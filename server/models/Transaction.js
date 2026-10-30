import mongoose from 'mongoose';
import { memoryStore, isConnectedToMongo, POPULARITY_RATES } from '../config/db.js';
import { BookModel, Book } from './Book.js';
import { MemberModel, Member } from './Member.js';

// Mongoose Transaction Schema
const transactionSchema = new mongoose.Schema(
  {
    bookId: { type: String, required: true, ref: 'Book' },
    memberId: { type: String, required: true, ref: 'Member' },
    issueDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    returnDate: { type: String, default: null },
    status: { type: String, enum: ['issued', 'returned'], default: 'issued' },
    dailyRate: { type: Number, required: true },
    daysHeld: { type: Number, default: 1 },
    holdingFee: { type: Number, default: 0 },
    overdueFee: { type: Number, default: 0 },
    totalFee: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export const computeTransactionFinancials = (tx, book) => {
  const issueTime = new Date(tx.issueDate).getTime();
  const endTime = tx.returnDate ? new Date(tx.returnDate).getTime() : new Date().getTime();
  
  const diffTime = Math.max(0, endTime - issueTime);
  const daysHeld = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  let dailyRate = tx.dailyRate;
  if (dailyRate === undefined || dailyRate === null) {
    if (book && book.dailyRate !== undefined) {
      dailyRate = book.dailyRate;
    } else if (book && POPULARITY_RATES[book.popularity]) {
      dailyRate = POPULARITY_RATES[book.popularity].rate;
    } else {
      dailyRate = 1.00;
    }
  }

  const holdingFee = Number((daysHeld * dailyRate).toFixed(2));

  let overdueFee = 0;
  let overdueDays = 0;
  if (tx.dueDate) {
    const dueTime = new Date(tx.dueDate).getTime();
    if (endTime > dueTime) {
      overdueDays = Math.floor((endTime - dueTime) / (1000 * 60 * 60 * 24));
      overdueFee = Math.max(0, overdueDays * 1.00);
    }
  }

  const totalFee = Number((holdingFee + overdueFee).toFixed(2));

  return {
    daysHeld,
    dailyRate,
    holdingFee,
    overdueDays,
    overdueFee,
    totalFee,
  };
};

export const TransactionModel = {
  find: async (query) => {
    let txs = [];
    if (isConnectedToMongo) {
      try {
        const mongoQuery = {};
        if (query?.status && query.status !== 'All') mongoQuery.status = query.status;
        if (query?.memberId) mongoQuery.memberId = query.memberId;
        if (query?.bookId) mongoQuery.bookId = query.bookId;

        const results = await Transaction.find(mongoQuery).sort({ createdAt: -1 }).lean();
        if (results.length > 0) {
          txs = results;
        }
      } catch (e) {
        console.warn('MongoDB transaction query fallback:', e.message);
      }
    }

    if (txs.length === 0) {
      txs = [...memoryStore.getTransactions()];
      if (query?.status && query.status !== 'All') {
        txs = txs.filter(t => t.status === query.status);
      }
      if (query?.memberId) {
        txs = txs.filter(t => t.memberId === query.memberId);
      }
      if (query?.bookId) {
        txs = txs.filter(t => t.bookId === query.bookId);
      }
    }

    const books = isConnectedToMongo ? await Book.find().lean() : memoryStore.getBooks();
    const members = isConnectedToMongo ? await Member.find().lean() : memoryStore.getMembers();

    const populated = txs.map(t => {
      const book = books.find(b => b._id.toString() === t.bookId.toString()) || memoryStore.getBooks().find(b => b._id.toString() === t.bookId.toString());
      const member = members.find(m => m._id.toString() === t.memberId.toString()) || memoryStore.getMembers().find(m => m._id.toString() === t.memberId.toString());
      const financials = computeTransactionFinancials(t, book);

      return {
        ...t,
        ...financials,
        fine: financials.totalFee,
        book,
        member,
      };
    });

    return populated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findById: async (id) => {
    let t = null;
    if (isConnectedToMongo) {
      try {
        t = await Transaction.findById(id).lean();
      } catch {
        // continue
      }
    }
    if (!t) {
      t = memoryStore.getTransactions().find(tx => tx._id.toString() === id.toString());
    }
    if (!t) return null;

    const book = await BookModel.findById(t.bookId);
    const member = await MemberModel.findById(t.memberId);
    const financials = computeTransactionFinancials(t, book);

    return {
      ...t,
      ...financials,
      fine: financials.totalFee,
      book,
      member,
    };
  },

  issue: async (data) => {
    const book = await BookModel.findById(data.bookId);
    if (!book) throw new Error('Book not found');
    if (book.availableQuantity <= 0) {
      throw new Error('Cannot issue book: No available copies left in the library.');
    }

    const member = await MemberModel.findById(data.memberId);
    if (!member) throw new Error('Member not found');
    if (member.status === 'Inactive') {
      throw new Error('Member account is inactive. Cannot issue books.');
    }

    const now = new Date();
    const issueDate = data.issueDate || now.toISOString().split('T')[0];
    let dueDate = data.dueDate;
    if (!dueDate) {
      const due = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      dueDate = due.toISOString().split('T')[0];
    }

    const dailyRate = book.dailyRate !== undefined ? book.dailyRate : (POPULARITY_RATES[book.popularity]?.rate || 1.00);

    const txPayload = {
      bookId: data.bookId,
      memberId: data.memberId,
      issueDate,
      dueDate,
      returnDate: null,
      status: 'issued',
      dailyRate,
      daysHeld: 1,
      holdingFee: dailyRate,
      overdueFee: 0,
      totalFee: dailyRate,
      notes: data.notes?.trim() || '',
    };

    let createdTx = null;
    if (isConnectedToMongo) {
      try {
        const mongoCreated = await Transaction.create(txPayload);
        createdTx = mongoCreated.toObject();
      } catch (e) {
        console.warn('MongoDB create transaction error:', e.message);
      }
    }

    if (!createdTx) {
      createdTx = {
        ...txPayload,
        _id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
      const txs = memoryStore.getTransactions();
      txs.push(createdTx);
      memoryStore.setTransactions(txs);
    }

    // Decrement available copies
    await BookModel.findByIdAndUpdate(book._id, {
      availableQuantity: book.availableQuantity - 1,
      borrowCount: (book.borrowCount || 0) + 1,
    });

    return {
      ...createdTx,
      book,
      member,
    };
  },

  returnBook: async (id, customReturnDate) => {
    const returnDate = customReturnDate || new Date().toISOString().split('T')[0];
    const tx = await TransactionModel.findById(id);
    if (!tx) throw new Error('Transaction record not found');
    if (tx.status === 'returned') {
      throw new Error('This book has already been checked in and returned.');
    }

    const book = await BookModel.findById(tx.bookId);
    const tempTx = { ...tx, returnDate };
    const financials = computeTransactionFinancials(tempTx, book);

    const updatedData = {
      returnDate,
      status: 'returned',
      ...financials,
      totalFee: financials.totalFee,
    };

    let updatedTx = null;
    if (isConnectedToMongo) {
      try {
        updatedTx = await Transaction.findByIdAndUpdate(id, updatedData, { new: true }).lean();
      } catch {
        // continue
      }
    }

    if (!updatedTx) {
      const txs = memoryStore.getTransactions();
      const index = txs.findIndex(t => t._id.toString() === id.toString());
      if (index !== -1) {
        txs[index] = { ...txs[index], ...updatedData };
        memoryStore.setTransactions(txs);
        updatedTx = txs[index];
      }
    }

    // Increment available copies
    if (book) {
      await BookModel.findByIdAndUpdate(book._id, {
        availableQuantity: Math.min(book.quantity, book.availableQuantity + 1),
      });
    }

    const member = await MemberModel.findById(tx.memberId);

    return {
      ...(updatedTx || updatedData),
      book: book || undefined,
      member: member || undefined,
    };
  }
};
