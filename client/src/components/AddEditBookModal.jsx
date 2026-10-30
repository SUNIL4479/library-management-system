import React, { useState, useEffect } from 'react';
import { X, BookPlus, BookOpen, Sparkles } from 'lucide-react';
import { POPULARITY_INFO } from '../services/api.js';

const CATEGORIES = [
  'Computer Science',
  'Web Development',
  'Software Engineering',
  'Database Systems',
  'Literature',
  'Science',
  'Mathematics',
  'Self Development',
  'Business & Management',
  'Other'
];

export const AddEditBookModal = ({
  isOpen,
  bookToEdit,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [customCategory, setCustomCategory] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState(3);
  const [publishedYear, setPublishedYear] = useState(2023);
  const [popularity, setPopularity] = useState('High');
  const [dailyRate, setDailyRate] = useState(1.50);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      if (CATEGORIES.includes(bookToEdit.category)) {
        setCategory(bookToEdit.category);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setCustomCategory(bookToEdit.category);
      }
      setIsbn(bookToEdit.isbn);
      setQuantity(bookToEdit.quantity);
      setPublishedYear(bookToEdit.publishedYear || '');
      setPopularity(bookToEdit.popularity || 'High');
      setDailyRate(bookToEdit.dailyRate !== undefined ? bookToEdit.dailyRate : 1.50);
      setDescription(bookToEdit.description || '');
    } else {
      setTitle('');
      setAuthor('');
      setCategory('Computer Science');
      setCustomCategory('');
      setIsbn('');
      setQuantity(3);
      setPublishedYear(new Date().getFullYear());
      setPopularity('High');
      setDailyRate(1.50);
      setDescription('');
    }
    setError(null);
  }, [bookToEdit, isOpen]);

  const handlePopularityChange = (newPop) => {
    setPopularity(newPop);
    if (POPULARITY_INFO[newPop]) {
      setDailyRate(POPULARITY_INFO[newPop].rate);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Book title is required.');
      return;
    }
    if (!author.trim()) {
      setError('Author is required.');
      return;
    }
    if (!isbn.trim()) {
      setError('ISBN number is required.');
      return;
    }
    if (Number(quantity) < 1) {
      setError('Quantity must be at least 1 copy.');
      return;
    }

    const finalCategory = category === 'Other' ? (customCategory.trim() || 'General') : category;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        author: author.trim(),
        category: finalCategory,
        isbn: isbn.trim(),
        quantity: Number(quantity),
        availableQuantity: bookToEdit
          ? Math.max(0, bookToEdit.availableQuantity + (Number(quantity) - bookToEdit.quantity))
          : Number(quantity),
        publishedYear: publishedYear ? Number(publishedYear) : undefined,
        popularity,
        dailyRate: Number(dailyRate),
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save book record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '34rem' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.625rem',
              borderRadius: '0.75rem',
              backgroundColor: '#eef2ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {bookToEdit ? <BookOpen style={{ width: '1.25rem', height: '1.25rem' }} /> : <BookPlus style={{ width: '1.25rem', height: '1.25rem' }} />}
            </div>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                {bookToEdit ? 'Edit Catalog Title' : 'Add New Book & Allocate Daily Rate'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Configure bibliographic data and popularity-based daily holding rate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#9f1239',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Book Title <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Clean Code"
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Author <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Robert C. Martin"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Category / Genre <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {category === 'Other' && (
            <div className="form-group">
              <label className="form-label">Specify Category</label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                className="form-input"
              />
            </div>
          )}

          {/* Popularity Tier & Daily Allocation Rate */}
          <div style={{
            padding: '1rem',
            borderRadius: '1rem',
            backgroundColor: '#f5f3ff',
            border: '1px solid #ddd6fe',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#312e81', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles style={{ width: '0.875rem', height: '0.875rem', color: '#6366f1' }} />
                Popularity Tier & Daily Allocation
              </span>
              <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#4338ca' }}>
                ${Number(dailyRate).toFixed(2)} / day
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { tier: 'High', label: 'High Demand', rate: '$1.50/day' },
                { tier: 'Medium', label: 'Medium', rate: '$1.00/day' },
                { tier: 'Standard', label: 'Standard', rate: '$0.50/day' },
              ].map(opt => {
                const isSelected = popularity === opt.tier;
                return (
                  <button
                    type="button"
                    key={opt.tier}
                    onClick={() => handlePopularityChange(opt.tier)}
                    style={{
                      padding: '0.625rem',
                      borderRadius: '0.75rem',
                      border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#4338ca' : '#1e293b' }}>
                      {opt.label}
                    </span>
                    <span className="font-mono" style={{ display: 'block', fontSize: '0.6875rem', color: '#64748b', marginTop: '2px' }}>
                      {opt.rate}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #ede9fe', fontSize: '0.75rem' }}>
              <span style={{ color: '#64748b' }}>Custom Daily Rate Override ($):</span>
              <input
                type="number"
                step="0.10"
                min="0.10"
                value={dailyRate}
                onChange={(e) => setDailyRate(parseFloat(e.target.value) || 0)}
                className="form-input font-mono"
                style={{ width: '6rem', padding: '0.25rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#4338ca' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">
                ISBN <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-0132350884"
                className="form-input font-mono"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Total Copies <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                className="form-input tabular-nums"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear() + 1}
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value ? parseInt(e.target.value, 10) : '')}
                placeholder="2023"
                className="form-input tabular-nums"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Summary</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary, curriculum level, or edition..."
              className="form-textarea"
              style={{ resize: 'none' }}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : bookToEdit ? 'Save Changes' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
