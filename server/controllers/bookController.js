import { BookModel } from '../models/Book.js';
import { db, POPULARITY_RATES } from '../config/db.js';

export const getBooks = async (req, res) => {
  try {
    const { category, search, popularity } = req.query;
    const books = await BookModel.find({
      category,
      search,
      popularity,
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve books', error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve book', error: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, author, category, isbn, quantity, publishedYear, description, popularity, dailyRate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Book title is required.' });
    }
    if (!author || !author.trim()) {
      return res.status(400).json({ message: 'Author name is required.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category is required.' });
    }
    if (!isbn || !isbn.trim()) {
      return res.status(400).json({ message: 'ISBN is required.' });
    }
    const numQty = Number(quantity);
    if (isNaN(numQty) || numQty < 1) {
      return res.status(400).json({ message: 'Total quantity must be at least 1 copy.' });
    }

    const existing = await BookModel.findOne({ isbn: isbn.trim() });
    if (existing) {
      return res.status(400).json({ message: `A book with ISBN ${isbn} already exists (${existing.title}).` });
    }

    const newBook = await BookModel.create({
      title,
      author,
      category,
      isbn,
      quantity: numQty,
      availableQuantity: numQty,
      publishedYear: publishedYear ? Number(publishedYear) : undefined,
      description,
      popularity: popularity || 'Standard',
      dailyRate: dailyRate !== undefined ? Number(dailyRate) : undefined,
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, isbn, quantity, publishedYear, description, popularity, dailyRate } = req.body;

    const existingBook = await BookModel.findById(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Book title cannot be empty.' });
    }
    if (author !== undefined && !author.trim()) {
      return res.status(400).json({ message: 'Author cannot be empty.' });
    }
    if (quantity !== undefined) {
      const numQty = Number(quantity);
      if (isNaN(numQty) || numQty < 1) {
        return res.status(400).json({ message: 'Total quantity must be at least 1.' });
      }
      const currentlyIssued = existingBook.quantity - existingBook.availableQuantity;
      if (numQty < currentlyIssued) {
        return res.status(400).json({
          message: `Cannot reduce total quantity below currently issued copies (${currentlyIssued} copies currently on loan).`
        });
      }
    }

    const updated = await BookModel.findByIdAndUpdate(id, {
      title,
      author,
      category,
      isbn,
      quantity: quantity !== undefined ? Number(quantity) : undefined,
      publishedYear: publishedYear ? Number(publishedYear) : undefined,
      description,
      popularity,
      dailyRate: dailyRate !== undefined ? Number(dailyRate) : undefined,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBook = await BookModel.findById(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const transactions = db.getTransactions();
    const activeIssue = transactions.find(t => t.bookId === id && t.status === 'issued');
    if (activeIssue) {
      return res.status(400).json({
        message: 'Cannot delete book: Copies of this book are currently issued to members. Please return them first.'
      });
    }

    await BookModel.findByIdAndDelete(id);
    res.json({ message: 'Book deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};
