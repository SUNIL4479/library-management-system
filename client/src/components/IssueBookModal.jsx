import React, { useState, useEffect } from 'react';
import { X, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { POPULARITY_INFO } from '../services/api.js';

export const IssueBookModal = ({
  isOpen,
  books,
  members,
  preselectedBookId,
  preselectedMemberId,
  onClose,
  onSubmit,
}) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date();
    const issueStr = today.toISOString().split('T')[0];
    const dueDay = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const dueStr = dueDay.toISOString().split('T')[0];

    setIssueDate(issueStr);
    setDueDate(dueStr);
    setNotes('');
    setError(null);

    if (preselectedBookId) {
      setSelectedBookId(preselectedBookId);
    } else {
      const firstAvailable = books.find(b => b.availableQuantity > 0);
      setSelectedBookId(firstAvailable ? firstAvailable._id : (books[0]?._id || ''));
    }

    if (preselectedMemberId) {
      setSelectedMemberId(preselectedMemberId);
    } else {
      const firstActive = members.find(m => m.status === 'Active');
      setSelectedMemberId(firstActive ? firstActive._id : (members[0]?._id || ''));
    }
  }, [isOpen, preselectedBookId, preselectedMemberId, books, members]);

  if (!isOpen) return null;

  const currentBook = books.find(b => b._id === selectedBookId);
  const currentMember = members.find(m => m._id === selectedMemberId);

  const isBookUnavailable = currentBook ? currentBook.availableQuantity <= 0 : false;
  const isMemberInactive = currentMember ? currentMember.status === 'Inactive' : false;

  const popTier = currentBook?.popularity || 'Standard';
  const popInfo = POPULARITY_INFO[popTier] || POPULARITY_INFO.Standard;
  const bookRate = currentBook?.dailyRate !== undefined ? currentBook.dailyRate : popInfo.rate;
  const estimated14Days = (bookRate * 14).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedBookId) {
      setError('Please choose a book to issue.');
      return;
    }
    if (!selectedMemberId) {
      setError('Please choose a member.');
      return;
    }
    if (isBookUnavailable) {
      setError('Cannot issue this book: Zero copies currently available in the library.');
      return;
    }
    if (isMemberInactive) {
      setError('Cannot issue book to an inactive member profile.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        bookId: selectedBookId,
        memberId: selectedMemberId,
        issueDate,
        dueDate,
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to issue book');
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
              <RotateCcw style={{ width: '1.25rem', height: '1.25rem', transform: 'rotate(180deg)' }} />
            </div>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                Issue Book to Patron
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Initialize loan with popularity-based daily holding fee
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
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Select Book */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Select Book <span style={{ color: '#e11d48' }}>*</span>
              </label>
              {currentBook && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: currentBook.availableQuantity > 0 ? '#059669' : '#e11d48' }}>
                  {currentBook.availableQuantity} of {currentBook.quantity} available
                </span>
              )}
            </div>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="form-select"
              required
            >
              {books.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.title} — by {b.author} ({b.availableQuantity} in stock · ${Number(b.dailyRate || 1.00).toFixed(2)}/day)
                </option>
              ))}
            </select>
          </div>

          {/* Popularity Daily Rate Badge Strip */}
          {currentBook && (
            <div style={{
              padding: '0.875rem 1rem',
              borderRadius: '1rem',
              backgroundColor: '#eef2ff',
              border: '1px solid #c7d2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sparkles style={{ width: '0.75rem', height: '0.75rem', color: '#4f46e5' }} />
                  Popularity: {popInfo.label}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  Allocated rate: <strong>${bookRate.toFixed(2)}</strong> for each day patron keeps the book
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="font-mono tabular-nums" style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#4338ca', display: 'block' }}>
                  ${bookRate.toFixed(2)}/day
                </span>
                <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>~${estimated14Days} for 14d</span>
              </div>
            </div>
          )}

          {/* Select Member */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Select Member <span style={{ color: '#e11d48' }}>*</span>
              </label>
              {currentMember && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: currentMember.status === 'Active' ? '#059669' : '#e11d48' }}>
                  Status: {currentMember.status}
                </span>
              )}
            </div>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="form-select"
              required
            >
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.email}) {m.status === 'Inactive' ? '— INACTIVE' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="form-row form-row-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Issue Date <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="form-input font-mono"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Due Date <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input font-mono"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Purpose / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Exam prep, course reading..."
              className="form-input"
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
              disabled={isSubmitting || isBookUnavailable || isMemberInactive}
              className="btn btn-primary"
              style={{ opacity: (isBookUnavailable || isMemberInactive) ? 0.5 : 1 }}
            >
              {isSubmitting ? 'Issuing...' : 'Authorize Loan & Accrual'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
