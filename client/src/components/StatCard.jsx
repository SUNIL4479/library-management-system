import React from 'react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon,
  variant = 'default',
  pillLabel,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return {
          iconBg: '#ecfdf5',
          iconColor: '#059669',
          iconBorder: '#a7f3d0',
          pillBg: '#ecfdf5',
          pillColor: '#065f46',
        };
      case 'amber':
        return {
          iconBg: '#fffbeb',
          iconColor: '#d97706',
          iconBorder: '#fde68a',
          pillBg: '#fffbeb',
          pillColor: '#92400e',
        };
      case 'indigo':
        return {
          iconBg: '#eef2ff',
          iconColor: '#4f46e5',
          iconBorder: '#c7d2fe',
          pillBg: '#eef2ff',
          pillColor: '#4338ca',
        };
      default:
        return {
          iconBg: '#f1f5f9',
          iconColor: '#475569',
          iconBorder: '#e2e8f0',
          pillBg: '#f1f5f9',
          pillColor: '#475569',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="stat-metric-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span className="font-serif tabular-nums" style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {value}
            </span>
            {pillLabel && (
              <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '0.375rem', backgroundColor: styles.pillBg, color: styles.pillColor }}>
                {pillLabel}
              </span>
            )}
          </div>
        </div>

        <div style={{
          padding: '0.625rem',
          borderRadius: '0.75rem',
          backgroundColor: styles.iconBg,
          color: styles.iconColor,
          border: `1px solid ${styles.iconBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>

      {subtext && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: '#64748b' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
};
