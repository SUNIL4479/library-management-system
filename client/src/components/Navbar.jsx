import React from 'react';
import { Plus, ArrowUpRight, Library } from 'lucide-react';

export const Navbar = ({
  currentTab,
  setCurrentTab,
  onOpenIssueModal,
  onOpenAddBookModal,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'books', label: 'Book Catalog' },
    { id: 'members', label: 'Members' },
    { id: 'transactions', label: 'Circulation & Rates' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Zone 1: Brand Title */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="nav-brand"
        >
          <div className="brand-icon-box">
            <Library style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
          <div>
            <span className="font-brand" style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', display: 'block', textTransform: 'uppercase', lineHeight: 1.2 }}>
              LibreStack LMS
            </span>
            <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
              Archival & Circulation Desk
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="nav-tabs">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="nav-actions">
          <button
            onClick={onOpenAddBookModal}
            className="btn btn-secondary"
          >
            <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
            <span>Add Book</span>
          </button>
          <button
            onClick={onOpenIssueModal}
            className="btn btn-primary"
          >
            <span>Issue Book</span>
            <ArrowUpRight style={{ width: '0.875rem', height: '0.875rem', opacity: 0.8 }} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="nav-mobile-bar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
