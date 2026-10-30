import React from 'react';
import {
  BookOpen,
  Users,
  RotateCcw,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  ArrowUpRight,
  Check,
  DollarSign,
} from 'lucide-react';
import { StatCard } from '../components/StatCard.jsx';
import { POPULARITY_INFO } from '../services/api.js';

export const Dashboard = ({
  stats,
  books,
  recentTransactions,
  onOpenIssueModal,
  onOpenAddBookModal,
  onOpenAddMemberModal,
  onNavigateTab,
  onReturnBook,
  onViewReceipt,
}) => {
  const lowStockBooks = books.filter(b => b.availableQuantity <= 1);
  const activeLoans = recentTransactions.filter(t => t.status === 'issued');

  const circulationPercentage = stats && stats.totalCopies > 0
    ? Math.round(((stats.totalCopies - stats.availableCopies) / stats.totalCopies) * 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div className="hero-banner">
        <div className="hero-banner-inner">
          <div style={{ maxWidth: '42rem' }}>
            <div className="hero-pill">
              <Sparkles style={{ width: '0.875rem', height: '0.875rem' }} />
              <span>Popularity-Based Daily Accrual Active</span>
            </div>
            <h1 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', lineHeight: 1.15 }}>
              Library Operations Hub
            </h1>
            <p style={{ fontSize: '0.9375rem', color: '#cbd5e1', fontWeight: 300, lineHeight: 1.6, marginTop: '0.5rem', maxWidth: '36rem' }}>
              Track catalog stock, manage member privileges, issue loans with popularity-scaled daily rates, and monitor fee accruals in real time.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <button
              onClick={() => onOpenIssueModal()}
              className="btn btn-secondary"
              style={{ backgroundColor: '#ffffff', color: '#0f172a', fontWeight: 700, padding: '0.625rem 1.125rem' }}
            >
              <RotateCcw style={{ width: '1rem', height: '1rem', color: '#4f46e5', transform: 'rotate(180deg)' }} />
              <span>Issue Book</span>
              <ArrowUpRight style={{ width: '0.875rem', height: '0.875rem', opacity: 0.7 }} />
            </button>
            <button
              onClick={onOpenAddBookModal}
              className="btn"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#ffffff', border: '1px solid #334155' }}
            >
              <PlusCircle style={{ width: '1rem', height: '1rem', color: '#a5b4fc' }} />
              <span>Add Book</span>
            </button>
            <button
              onClick={onOpenAddMemberModal}
              className="btn"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#ffffff', border: '1px solid #334155' }}
            >
              <Users style={{ width: '1rem', height: '1rem', color: '#6ee7b7' }} />
              <span>New Member</span>
            </button>
          </div>
        </div>

        {/* Banner Quick Bar */}
        <div className="hero-stats-row">
          <div>
            <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#94a3b8', display: 'block' }}>Total Volume Copies</span>
            <span className="font-serif tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>{stats?.totalCopies ?? '—'}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#94a3b8', display: 'block' }}>Copies On Loan</span>
            <span className="font-serif tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c7d2fe' }}>
              {stats ? stats.totalCopies - stats.availableCopies : '—'} <span className="font-sans" style={{ fontSize: '0.75rem', fontWeight: 400, color: '#818cf8' }}>({circulationPercentage}%)</span>
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#94a3b8', display: 'block' }}>Accrued Holding Fees</span>
            <span className="font-serif tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
              ${stats?.totalAccruedFees?.toFixed(2) ?? '0.00'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#94a3b8', display: 'block' }}>Overdue Follow-ups</span>
            <span className="font-serif tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 700, color: stats && stats.overdueCount > 0 ? '#fbbf24' : '#34d399' }}>
              {stats?.overdueCount ?? 0} <span className="font-sans" style={{ fontSize: '0.75rem', fontWeight: 400 }}>loans</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid-4">
        <StatCard
          title="Catalog Titles"
          value={stats ? stats.totalBooks : '—'}
          subtext={stats ? `${stats.availableCopies} physical copies on shelf` : undefined}
          icon={<BookOpen style={{ width: '1.25rem', height: '1.25rem' }} />}
          variant="indigo"
          pillLabel="Catalog"
        />
        <StatCard
          title="Active Patrons"
          value={stats ? stats.activeMembers : '—'}
          subtext={stats ? `${stats.totalMembers} registered patron accounts` : undefined}
          icon={<Users style={{ width: '1.25rem', height: '1.25rem' }} />}
          variant="default"
          pillLabel="Members"
        />
        <StatCard
          title="Circulating Loans"
          value={stats ? stats.issuedBooks : '—'}
          subtext={stats ? `${stats.overdueCount} loans past 14-day limit` : undefined}
          icon={<Clock style={{ width: '1.25rem', height: '1.25rem' }} />}
          variant={stats && stats.overdueCount > 0 ? 'amber' : 'default'}
          pillLabel={stats && stats.overdueCount > 0 ? `${stats.overdueCount} Overdue` : 'Healthy'}
        />
        <StatCard
          title="Total Fees Accrued"
          value={stats ? `$${stats.totalAccruedFees?.toFixed(2)}` : '$0.00'}
          subtext={stats ? `$${stats.totalHoldingFees?.toFixed(2)} daily holding + $${stats.totalOverdueFees?.toFixed(2)} late` : undefined}
          icon={<DollarSign style={{ width: '1.25rem', height: '1.25rem' }} />}
          variant="emerald"
          pillLabel="Popularity Model"
        />
      </div>

      {/* 2-Column Main Section */}
      <div className="dashboard-activity-layout">
        {/* Active Circulating Loans Table */}
        <div className="card dashboard-activity-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.625rem', borderRadius: '0.75rem', backgroundColor: '#eef2ff', color: '#4338ca' }}>
                  <Clock style={{ width: '1rem', height: '1rem' }} />
                </div>
                <div>
                  <h2 className="heading-section" style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    Current Borrowings & Daily Accrual
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    Books currently on loan with live calculated fees
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('transactions')}
                style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>Full Ledger ({recentTransactions.length})</span>
                <ArrowRight style={{ width: '0.875rem', height: '0.875rem' }} />
              </button>
            </div>

            <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
              {activeLoans.length === 0 ? (
                <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '1rem', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                    <Check style={{ width: '1.5rem', height: '1.5rem' }} />
                  </div>
                  <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>All books checked in</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>There are no active loans pending return.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Book & Popularity</th>
                      <th>Borrower</th>
                      <th>Days Kept</th>
                      <th>Accrued Amount</th>
                      <th style={{ textAlign: 'right' }}>Desk Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLoans.slice(0, 5).map((tx) => {
                      const isOverdue = tx.overdueDays > 0;
                      const popInfo = POPULARITY_INFO[tx.book?.popularity] || POPULARITY_INFO.Standard;

                      return (
                        <tr key={tx._id}>
                          <td>
                            <span style={{ fontWeight: 700, color: '#0f172a', display: 'block', maxWidth: '16rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tx.book?.title || `Book #${tx.bookId}`}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>
                              <span className="badge badge-indigo">
                                ${tx.dailyRate?.toFixed(2)}/day
                              </span>
                              <span>·</span>
                              <span>by {tx.book?.author || 'Unknown'}</span>
                            </div>
                          </td>

                          <td>
                            <span style={{ fontWeight: 600, color: '#1e293b', display: 'block', maxWidth: '8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tx.member?.name || tx.memberId}
                            </span>
                            <span style={{ fontSize: '0.6875rem', color: '#94a3b8', display: 'block', maxWidth: '8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tx.member?.email}
                            </span>
                          </td>

                          <td>
                            <span className="font-mono" style={{ fontWeight: 700, color: '#334155' }}>
                              {tx.daysHeld} {tx.daysHeld === 1 ? 'day' : 'days'}
                            </span>
                            <span style={{ fontSize: '0.625rem', color: '#94a3b8', display: 'block' }}>since {tx.issueDate}</span>
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <span className="font-mono" style={{ fontWeight: 700, color: '#0f172a' }}>
                                ${tx.totalFee?.toFixed(2)}
                              </span>
                              {isOverdue && (
                                <span className="badge badge-rose">Overdue</span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>
                              (${tx.holdingFee?.toFixed(2)} hold {tx.overdueFee > 0 ? `+ $${tx.overdueFee.toFixed(2)} late` : ''})
                            </span>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.375rem' }}>
                              <button
                                onClick={() => onViewReceipt && onViewReceipt(tx)}
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                                title="Inspect invoice breakdown"
                              >
                                Audit
                              </button>
                              <button
                                onClick={() => onReturnBook(tx._id)}
                                className="btn btn-subtle"
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                Check In
                              </button>
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

          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>Daily fee is calculated according to each book's popularity tier</span>
            <button
              onClick={() => onOpenIssueModal()}
              style={{ color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}
            >
              + Issue Another Copy
            </button>
          </div>
        </div>

        {/* Right Sidebar: Popularity Breakdown & Low Stock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Popularity Rates Guide */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#ecfdf5', color: '#059669' }}>
                <DollarSign style={{ width: '1rem', height: '1rem' }} />
              </div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Popularity Daily Rate Scale</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.75rem' }}>
              {Object.entries(POPULARITY_INFO).map(([tier, info]) => {
                const count = books.filter(b => (b.popularity || 'Standard') === tier).length;
                return (
                  <div key={tier} style={{
                    padding: '0.625rem 0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #f1f5f9',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#1e293b', display: 'block', fontSize: '0.75rem' }}>{info.label}</span>
                      <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{count} titles in collection</span>
                    </div>
                    <span className="font-mono" style={{ fontWeight: 700, color: '#4338ca', fontSize: '0.75rem' }}>
                      ${info.rate.toFixed(2)} / day
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#fffbeb', color: '#d97706' }}>
                  <AlertCircle style={{ width: '1rem', height: '1rem' }} />
                </div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Inventory Status</h3>
              </div>
              <button
                onClick={() => onNavigateTab('books')}
                style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', cursor: 'pointer' }}
              >
                Catalog
              </button>
            </div>

            <div style={{ marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {lowStockBooks.length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.75rem 0', textAlign: 'center' }}>
                  All catalog titles maintain healthy stock levels (&ge; 2 copies).
                </p>
              ) : (
                lowStockBooks.slice(0, 4).map((book) => (
                  <div
                    key={book._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      fontSize: '0.75rem'
                    }}
                  >
                    <div style={{ overflow: 'hidden', paddingRight: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {book.title}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                        ${Number(book.dailyRate || 1.00).toFixed(2)}/day · {book.author}
                      </span>
                    </div>
                    <span className={book.availableQuantity === 0 ? 'badge badge-rose' : 'badge badge-amber'}>
                      {book.availableQuantity === 0 ? 'Out of Stock' : `${book.availableQuantity} left`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
