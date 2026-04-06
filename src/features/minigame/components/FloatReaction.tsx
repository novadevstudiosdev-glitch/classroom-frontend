'use client';
import { useEffect, useState } from 'react';

interface Props {
  reaction: { emoji: string; alias: string; id: number } | null;
}

export function FloatReaction({ reaction }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!reaction) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, [reaction?.id]);

  if (!reaction || !visible) return null;

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
