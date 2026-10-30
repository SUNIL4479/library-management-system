import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck } from 'lucide-react';

export const AddEditMemberModal = ({
  isOpen,
  memberToEdit,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipDate, setMembershipDate] = useState('');
  const [status, setStatus] = useState('Active');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setEmail(memberToEdit.email);
      setPhone(memberToEdit.phone);
      setMembershipDate(memberToEdit.membershipDate);
      setStatus(memberToEdit.status);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setMembershipDate(new Date().toISOString().split('T')[0]);
      setStatus('Active');
    }
    setError(null);
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Member full name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email format (e.g. name@domain.com).');
      return;
    }
    if (!phone.trim()) {
      setError('Contact phone number is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        membershipDate: membershipDate || new Date().toISOString().split('T')[0],
        status,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save member details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '30rem' }}>
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
              {memberToEdit ? <UserCheck style={{ width: '1.25rem', height: '1.25rem' }} /> : <UserPlus style={{ width: '1.25rem', height: '1.25rem' }} />}
            </div>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                {memberToEdit ? 'Edit Patron Profile' : 'Register New Member'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Update borrowing eligibility and contact details
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
              Full Name <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email Address <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. maya.lin@university.edu"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Phone Number <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 789-0123"
              className="form-input font-mono"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Joined Date</label>
              <input
                type="date"
                value={membershipDate}
                onChange={(e) => setMembershipDate(e.target.value)}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
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
              {isSubmitting ? 'Saving...' : memberToEdit ? 'Save Changes' : 'Register Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
