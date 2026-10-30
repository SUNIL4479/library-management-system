import mongoose from 'mongoose';
import { memoryStore, isConnectedToMongo, POPULARITY_RATES } from '../config/db.js';

// Mongoose Book Schema
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    availableQuantity: { type: Number, required: true, min: 0 },
    publishedYear: { type: Number },
    popularity: { type: String, enum: ['High', 'Medium', 'Standard'], default: 'Standard' },
    dailyRate: { type: Number, default: 0.50 },
    borrowCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export const BookModel = {
  find: async (query) => {
    if (isConnectedToMongo) {
      try {
        const mongoQuery = {};
        if (query?.category && query.category !== 'All') {
          mongoQuery.category = { $regex: new RegExp(`^${query.category}$`, 'i') };
        }
        if (query?.popularity && query.popularity !== 'All') {
          mongoQuery.popularity = query.popularity;
        }
        if (query?.search) {
          const s = query.search.trim();
          mongoQuery.$or = [
            { title: { $regex: s, $options: 'i' } },
            { author: { $regex: s, $options: 'i' } },
            { isbn: { $regex: s, $options: 'i' } },
          ];
        }
        const results = await Book.find(mongoQuery).sort({ createdAt: -1 }).lean();
        if (results.length > 0) return results;
      } catch (e) {
        console.warn('MongoDB query fallback:', e.message);
      }
    }

    let books = [...memoryStore.getBooks()];
    if (query?.category && query.category !== 'All') {
      books = books.filter(b => b.category.toLowerCase() === query.category.toLowerCase());
    }
    if (query?.popularity && query.popularity !== 'All') {
      books = books.filter(b => b.popularity === query.popularity);
    }
    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      books = books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
      );
    }
    return books.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findById: async (id) => {
    if (isConnectedToMongo) {
      try {
        const found = await Book.findById(id).lean();
        if (found) return found;
      } catch {
        // continue to memory lookup
      }
    }
    const book = memoryStore.getBooks().find(b => b._id.toString() === id.toString());
    return book || null;
  },

  findOne: async (filter) => {
    if (isConnectedToMongo) {
      try {
        const found = await Book.findOne(filter).lean();
        if (found) return found;
      } catch {
        // continue
      }
    }
    const books = memoryStore.getBooks();
    return books.find(b => Object.entries(filter).every(([k, v]) => b[k] === v)) || null;
  },

  create: async (data) => {
    const popularity = data.popularity || 'Standard';
    const rateConfig = POPULARITY_RATES[popularity] || POPULARITY_RATES.Standard;
    const dailyRate = data.dailyRate !== undefined ? Number(data.dailyRate) : rateConfig.rate;

    const bookPayload = {
      title: data.title.trim(),
      author: data.author.trim(),
      category: data.category.trim(),
      isbn: data.isbn.trim(),
      quantity: Number(data.quantity),
      availableQuantity: data.availableQuantity !== undefined ? Number(data.availableQuantity) : Number(data.quantity),
      popularity,
      dailyRate,
      borrowCount: 0,
      publishedYear: data.publishedYear ? Number(data.publishedYear) : undefined,
      description: data.description?.trim() || '',
    };

    if (isConnectedToMongo) {
      try {
        const createdMongo = await Book.create(bookPayload);
        return createdMongo.toObject();
      } catch (e) {
        console.warn('MongoDB create error:', e.message);
      }
    }

    const books = memoryStore.getBooks();
    const newBook = {
      ...bookPayload,
      _id: `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    books.push(newBook);
    memoryStore.setBooks(books);
    return newBook;
  },

  findByIdAndUpdate: async (id, updateData) => {
    if (isConnectedToMongo) {
      try {
        const updatedMongo = await Book.findByIdAndUpdate(id, updateData, { new: true }).lean();
        if (updatedMongo) return updatedMongo;
      } catch {
        // continue
      }
    }

    const books = memoryStore.getBooks();
    const index = books.findIndex(b => b._id.toString() === id.toString());
    if (index === -1) return null;

    const current = books[index];
    let availableQuantity = updateData.availableQuantity !== undefined
      ? Number(updateData.availableQuantity)
      : current.availableQuantity;

    if (updateData.quantity !== undefined && updateData.availableQuantity === undefined) {
      const diff = Number(updateData.quantity) - current.quantity;
      availableQuantity = Math.max(0, current.availableQuantity + diff);
    }

    const popularity = updateData.popularity !== undefined ? updateData.popularity : current.popularity;
    let dailyRate = updateData.dailyRate !== undefined ? Number(updateData.dailyRate) : current.dailyRate;
    if (updateData.popularity && updateData.dailyRate === undefined && POPULARITY_RATES[popularity]) {
      dailyRate = POPULARITY_RATES[popularity].rate;
    }

    const updated = {
      ...current,
      ...updateData,
      availableQuantity,
      popularity,
      dailyRate,
    };

    books[index] = updated;
    memoryStore.setBooks(books);
    return updated;
  },

  findByIdAndDelete: async (id) => {
    if (isConnectedToMongo) {
      try {
        await Book.findByIdAndDelete(id);
      } catch {
        // continue
      }
    }
    const books = memoryStore.getBooks();
    const filtered = books.filter(b => b._id.toString() !== id.toString());
    memoryStore.setBooks(filtered);
    return true;
  }
};
