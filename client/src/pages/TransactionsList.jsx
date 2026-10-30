import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  AlertCircle,
  Clock,
  BookCheck,
  Plus,
  X,
  DollarSign,
  Receipt,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { POPULARITY_INFO } from '../services/api.js';

export const TransactionsList = ({
  transactions,
  onReturnBook,
  onOpenIssueModal,
  onViewReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTransactions = transactions.filter(t => {
    const bookTitle = t.book?.title || '';
    const memberName = t.member?.name || '';
    const notes = t.notes || '';
    const matchesSearch =
      bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalActiveLoans = transactions.filter(t => t.status === 'issued').length;
  const totalReturned = transactions.filter(t => t.status === 'returned').length;
  const overdueCount = transactions.filter(t => t.status === 'issued' && t.overdueDays > 0).length;

  const totalHoldingAccrued = transactions.reduce((sum, t) => sum + (t.holdingFee || 0), 0);
  const totalOverdueFines = transactions.reduce((sum, t) => sum + (t.overdueFee || 0), 0);
  const grandTotalFees = totalHoldingAccrued + totalOverdueFines;
  const currentDailyRunRate = transactions
    .filter(t => t.status === 'issued')
    .reduce((sum, t) => sum + (t.dailyRate || 1.00), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="heading-page">
            Circulation Ledger & Daily Accruals
          </h1>
          <p className="subheading-page">
            Every book incurs an allocated daily holding fee based on its popularity tier for each day a user keeps it.
          </p>
        </div>
        <button
          onClick={onOpenIssueModal}
          className="btn btn-primary"
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          <span>Issue New Loan</span>
        </button>
      </div>

      {/* Financial Accrual KPI Strip */}
      <div className="grid-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Total Accrued Fees</span>
            <DollarSign style={{ width: '1rem', height: '1rem', color: '#059669' }} />
          </div>
          <p className="font-serif tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem', lineHeight: 1.1 }}>
            ${grandTotalFees.toFixed(2)}
          </p>
          <p style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Holding fees + overdue late penalties
          </p>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Popularity Holding Fees</span>
            <Sparkles style={{ width: '1rem', height: '1rem', color: '#4f46e5' }} />
          </div>
          <p className="font-serif tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#4338ca', marginTop: '0.5rem', lineHeight: 1.1 }}>
            ${totalHoldingAccrued.toFixed(2)}
          </p>
          <p style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Days kept × allocated daily rates
          </p>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Live Daily Accrual Rate</span>
            <TrendingUp style={{ width: '1rem', height: '1rem', color: '#059669' }} />
          </div>
          <p className="font-serif tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#059669', marginTop: '0.5rem', lineHeight: 1.1 }}>
            +${currentDailyRunRate.toFixed(2)} <span className="font-sans" style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8' }}>/ day</span>
          </p>
          <p style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Across {totalActiveLoans} active circulating loans
          </p>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Overdue Penalty Fines</span>
            <AlertCircle style={{ width: '1rem', height: '1rem', color: overdueCount > 0 ? '#e11d48' : '#94a3b8' }} />
          </div>
          <p className="font-serif tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: overdueCount > 0 ? '#e11d48' : '#0f172a', marginTop: '0.5rem', lineHeight: 1.1 }}>
            ${totalOverdueFines.toFixed(2)}
          </p>
          <p style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {overdueCount} loans currently past 14-day limit
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ width: '1rem', height: '1rem', color: '#94a3b8', position: 'absolute', left: '0.875rem', top: '0.75rem' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by book title, borrower name, or transaction code..."
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

          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '0.75rem' }}>
            {['All', 'issued', 'returned'].map((status) => {
              const isSelected = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
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
                  {status === 'All'
                    ? `All (${transactions.length})`
                    : status === 'issued'
                    ? `Active (${totalActiveLoans})`
                    : `Returned (${totalReturned})`}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div>
            <span>Showing {filteredTransactions.length} of {transactions.length} total entries</span>
            {overdueCount > 0 && statusFilter !== 'returned' && (
              <span style={{ marginLeft: '0.5rem', color: '#e11d48', fontWeight: 700 }}>· {overdueCount} loans past due date</span>
            )}
          </div>
          {(searchTerm || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
              }}
              style={{ color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Circulation Ledger Table */}
      <div className="table-container">
        {filteredTransactions.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <Clock style={{ width: '3rem', height: '3rem', color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
            <h3 className="heading-section" style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>No circulation records found</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              There are no transactions matching your current filters.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Title & Popularity</th>
                <th>Borrower</th>
                <th>Holding Duration</th>
                <th>Daily Rate & Accrual</th>
                <th>Overdue Late Fine</th>
                <th>Total Amount Due</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const isReturned = tx.status === 'returned';
                const popTier = tx.book?.popularity || 'Standard';
                const popInfo = POPULARITY_INFO[popTier] || POPULARITY_INFO.Standard;

                return (
                  <tr key={tx._id}>
                    {/* Book & Popularity */}
                    <td>
                      <div>
                        <span className="font-serif" style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem', display: 'block', maxWidth: '16rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tx.book?.title || 'Unknown Title'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.6875rem', marginTop: '2px' }}>
                          <span>by {tx.book?.author || 'Unknown'}</span>
                          <span>·</span>
                          <span className="badge badge-indigo">
                            {popInfo.label}
                          </span>
                        </div>
                        {tx.notes && (
                          <p style={{ fontSize: '0.6875rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>
                            &ldquo;{tx.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Borrower */}
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, color: '#1e293b', display: 'block', maxWidth: '8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tx.member?.name || tx.memberId}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#94a3b8', display: 'block', maxWidth: '8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tx.member?.email}
                        </span>
                      </div>
                    </td>

                    {/* Holding Duration */}
                    <td>
                      <span className="font-mono tabular-nums" style={{ fontWeight: 700, color: '#0f172a', display: 'block' }}>
                        {tx.daysHeld} {tx.daysHeld === 1 ? 'day' : 'days'} kept
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.625rem', color: '#94a3b8', display: 'block' }}>
                        {tx.issueDate} ➔ {tx.returnDate || 'Present'}
                      </span>
                    </td>

                    {/* Daily Rate & Holding Accrual */}
                    <td>
                      <span className="font-mono tabular-nums" style={{ fontWeight: 700, color: '#4338ca', fontSize: '0.875rem', display: 'block' }}>
                        ${tx.holdingFee?.toFixed(2)}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.625rem', color: '#94a3b8' }}>
                        ${tx.dailyRate?.toFixed(2)}/day × {tx.daysHeld}d
                      </span>
                    </td>

                    {/* Overdue Penalty */}
                    <td>
                      {tx.overdueFee > 0 ? (
                        <div>
                          <span className="font-mono tabular-nums" style={{ fontWeight: 700, color: '#e11d48', display: 'block' }}>
                            +${tx.overdueFee?.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '0.625rem', color: '#e11d48', fontWeight: 600 }}>
                            {tx.overdueDays}d overdue @ $1.00/d
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>
                      )}
                    </td>

                    {/* Total Amount Due & Status */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span className="font-mono tabular-nums" style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.875rem' }}>
                          ${tx.totalFee?.toFixed(2)}
                        </span>
                        {isReturned ? (
                          <span className="badge badge-emerald">Settled</span>
                        ) : (
                          <span className="badge badge-indigo">Accruing</span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.625rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                        Due: {tx.dueDate}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.375rem' }}>
                        <button
                          onClick={() => onViewReceipt && onViewReceipt(tx)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title="View audit breakdown receipt"
                        >
                          <Receipt style={{ width: '0.875rem', height: '0.875rem' }} />
                        </button>

                        {isReturned ? (
                          <span style={{ fontSize: '0.6875rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', paddingLeft: '0.25rem' }}>
                            <BookCheck style={{ width: '0.875rem', height: '0.875rem', color: '#059669' }} />
                            <span>Restocked</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onReturnBook(tx._id)}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            Check In
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
