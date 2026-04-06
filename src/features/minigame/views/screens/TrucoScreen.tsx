'use client';
import { useState, useEffect, useRef } from 'react';
import { useMinigameStore } from '../../store/minigame.store';
import { GameSidebar } from '../../components/GameSidebar';
import type { TrucoCard, TableTheme } from '../../types/game.types';

/* ═══════════════════════════════════════════════════════════════════════════
   PROPS
═══════════════════════════════════════════════════════════════════════════ */
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendTrucoAction: (action: { type: string; [k: string]: any }) => void;
  onSendReaction: (emoji: string) => void;
  onSendChat: (text: string) => void;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE THEMES
═══════════════════════════════════════════════════════════════════════════ */
type ThemeDef = {
  felt: string;
  feltInner: string;
  border: string;
  text: string;
  bg: string;
  label: string;
  icon: string;
};

const THEMES: Record<TableTheme, ThemeDef> = {
  green: {
    felt: 'radial-gradient(ellipse 80% 70% at 50% 50%, #1f7a4a 0%, #155a35 55%, #0f3d26 100%)',
    feltInner: '#1a6640',
    border: '#0b2e1c',
    text: '#d4f5e2',
    bg: 'radial-gradient(ellipse at center, #0d2b18 0%, #07160c 100%)',
    label: 'Tapete verde',
    icon: '🟢',
  },
  wood: {
    felt: 'radial-gradient(ellipse 80% 70% at 50% 50%, #9a6a45 0%, #7a4e28 55%, #5a3418 100%)',
    feltInner: '#8b5e3a',
    border: '#3a2010',
    text: '#fff0d8',
    bg: 'radial-gradient(ellipse at center, #2d1a0a 0%, #180d04 100%)',
    label: 'Mesa de madera',
    icon: '🪵',
  },
  plastic: {
    felt: 'radial-gradient(ellipse 80% 70% at 50% 50%, #2a4f80 0%, #1a3860 55%, #102845 100%)',
    feltInner: '#1e4070',
    border: '#0a1e38',
    text: '#c8e8ff',
    bg: 'radial-gradient(ellipse at center, #0a1a30 0%, #050e1a 100%)',
    label: 'Mesa de plástico',
    icon: '🔵',
  },
  night: {
    felt: 'radial-gradient(ellipse 80% 70% at 50% 50%, #252540 0%, #16163a 55%, #0d0d25 100%)',
    feltInner: '#1e1e38',
    border: '#080818',
    text: '#c0c0ff',
    bg: 'radial-gradient(ellipse at center, #05050f 0%, #020209 100%)',
    label: 'Modo noche',
    icon: '🌙',
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   SUIT COLORS & SVG ICONS
═══════════════════════════════════════════════════════════════════════════ */
const SUIT_COLOR: Record<string, string> = {
  espadas: '#1a237e',
  bastos:  '#1b5e20',
  copas:   '#c62828',
  oros:    '#e65100',
};

function SuitIcon({ suit, size = 14 }: { suit: string; size?: number }) {
  const c = SUIT_COLOR[suit] ?? '#333';
  const s = size;
  if (suit === 'espadas') return (
    <svg width={s} height={s} viewBox="0 0 20 24" fill="none">
      <polygon points="10,1 12.5,18 10,16 7.5,18" fill={c} />
      <rect x="4" y="17" width="12" height="2.5" rx="1.2" fill={c} />
      <rect x="9" y="19.5" width="2" height="4" rx="1" fill={c} />
    </svg>
  );
  if (suit === 'bastos') return (
    <svg width={s} height={s} viewBox="0 0 22 24" fill="none">
      <circle cx="11" cy="4"  r="3.8" fill={c} />
      <circle cx="4.5" cy="17" r="3.8" fill={c} />
      <circle cx="17.5" cy="17" r="3.8" fill={c} />
      <polygon points="10,4 12,4 14,17 8,17" fill={c} opacity="0.7" />
      <rect x="9" y="19.5" width="4" height="3.5" rx="1" fill={c} />
    </svg>
  );
  if (suit === 'copas') return (
    <svg width={s} height={s} viewBox="0 0 22 26" fill="none">
      <path d="M4 2 H18 Q18 14 11 18 Q4 14 4 2 Z" fill={c} />
      <path d="M6 3 H16" stroke="white" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
      <rect x="9.5" y="18" width="3" height="5" rx="1" fill={c} />
      <rect x="5" y="22.5" width="12" height="2.5" rx="1.2" fill={c} />
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9.5" fill={c} />
      <circle cx="11" cy="11" r="7"   fill={c} stroke="rgba(255,200,100,0.35)" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="4.5" fill="none" stroke="rgba(255,230,150,0.4)" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="2"   fill="rgba(255,220,130,0.35)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PIP POSITIONS (% of card width/height for suit symbols)
═══════════════════════════════════════════════════════════════════════════ */
const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[50, 22], [50, 78]],
  3: [[50, 18], [30, 65], [70, 65]],
  4: [[28, 25], [72, 25], [28, 75], [72, 75]],
  5: [[28, 22], [72, 22], [50, 50], [28, 78], [72, 78]],
  6: [[28, 18], [72, 18], [28, 50], [72, 50], [28, 82], [72, 82]],
  7: [[28, 15], [72, 15], [50, 32], [28, 55], [72, 55], [28, 82], [72, 82]],
};

const COURT: Record<number, string> = { 10: 'S', 11: 'C', 12: 'R' };
const COURT_FULL: Record<number, string> = { 10: 'SOTA', 11: 'CABALLO', 12: 'REY' };

/* ═══════════════════════════════════════════════════════════════════════════
   PLAYING CARD COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const CSIZES: Record<CardSize, { w: number; h: number; fs: number; pip: number; cornerFs: number }> = {
  xs: { w: 36,  h: 52,  fs: 7,  pip: 9,  cornerFs: 7  },
  sm: { w: 50,  h: 72,  fs: 10, pip: 12, cornerFs: 9  },
  md: { w: 66,  h: 94,  fs: 13, pip: 16, cornerFs: 11 },
  lg: { w: 82,  h: 116, fs: 16, pip: 20, cornerFs: 13 },
  xl: { w: 100, h: 140, fs: 18, pip: 24, cornerFs: 15 },
};

interface CardProps {
  card: TrucoCard;
  size?: CardSize;
  onClick?: () => void;
  selected?: boolean;
  dimmed?: boolean;
  highlight?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

function PlayingCard({
  card, size = 'md', onClick, selected, dimmed, highlight,
  draggable: isDraggable, isDragging, onDragStart, onDragEnd,
}: CardProps) {
  const d = CSIZES[size];
  const color = SUIT_COLOR[card.suit] ?? '#333';
  const isCourt = card.value >= 10;
  const label = COURT[card.value] ?? String(card.value);
  const pips = PIPS[card.value] ?? [];

  return (
    <div
      onClick={onClick}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        width: d.w, height: d.h,
        borderRadius: size === 'xs' ? 4 : size === 'sm' ? 5 : 7,
        background: 'linear-gradient(160deg, #fefdf8 0%, #f8f3e8 100%)',
        border: selected
          ? '2.5px solid #fbbf24'
          : highlight
          ? '2px solid rgba(99,255,160,0.7)'
          : '1px solid rgba(30,20,10,0.18)',
        boxShadow: selected
          ? '0 0 0 3px rgba(251,191,36,0.35), 0 8px 20px rgba(0,0,0,0.55)'
          : highlight
          ? '0 0 0 2px rgba(99,255,160,0.2), 0 4px 12px rgba(0,0,0,0.4)'
          : '0 3px 10px rgba(0,0,0,0.4)',
        cursor: isDraggable ? 'grab' : onClick ? 'pointer' : 'default',
        position: 'relative',
        flexShrink: 0,
        transform: selected ? 'translateY(-16px) scale(1.04)' : 'none',
        opacity: isDragging ? 0.35 : dimmed ? 0.55 : 1,
        transition: 'transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.15s, opacity 0.15s',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Top-left corner */}
      <div style={{
        position: 'absolute', top: size === 'xs' ? 2 : 3, left: size === 'xs' ? 3 : 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1,
      }}>
        <span style={{ fontSize: d.cornerFs, fontWeight: 900, color, lineHeight: 1 }}>{label}</span>
        <SuitIcon suit={card.suit} size={d.cornerFs - 1} />
      </div>

      {/* Bottom-right corner (rotated) */}
      <div style={{
        position: 'absolute', bottom: size === 'xs' ? 2 : 3, right: size === 'xs' ? 3 : 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1,
        transform: 'rotate(180deg)',
      }}>
        <span style={{ fontSize: d.cornerFs, fontWeight: 900, color, lineHeight: 1 }}>{label}</span>
        <SuitIcon suit={card.suit} size={d.cornerFs - 1} />
      </div>

      {/* Center content */}
      {isCourt ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: size === 'xs' ? 1 : 2,
        }}>
          <SuitIcon suit={card.suit} size={d.pip + 2} />
          {size !== 'xs' && (
            <span style={{ fontSize: d.fs - 2, fontWeight: 900, color, letterSpacing: '0.05em', lineHeight: 1 }}>
              {COURT_FULL[card.value]}
            </span>
          )}
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0 }}>
          {pips.map(([px, py], i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${px}%`, top: `${py}%`,
              transform: 'translate(-50%, -50%)',
            }}>
              <SuitIcon suit={card.suit} size={d.pip} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARD BACK
═══════════════════════════════════════════════════════════════════════════ */
function CardBack({ size = 'md' }: { size?: CardSize }) {
  const d = CSIZES[size];
  return (
    <div style={{
      width: d.w, height: d.h,
      borderRadius: size === 'xs' ? 4 : size === 'sm' ? 5 : 7,
      background: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #1565c0 70%, #1a237e 100%)',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: size === 'xs' ? 2 : 3,
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: size === 'xs' ? 2 : 4,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          rgba(255,255,255,0.04) 0px,
          rgba(255,255,255,0.04) 1.5px,
          transparent 1.5px,
          transparent 7px
        ), repeating-linear-gradient(
          -45deg,
          rgba(255,255,255,0.03) 0px,
          rgba(255,255,255,0.03) 1.5px,
          transparent 1.5px,
          transparent 7px
        )`,
      }} />
      {size !== 'xs' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: d.w * 0.42, height: d.h * 0.38,
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: size === 'sm' ? 9 : 12, opacity: 0.35 }}>♦</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE POSITIONS (for N players, always I'm at bottom center)
   Returns [{x, y, rot}] — x/y as % of container, rot in deg
═══════════════════════════════════════════════════════════════════════════ */
type Pos = { x: number; y: number; rot: number };
function getPositions(n: number): Pos[] {
  if (n === 2) return [
    { x: 50, y: 88, rot: 0   },  // me
    { x: 50, y: 12, rot: 180 },  // opponent
  ];
  if (n === 4) return [
    { x: 50, y: 88, rot: 0   },  // me
    { x: 88, y: 50, rot: 270 },  // right
    { x: 50, y: 12, rot: 180 },  // top
    { x: 12, y: 50, rot: 90  },  // left
  ];
  /* n=6 */
  return [
    { x: 50,  y: 90, rot: 0   },
    { x: 82,  y: 70, rot: 300 },
    { x: 88,  y: 30, rot: 270 },
    { x: 50,  y: 10, rot: 180 },
    { x: 12,  y: 30, rot: 90  },
    { x: 18,  y: 70, rot: 60  },
  ];
}

/** Played card position = 42% of the way from player seat toward center of felt */
function getPlayedCardPos(pos: Pos): { x: number; y: number } {
  const cx = 50, cy = 48; // felt center (slightly above geometric center)
  return {
    x: pos.x + (cx - pos.x) * 0.42,
    y: pos.y + (cy - pos.y) * 0.42,
  };
}

/** Build clockwise seating order, alternating teams, starting from my index */
function buildSeating(
  teamA: { alias: string }[],
  teamB: { alias: string }[],
  myAlias: string,
): string[] {
  const order: string[] = [];
  const maxLen = Math.max(teamA.length, teamB.length);
  for (let i = 0; i < maxLen; i++) {
    if (teamA[i]) order.push(teamA[i].alias);
    if (teamB[i]) order.push(teamB[i].alias);
  }
  const myIdx = order.indexOf(myAlias);
  if (myIdx < 0) return order;
  return [...order.slice(myIdx), ...order.slice(0, myIdx)];
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION BUTTON STYLE HELPERS
═══════════════════════════════════════════════════════════════════════════ */
type BtnVariant = 'primary' | 'danger' | 'success' | 'warning' | 'ghost';
const BTN_STYLES: Record<BtnVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
    border: '1px solid rgba(99,102,241,0.5)',
    color: '#fff', boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
  },
  danger: {
    background: 'linear-gradient(135deg,#dc2626,#ef4444)',
    border: '1px solid rgba(239,68,68,0.5)',
    color: '#fff', boxShadow: '0 4px 14px rgba(220,38,38,0.4)',
  },
  success: {
    background: 'linear-gradient(135deg,#059669,#10b981)',
    border: '1px solid rgba(16,185,129,0.5)',
    color: '#fff', boxShadow: '0 4px 14px rgba(5,150,105,0.4)',
  },
  warning: {
    background: 'linear-gradient(135deg,#d97706,#f59e0b)',
    border: '1px solid rgba(245,158,11,0.5)',
    color: '#fff', boxShadow: '0 4px 14px rgba(217,119,6,0.4)',
  },
  ghost: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)', boxShadow: 'none',
  },
};

function Btn({
  label, variant = 'primary', onClick, small, disabled,
}: {
  label: string; variant?: BtnVariant; onClick: () => void;
  small?: boolean; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? '6px 12px' : '9px 18px',
        borderRadius: 10,
        fontSize: small ? 12 : 13,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        opacity: disabled ? 0.45 : 1,
        transition: 'all .15s',
        whiteSpace: 'nowrap',
        ...BTN_STYLES[variant],
      }}
    >
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCORE PANEL
═══════════════════════════════════════════════════════════════════════════ */
function ScorePanel({
  teamAScore, teamBScore, myTeam, maxPoints, themeText,
}: {
  teamAScore: number; teamBScore: number; myTeam: 'A' | 'B'; maxPoints: number; themeText: string;
}) {
  return (
    <div style={{
      position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 0,
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(12px)',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden', zIndex: 20,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      {(['A', 'B'] as const).map((team, ti) => {
        const score = team === 'A' ? teamAScore : teamBScore;
        const isMe = team === myTeam;
        const pct = Math.min(100, (score / maxPoints) * 100);
        return (
          <div key={team} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '8px 20px', gap: 3,
            borderRight: ti === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            background: isMe ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.05)',
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: isMe ? '#6ee7b7' : '#fca5a5',
            }}>
              {isMe ? 'Nosotros' : 'Ellos'}
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: themeText, lineHeight: 1, letterSpacing: '-0.03em' }}>
              {score}
            </div>
            <div style={{ width: 52, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99, width: `${pct}%`,
                background: isMe
                  ? 'linear-gradient(90deg,#059669,#10b981)'
                  : 'linear-gradient(90deg,#dc2626,#ef4444)',
                transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
              / {maxPoints}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PLAYER SLOT (around the table — shows face-down cards + name badge)
═══════════════════════════════════════════════════════════════════════════ */
function PlayerSlot({
  alias, cardCount, isMyTeam, isCurrentTurn, rot, themeText,
}: {
  alias: string; cardCount: number; isMyTeam: boolean;
  isCurrentTurn: boolean; rot: number; themeText: string;
}) {
  const cardSize: CardSize = 'xs';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      transform: `rotate(${rot}deg)`,
    }}>
      {/* Face-down cards in hand */}
      <div style={{ display: 'flex', position: 'relative', height: CSIZES[cardSize].h }}>
        {cardCount > 0
          ? Array.from({ length: cardCount }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: i * 14,
                transform: `rotate(${(i - (cardCount - 1) / 2) * 5}deg)`,
                zIndex: i,
              }}>
                <CardBack size={cardSize} />
              </div>
            ))
          : (
            <div style={{
              width: CSIZES[cardSize].w + 28,
              height: CSIZES[cardSize].h,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0.3, fontSize: 11, color: themeText,
            }}>
              sin cartas
            </div>
          )
        }
      </div>

      {/* Name badge */}
      <div style={{
        padding: '3px 10px', borderRadius: 20,
        background: isMyTeam ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)',
        border: `1px solid ${isMyTeam ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.3)'}`,
        fontSize: 10, fontWeight: 700,
        color: isMyTeam ? '#6ee7b7' : '#fca5a5',
        display: 'flex', alignItems: 'center', gap: 4,
        transform: `rotate(${-rot}deg)`,
        whiteSpace: 'nowrap',
      }}>
        {isCurrentTurn && (
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: '#fbbf24',
            boxShadow: '0 0 6px rgba(251,191,36,0.8)',
            animation: 'turnPulse 1.2s ease-in-out infinite',
          }} />
        )}
        {alias}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PLAYED CARD ON FELT — card positioned at a player's played-card zone
═══════════════════════════════════════════════════════════════════════════ */
function PlayedCardOnFelt({
  card, x, y, rot, alias, isMe,
}: {
  card: TrucoCard; x: number; y: number; rot?: number; alias: string; isMe: boolean;
}) {
  const tiltDeg = isMe ? 0 : (rot ?? 0) + 180;
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%, -50%) rotate(${tiltDeg}deg)`,
      zIndex: 12,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
      animation: 'cardLand 0.25s cubic-bezier(.34,1.56,.64,1)',
    }}>
      <PlayingCard card={card} size="md" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HAND RESULT TOAST (non-blocking)
═══════════════════════════════════════════════════════════════════════════ */
function HandResultToast({ result, myTeam }: {
  result: { envidoWinnerTeam?: 'A' | 'B' | null; trucoPtsWinner?: 'A' | 'B' | null; mazoTeam?: 'A' | 'B' | null } | null;
  myTeam: 'A' | 'B';
}) {
  if (!result) return null;
  const lines: { text: string; win: boolean }[] = [];
  if (result.envidoWinnerTeam) {
    lines.push({ text: `Envido: ${result.envidoWinnerTeam === myTeam ? '✓ ganamos' : '✗ perdimos'}`, win: result.envidoWinnerTeam === myTeam });
  }
  if (result.trucoPtsWinner) {
    lines.push({ text: `Truco: ${result.trucoPtsWinner === myTeam ? '✓ ganamos' : '✗ perdimos'}`, win: result.trucoPtsWinner === myTeam });
  }
  if (result.mazoTeam) {
    lines.push({ text: `Ir al mazo: ${result.mazoTeam === myTeam ? '✗ nos fuimos' : '✓ se fueron'}`, win: result.mazoTeam !== myTeam });
  }
  if (lines.length === 0) return null;

  return (
    <div style={{
      position: 'absolute', top: 60, right: 12, zIndex: 30,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '10px 14px',
      display: 'flex', flexDirection: 'column', gap: 5,
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      animation: 'slideIn 0.3s ease',
    }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>
        Resultado de la mano
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: 12, fontWeight: 700, color: l.win ? '#6ee7b7' : '#fca5a5' }}>
          {l.text}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHOW ENVIDO PROMPT
═══════════════════════════════════════════════════════════════════════════ */
function ShowEnvidoPrompt({
  onShow, onHide, timeLeft,
}: { onShow: () => void; onHide: () => void; timeLeft: number }) {
  const pct = (timeLeft / 30) * 100;
  return (
    <div style={{
      position: 'absolute', bottom: 220, left: '50%', transform: 'translateX(-50%)',
      zIndex: 40,
      background: 'rgba(10,10,30,0.85)', backdropFilter: 'blur(14px)',
      border: '1px solid rgba(251,191,36,0.4)',
      borderRadius: 16, padding: '16px 22px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(251,191,36,0.15)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      minWidth: 280,
      animation: 'slideUp 0.3s ease',
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        ¿Mostrar el envido?
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 1.4 }}>
        Ganaste el envido. Si no mostrás, perdés los puntos.
      </div>
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          width: `${pct}%`,
          background: timeLeft > 15 ? 'linear-gradient(90deg,#059669,#10b981)' : 'linear-gradient(90deg,#dc2626,#ef4444)',
          transition: 'width 1s linear, background 0.5s',
        }} />
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{timeLeft}s restantes</div>
      <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
        <Btn label="Mostrar cartas" variant="success" onClick={onShow} />
        <Btn label="No mostrar (−pts)" variant="danger" onClick={onHide} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME PICKER (host only)
═══════════════════════════════════════════════════════════════════════════ */
function ThemePicker({
  current, onChange, onClose,
}: { current: TableTheme; onChange: (t: TableTheme) => void; onClose: () => void }) {
  return (
    <div style={{
      position: 'absolute', top: 56, right: 12, zIndex: 50,
      background: 'rgba(10,10,25,0.92)', backdropFilter: 'blur(14px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 14, padding: '12px 14px',
      boxShadow: '0 8px 28px rgba(0,0,0,0.7)',
      display: 'flex', flexDirection: 'column', gap: 6,
      minWidth: 200,
    }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>
        Cambiar tapete
      </div>
      {(Object.keys(THEMES) as TableTheme[]).map((t) => {
        const th = THEMES[t];
        const active = t === current;
        return (
          <button key={t} onClick={() => { onChange(t); onClose(); }} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 9,
            background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
            cursor: 'pointer', fontFamily: 'inherit',
            color: active ? '#a5b4fc' : 'rgba(255,255,255,0.6)',
            fontSize: 13, fontWeight: 600,
            transition: 'all .12s',
          }}>
            <span>{th.icon}</span>
            <span>{th.label}</span>
            {active && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#818cf8' }}>✓</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROUND INDICATORS (top-left)
═══════════════════════════════════════════════════════════════════════════ */
function RoundIndicators({
  roundWinners, myTeam, themeText,
}: { roundWinners: ('A' | 'B' | 'tie')[]; myTeam: 'A' | 'B'; themeText: string }) {
  return (
    <div style={{
      position: 'absolute', top: 12, left: 12,
      display: 'flex', flexDirection: 'column', gap: 5,
      zIndex: 20,
    }}>
      {[0, 1, 2].map(i => {
        const w = roundWinners[i];
        const color = !w ? 'rgba(255,255,255,0.12)' : w === 'tie' ? '#fbbf24' : w === myTeam ? '#10b981' : '#ef4444';
        const label = !w ? '' : w === 'tie' ? '=' : w === myTeam ? '✓' : '✗';
        return (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: 8,
            background: w ? `${color}22` : 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 900, color,
            transition: 'all 0.3s',
          }}>
            {label || (
              <span style={{ fontSize: 8, opacity: 0.4, color: themeText }}>{i + 1}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION PANEL — context-sensitive buttons (Argentine Truco rules)

   Rules implemented:
   - Envido / Real Envido / Falta Envido only on round 1, while envido available
   - Envido response: No Quiero | (escalate) Real Envido / Falta Envido | Quiero
   - Flor must-declare (con flor cuando tiene flor)
   - Truco chain: Truco → Retruco → Vale Cuatro
   - Truco response: No Quiero | (escalate) | Quiero
   - Ir al mazo (fold) on my turn
═══════════════════════════════════════════════════════════════════════════ */
function ActionPanel({
  view, myAlias, myTeam, onAction,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  view: any;
  myAlias: string;
  myTeam: 'A' | 'B';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAction: (a: { type: string; [k: string]: any }) => void;
}) {
  const isMyTurn   = view.currentTurnAlias === myAlias;
  const phase      = view.phase as string;
  const envidoSt   = view.envidoStatus as string;
  const trucoSt    = view.trucoStatus as string;
  const florMust   = view.florMustDeclare as boolean;
  const florDone   = (view.florDeclaredAliases as string[]).includes(myAlias);
  const envidoResp = view.envidoResponderTeam === myTeam;
  const trucoResp  = view.trucoResponderTeam === myTeam;
  const trucoChain = (view.trucoChain ?? []) as { type: string }[];
  const lastTruco  = trucoChain[trucoChain.length - 1]?.type ?? null;
  const envidoChain = (view.envidoChain ?? []) as { type: string }[];
  const lastEnvido  = envidoChain[envidoChain.length - 1]?.type ?? null;

  if (phase === 'show_envido' || phase === 'hand_end' || phase === 'game_over') return null;

  const sections: React.ReactNode[] = [];

  /* ── Flor must-declare ── */
  if (florMust && !florDone && phase === 'playing') {
    sections.push(
      <div key="flor" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700 }}>¡Flor!</span>
        <Btn label="Declarar Flor" variant="warning" onClick={() => onAction({ type: 'flor' })} />
        <Btn label="Con Flor Me Gano" variant="warning" small onClick={() => onAction({ type: 'con-flor-me-gano' })} />
      </div>
    );
  }

  /* ── Envido call (available on round 1, any player can call) ── */
  if (envidoSt === 'available' && phase === 'playing' && !florMust) {
    sections.push(
      <div key="envido-call" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginRight: 2 }}>ENVIDO</span>
        <Btn label="Envido" variant="primary" small onClick={() => onAction({ type: 'envido' })} />
        <Btn label="Real Envido" variant="primary" small onClick={() => onAction({ type: 'real-envido' })} />
        <Btn label="Falta Envido" variant="warning" small onClick={() => onAction({ type: 'falta-envido' })} />
      </div>
    );
  }

  /* ── Envido response (opponent called envido) ── */
  if (envidoSt === 'pending' && envidoResp && phase === 'playing') {
    const canRaise = lastEnvido === 'envido' || lastEnvido === 'real-envido';
    sections.push(
      <div key="envido-resp" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 800, letterSpacing: '0.05em', marginRight: 2 }}>
          ¿QUIEREN EL {(lastEnvido ?? '').toUpperCase()}?
        </span>
        <Btn label="No Quiero" variant="danger" onClick={() => onAction({ type: 'no-quiero' })} />
        {canRaise && lastEnvido === 'envido' && (
          <Btn label="Real Envido" variant="primary" small onClick={() => onAction({ type: 'real-envido' })} />
        )}
        {canRaise && (
          <Btn label="Falta Envido" variant="warning" small onClick={() => onAction({ type: 'falta-envido' })} />
        )}
        <Btn label="Quiero" variant="success" onClick={() => onAction({ type: 'quiero' })} />
      </div>
    );
  }

  /* ── Truco call (truco available, any player can call) ── */
  if (trucoSt === 'available' && phase === 'playing') {
    sections.push(
      <div key="truco-call" style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginRight: 2 }}>TRUCO</span>
        <Btn label="Truco" variant="primary" onClick={() => onAction({ type: 'truco' })} />
      </div>
    );
  }

  /* ── Truco response ── */
  if (trucoSt === 'pending' && trucoResp && phase === 'playing') {
    const canRetruco    = lastTruco === 'truco';
    const canValeCuatro = lastTruco === 'retruco';
    sections.push(
      <div key="truco-resp" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 800, letterSpacing: '0.05em', marginRight: 2 }}>
          ¿QUIEREN EL {(lastTruco ?? '').toUpperCase()}?
        </span>
        <Btn label="No Quiero" variant="danger" onClick={() => onAction({ type: 'no-quiero' })} />
        {canRetruco && (
          <Btn label="Retruco" variant="warning" small onClick={() => onAction({ type: 'retruco' })} />
        )}
        {canValeCuatro && (
          <Btn label="Vale Cuatro" variant="warning" small onClick={() => onAction({ type: 'vale-cuatro' })} />
        )}
        <Btn label="Quiero" variant="success" onClick={() => onAction({ type: 'quiero' })} />
      </div>
    );
  }

  /* ── Ir al mazo (my turn only) ── */
  if (isMyTurn && phase === 'playing') {
    sections.push(
      <div key="mazo" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Btn label="Ir al mazo" variant="ghost" small onClick={() => onAction({ type: 'ir-al-mazo' })} />
      </div>
    );
  }

  if (sections.length === 0) {
    if (!isMyTurn && phase === 'playing') {
      return (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,0,0,0.3)', borderRadius: 12,
          padding: '8px 18px', fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
            animation: 'turnPulse 1.2s ease-in-out infinite',
          }} />
          Turno de {view.currentTurnAlias}...
        </div>
      );
    }
    return null;
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)',
      borderRadius: 16, padding: '12px 18px',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
    }}>
      {sections}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN TRUCO SCREEN
═══════════════════════════════════════════════════════════════════════════ */
export function TrucoScreen({ sendTrucoAction, onSendReaction, onSendChat }: Props) {
  const myAlias  = useMinigameStore(s => s.myAlias);
  const isHost   = useMinigameStore(s => s.isHost);
  const players  = useMinigameStore(s => s.players);
  const roomChat = useMinigameStore(s => s.roomChat);
  const view     = useMinigameStore(s => s.truco);

  const [theme, setTheme]           = useState<TableTheme>('green');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TrucoCard | null>(null);
  const [draggingCard, setDraggingCard] = useState<TrucoCard | null>(null);
  const [dropActive, setDropActive]     = useState(false);
  const [envidoTimer, setEnvidoTimer]   = useState(30);
  const envidoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync theme with room config (valid: syncing server config → local state)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (view?.config?.tableTheme) setTheme(view.config.tableTheme);
  }, [view?.config?.tableTheme]);

  // Countdown for show_envido phase
  useEffect(() => {
    if (view?.phase === 'show_envido') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnvidoTimer(30);
      envidoTimerRef.current = setInterval(() => {
        setEnvidoTimer(t => {
          if (t <= 1) { clearInterval(envidoTimerRef.current!); return 0; }
          return t - 1;
        });
      }, 1000);
    } else {
      if (envidoTimerRef.current) clearInterval(envidoTimerRef.current);
      setEnvidoTimer(30);
    }
    return () => { if (envidoTimerRef.current) clearInterval(envidoTimerRef.current); };
  }, [view?.phase]);

  // Reset selected card on new hand / round
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSelectedCard(null); }, [view?.handNum, view?.round]);

  if (!view) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.5 }}>🃏</div>
          <div style={{ fontWeight: 600 }}>Cargando Truco...</div>
        </div>
      </div>
    );
  }

  const th           = THEMES[theme];
  const myTeam       = view.myTeam as 'A' | 'B';
  const isMyTurn     = view.currentTurnAlias === myAlias;
  const myHand       = (view.myHand ?? []) as TrucoCard[];
  const teamA        = (view.teamAMembers ?? []) as { alias: string }[];
  const teamB        = (view.teamBMembers ?? []) as { alias: string }[];
  const allCount     = view.config.mode === '1v1' ? 2 : view.config.mode === '2v2' ? 4 : 6;
  const seating      = buildSeating(teamA, teamB, myAlias);
  const positions    = getPositions(allCount);
  const currentRound = (view.currentRoundCards ?? {}) as Record<string, TrucoCard | null>;
  const cardCounts   = (view.allPlayerCardCounts ?? {}) as Record<string, number>;
  const alreadyPlayed = !!currentRound[myAlias];
  const canPlay      = isMyTurn && view.phase === 'playing' && !alreadyPlayed;
  const needShowEnvido = view.phase === 'show_envido' &&
    Array.isArray(view.pendingShowEnvido) &&
    (view.pendingShowEnvido as string[]).includes(myAlias);

  const myScore = myTeam === 'A' ? view.teamAScore : view.teamBScore;

  const handleThemeChange = (t: TableTheme) => {
    setTheme(t);
    sendTrucoAction({ type: 'change-theme', theme: t });
  };

  // Click to select, click again (same card) to play
  const handleCardClick = (card: TrucoCard) => {
    if (!canPlay) return;
    if (selectedCard?.suit === card.suit && selectedCard?.value === card.value) {
      sendTrucoAction({ type: 'play-card', card });
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  // Drag to play — drop on the felt
  const handleDrop = () => {
    if (draggingCard && canPlay) {
      sendTrucoAction({ type: 'play-card', card: draggingCard });
      setSelectedCard(null);
    }
    setDraggingCard(null);
    setDropActive(false);
  };

  const opponentSeats = seating.slice(1);

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

      {/* ── Table area ── */}
      <div style={{
        flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden',
        background: th.bg,
      }}>
        {/* Felt oval */}
        <div style={{
          position: 'absolute',
          top: '8%', left: '6%', right: '6%', bottom: '16%',
          borderRadius: '50%',
          background: th.felt,
          boxShadow: `inset 0 0 60px rgba(0,0,0,0.4), 0 0 0 12px ${th.border}, 0 0 0 16px rgba(0,0,0,0.3)`,
        }} />

        {/* Felt texture overlay */}
        <div style={{
          position: 'absolute',
          top: '8%', left: '6%', right: '6%', bottom: '16%',
          borderRadius: '50%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          pointerEvents: 'none',
        }} />

        {/* ── Drop zone (entire felt area — shown while dragging) ── */}
        {draggingCard && canPlay && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDropActive(true); }}
            onDragLeave={(e) => {
              // Only deactivate if leaving the drop zone entirely
              if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
                setDropActive(false);
              }
            }}
            onDrop={(e) => { e.preventDefault(); handleDrop(); }}
            style={{
              position: 'absolute',
              top: '8%', left: '6%', right: '6%', bottom: '16%',
              borderRadius: '50%',
              zIndex: 13,
              border: dropActive
                ? '3px dashed rgba(251,191,36,0.8)'
                : '3px dashed rgba(255,255,255,0.25)',
              background: dropActive
                ? 'rgba(251,191,36,0.08)'
                : 'rgba(255,255,255,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              opacity: dropActive ? 0.9 : 0.45,
              transition: 'opacity 0.15s',
              pointerEvents: 'none',
            }}>
              <span style={{ fontSize: 28 }}>🃏</span>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: dropActive ? '#fbbf24' : 'rgba(255,255,255,0.5)',
              }}>
                {dropActive ? '¡Soltá la carta!' : 'Arrastrá acá para jugar'}
              </span>
            </div>
          </div>
        )}

        {/* ── Played cards on the felt (per-player positions) ── */}
        {seating.map((alias, seatIdx) => {
          const card = currentRound[alias];
          if (!card) return null;
          const pos = positions[seatIdx];
          if (!pos) return null;
          const { x, y } = getPlayedCardPos(pos);
          const isMe = alias === myAlias;
          return (
            <PlayedCardOnFelt
              key={`played-${alias}`}
              card={card}
              x={x}
              y={y}
              rot={pos.rot}
              alias={alias}
              isMe={isMe}
            />
          );
        })}

        {/* ── Score panel (top center) ── */}
        <ScorePanel
          teamAScore={view.teamAScore}
          teamBScore={view.teamBScore}
          myTeam={myTeam}
          maxPoints={view.config.maxPoints}
          themeText={th.text}
        />

        {/* ── Round indicators (top-left) ── */}
        <RoundIndicators
          roundWinners={view.roundWinners ?? []}
          myTeam={myTeam}
          themeText={th.text}
        />

        {/* ── Hand result toast (top-right) ── */}
        {view.handEndResult && (
          <HandResultToast result={view.handEndResult} myTeam={myTeam} />
        )}

        {/* ── Host theme picker button (top-right) ── */}
        {isHost && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 30 }}>
            <button
              onClick={() => setShowPicker(v => !v)}
              style={{
                padding: '6px 12px', borderRadius: 10,
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {THEMES[theme].icon} Tapete
            </button>
            {showPicker && (
              <ThemePicker
                current={theme}
                onChange={handleThemeChange}
                onClose={() => setShowPicker(false)}
              />
            )}
          </div>
        )}

        {/* ── Game info pill (hand / round / dealer) ── */}
        <div style={{
          position: 'absolute', bottom: 14, right: 14, zIndex: 20,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '5px 10px',
          fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
        }}>
          <span>Mano Nº {view.handNum}</span>
          <span>Ronda {view.round}/3</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>Dealer: {view.dealerAlias}</span>
        </div>

        {/* ── Envido result chip ── */}
        {view.envidoStatus !== 'available' && view.envidoResult && (
          <div style={{
            position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(251,191,36,0.2)',
            borderRadius: 10, padding: '4px 14px',
            fontSize: 11, color: '#fbbf24', fontWeight: 700, zIndex: 20,
          }}>
            Envido: {view.envidoResult.winnerTeam === myTeam ? '+' : '-'}{view.envidoResult.pts} pts
            {view.envidoResult.winnerAlias ? ` · ${view.envidoResult.winnerAlias}` : ''}
          </div>
        )}

        {/* ── Opponents around the table ── */}
        {opponentSeats.map((alias, i) => {
          const pos = positions[i + 1];
          if (!pos) return null;
          const isTeamA = teamA.some(p => p.alias === alias);
          const isMine  = (myTeam === 'A') === isTeamA;
          const count   = cardCounts[alias] ?? 0;
          const isCurr  = view.currentTurnAlias === alias;

          return (
            <div key={alias} style={{
              position: 'absolute',
              left: `${pos.x}%`, top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}>
              <PlayerSlot
                alias={alias}
                cardCount={count}
                isMyTeam={isMine}
                isCurrentTurn={isCurr}
                rot={pos.rot}
                themeText={th.text}
              />
            </div>
          );
        })}

        {/* ── Show Envido prompt ── */}
        {needShowEnvido && (
          <ShowEnvidoPrompt
            timeLeft={envidoTimer}
            onShow={() => sendTrucoAction({ type: 'show-envido', show: true })}
            onHide={() => sendTrucoAction({ type: 'show-envido', show: false })}
          />
        )}

        {/* ── Envido shown cards overlay ── */}
        {view.phase === 'show_envido' &&
          view.envidoResult?.reveals &&
          view.envidoResult.reveals.some((r: { cards?: TrucoCard[] }) => r.cards && r.cards.length > 0) && (
          <div style={{
            position: 'absolute', top: 120, left: '50%', transform: 'translateX(-50%)',
            zIndex: 25,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 16, padding: '14px 18px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            {view.envidoResult.reveals.filter((r: { cards?: TrucoCard[] }) => r.cards?.length).map((reveal: { alias: string; value: number; cards?: TrucoCard[] }) => (
              <div key={reveal.alias} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {reveal.alias} muestra · {reveal.value} pts
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(reveal.cards ?? []).map((c: TrucoCard, i: number) => (
                    <PlayingCard key={i} card={c} size="sm" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Game over overlay ── */}
        {view.phase === 'game_over' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: 'rgba(10,10,30,0.9)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 24, padding: '32px 48px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}>
              <div style={{ fontSize: 48 }}>🏆</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.03em' }}>
                {(myTeam === 'A' ? view.teamAScore : view.teamBScore) >= view.config.maxPoints
                  ? '¡Ganamos!'
                  : '¡Perdimos!'}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                Resultado final: {view.teamAScore} - {view.teamBScore}
              </div>
            </div>
          </div>
        )}

        {/* ── My hand + action buttons (bottom strip) ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          padding: '0 20px 14px',
          zIndex: 20,
        }}>
          {/* Action panel */}
          <ActionPanel
            view={view}
            myAlias={myAlias}
            myTeam={myTeam}
            onAction={sendTrucoAction}
          />

          {/* My cards */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            gap: 12, padding: '8px 0 0',
          }}>
            {myHand.length === 0 ? (
              <div style={{
                height: CSIZES.xl.h,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0.25, color: th.text, fontSize: 12,
              }}>
                Sin cartas en mano
              </div>
            ) : myHand.map((card, i) => {
              const isSelected = selectedCard?.suit === card.suit && selectedCard?.value === card.value;
              const isBeeingDragged = draggingCard?.suit === card.suit && draggingCard?.value === card.value;

              return (
                <div
                  key={`${card.suit}-${card.value}-${i}`}
                  style={{
                    transition: 'transform 0.2s',
                    cursor: canPlay ? (draggingCard ? 'grabbing' : 'grab') : 'default',
                  }}
                >
                  <PlayingCard
                    card={card}
                    size="xl"
                    onClick={canPlay ? () => handleCardClick(card) : undefined}
                    selected={isSelected}
                    dimmed={!canPlay && !alreadyPlayed}
                    highlight={canPlay && !selectedCard && !draggingCard}
                    draggable={canPlay}
                    isDragging={isBeeingDragged}
                    onDragStart={(e) => {
                      if (!canPlay) { e.preventDefault(); return; }
                      setDraggingCard(card);
                      setSelectedCard(null);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragEnd={() => {
                      setDraggingCard(null);
                      setDropActive(false);
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Hint text */}
          {canPlay && !alreadyPlayed && (
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600,
              animation: 'fadeIn 1s ease',
            }}>
              {draggingCard
                ? ''
                : selectedCard
                ? 'Clic de nuevo para confirmar · o elegí otra carta'
                : 'Arrastrá una carta al tapete, o hacé clic para seleccionar'}
            </div>
          )}
        </div>

        {/* Animations */}
        <style>{`
          @keyframes turnPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
          @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
          @keyframes slideUp   { from{opacity:0;transform:translate(-50%,20px)} to{opacity:1;transform:translate(-50%,0)} }
          @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
          @keyframes cardLand  { from{opacity:0;transform:translate(-50%,-50%) scale(0.7)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        `}</style>
      </div>

      {/* ── Sidebar ── */}
      <GameSidebar
        myScore={myScore}
        myAlias={myAlias}
        players={players}
        roomChat={roomChat}
        onSendChat={onSendChat}
        onSendReaction={onSendReaction}
        showScores
      />
    </div>
  );
}
