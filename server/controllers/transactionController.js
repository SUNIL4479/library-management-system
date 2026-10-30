import { TransactionModel } from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
  try {
    const { status, memberId, bookId } = req.query;
    const transactions = await TransactionModel.find({
      status,
      memberId,
      bookId,
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve transactions', error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await TransactionModel.findById(id);
    if (!tx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(tx);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve transaction', error: error.message });
  }
};

export const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, issueDate, dueDate, notes } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Please select a book to issue.' });
    }
    if (!memberId) {
      return res.status(400).json({ message: 'Please select a member.' });
    }

    const tx = await TransactionModel.issue({
      bookId,
      memberId,
      issueDate,
      dueDate,
      notes,
    });

    res.status(201).json({
      message: `Book issued successfully! Daily holding fee: $${tx.dailyRate.toFixed(2)}/day`,
      transaction: tx,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to issue book' });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { returnDate } = req.body;

    const tx = await TransactionModel.returnBook(id, returnDate);

    res.json({
      message: `Book returned successfully! Total fee accrued: $${tx.totalFee.toFixed(2)} (${tx.daysHeld} days kept @ $${tx.dailyRate.toFixed(2)}/day${tx.overdueFee > 0 ? ` + $${tx.overdueFee.toFixed(2)} late fine` : ''})`,
      transaction: tx,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to process return' });
  }
};
