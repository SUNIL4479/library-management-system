import React from 'react';
import { X, Receipt, Clock, BookOpen, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { POPULARITY_INFO } from '../services/api.js';

export const TransactionReceiptModal = ({ isOpen, transaction, onClose, onReturnBook }) => {
  if (!isOpen || !transaction) return null;

  const isReturned = transaction.status === 'returned';
  const popularity = transaction.book?.popularity || 'Standard';
  const popInfo = POPULARITY_INFO[popularity] || POPULARITY_INFO.Standard;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '34rem' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              backgroundColor: '#eef2ff',
              color: '#4338ca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Receipt style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                Circulation Invoice & Fee Audit
              </h3>
              <p className="font-mono" style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                Transaction ID: {transaction._id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
          {/* Status Banner */}
          <div style={{
            padding: '0.875rem 1rem',
            borderRadius: '1rem',
            border: isReturned ? '1px solid #a7f3d0' : transaction.overdueDays > 0 ? '1px solid #fecdd3' : '1px solid #c7d2fe',
            backgroundColor: isReturned ? '#ecfdf5' : transaction.overdueDays > 0 ? '#fff1f2' : '#eef2ff',
            color: isReturned ? '#065f46' : transaction.overdueDays > 0 ? '#9f1239' : '#312e81',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isReturned ? (
                <CheckCircle2 style={{ width: '1rem', height: '1rem', color: '#059669', flexShrink: 0 }} />
              ) : (
                <Clock style={{ width: '1rem', height: '1rem', color: '#4f46e5', flexShrink: 0 }} />
              )}
              <span style={{ fontWeight: 700 }}>
                {isReturned
                  ? 'Book Returned & Restocked'
                  : transaction.overdueDays > 0
                  ? `Active Loan (Overdue by ${transaction.overdueDays} days)`
                  : 'Active Loan in Good Standing'}
              </span>
            </div>
            <span className="font-mono" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
              {isReturned ? `Returned: ${transaction.returnDate}` : `Due: ${transaction.dueDate}`}
            </span>
          </div>

          {/* Book & Borrower Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <BookOpen style={{ width: '0.75rem', height: '0.75rem', color: '#4f46e5' }} />
                Book Title
              </span>
              <p className="font-serif" style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {transaction.book?.title || 'Unknown Title'}
              </p>
              <p className="font-scholarly" style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                by {transaction.book?.author || 'Unknown'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User style={{ width: '0.75rem', height: '0.75rem', color: '#4f46e5' }} />
                Borrower
              </span>
              <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {transaction.member?.name || transaction.memberId}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {transaction.member?.email}
              </p>
            </div>
          </div>

          {/* Popularity & Allocation Formula */}
          <div style={{
            padding: '1rem',
            borderRadius: '1rem',
            border: '1px solid #ddd6fe',
            backgroundColor: 'rgba(238, 242, 255, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.75rem' }}>Popularity-Based Daily Rate:</span>
              <span className="badge badge-indigo">
                {popInfo.label} (${transaction.dailyRate?.toFixed(2)}/day)
              </span>
            </div>
            <p style={{ fontSize: '0.6875rem', color: '#64748b', lineHeight: 1.5 }}>
              Based on the book's demand tier, an allocated daily fee of{' '}
              <strong style={{ color: '#4338ca' }}>${transaction.dailyRate?.toFixed(2)}</strong> applies for every day the patron keeps the volume.
            </p>
          </div>

          {/* Detailed Itemized Ledger Calculation */}
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <h4 style={{ fontWeight: 700, color: '#0f172a', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.75rem' }}>
              Itemized Financial Breakdown
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0' }}>
              <div>
                <span style={{ color: '#334155', fontWeight: 500 }}>Issue Date:</span>
                <span className="font-mono" style={{ color: '#64748b', marginLeft: '0.375rem' }}>{transaction.issueDate}</span>
              </div>
              <div>
                <span style={{ color: '#334155', fontWeight: 500 }}>Calculation Date:</span>
                <span className="font-mono" style={{ color: '#64748b', marginLeft: '0.375rem' }}>{transaction.returnDate || 'Today (Live)'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 0', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ color: '#1e293b', fontWeight: 600 }}>Holding Duration:</span>
                <span style={{ color: '#64748b', marginLeft: '0.375rem' }}>
                  {transaction.daysHeld} {transaction.daysHeld === 1 ? 'day' : 'days'} kept
                </span>
              </div>
              <span className="font-mono tabular-nums" style={{ fontWeight: 700, color: '#0f172a' }}>
                {transaction.daysHeld} × ${transaction.dailyRate?.toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 0', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ color: '#334155' }}>Subtotal (Daily Allocation Fee):</span>
              <span className="font-mono tabular-nums" style={{ fontWeight: 700, color: '#0f172a' }}>
                ${transaction.holdingFee?.toFixed(2)}
              </span>
            </div>

            {transaction.overdueFee > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 0', borderTop: '1px solid #f1f5f9', color: '#e11d48' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  <AlertCircle style={{ width: '0.875rem', height: '0.875rem' }} />
                  Overdue Late Penalty ({transaction.overdueDays} days @ $1.00/day):
                </span>
                <span className="font-mono tabular-nums" style={{ fontWeight: 700 }}>
                  +${transaction.overdueFee?.toFixed(2)}
                </span>
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.625rem',
              marginTop: '0.25rem',
              borderTop: '2px solid #e2e8f0'
            }}>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>Total Settlement Amount:</span>
              <span className="font-mono tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4338ca' }}>
                ${transaction.totalFee?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close Invoice
          </button>
          {!isReturned && onReturnBook && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReturnBook(transaction._id);
              }}
              className="btn btn-primary"
            >
              Process Check-In & Settlement
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
