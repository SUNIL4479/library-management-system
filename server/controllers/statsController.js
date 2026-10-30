import { memoryStore, isConnectedToMongo } from '../config/db.js';
import { Book } from '../models/Book.js';
import { Member } from '../models/Member.js';
import { Transaction, computeTransactionFinancials } from '../models/Transaction.js';

export const getStats = async (_req, res) => {
  try {
    let books = [];
    let members = [];
    let transactions = [];

    if (isConnectedToMongo) {
      try {
        books = await Book.find().lean();
        members = await Member.find().lean();
        transactions = await Transaction.find().lean();
      } catch (e) {
        console.warn('MongoDB stats query fallback:', e.message);
      }
    }

    if (books.length === 0) books = memoryStore.getBooks();
    if (members.length === 0) members = memoryStore.getMembers();
    if (transactions.length === 0) transactions = memoryStore.getTransactions();

    const totalBooks = books.length;
    const totalCopies = books.reduce((acc, b) => acc + (b.quantity || 0), 0);
    const availableCopies = books.reduce((acc, b) => acc + (b.availableQuantity || 0), 0);

    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'Active').length;

    const issuedBooks = transactions.filter(t => t.status === 'issued').length;
    const returnedBooks = transactions.filter(t => t.status === 'returned').length;

    const nowTime = new Date().getTime();
    const overdueCount = transactions.filter(t => {
      if (t.status !== 'issued' || !t.dueDate) return false;
      return nowTime > new Date(t.dueDate).getTime();
    }).length;

    let totalAccruedFees = 0;
    let totalHoldingFees = 0;
    let totalOverdueFees = 0;

    transactions.forEach(t => {
      const book = books.find(b => b._id.toString() === t.bookId.toString());
      const financials = computeTransactionFinancials(t, book);
      totalAccruedFees += financials.totalFee || 0;
      totalHoldingFees += financials.holdingFee || 0;
      totalOverdueFees += financials.overdueFee || 0;
    });

    const categoryCounts = {};
    books.forEach(b => {
      const cat = b.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const popularityCounts = {
      High: books.filter(b => b.popularity === 'High').length,
      Medium: books.filter(b => b.popularity === 'Medium').length,
      Standard: books.filter(b => b.popularity === 'Standard').length,
    };

    res.json({
      totalBooks,
      totalCopies,
      availableCopies,
      totalMembers,
      activeMembers,
      issuedBooks,
      returnedBooks,
      overdueCount,
      totalAccruedFees: Number(totalAccruedFees.toFixed(2)),
      totalHoldingFees: Number(totalHoldingFees.toFixed(2)),
      totalOverdueFees: Number(totalOverdueFees.toFixed(2)),
      totalFinesCollected: Number(totalAccruedFees.toFixed(2)),
      categoryCounts,
      popularityCounts,
      mongoConnected: isConnectedToMongo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve stats', error: error.message });
  }
};

export const resetData = async (_req, res) => {
  try {
    const initial = memoryStore.resetData();
    res.json({
      message: 'Library database reset to initial demonstration state successfully.',
      counts: {
        books: initial.books.length,
        members: initial.members.length,
        transactions: initial.transactions.length,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset database', error: error.message });
  }
};
