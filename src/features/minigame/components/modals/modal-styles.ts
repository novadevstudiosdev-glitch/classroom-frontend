import type { CSSProperties } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────
// Keep styles in sync with tailwind classes used in screen components.

export const titleStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: '#f8fafc',
  marginBottom: 0,
  letterSpacing: '-0.025em',
  lineHeight: 1.2,
};

export const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 6,
  display: 'block',
};

export const inputStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(15,23,42,0.6)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#f1f5f9',
  fontSize: 14,
  fontWeight: 500,
  outline: 'none',
  marginBottom: 14,
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color .15s, box-shadow .15s',
};

export const primaryBtn: CSSProperties = {
  flex: 1,
  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
  border: '1px solid rgba(99,102,241,0.4)',
  borderRadius: 10,
  padding: '11px 20px',
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
  letterSpacing: '-0.01em',
  boxShadow: '0 4px 24px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
  transition: 'opacity .15s, transform .1s',
};

export const secondaryBtn: CSSProperties = {
  flex: 1,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  padding: '11px 20px',
  color: '#64748b',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background .15s, color .15s',
};
