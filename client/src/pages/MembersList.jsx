import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  BookMarked,
  UserX,
  X,
  ArrowUpRight,
} from 'lucide-react';

export const MembersList = ({
  members,
  transactions,
  onOpenAddMemberModal,
  onEditMember,
  onDeleteMember,
  onIssueToMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const getActiveLoansCount = (memberId) => {
    return transactions.filter(t => t.memberId === memberId && t.status === 'issued').length;
  };

  const getMemberAccruedFees = (memberId) => {
    return transactions
      .filter(t => t.memberId === memberId && t.status === 'issued')
      .reduce((sum, t) => sum + (t.totalFee || 0), 0);
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="heading-page">
            Patron & Member Directory
          </h1>
          <p className="subheading-page">
            Registered students, faculty, and community patrons eligible for circulation privileges.
          </p>
        </div>
        <button
          onClick={onOpenAddMemberModal}
          className="btn btn-primary"
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          <span>Register Member</span>
        </button>
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
              placeholder="Search member by full name, email, or telephone number..."
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
            {['All', 'Active', 'Inactive'].map((status) => {
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
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div>
            <span>Showing {filteredMembers.length} of {members.length} members</span>
            {statusFilter !== 'All' && (
              <span style={{ marginLeft: '0.5rem', color: '#475569', fontWeight: 600 }}>· Status: {statusFilter}</span>
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

      {/* Member Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="card" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <UserX style={{ width: '3rem', height: '3rem', color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
          <h3 className="heading-section" style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>No members match your criteria</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Try modifying the search keyword or status filter.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredMembers.map((member) => {
            const activeLoans = getActiveLoansCount(member._id);
            const accruedFees = getMemberAccruedFees(member._id);
            const isActive = member.status === 'Active';

            return (
              <div
                key={member._id}
                className="card card-hoverable"
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '0.875rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, #1e293b, #312e81)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.875rem'
                      }}>
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="heading-section" style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                          {member.name}
                        </h3>
                        <span className={isActive ? 'badge badge-emerald' : 'badge badge-slate'} style={{ marginTop: '0.25rem' }}>
                          {member.status} Account
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <button
                        onClick={() => onEditMember(member)}
                        className="btn-icon"
                        title="Edit profile"
                      >
                        <Edit2 style={{ width: '0.875rem', height: '0.875rem' }} />
                      </button>
                      <button
                        onClick={() => onDeleteMember(member._id, member.name)}
                        className="btn-icon danger"
                        title="Delete member"
                      >
                        <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <Mail style={{ width: '0.875rem', height: '0.875rem', color: '#94a3b8', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <Phone style={{ width: '0.875rem', height: '0.875rem', color: '#94a3b8', flexShrink: 0 }} />
                      <span className="font-mono tabular-nums" style={{ color: '#334155' }}>{member.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <Calendar style={{ width: '0.875rem', height: '0.875rem', color: '#94a3b8', flexShrink: 0 }} />
                      <span style={{ color: '#94a3b8' }}>Joined {member.membershipDate}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Loan Status & Action */}
                <div style={{ marginTop: '1.25rem', paddingTop: '0.875rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <BookMarked style={{ width: '1rem', height: '1rem', color: '#4f46e5' }} />
                      <span className="tabular-nums" style={{ fontWeight: 700, color: '#1e293b' }}>
                        {activeLoans} on loan
                      </span>
                    </div>
                    {accruedFees > 0 && (
                      <span className="font-mono" style={{ fontSize: '0.6875rem', color: '#059669', display: 'block', fontWeight: 600, marginTop: '2px' }}>
                        Accruing: ${accruedFees.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {isActive ? (
                    <button
                      onClick={() => onIssueToMember(member._id)}
                      className="btn btn-subtle"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      <span>Issue Copy</span>
                      <ArrowUpRight style={{ width: '0.75rem', height: '0.75rem' }} />
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
