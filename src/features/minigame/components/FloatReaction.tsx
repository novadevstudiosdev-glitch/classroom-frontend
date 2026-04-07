'use client';
import { useEffect, useState } from 'react';

interface Props {
  reaction: { emoji: string; alias: string; id: number } | null;
}

export function FloatReaction({ reaction }: Props) {
  // Track IDs that have already faded out so we can hide them without synchronous setState in effect
  const [hiddenIds, setHiddenIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!reaction) return;
    const t = setTimeout(() => {
      setHiddenIds(prev => { const s = new Set(prev); s.add(reaction.id); return s; });
    }, 2200);
    return () => clearTimeout(t);
  }, [reaction?.id]);

  if (!reaction || hiddenIds.has(reaction.id)) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 100,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      animation: 'floatUp 2.2s ease-out forwards',
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: 48 }}>{reaction.emoji}</div>
      <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{reaction.alias}</div>
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50%) translateY(-80px); }
        }
      `}</style>
    </div>
  );
}
