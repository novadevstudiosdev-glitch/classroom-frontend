'use client';
import { CircularTimer } from './CircularTimer';
import { ReactionBar } from './ReactionBar';
import { ChatPanel } from './ChatPanel';
import type { PlayerInfo, ChatMessage } from '../types/game.types';

interface Props {
  myScore: number;
  myAlias: string;
  players: PlayerInfo[];
  roomChat: ChatMessage[];
  onSendChat: (t: string) => void;
  onSendReaction: (emoji: string) => void;
  /** If provided, renders the circular timer at the top of the sidebar */
  timer?: { key: string | number; durationMs: number; onExpire?: () => void };
  /** Show the green dot per player when they've answered */
  showAnswered?: boolean;
  /** Show each player's score instead of answered status */
  showScores?: boolean;
}

const AVATAR_PALETTE = [
  '#6366f1', '#0ea5e9', '#f59e0b', '#10b981',
  '#8b5cf6', '#ec4899', '#ef4444', '#14b8a6',
];

export function GameSidebar({
  myScore, myAlias, players, roomChat,
  onSendChat, onSendReaction,
  timer, showAnswered = false, showScores = false,
}: Props) {
  return (
    <div style={{
      width: 256, flexShrink: 0,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      borderLeft: '1px solid rgba(255,255,255,0.045)',
      background: 'rgba(0,0,0,0.25)',
    }}>

      {/* ── Score + Timer block ── */}
      <div style={{
        flexShrink: 0, padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {/* My score */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.06))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 12, padding: '10px 14px',
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(99,102,241,0.6)', marginBottom: 3 }}>
              Mi puntaje
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {myScore.toLocaleString()}
            </div>
          </div>
          <div style={{ fontSize: 28, opacity: 0.6 }}>🏆</div>
        </div>

        {/* Timer */}
        {timer && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>
              Tiempo
            </div>
            <CircularTimer
              key={timer.key}
              durationMs={timer.durationMs}
              onExpire={timer.onExpire}
              size={72}
              strokeWidth={5}
            />
          </div>
        )}
      </div>

      {/* ── Players ── */}
      <div style={{
        flexShrink: 0, padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        maxHeight: 200, overflowY: 'auto',
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)', marginBottom: 8 }}>
          Jugadores · {players.length}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {players.map((p, i) => {
            const isMe = p.alias === myAlias;
            const color = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
            return (
              <div key={`${p.alias}-${i}`} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 8px', borderRadius: 8,
                background: isMe ? 'rgba(99,102,241,0.08)' : 'transparent',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: color + '28',
                  border: `1px solid ${color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 900, color: color,
                }}>
                  {p.alias[0]?.toUpperCase()}
                </div>
                {/* Name */}
                <div style={{
                  flex: 1, minWidth: 0,
                  fontSize: 12, fontWeight: isMe ? 700 : 600,
                  color: isMe ? '#a5b4fc' : 'rgba(255,255,255,0.55)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {p.alias}
                </div>
                {/* Score or answered */}
                {showScores && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                    {(p.score ?? 0).toLocaleString()}
                  </div>
                )}
                {showAnswered && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: p.answered ? '#10b981' : 'rgba(255,255,255,0.12)',
                    boxShadow: p.answered ? '0 0 6px rgba(16,185,129,0.6)' : 'none',
                    transition: 'all .3s',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Chat (flex-1) ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '12px 16px 10px', gap: 8, overflow: 'hidden' }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)', flexShrink: 0 }}>
          Chat
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChatPanel messages={roomChat} onSend={onSendChat} placeholder="Mensaje..." grow />
        </div>
      </div>

      {/* ── Reactions ── */}
      <div style={{ flexShrink: 0, padding: '8px 16px 14px', borderTop: '1px solid rgba(255,255,255,0.045)' }}>
        <ReactionBar onReact={onSendReaction} />
      </div>
    </div>
  );
}
