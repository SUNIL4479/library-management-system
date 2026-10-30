import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

export const POPULARITY_RATES = {
  High: { label: 'High Demand', rate: 1.50, description: 'Bestsellers, current academic curriculum & high-circulation titles' },
  Medium: { label: 'Medium Demand', rate: 1.00, description: 'Standard reference works & recommended literature' },
  Standard: { label: 'Standard Catalog', rate: 0.50, description: 'Archival, classic & general collection volumes' }
};

export const getInitialData = () => {
  const now = new Date();
  
  const formatDate = (daysAgo) => {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  };

  const formatFutureDate = (daysAhead) => {
    const d = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  };

  return {
    books: [
      {
        _id: 'book-101',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        category: 'Computer Science',
        isbn: '978-0132350884',
        quantity: 5,
        availableQuantity: 4,
        publishedYear: 2008,
        popularity: 'High',
        dailyRate: 1.50,
        borrowCount: 38,
        description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        _id: 'book-102',
        title: 'Introduction to Algorithms (CLRS)',
        author: 'Thomas H. Cormen, Charles E. Leiserson',
        category: 'Computer Science',
        isbn: '978-0262033848',
        quantity: 4,
        availableQuantity: 2,
        publishedYear: 2009,
        popularity: 'High',
        dailyRate: 1.50,
        borrowCount: 45,
        description: 'Comprehensive textbook covering modern algorithms with rigor and depth.',
        createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
      },
      {
        _id: 'book-103',
        title: 'JavaScript: The Definitive Guide',
        author: 'David Flanagan',
        category: 'Web Development',
        isbn: '978-1491952023',
        quantity: 6,
        availableQuantity: 5,
        publishedYear: 2020,
        popularity: 'Medium',
        dailyRate: 1.00,
        borrowCount: 22,
        description: 'The master reference for JavaScript programmers, covering ES2020 and modern web APIs.',
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      },
      {
        _id: 'book-104',
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        category: 'Software Engineering',
        isbn: '978-0201633610',
        quantity: 3,
        availableQuantity: 1,
        publishedYear: 1994,
        popularity: 'High',
        dailyRate: 1.50,
        borrowCount: 31,
        description: 'Classic Gang of Four reference cataloging 23 fundamental design patterns.',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        _id: 'book-105',
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        category: 'Database Systems',
        isbn: '978-1449373320',
        quantity: 4,
        availableQuantity: 4,
        publishedYear: 2017,
        popularity: 'High',
        dailyRate: 1.50,
        borrowCount: 29,
        description: 'The definitive guide to architecture, reliability, scalability, and maintainability in modern data systems.',
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
      {
        _id: 'book-106',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        category: 'Literature',
        isbn: '978-0061120084',
        quantity: 3,
        availableQuantity: 0,
        publishedYear: 1960,
        popularity: 'Medium',
        dailyRate: 1.00,
        borrowCount: 19,
        description: 'Pulitzer Prize-winning novel about justice and moral growth in the American South.',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        _id: 'book-107',
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        category: 'Science',
        isbn: '978-0553380163',
        quantity: 5,
        availableQuantity: 5,
        publishedYear: 1988,
        popularity: 'Standard',
        dailyRate: 0.50,
        borrowCount: 14,
        description: 'Landmark work exploring the cosmology of black holes, space-time, and quantum mechanics.',
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
      {
        _id: 'book-108',
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'Self Development',
        isbn: '978-0735211292',
        quantity: 6,
        availableQuantity: 5,
        publishedYear: 2018,
        popularity: 'High',
        dailyRate: 1.50,
        borrowCount: 52,
        description: 'An easy and proven way to build good habits and break bad ones.',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      }
    ],
    members: [
      {
        _id: 'mem-201',
        name: 'Alex Johnson',
        email: 'alex.johnson@university.edu',
        phone: '+1 (555) 234-5678',
        membershipDate: formatDate(120),
        status: 'Active',
        createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
      },
      {
        _id: 'mem-202',
        name: 'Sophia Chen',
        email: 'sophia.chen@techlab.io',
        phone: '+1 (555) 345-6789',
        membershipDate: formatDate(90),
        status: 'Active',
        createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
      {
        _id: 'mem-203',
        name: 'Marcus Williams',
        email: 'marcus.w@coderacademy.org',
        phone: '+1 (555) 456-7890',
        membershipDate: formatDate(60),
        status: 'Active',
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      },
      {
        _id: 'mem-204',
        name: 'Elena Rostova',
        email: 'elena.rostova@designworks.com',
        phone: '+1 (555) 567-8901',
        membershipDate: formatDate(35),
        status: 'Active',
        createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
      },
      {
        _id: 'mem-205',
        name: 'David Patel',
        email: 'david.patel@datastack.net',
        phone: '+1 (555) 678-9012',
        membershipDate: formatDate(14),
        status: 'Active',
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      }
    ],
    transactions: [
      {
        _id: 'tx-301',
        bookId: 'book-101',
        memberId: 'mem-201',
        issueDate: formatDate(10),
        dueDate: formatFutureDate(4),
        returnDate: null,
        status: 'issued',
        dailyRate: 1.50,
        daysHeld: 10,
        holdingFee: 15.00,
        overdueFee: 0,
        totalFee: 15.00,
        notes: 'Semester project reference reading',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        _id: 'tx-302',
        bookId: 'book-102',
        memberId: 'mem-202',
        issueDate: formatDate(18),
        dueDate: formatDate(4),
        returnDate: null,
        status: 'issued',
        dailyRate: 1.50,
        daysHeld: 18,
        holdingFee: 27.00,
        overdueFee: 4.00,
        totalFee: 31.00,
        notes: 'Competitive programming study club',
        createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
      },
      {
        _id: 'tx-303',
        bookId: 'book-102',
        memberId: 'mem-203',
        issueDate: formatDate(5),
        dueDate: formatFutureDate(9),
        returnDate: null,
        status: 'issued',
        dailyRate: 1.50,
        daysHeld: 5,
        holdingFee: 7.50,
        overdueFee: 0,
        totalFee: 7.50,
        notes: 'Algorithm research prep',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        _id: 'tx-304',
        bookId: 'book-104',
        memberId: 'mem-204',
        issueDate: formatDate(20),
        dueDate: formatDate(6),
        returnDate: null,
        status: 'issued',
        dailyRate: 1.50,
        daysHeld: 20,
        holdingFee: 30.00,
        overdueFee: 6.00,
        totalFee: 36.00,
        notes: 'Architecture patterns seminar',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        _id: 'tx-305',
        bookId: 'book-106',
        memberId: 'mem-205',
        issueDate: formatDate(12),
        dueDate: formatFutureDate(2),
        returnDate: null,
        status: 'issued',
        dailyRate: 1.00,
        daysHeld: 12,
        holdingFee: 12.00,
        overdueFee: 0,
        totalFee: 12.00,
        notes: 'Book club literature selection',
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      },
      {
        _id: 'tx-306',
        bookId: 'book-103',
        memberId: 'mem-201',
        issueDate: formatDate(25),
        dueDate: formatDate(11),
        returnDate: formatDate(12),
        status: 'returned',
        dailyRate: 1.00,
        daysHeld: 13,
        holdingFee: 13.00,
        overdueFee: 0,
        totalFee: 13.00,
        notes: 'Returned in pristine condition',
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      },
      {
        _id: 'tx-307',
        bookId: 'book-105',
        memberId: 'mem-202',
        issueDate: formatDate(30),
        dueDate: formatDate(16),
        returnDate: formatDate(14),
        status: 'returned',
        dailyRate: 1.50,
        daysHeld: 16,
        holdingFee: 24.00,
        overdueFee: 0,
        totalFee: 24.00,
        notes: 'Distributed systems review completed',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      }
    ]
  };
};

class MemoryBufferStore {
  constructor() {
    this.data = getInitialData();
  }

  getBooks() {
    return this.data.books;
  }

  getMembers() {
    return this.data.members;
  }

  getTransactions() {
    return this.data.transactions;
  }

  setBooks(books) {
    this.data.books = books;
  }

  setMembers(members) {
    this.data.members = members;
  }

  setTransactions(transactions) {
    this.data.transactions = transactions;
  }

  resetData() {
    this.data = getInitialData();
    return this.data;
  }
}

export const memoryStore = new MemoryBufferStore();
export const db = memoryStore;

export let isConnectedToMongo = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI || mongoURI.includes('<username>') || mongoURI.includes('MY_MONGODB_URI')) {
    console.log('[MongoDB] Notice: MONGODB_URI not configured in .env. Running with in-memory store.');
    console.log('[MongoDB] To connect a live MongoDB database, update MONGODB_URI in your .env file.');
    isConnectedToMongo = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    isConnectedToMongo = true;
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Connection failed (${error.message}). Operating in resilient memory mode.`);
    console.warn('[MongoDB] Check your MONGODB_URI connection string and IP whitelist in MongoDB Atlas.');
    isConnectedToMongo = false;
    return false;
  }
};
