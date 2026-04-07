'use client';
import type { ScoreboardEntry } from '../types/game.types';

interface Props {
  entries: ScoreboardEntry[];
  myAlias: string;
  title?: string;
}

const RANK_COLORS = ['#fbbf24', '#94a3b8', '#b45309'];
const RANK_ICONS = ['🥇', '🥈', '🥉'];

export function Scoreboard({ entries, myAlias, title = 'Tabla de posiciones' }: Props) {
  return (
    <div style={{ width: '100%' }}>
      {title && (
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.map((e, i) => {
          const isMe = e.alias === myAlias;
          const rankColor = RANK_COLORS[i] ?? '#6366f1';
          const rankIcon = RANK_ICONS[i] ?? `${i + 1}`;

          return (
            <div key={`${e.alias}-${i}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: isMe ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
              borderRadius: 10,
              padding: '8px 12px',
              border: isMe ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
            }}>
              <div style={{
                width: 28, textAlign: 'center',
                fontSize: i < 3 ? 18 : 14,
                color: rankColor,
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {rankIcon}
              </div>
              <div style={{ flex: 1, color: '#e2e8f0', fontWeight: isMe ? 800 : 600, fontSize: 14,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.alias}
              </div>
              {e.correct != null && (
                <div style={{ fontSize: 12, color: '#22c55e', flexShrink: 0 }}>✓{e.correct}</div>
              )}
              <div style={{ fontWeight: 800, color: rankColor, fontSize: 14, flexShrink: 0 }}>
                {e.score}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
