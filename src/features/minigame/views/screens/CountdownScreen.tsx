'use client';
import { useEffect, useState } from 'react';

export function CountdownScreen() {
  const [n, setN] = useState(3);

  useEffect(() => {
    const iv = setInterval(() => setN((prev) => prev - 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const isGo = n <= 0;

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Pulse rings */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 260 + i * 80, height: 260 + i * 80,
            borderRadius: '50%',
            border: `1px solid rgba(99,102,241,${0.12 - i * 0.03})`,
            animation: `cdPulse 2s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
        {isGo ? '¡A jugar!' : '¡El juego comienza en!'}
      </div>

      <div
        key={n}
        style={{
          fontSize: 140, fontWeight: 900, lineHeight: 1,
          color: isGo ? '#22c55e' : '#6366f1',
          animation: 'cdPop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          textShadow: isGo
            ? '0 0 60px rgba(34,197,94,0.4), 0 0 120px rgba(34,197,94,0.15)'
            : '0 0 60px rgba(99,102,241,0.4), 0 0 120px rgba(99,102,241,0.15)',
          letterSpacing: '-0.04em',
        }}
      >
        {isGo ? '🎮' : n}
      </div>

      {!isGo && (
        <div style={{ display: 'flex', gap: 8 }}>
          {[3, 2, 1].map((dot) => (
            <div key={dot} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: dot >= n ? '#6366f1' : 'rgba(255,255,255,0.1)',
              transition: 'background .3s',
              boxShadow: dot >= n ? '0 0 8px rgba(99,102,241,0.6)' : 'none',
            }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes cdPop {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes cdPulse {
          0%, 100% { transform: scale(1);    opacity: 0.6; }
          50%       { transform: scale(1.06); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
