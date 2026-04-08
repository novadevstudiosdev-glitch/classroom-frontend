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
  onSendChat: (text: string) => void;
  onExitGame: () => void;
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
  xl: { w: 112, h: 156, fs: 20, pip: 26, cornerFs: 16 },
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
        background: 'linear-gradient(160deg, #fffefb 0%, #f9f4e8 100%)',
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
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 2,
        borderRadius: size === 'xs' ? 3 : size === 'sm' ? 4 : 6,
        border: '1px solid rgba(65,45,20,0.12)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 6px)',
        pointerEvents: 'none',
      }} />
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

/** Played card position = 62% of the way from player seat toward center of felt */
function getPlayedCardPos(pos: Pos): { x: number; y: number } {
  const cx = 50, cy = 48; // felt center (slightly above geometric center)
  return {
    x: pos.x + (cx - pos.x) * 0.62,
    y: pos.y + (cy - pos.y) * 0.62,
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
  const myIdx = order.findIndex((a) => a.toLowerCase().trim() === myAlias.toLowerCase().trim());
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
   TANTEADOR — traditional Argentine Truco score board
   Squares in groups of 5; filled squares get an X through them
═══════════════════════════════════════════════════════════════════════════ */
const TANTO_SQ   = 11; // px per square
const TANTO_GAP  = 2;  // px between squares in a group
const TANTO_GSEP = 6;  // px between groups

function TanteadorSide({ score, maxPoints, ink }: { score: number; maxPoints: number; ink: string }) {
  const GROUP = 5;
  const numGroups = Math.ceil(maxPoints / GROUP);
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: TANTO_GSEP, alignItems: 'flex-start' }}>
      {Array.from({ length: numGroups }).map((_, g) => (
        <div key={g} style={{ display: 'flex', flexDirection: 'column', gap: TANTO_GAP }}>
          {Array.from({ length: GROUP }).map((_, s) => {
            const idx = g * GROUP + s;
            if (idx >= maxPoints) return null;
            const filled = idx < score;
            return (
              <div key={s} style={{
                width: TANTO_SQ, height: TANTO_SQ,
                border: `1.5px solid ${ink}`,
                borderRadius: 1,
                position: 'relative',
                opacity: filled ? 1 : 0.35,
              }}>
                {filled && (
                  <svg
                    style={{ position: 'absolute', inset: 0 }}
                    width={TANTO_SQ} height={TANTO_SQ}
                    viewBox={`0 0 ${TANTO_SQ} ${TANTO_SQ}`}
                  >
                    <line x1="1" y1="1" x2={TANTO_SQ - 1} y2={TANTO_SQ - 1} stroke={ink} strokeWidth="1.5" />
                    <line x1={TANTO_SQ - 1} y1="1" x2="1" y2={TANTO_SQ - 1} stroke={ink} strokeWidth="1.5" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ScorePanel({
  teamAScore, teamBScore, myTeam, maxPoints,
}: {
  teamAScore: number; teamBScore: number; myTeam: 'A' | 'B'; maxPoints: number;
}) {
  const nosotros = myTeam === 'A' ? teamAScore : teamBScore;
  const ellos    = myTeam === 'A' ? teamBScore : teamAScore;

  return (
    <div style={{
      position: 'absolute', top: 10, left: 10,
      background: 'rgba(238,231,212,0.97)',
      border: '2px solid rgba(90,65,30,0.45)',
      borderRadius: 10, padding: '8px 12px',
      zIndex: 20,
      boxShadow: '0 3px 18px rgba(0,0,0,0.55)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {/* Nosotros */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <span style={{ fontSize: 8, fontWeight: 900, color: '#1a3a1a', letterSpacing: '0.1em' }}>NOSOTROS</span>
        <TanteadorSide score={nosotros} maxPoints={maxPoints} ink="#1a3a1a" />
        <span style={{ fontSize: 17, fontWeight: 900, color: '#1a3a1a', lineHeight: 1 }}>{nosotros}</span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(90,65,30,0.35)' }} />

      {/* Ellos */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <span style={{ fontSize: 8, fontWeight: 900, color: '#3a1a1a', letterSpacing: '0.1em' }}>ELLOS</span>
        <TanteadorSide score={ellos} maxPoints={maxPoints} ink="#3a1a1a" />
        <span style={{ fontSize: 17, fontWeight: 900, color: '#3a1a1a', lineHeight: 1 }}>{ellos}</span>
      </div>
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
  const cardSize: CardSize = 'sm';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  card, x, y, rot, alias, isMe, dimmed = false, roundIdx = 0,
}: {
  card: TrucoCard; x: number; y: number; rot?: number; alias: string;
  isMe: boolean; dimmed?: boolean; roundIdx?: number;
}) {
  const tiltDeg = isMe ? 0 : (rot ?? 0) + 180;
  // Offset each round slightly so cards from different rounds don't overlap perfectly
  const offsetX = (roundIdx - 1) * 6;
  const offsetY = (roundIdx - 1) * 4;
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`, top: `${y}%`,
      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) rotate(${tiltDeg}deg)`,
      zIndex: dimmed ? 10 : 12,
      filter: dimmed
        ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3)) grayscale(0.4)'
        : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
      opacity: dimmed ? 0.65 : 1,
      animation: dimmed ? 'none' : 'cardLand 0.25s cubic-bezier(.34,1.56,.64,1)',
      transition: 'opacity 0.3s',
    }}>
      <PlayingCard card={card} size={dimmed ? 'lg' : 'xl'} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PLAYER CALL BUBBLE — floats above a player's seat when they make a call
═══════════════════════════════════════════════════════════════════════════ */
function PlayerCallBubble({ text, color }: { text: string; color: string }) {
  return (
    <div style={{
      position: 'absolute', bottom: '100%', left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: 6,
      pointerEvents: 'none',
      animation: 'bubblePop 0.3s cubic-bezier(.34,1.56,.64,1)',
      zIndex: 30,
    }}>
      <div style={{
        background: `linear-gradient(135deg, rgba(10,10,20,0.95), rgba(20,20,40,0.95))`,
        border: `1.5px solid ${color}`,
        borderRadius: 10,
        padding: '5px 10px',
        whiteSpace: 'nowrap',
        fontSize: 13,
        fontWeight: 900,
        color,
        letterSpacing: '-0.01em',
        boxShadow: `0 2px 16px ${color}44`,
      }}>
        {text}
      </div>
      {/* Tail */}
      <div style={{
        position: 'absolute', top: '100%', left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `5px solid ${color}`,
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TURN TIMER — counts down when it's someone's turn
═══════════════════════════════════════════════════════════════════════════ */
function TurnTimer({ seconds }: { seconds: number }) {
  const pct = seconds / 30;
  const color = seconds > 10 ? '#10b981' : seconds > 5 ? '#f59e0b' : '#ef4444';
  const r = 14;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{
      position: 'absolute', top: 10, right: 10,
      zIndex: 20,
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      <svg width={34} height={34} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={17} cy={17} r={r} fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
        <circle cx={17} cy={17} r={r} fill="none" stroke={color} strokeWidth={2.5}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
        />
      </svg>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 18 }}>{seconds}s</span>
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
  const isMyTurn          = view.currentTurnAlias === myAlias;
  const phase             = view.phase as string;
  const envidoSt          = view.envidoStatus as string;
  const trucoSt           = view.trucoStatus as string;
  const florSt            = view.florStatus as string;
  const florMust          = view.florMustDeclare as boolean;
  const florDone          = (view.florDeclaredAliases as string[]).includes(myAlias);
  const florResp          = view.florResponderTeam === myTeam; // my team must respond to flor
  const contraFlorEnabled = (view.config?.contraFlorEnabled as boolean) ?? false;
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
        <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>¡Tenés Flor!</span>
        <Btn label="Declarar Flor" variant="success" onClick={() => onAction({ type: 'flor' })} />
      </div>
    );
  }

  /* ── Flor responder (opponent declared flor, my team must respond) ── */
  if (florSt === 'pending' && florResp && !florMust && phase === 'playing') {
    sections.push(
      <div key="flor-resp" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: '#10b981', fontWeight: 800, letterSpacing: '0.05em', marginRight: 2 }}>
          ¿QUIEREN LA FLOR?
        </span>
        <Btn label="Con Gangamos" variant="danger" onClick={() => onAction({ type: 'no-quiero' })} />
        {contraFlorEnabled && (
          <Btn label="Contra Flor" variant="warning" small onClick={() => onAction({ type: 'contraflor' })} />
        )}
        {contraFlorEnabled && (
          <Btn label="Contra Flor al Resto" variant="warning" small onClick={() => onAction({ type: 'contraflor-al-resto' })} />
        )}
        <Btn label="Con Quiero" variant="success" onClick={() => onAction({ type: 'quiero' })} />
      </div>
    );
  }

  /* ── Envido call (available on round 1, any player can call) ── */
  // Envido solo en la primera ronda de la mano, mientras esté disponible
  if (envidoSt === 'available' && phase === 'playing' && view.round === 0 && !florMust && florSt !== 'pending') {
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
    // lastEnvido comes from the engine chain (.type = 'envido'|'realenvido'|'faltaenvido' — no hyphens)
    const canRaiseToReal  = lastEnvido === 'envido';
    const canRaiseToFalta = lastEnvido === 'envido' || lastEnvido === 'realenvido';
    const displayName = lastEnvido === 'realenvido' ? 'REAL ENVIDO'
      : lastEnvido === 'faltaenvido' ? 'FALTA ENVIDO'
      : (lastEnvido ?? '').toUpperCase();
    sections.push(
      <div key="envido-resp" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 800, letterSpacing: '0.05em', marginRight: 2 }}>
          ¿QUIEREN EL {displayName}?
        </span>
        <Btn label="No Quiero" variant="danger" onClick={() => onAction({ type: 'no-quiero' })} />
        {canRaiseToReal && (
          <Btn label="Real Envido" variant="primary" small onClick={() => onAction({ type: 'real-envido' })} />
        )}
        {canRaiseToFalta && (
          <Btn label="Falta Envido" variant="warning" small onClick={() => onAction({ type: 'falta-envido' })} />
        )}
        <Btn label="Quiero" variant="success" onClick={() => onAction({ type: 'quiero' })} />
      </div>
    );
  }

  /* ── Truco call (truco available, any player can call) ── */
  if (trucoSt === 'available' && phase === 'playing' && florSt !== 'pending') {
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
   CALL NOTIFICATION — floating banner when envido/truco is called at you
═══════════════════════════════════════════════════════════════════════════ */
function CallNotification({
  call, sub, color, onDismiss,
}: {
  call: string; sub: string; color: string; onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'absolute', top: '28%', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 40,
      animation: 'callBounce 0.4s cubic-bezier(.34,1.56,.64,1)',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: `linear-gradient(135deg, rgba(0,0,0,0.92), rgba(20,20,20,0.95))`,
        border: `2px solid ${color}`,
        borderRadius: 16,
        padding: '14px 24px',
        textAlign: 'center',
        boxShadow: `0 0 40px ${color}44, 0 8px 32px rgba(0,0,0,0.6)`,
        minWidth: 180,
      }}>
        <div style={{
          fontSize: 22, fontWeight: 900, color,
          letterSpacing: '-0.02em', lineHeight: 1,
          textShadow: `0 0 20px ${color}88`,
        }}>
          {call}
        </div>
        <div style={{
          fontSize: 12, color: 'rgba(255,255,255,0.6)',
          fontWeight: 600, marginTop: 5,
        }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN TRUCO SCREEN
═══════════════════════════════════════════════════════════════════════════ */
export function TrucoScreen({ sendTrucoAction, onSendChat, onExitGame }: Props) {
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

  // Track all played cards for the current hand (across rounds)
  const [historicCards, setHistoricCards] = useState<
    Array<{ alias: string; card: TrucoCard; round: number }>
  >([]);
  const seenPlayedRef = useRef<Set<string>>(new Set());
  const lastHandRef   = useRef(-1);

  // Turn timer (30 seconds per turn)
  const [turnTimer, setTurnTimer]   = useState(30);
  const turnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTurnRef  = useRef('');

  // Player call bubbles: alias → { text, color, id }
  const [callBubbles, setCallBubbles] = useState<Record<string, { text: string; color: string; id: number }>>({});
  const [callHistory, setCallHistory] = useState<string[]>([]);
  const prevEnvidoChainLenRef = useRef(0);
  const prevTrucoChainLenRef  = useRef(0);
  const prevEnvidoResultRef   = useRef<string | null>(null);
  const prevTrucoAcceptedRef  = useRef(false);
  const prevBubbleEnvidoStatusRef = useRef('');
  const prevBubbleTrucoStatusRef = useRef('');
  const prevHistEnvidoLenRef = useRef(0);
  const prevHistTrucoLenRef = useRef(0);
  const prevHistEnvidoStatusRef = useRef('');
  const prevHistTrucoStatusRef = useRef('');

  // Call notifications (envido / truco / flor called at us)
  const [callNotif, setCallNotif] = useState<{ call: string; sub: string; color: string } | null>(null);
  const prevEnvidoStRef = useRef('');
  const prevTrucoStRef  = useRef('');
  const prevFlorStRef   = useRef('');

  // Sync theme with room config (valid: syncing server config → local state)
  useEffect(() => {
    if (view?.config?.tableTheme) setTheme(view.config.tableTheme);
  }, [view?.config?.tableTheme]);

  // Countdown for show_envido phase
  useEffect(() => {
    if (view?.phase === 'show_envido') {
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
  useEffect(() => { setSelectedCard(null); }, [view?.handNum, view?.round]);

  // Accumulate played cards so they stay on the table across rounds
  useEffect(() => {
    if (!view) return;
    const currentCards = view.currentRoundCards as Record<string, TrucoCard | null>;

    if (view.handNum !== lastHandRef.current) {
      lastHandRef.current = view.handNum;
      seenPlayedRef.current = new Set();
      setHistoricCards([]);
      setCallHistory([]);
      return;
    }

    const newEntries: Array<{ alias: string; card: TrucoCard; round: number }> = [];
    for (const [alias, card] of Object.entries(currentCards)) {
      if (!card) continue;
      const key = `${view.handNum}-${view.round}-${alias}`;
      if (!seenPlayedRef.current.has(key)) {
        seenPlayedRef.current.add(key);
        newEntries.push({ alias, card, round: view.round as number });
      }
    }
    if (newEntries.length > 0) {
      setHistoricCards(prev => [...prev, ...newEntries]);
    }
  }, [view]);

  // Show call notification when envido, truco, or flor is called at our team
  useEffect(() => {
    if (!view) return;
    const myTm       = view.myTeam as string;
    const envidoSt   = view.envidoStatus as string;
    const trucoSt    = view.trucoStatus as string;
    const florSt     = view.florStatus as string;
    const envidoResp = view.envidoResponderTeam === myTm;
    const trucoResp  = view.trucoResponderTeam  === myTm;
    const florResp   = view.florResponderTeam   === myTm;
    const envidoCh   = (view.envidoChain ?? []) as { type: string; alias: string }[];
    const trucoCh    = (view.trucoChain  ?? []) as { type: string; alias: string }[];
    const lastEnvido = envidoCh[envidoCh.length - 1];
    const lastTruco  = trucoCh[trucoCh.length - 1];

    if (envidoSt === 'pending' && prevEnvidoStRef.current !== 'pending' && envidoResp && lastEnvido) {
      setCallNotif({
        call: `¡${lastEnvido.type.toUpperCase()}!`,
        sub: `${lastEnvido.alias} te cantó — ¿lo querés?`,
        color: '#fbbf24',
      });
    }
    if (trucoSt === 'pending' && prevTrucoStRef.current !== 'pending' && trucoResp && lastTruco) {
      setCallNotif({
        call: `¡${lastTruco.type.toUpperCase()}!`,
        sub: `${lastTruco.alias} te cantó — ¿lo querés?`,
        color: '#ef4444',
      });
    }
    if (florSt === 'pending' && prevFlorStRef.current !== 'pending' && florResp) {
      setCallNotif({
        call: '¡FLOR!',
        sub: 'El rival cantó flor — ¿qué respondés?',
        color: '#10b981',
      });
    }

    prevEnvidoStRef.current = envidoSt;
    prevTrucoStRef.current  = trucoSt;
    prevFlorStRef.current   = florSt;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view?.envidoStatus, view?.trucoStatus, view?.florStatus, view?.envidoResponderTeam, view?.trucoResponderTeam, view?.florResponderTeam, view?.envidoChain, view?.trucoChain]);

  // Turn timer — resets to 30s each time the current player changes
  useEffect(() => {
    if (!view || view.phase !== 'playing') return;
    const currentTurn = view.currentTurnAlias as string;
    if (currentTurn === lastTurnRef.current) return;
    lastTurnRef.current = currentTurn;
    setTurnTimer(30);
    if (turnTimerRef.current) clearInterval(turnTimerRef.current);
    turnTimerRef.current = setInterval(() => {
      setTurnTimer(t => {
        if (t <= 1) { clearInterval(turnTimerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (turnTimerRef.current) clearInterval(turnTimerRef.current); };
  }, [view?.currentTurnAlias, view?.phase, view]);

  // Call bubbles — show speech bubble near player when they make a call
  useEffect(() => {
    if (!view) return;
    const envidoCh  = (view.envidoChain ?? []) as { type: string; alias: string }[];
    const trucoCh   = (view.trucoChain  ?? []) as { type: string; alias: string }[];
    const envidoRes = view.envidoResult as { winnerTeam?: string; pts?: number } | null;
    const trucoAcc  = view.trucoAccepted as boolean;
    const envidoSt  = view.envidoStatus as string;
    const trucoSt   = view.trucoStatus as string;
    let changed = false;

    // New envido call
    if (envidoCh.length > prevEnvidoChainLenRef.current) {
      const last = envidoCh[envidoCh.length - 1];
      const label = last.type === 'realenvido' ? 'Real Envido' : last.type === 'faltaenvido' ? 'Falta Envido' : last.type.charAt(0).toUpperCase() + last.type.slice(1);
      setCallBubbles(prev => ({ ...prev, [last.alias]: { text: `¡${label}!`, color: '#fbbf24', id: Date.now() } }));
      changed = true;
    }
    prevEnvidoChainLenRef.current = envidoCh.length;

    // Envido accepted/refused (status resolved)
    const envidoResKey = envidoRes ? JSON.stringify(envidoRes) : null;
    if (envidoSt === 'resolved' && envidoResKey !== prevEnvidoResultRef.current && envidoResKey) {
      if (envidoRes?.winnerTeam && (view as { envidoResult?: { winnerAlias?: string; pts?: number } }).envidoResult) {
        const result = (view as { envidoResult?: { winnerAlias?: string; pts?: number } }).envidoResult!;
        const winnerAlias = result.winnerAlias;
        if (winnerAlias) {
          setCallBubbles(prev => ({
            ...prev,
            [winnerAlias]: { text: `${result.pts ?? 0} de envido`, color: '#10b981', id: Date.now() },
          }));
        }
      }
      changed = true;
    }
    prevEnvidoResultRef.current = envidoResKey;

    // New truco call
    if (trucoCh.length > prevTrucoChainLenRef.current) {
      const last = trucoCh[trucoCh.length - 1];
      const label = last.type === 'valecuatro' ? 'Vale Cuatro' : last.type === 'retruco' ? 'Retruco' : 'Truco';
      setCallBubbles(prev => ({ ...prev, [last.alias]: { text: `¡${label}!`, color: '#ef4444', id: Date.now() } }));
      changed = true;
    }
    prevTrucoChainLenRef.current = trucoCh.length;

    // Truco accepted
    if (trucoSt !== 'pending' && trucoAcc && !prevTrucoAcceptedRef.current) {
      const lastCall = trucoCh[trucoCh.length - 1];
      if (lastCall) {
        setCallBubbles(prev => ({ ...prev, [lastCall.alias]: { text: '¡Quiero!', color: '#10b981', id: Date.now() } }));
        changed = true;
      }
    }
    if (
      prevBubbleTrucoStatusRef.current === 'pending' &&
      trucoSt === 'resolved' &&
      !trucoAcc
    ) {
      const lastCall = trucoCh[trucoCh.length - 1];
      if (lastCall) {
        setCallBubbles(prev => ({ ...prev, [lastCall.alias]: { text: 'No Quiero', color: '#fca5a5', id: Date.now() } }));
        changed = true;
      }
    }
    prevTrucoAcceptedRef.current = trucoAcc;
    prevBubbleEnvidoStatusRef.current = envidoSt;
    prevBubbleTrucoStatusRef.current = trucoSt;

    // Clear bubbles after 2.5s
    if (changed) {
      const t = setTimeout(() => setCallBubbles({}), 2500);
      return () => clearTimeout(t);
    }
  }, [view]);

  // Persistent call history (who called, who answered, points)
  useEffect(() => {
    if (!view) return;
    const envidoCh  = (view.envidoChain ?? []) as { type: string; alias: string }[];
    const trucoCh   = (view.trucoChain  ?? []) as { type: string; alias: string }[];
    const envidoSt  = view.envidoStatus as string;
    const trucoSt   = view.trucoStatus as string;
    const envidoRes = view.envidoResult as { winnerAlias?: string; pts?: number } | null;
    const lastEnvido = envidoCh[envidoCh.length - 1];
    const lastTruco = trucoCh[trucoCh.length - 1];

    const append = (line: string) => {
      setCallHistory((prev) => {
        if (prev[prev.length - 1] === line) return prev;
        return [...prev.slice(-19), line];
      });
    };

    if (envidoCh.length > prevHistEnvidoLenRef.current && lastEnvido) {
      const n = lastEnvido.type === 'realenvido' ? 'Real Envido' : lastEnvido.type === 'faltaenvido' ? 'Falta Envido' : 'Envido';
      append(`${lastEnvido.alias}: ${n}`);
    }
    if (trucoCh.length > prevHistTrucoLenRef.current && lastTruco) {
      const n = lastTruco.type === 'retruco' ? 'Retruco' : lastTruco.type === 'valecuatro' ? 'Vale Cuatro' : 'Truco';
      append(`${lastTruco.alias}: ${n}`);
    }
    if (prevHistEnvidoStatusRef.current === 'pending' && envidoSt === 'resolved') {
      if (envidoRes) {
        append(`Envido cerrado: ${envidoRes.winnerAlias ?? 'equipo'} (${envidoRes.pts ?? 0})`);
      } else {
        append('Envido cerrado');
      }
    }
    if (prevHistTrucoStatusRef.current === 'pending' && trucoSt === 'resolved') {
      append(`Truco: ${view.trucoAccepted ? 'Quiero' : 'No Quiero'}`);
    }
    prevHistEnvidoLenRef.current = envidoCh.length;
    prevHistTrucoLenRef.current = trucoCh.length;
    prevHistEnvidoStatusRef.current = envidoSt;
    prevHistTrucoStatusRef.current = trucoSt;
  }, [view]);

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
  const envidoChain = (view.envidoChain ?? []) as Array<{ alias: string; type: string }>;
  const trucoChain = (view.trucoChain ?? []) as Array<{ alias: string; type: string }>;

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
        {/* ── Exit button ── */}
        <button
          onClick={onExitGame}
          style={{
            position: 'absolute', top: 10, right: 10, zIndex: 30,
            padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
            background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          Salir
        </button>

        {/* Felt oval */}
        <div style={{
          position: 'absolute',
          top: '6%', left: '4%', right: '4%', bottom: '12%',
          borderRadius: '50%',
          background: th.felt,
          boxShadow: `inset 0 0 72px rgba(0,0,0,0.48), 0 0 0 10px ${th.border}, 0 0 0 16px rgba(0,0,0,0.28)`,
        }} />

        {/* Felt texture overlay */}
        <div style={{
          position: 'absolute',
          top: '6%', left: '4%', right: '4%', bottom: '12%',
          borderRadius: '50%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '44%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 180,
          height: 180,
          borderRadius: '50%',
          border: '1px dashed rgba(255,255,255,0.15)',
          pointerEvents: 'none',
          zIndex: 1,
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
              top: '6%', left: '4%', right: '4%', bottom: '12%',
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

        {/* ── Played cards on the felt: all rounds of this hand ── */}
        {historicCards.map(({ alias, card, round }) => {
          const seatIdx = seating.indexOf(alias);
          const pos     = positions[seatIdx];
          if (!pos) return null;
          const { x, y } = getPlayedCardPos(pos);
          const currentRoundNum = view.round as number;
          const isCurrent = round === currentRoundNum && !!currentRound[alias];
          return (
            <PlayedCardOnFelt
              key={`hist-${alias}-${round}-${card.suit}-${card.value}`}
              card={card}
              x={x} y={y}
              rot={pos.rot}
              alias={alias}
              isMe={alias === myAlias}
              dimmed={!isCurrent}
              roundIdx={round}
            />
          );
        })}
        {/* Current round cards (shown immediately before historicCards effect fires) */}
        {seating.map((alias, seatIdx) => {
          const card = currentRound[alias];
          if (!card) return null;
          const alreadyInHistory = historicCards.some(
            h => h.alias === alias && h.round === (view.round as number)
          );
          if (alreadyInHistory) return null; // avoid duplicate
          const pos = positions[seatIdx];
          if (!pos) return null;
          const { x, y } = getPlayedCardPos(pos);
          return (
            <PlayedCardOnFelt
              key={`curr-${alias}`}
              card={card}
              x={x} y={y}
              rot={pos.rot}
              alias={alias}
              isMe={alias === myAlias}
              dimmed={false}
              roundIdx={view.round as number}
            />
          );
        })}

        {/* ── Score panel (top center) ── */}
        <ScorePanel
          teamAScore={view.teamAScore}
          teamBScore={view.teamBScore}
          myTeam={myTeam}
          maxPoints={view.config.maxPoints}
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
          <span>Ronda {(view.round ?? 0) + 1}/3</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>Dealer: {view.dealerAlias}</span>
        </div>

        {/* ── Turn timer ── */}
        {view.phase === 'playing' && (
          <div style={{ position: 'absolute', top: isHost ? 52 : 10, right: 10, zIndex: 20 }}>
            <TurnTimer seconds={turnTimer} />
          </div>
        )}

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

          const bubble = callBubbles[alias];
          return (
            <div key={alias} style={{
              position: 'absolute',
              left: `${pos.x}%`, top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}>
              <div style={{ position: 'relative' }}>
                {bubble && <PlayerCallBubble key={bubble.id} text={bubble.text} color={bubble.color} />}
                <PlayerSlot
                  alias={alias}
                  cardCount={count}
                  isMyTeam={isMine}
                  isCurrentTurn={isCurr}
                  rot={pos.rot}
                  themeText={th.text}
                />
              </div>
            </div>
          );
        })}

        {/* ── Call notification overlay ── */}
        {callNotif && (
          <CallNotification
            call={callNotif.call}
            sub={callNotif.sub}
            color={callNotif.color}
            onDismiss={() => setCallNotif(null)}
          />
        )}

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
          padding: '0 20px 12px',
          zIndex: 20,
        }}>
          {/* My cards */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            gap: 14, padding: '8px 0 0',
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

          {/* Action panel — BELOW the cards */}
          <ActionPanel
            view={view}
            myAlias={myAlias}
            myTeam={myTeam}
            onAction={sendTrucoAction}
          />
        </div>

        {/* Animations */}
        <style>{`
          @keyframes turnPulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
          @keyframes slideIn    { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
          @keyframes slideUp    { from{opacity:0;transform:translate(-50%,20px)} to{opacity:1;transform:translate(-50%,0)} }
          @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
          @keyframes cardLand   { from{opacity:0;transform:translate(-50%,-50%) scale(0.7)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
          @keyframes callBounce { 0%{opacity:0;transform:translateX(-50%) scale(0.7)} 60%{transform:translateX(-50%) scale(1.06)} 100%{opacity:1;transform:translateX(-50%) scale(1)} }
          @keyframes bubblePop  { 0%{opacity:0;transform:translateX(-50%) scale(0.6)} 70%{transform:translateX(-50%) scale(1.08)} 100%{opacity:1;transform:translateX(-50%) scale(1)} }
        `}</style>
      </div>

      {/* ── Sidebar (no reactions in Truco — they distract from the game) ── */}
      <GameSidebar
        myScore={myScore}
        myAlias={myAlias}
        players={players}
        roomChat={roomChat}
        onSendChat={onSendChat}
        showScores
      />
    </div>
  );
}
