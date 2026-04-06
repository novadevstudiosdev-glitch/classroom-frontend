'use client';
import type { ReactNode } from 'react';

interface Props {
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}

export function Overlay({ onClose, children, maxWidth = 440 }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
        background: 'rgba(2,4,9,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        animation: 'overlayIn .18s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          /* Layered background for depth */
          background: 'linear-gradient(145deg, #0d1525 0%, #0a1020 60%, #070d1a 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: '28px 26px 24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: [
            '0 0 0 1px rgba(99,102,241,0.08)',
            '0 32px 80px rgba(0,0,0,0.8)',
            '0 0 120px rgba(99,102,241,0.04)',
            'inset 0 1px 0 rgba(255,255,255,0.05)',
          ].join(', '),
          animation: 'modalIn .24s cubic-bezier(.22,.68,0,1.2)',
        }}
      >
        {/* Top accent glow */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.3), transparent)',
          borderRadius: '0 0 100% 100%',
        }} />
        {children}
      </div>

      <style>{`
        @keyframes overlayIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.94) translateY(16px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
      `}</style>
    </div>
  );
}
