import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  BookX,
  LayoutGrid,
  List,
  Sparkles,
  X,
} from 'lucide-react';
import { POPULARITY_INFO } from '../services/api.js';

export const BooksList = ({
  books,
  onOpenAddBookModal,
  onEditBook,
  onDeleteBook,
  onIssueBook,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['All', ...Array.from(new Set(books.map((b) => b.category))).filter(Boolean)];

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'Available') matchesStock = b.availableQuantity > 0;
    if (stockFilter === 'Low') matchesStock = b.availableQuantity > 0 && b.availableQuantity <= 2;
    if (stockFilter === 'Out') matchesStock = b.availableQuantity === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="heading-page">
            Book Catalog & Daily Rates
          </h1>
          <p className="subheading-page">
            Browse collection titles with popularity tiers, daily holding allocation rates, and physical stock.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.25rem', boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.04)' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.4rem',
                borderRadius: '0.5rem',
                backgroundColor: viewMode === 'grid' ? '#eef2ff' : 'transparent',
                color: viewMode === 'grid' ? '#4f46e5' : '#94a3b8',
                cursor: 'pointer'
              }}
              title="Grid View"
            >
              <LayoutGrid style={{ width: '1rem', height: '1rem' }} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '0.4rem',
                borderRadius: '0.5rem',
                backgroundColor: viewMode === 'table' ? '#eef2ff' : 'transparent',
                color: viewMode === 'table' ? '#4f46e5' : '#94a3b8',
                cursor: 'pointer'
              }}
              title="Table View"
            >
              <List style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>

          <button
            onClick={onOpenAddBookModal}
            className="btn btn-primary"
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search style={{ width: '1rem', height: '1rem', color: '#94a3b8', position: 'absolute', left: '0.875rem', top: '0.75rem' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X style={{ width: '0.875rem', height: '0.875rem' }} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter Segmented Control */}
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '0.75rem' }}>
            {['All', 'Available', 'Low', 'Out'].map((filter) => {
              const isSelected = stockFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setStockFilter(filter)}
                  style={{
                    flex: 1,
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '0.5rem',
                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? '#0f172a' : '#64748b',
                    boxShadow: isSelected ? '0 1px 2px 0 rgba(15, 23, 42, 0.04)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter metadata */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div>
            <span>Showing {filteredBooks.length} of {books.length} titles</span>
            {selectedCategory !== 'All' && (
              <span style={{ marginLeft: '0.5rem', color: '#475569', fontWeight: 600 }}>· {selectedCategory}</span>
            )}
            {stockFilter !== 'All' && (
              <span style={{ marginLeft: '0.5rem', color: '#475569', fontWeight: 600 }}>· Stock: {stockFilter}</span>
            )}
          </div>
          {(searchTerm || selectedCategory !== 'All' || stockFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setStockFilter('All');
              }}
              style={{ color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Catalog Content */}
      {filteredBooks.length === 0 ? (
        <div className="card" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <BookX style={{ width: '3rem', height: '3rem', color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
          <h3 className="heading-section" style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>No books found</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', maxWidth: '24rem', margin: '0.25rem auto 1rem' }}>
            We couldn’t find any book matching your search or filters. Try clearing your filters or adding a new title.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setStockFilter('All');
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid-4">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableQuantity > 0;
            const isLow = book.availableQuantity > 0 && book.availableQuantity <= 2;
            const popInfo = POPULARITY_INFO[book.popularity] || POPULARITY_INFO.Standard;
            const rate = Number(book.dailyRate || popInfo.rate).toFixed(2);

            return (
              <div
                key={book._id}
                className="card card-hoverable book-spine-card"
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  {/* Category & Popularity Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge-slate">
                      {book.category}
                    </span>
                    <span className="badge badge-indigo font-mono">
                      ${rate}/day
                    </span>
                  </div>

                  {/* Title & Author */}
                  <h3 className="font-serif" style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.25rem' }}>
                    {book.title}
                  </h3>
                  <p className="font-scholarly" style={{ fontSize: '0.875rem', color: '#475569', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                    by {book.author}
                  </p>

                  {/* Popularity Badge and Daily Rate Note */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.6875rem',
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    padding: '0.5rem 0.625rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #f1f5f9'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                      <Sparkles style={{ width: '0.75rem', height: '0.75rem', color: '#6366f1' }} />
                      {popInfo.label}
                    </span>
                    <span className="font-mono tabular-nums" style={{ fontWeight: 700, color: '#1e293b' }}>
                      ${rate} / day
                    </span>
                  </div>

                  <p className="font-mono" style={{ marginTop: '0.5rem', fontSize: '0.6875rem', color: '#94a3b8' }}>
                    ISBN: {book.isbn} · {book.publishedYear || '—'}
                  </p>
                </div>

                {/* Stock Progress & Actions */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#64748b' }}>Physical Stock</span>
                      <span className="tabular-nums" style={{ fontWeight: 700, color: isAvailable ? (isLow ? '#d97706' : '#059669') : '#e11d48' }}>
                        {isAvailable ? `${book.availableQuantity} of ${book.quantity} copies` : 'Out of Stock'}
                      </span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '0.375rem', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          borderRadius: '9999px',
                          backgroundColor: isAvailable ? (isLow ? '#f59e0b' : '#10b981') : '#f43f5e',
                          width: `${Math.round((book.availableQuantity / (book.quantity || 1)) * 100)}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <button
                        onClick={() => onEditBook(book)}
                        title="Edit book & rate"
                        className="btn-icon"
                      >
                        <Edit2 style={{ width: '0.875rem', height: '0.875rem' }} />
                      </button>
                      <button
                        onClick={() => onDeleteBook(book._id, book.title)}
                        title="Delete book record"
                        className="btn-icon danger"
                      >
                        <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                      </button>
                    </div>

                    <button
                      onClick={() => onIssueBook(book._id)}
                      disabled={!isAvailable}
                      className={isAvailable ? 'btn btn-subtle' : 'btn btn-secondary'}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', opacity: isAvailable ? 1 : 0.5 }}
                    >
                      <RotateCcw style={{ width: '0.75rem', height: '0.75rem', transform: 'rotate(180deg)' }} />
                      <span>{isAvailable ? 'Issue Copy' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title & Author</th>
                <th>Popularity & Daily Rate</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Copies Available</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => {
                const isAvailable = book.availableQuantity > 0;
                const isLow = book.availableQuantity > 0 && book.availableQuantity <= 2;
                const popInfo = POPULARITY_INFO[book.popularity] || POPULARITY_INFO.Standard;

                return (
                  <tr key={book._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#eef2ff', color: '#4f46e5', flexShrink: 0, marginTop: '2px' }}>
                          <BookOpen style={{ width: '1rem', height: '1rem' }} />
                        </div>
                        <div>
                          <span className="font-serif" style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem', display: 'block', lineHeight: 1.3 }}>
                            {book.title}
                          </span>
                          <span className="font-scholarly" style={{ color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic' }}>
                            by {book.author}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-indigo font-mono">
                        ${Number(book.dailyRate || popInfo.rate).toFixed(2)}/day
                      </span>
                      <span style={{ fontSize: '0.625rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>{popInfo.label}</span>
                    </td>

                    <td style={{ color: '#475569', fontWeight: 500 }}>
                      {book.category}
                    </td>

                    <td className="font-mono tabular-nums" style={{ color: '#64748b' }}>
                      {book.isbn}
                    </td>

                    <td className="font-mono tabular-nums">
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                        {book.availableQuantity}
                      </span>
                      <span style={{ color: '#94a3b8' }}> / {book.quantity}</span>
                    </td>

                    <td>
                      {isAvailable ? (
                        isLow ? (
                          <span className="badge badge-amber">Low Stock</span>
                        ) : (
                          <span className="badge badge-emerald">In Stock</span>
                        )
                      ) : (
                        <span className="badge badge-rose">Out of Stock</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.375rem' }}>
                        {isAvailable ? (
                          <button
                            onClick={() => onIssueBook(book._id)}
                            className="btn btn-subtle"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            Issue
                          </button>
                        ) : (
                          <span style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: '#94a3b8', backgroundColor: '#f1f5f9', borderRadius: '0.5rem' }}>
                            Unavailable
                          </span>
                        )}

                        <button
                          onClick={() => onEditBook(book)}
                          title="Edit book details"
                          className="btn-icon"
                        >
                          <Edit2 style={{ width: '0.875rem', height: '0.875rem' }} />
                        </button>

                        <button
                          onClick={() => onDeleteBook(book._id, book.title)}
                          title="Delete book record"
                          className="btn-icon danger"
                        >
                          <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
