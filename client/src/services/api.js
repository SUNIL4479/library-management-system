const API_BASE = '/api';

export const POPULARITY_INFO = {
  High: { label: 'High Demand', rate: 1.50, badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  Medium: { label: 'Medium Demand', rate: 1.00, badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  Standard: { label: 'Standard Catalog', rate: 0.50, badge: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export const api = {
  // Books API
  async getBooks(category, search, popularity) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (popularity && popularity !== 'All') params.append('popularity', popularity);

    const res = await fetch(`${API_BASE}/books?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to fetch books' }));
      throw new Error(err.message || 'Failed to fetch books');
    }
    return res.json();
  },

  async getBookById(id) {
    const res = await fetch(`${API_BASE}/books/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to fetch book' }));
      throw new Error(err.message || 'Failed to fetch book');
    }
    return res.json();
  },

  async createBook(data) {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to create book');
    }
    return result;
  },

  async updateBook(id, data) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update book');
    }
    return result;
  },

  async deleteBook(id) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete book');
    }
    return result;
  },

  // Members API
  async getMembers(search, status) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);

    const res = await fetch(`${API_BASE}/members?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to fetch members' }));
      throw new Error(err.message || 'Failed to fetch members');
    }
    return res.json();
  },

  async createMember(data) {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to create member');
    }
    return result;
  },

  async updateMember(id, data) {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update member');
    }
    return result;
  },

  async deleteMember(id) {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete member');
    }
    return result;
  },

  // Transactions API
  async getTransactions(status, memberId, bookId) {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (memberId) params.append('memberId', memberId);
    if (bookId) params.append('bookId', bookId);

    const res = await fetch(`${API_BASE}/transactions?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to fetch transactions' }));
      throw new Error(err.message || 'Failed to fetch transactions');
    }
    return res.json();
  },

  async issueBook(payload) {
    const res = await fetch(`${API_BASE}/transactions/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to issue book');
    }
    return result;
  },

  async returnBook(id, returnDate) {
    const res = await fetch(`${API_BASE}/transactions/${id}/return`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnDate }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to return book');
    }
    return result;
  },

  // Stats & System
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to fetch library stats' }));
      throw new Error(err.message || 'Failed to fetch stats');
    }
    return res.json();
  },

  async resetData() {
    const res = await fetch(`${API_BASE}/stats/reset`, { method: 'POST' });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to reset database');
    }
    return result;
  }
};
