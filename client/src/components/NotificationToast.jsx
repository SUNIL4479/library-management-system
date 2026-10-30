import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const NotificationToast = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.25rem',
      right: '1.25rem',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxWidth: '24rem',
      width: '100%',
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        const bg = isError ? '#fff1f2' : isSuccess ? '#ecfdf5' : '#ffffff';
        const border = isError ? '#fecdd3' : isSuccess ? '#a7f3d0' : '#e2e8f0';
        const textColor = isError ? '#9f1239' : isSuccess ? '#065f46' : '#0f172a';

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              borderRadius: '0.75rem',
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: textColor,
              boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
            }}
          >
            {isError ? (
              <AlertCircle style={{ width: '1.125rem', height: '1.125rem', color: '#e11d48', flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <CheckCircle2 style={{ width: '1.125rem', height: '1.125rem', color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
            )}
            <div style={{ flex: 1, fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.4 }}>
              {toast.text}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ color: '#94a3b8', flexShrink: 0, cursor: 'pointer' }}
            >
              <X style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
