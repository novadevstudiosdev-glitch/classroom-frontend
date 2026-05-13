'use client';
import { useMinigameStore } from '../../store/minigame.store';

export function LoadingScreen() {
  const text = useMinigameStore((s) => s.loadingText);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Concentric rings */}
      <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 32 }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid rgba(99,102,241,0.12)',
          animation: 'ringPulse 2.4s ease-in-out infinite',
        }} />
        {/* Mid ring */}
        <div style={{
          position: 'absolute', inset: 10, borderRadius: '50%',
          border: '1px solid rgba(99,102,241,0.18)',
          animation: 'ringPulse 2.4s ease-in-out infinite .3s',
        }} />
        {/* Spinner ring */}
        <div style={{
          position: 'absolute', inset: 20, borderRadius: '50%',
          border: '2px solid rgba(99,102,241,0.08)',
          borderTopColor: '#6366f1',
          borderRightColor: '#818cf8',
          animation: 'spin .9s linear infinite',
        }} />
        {/* Icon center */}
        <div style={{
          position: 'absolute', inset: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>🚀</div>
      </div>

      <p style={{
        fontSize: 16, fontWeight: 700, color: '#f1f5f9',
        letterSpacing: '-0.02em', margin: '0 0 6px',
      }}>
        {text || 'Conectando...'}
      </p>
      <p style={{ fontSize: 13, color: '#334155', fontWeight: 500, margin: 0 }}>
        Estableciendo conexión segura
      </p>

      <style>{`
        @keyframes spin       { to { transform: rotate(360deg); } }
        @keyframes ringPulse  { 0%,100% { opacity:.4; transform:scale(1); } 50% { opacity:.8; transform:scale(1.04); } }
      `}</style>
    </div>
  );
}
