import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api.js';
import { Navbar } from './components/Navbar.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { BooksList } from './pages/BooksList.jsx';
import { MembersList } from './pages/MembersList.jsx';
import { TransactionsList } from './pages/TransactionsList.jsx';
import { AddEditBookModal } from './components/AddEditBookModal.jsx';
import { AddEditMemberModal } from './components/AddEditMemberModal.jsx';
import { IssueBookModal } from './components/IssueBookModal.jsx';
import { ConfirmModal } from './components/ConfirmModal.jsx';
import { TransactionReceiptModal } from './components/TransactionReceiptModal.jsx';
import { NotificationToast } from './components/NotificationToast.jsx';
import { Library, RefreshCw, AlertCircle, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Core Data State
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  // Modals
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);

  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [preselectedBookId, setPreselectedBookId] = useState(null);
  const [preselectedMemberId, setPreselectedMemberId] = useState(null);

  const [receiptTx, setReceiptTx] = useState(null);

  // Confirm Modal
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDestructive: false,
    onConfirm: () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (type, text) => {
    setToasts((prev) => [...prev, { id: `toast-${Date.now()}-${Math.random()}`, type, text }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setInitError(null);
      const [booksData, membersData, txsData, statsData] = await Promise.all([
        api.getBooks(),
        api.getMembers(),
        api.getTransactions(),
        api.getStats(),
      ]);

      setBooks(booksData);
      setMembers(membersData);
      setTransactions(txsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load library data:', err);
      setInitError(err.message || 'Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Book Actions
  const handleSaveBook = async (bookData) => {
    if (bookToEdit) {
      await api.updateBook(bookToEdit._id, bookData);
      addToast('success', `"${bookData.title}" was updated successfully.`);
    } else {
      await api.createBook(bookData);
      addToast('success', `"${bookData.title}" was added with $${Number(bookData.dailyRate || 1.00).toFixed(2)}/day rate.`);
    }
    await loadData();
  };

  const handleDeleteBook = (id, title) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Book from Catalog',
      message: `Are you sure you want to remove "${title}"? This action cannot be undone.`,
      confirmLabel: 'Delete Book',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.deleteBook(id);
          addToast('success', `"${title}" has been deleted.`);
          await loadData();
        } catch (err) {
          addToast('error', err.message || 'Failed to delete book');
        } finally {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Handle Member Actions
  const handleSaveMember = async (memberData) => {
    if (memberToEdit) {
      await api.updateMember(memberToEdit._id, memberData);
      addToast('success', `Member "${memberData.name}" was updated.`);
    } else {
      await api.createMember(memberData);
      addToast('success', `Member "${memberData.name}" has been registered.`);
    }
    await loadData();
  };

  const handleDeleteMember = (id, name) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Remove Member Profile',
      message: `Are you sure you want to remove member "${name}" from the system?`,
      confirmLabel: 'Delete Member',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.deleteMember(id);
          addToast('success', `Member "${name}" was removed.`);
          await loadData();
        } catch (err) {
          addToast('error', err.message || 'Failed to delete member');
        } finally {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Handle Issue Book
  const handleIssueBook = async (payload) => {
    const res = await api.issueBook(payload);
    addToast('success', res.message || 'Book issued successfully!');
    await loadData();
  };

  // Handle Return Book
  const handleReturnBook = (txId) => {
    const tx = transactions.find((t) => t._id === txId);
    const bookTitle = tx?.book?.title || 'this book';
    const borrowerName = tx?.member?.name || 'the borrower';
    const totalFee = tx?.totalFee ? tx.totalFee.toFixed(2) : '0.00';

    setConfirmConfig({
      isOpen: true,
      title: 'Confirm Book Check-In & Fee Settlement',
      message: `Confirm return of "${bookTitle}" borrowed by ${borrowerName}? Calculated total fee is $${totalFee} based on popularity daily rate of $${tx?.dailyRate?.toFixed(2)}/day for ${tx?.daysHeld} days.`,
      confirmLabel: `Accept Return ($${totalFee})`,
      isDestructive: false,
      onConfirm: async () => {
        try {
          const res = await api.returnBook(txId);
          addToast('success', res.message || 'Book returned and restocked successfully!');
          await loadData();
        } catch (err) {
          addToast('error', err.message || 'Failed to return book');
        } finally {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Handle Database Reset
  const handleResetDatabase = async () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Reset Demo Database',
      message: 'This will restore all catalog books, popularity tiers, members, and transactions back to the clean demonstration seed data.',
      confirmLabel: 'Reset Database',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await api.resetData();
          addToast('success', res.message || 'Database reset successfully.');
          await loadData();
        } catch (err) {
          addToast('error', err.message || 'Failed to reset database');
        } finally {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenIssueModal={() => {
          setPreselectedBookId(null);
          setPreselectedMemberId(null);
          setIsIssueOpen(true);
        }}
        onOpenAddBookModal={() => {
          setBookToEdit(null);
          setIsAddBookOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="main-container">
        {initError ? (
          <div className="card" style={{ maxWidth: '28rem', margin: '4rem auto', textAlign: 'center', borderColor: '#fecdd3' }}>
            <AlertCircle style={{ width: '3rem', height: '3rem', color: '#e11d48', margin: '0 auto 0.75rem' }} />
            <h2 className="heading-section" style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Backend Connection Error</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.6 }}>{initError}</p>
            <button
              onClick={() => loadData()}
              className="btn btn-primary"
              style={{ marginTop: '1.25rem' }}
            >
              <RefreshCw style={{ width: '0.875rem', height: '0.875rem' }} />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : loading && books.length === 0 ? (
          <div style={{ padding: '8rem 1rem', textAlign: 'center' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              border: '3px solid #4f46e5',
              borderTopColor: 'transparent',
              borderRadius: '9999px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 0.75rem'
            }} />
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Loading catalog & circulation ledger...</p>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <Dashboard
                stats={stats}
                books={books}
                recentTransactions={transactions}
                onOpenIssueModal={(bookId) => {
                  setPreselectedBookId(bookId || null);
                  setPreselectedMemberId(null);
                  setIsIssueOpen(true);
                }}
                onOpenAddBookModal={() => {
                  setBookToEdit(null);
                  setIsAddBookOpen(true);
                }}
                onOpenAddMemberModal={() => {
                  setMemberToEdit(null);
                  setIsAddMemberOpen(true);
                }}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onReturnBook={handleReturnBook}
                onViewReceipt={(tx) => setReceiptTx(tx)}
              />
            )}

            {currentTab === 'books' && (
              <BooksList
                books={books}
                onOpenAddBookModal={() => {
                  setBookToEdit(null);
                  setIsAddBookOpen(true);
                }}
                onEditBook={(book) => {
                  setBookToEdit(book);
                  setIsAddBookOpen(true);
                }}
                onDeleteBook={handleDeleteBook}
                onIssueBook={(bookId) => {
                  setPreselectedBookId(bookId);
                  setPreselectedMemberId(null);
                  setIsIssueOpen(true);
                }}
              />
            )}

            {currentTab === 'members' && (
              <MembersList
                members={members}
                transactions={transactions}
                onOpenAddMemberModal={() => {
                  setMemberToEdit(null);
                  setIsAddMemberOpen(true);
                }}
                onEditMember={(member) => {
                  setMemberToEdit(member);
                  setIsAddMemberOpen(true);
                }}
                onDeleteMember={handleDeleteMember}
                onIssueToMember={(memberId) => {
                  setPreselectedBookId(null);
                  setPreselectedMemberId(memberId);
                  setIsIssueOpen(true);
                }}
              />
            )}

            {currentTab === 'transactions' && (
              <TransactionsList
                transactions={transactions}
                onReturnBook={handleReturnBook}
                onOpenIssueModal={() => {
                  setPreselectedBookId(null);
                  setPreselectedMemberId(null);
                  setIsIssueOpen(true);
                }}
                onViewReceipt={(tx) => setReceiptTx(tx)}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AddEditBookModal
        isOpen={isAddBookOpen}
        bookToEdit={bookToEdit}
        onClose={() => {
          setIsAddBookOpen(false);
          setBookToEdit(null);
        }}
        onSubmit={handleSaveBook}
      />

      <AddEditMemberModal
        isOpen={isAddMemberOpen}
        memberToEdit={memberToEdit}
        onClose={() => {
          setIsAddMemberOpen(false);
          setMemberToEdit(null);
        }}
        onSubmit={handleSaveMember}
      />

      <IssueBookModal
        isOpen={isIssueOpen}
        books={books}
        members={members}
        preselectedBookId={preselectedBookId}
        preselectedMemberId={preselectedMemberId}
        onClose={() => {
          setIsIssueOpen(false);
          setPreselectedBookId(null);
          setPreselectedMemberId(null);
        }}
        onSubmit={handleIssueBook}
      />

      <TransactionReceiptModal
        isOpen={Boolean(receiptTx)}
        transaction={receiptTx}
        onClose={() => setReceiptTx(null)}
        onReturnBook={handleReturnBook}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toasts */}
      <NotificationToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
