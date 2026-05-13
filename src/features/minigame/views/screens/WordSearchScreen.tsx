'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMinigameStore } from '../../store/minigame.store';
import { ChatPanel } from '../../components/ChatPanel';
import { CircularTimer } from '../../components/CircularTimer';
import type { WordCell } from '../../types/game.types';

const FOUND_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];
const AVATAR_PALETTE = ['#6366f1', '#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#ef4444', '#14b8a6'];

interface Props {
  onFindWord:        (word: string, cells: WordCell[]) => void;
  onSubmitComplete:  (score: number) => void;
  onSendChat:        (text: string)  => void;
}

export function WordSearchScreen({ onFindWord, onSubmitComplete, onSendChat }: Props) {
  const myAlias    = useMinigameStore((s) => s.myAlias);
  const players    = useMinigameStore((s) => s.players);
  const roomChat   = useMinigameStore((s) => s.roomChat);
  const wordSearch = useMinigameStore((s) => s.wordSearch);
  const { grid, words, placed, foundWords, timeLimitMs, myScore, gridSize } = wordSearch;

  const [selecting, setSelecting]   = useState<WordCell[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastFound, setLastFound]   = useState<string | null>(null);
  const submittedRef                = useRef(false);
  const gridContainerRef            = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize]     = useState(36);

  // Compute cell size from container
  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el || gridSize < 1) return;
    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      const byW = Math.floor((width  - 8) / gridSize);
      const byH = Math.floor((height - 8) / gridSize);
      setCellSize(Math.max(16, Math.min(52, Math.min(byW, byH))));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [gridSize]);

  const startCellRef = useRef<WordCell | null>(null);

  const cellKey    = (cell: WordCell) => `${cell.r}-${cell.c}`;
  const isSelected = (r: number, c: number) => selecting.some((s) => s.r === r && s.c === c);

  const getFoundColor = (r: number, c: number): string | null => {
    for (const [, info] of Object.entries(foundWords)) {
      if (info.cells.some((s) => s.r === r && s.c === c))
        return FOUND_COLORS[info.colorIndex % FOUND_COLORS.length];
    }
    return null;
  };

  /** Compute a clean straight line (H, V, or 45° diagonal) from start to end */
  const getLineCells = (start: WordCell, end: WordCell): WordCell[] => {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    if (dr === 0 && dc === 0) return [start];

    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    let stepR: number, stepC: number, steps: number;

    if (absDr === 0) {
      // Pure horizontal
      stepR = 0; stepC = dc > 0 ? 1 : -1; steps = absDc;
    } else if (absDc === 0) {
      // Pure vertical
      stepR = dr > 0 ? 1 : -1; stepC = 0; steps = absDr;
    } else if (absDr === absDc) {
      // Perfect 45° diagonal
      stepR = dr > 0 ? 1 : -1; stepC = dc > 0 ? 1 : -1; steps = absDr;
    } else {
      // Snap to dominant axis
      if (absDr >= absDc) {
        stepR = dr > 0 ? 1 : -1; stepC = 0; steps = absDr;
      } else {
        stepR = 0; stepC = dc > 0 ? 1 : -1; steps = absDc;
      }
    }

    const cells: WordCell[] = [];
    for (let i = 0; i <= steps; i++) {
      cells.push({ r: start.r + i * stepR, c: start.c + i * stepC });
    }
    return cells;
  };

  const handleMouseDown = (r: number, c: number) => {
    startCellRef.current = { r, c };
    setIsDragging(true);
    setSelecting([{ r, c }]);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!isDragging || !startCellRef.current) return;
    setSelecting(getLineCells(startCellRef.current, { r, c }));
  };

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (selecting.length < 2) { setSelecting([]); return; }
    const selKey = selecting.map(cellKey).join(',');
    for (const { word, cells } of placed) {
      if (foundWords[word]) continue;
      const fwd = cells.map(cellKey).join(',');
      const rev = [...cells].reverse().map(cellKey).join(',');
      if (selKey === fwd || selKey === rev) {
        onFindWord(word, cells);
        setLastFound(word);
        setTimeout(() => setLastFound(null), 1800);
        setSelecting([]);
        return;
      }
    }
    setSelecting([]);
  }, [isDragging, selecting, placed, foundWords, onFindWord]);

  const allFound    = words.every((w) => foundWords[w]);
  const foundCount  = Object.keys(foundWords).length;

  const handleTimeExpire = () => { if (!submittedRef.current) { submittedRef.current = true; onSubmitComplete(myScore); } };
  const handleFinish     = () => { if (!submittedRef.current) { submittedRef.current = true; onSubmitComplete(myScore); } };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Topbar ── */}
      <div style={{
        flexShrink: 0, height: 48, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12, padding: '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(2,4,9,0.5)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>🔤 Sopa de letras</span>
          <div style={{
            padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700,
            background: allFound ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${allFound ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
            color: allFound ? '#6ee7b7' : 'rgba(255,255,255,0.4)',
          }}>
            {foundCount} / {words.length} palabras
          </div>
          {lastFound && (
            <div style={{
              padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800,
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)',
              color: '#6ee7b7', animation: 'wsFoundPop .4s cubic-bezier(.22,.68,0,1.2)',
            }}>
              ✓ {lastFound}
            </div>
          )}
        </div>
        {allFound && (
          <button onClick={handleFinish} style={{
            padding: '6px 20px', borderRadius: 9, cursor: 'pointer',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            border: '1px solid rgba(16,185,129,0.4)',
            color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
          }}>¡Terminé! →</button>
        )}
      </div>

      {/* ── Body: 3 columns ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT: Chat ── */}
        <div style={{
          width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.045)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <div style={{ padding: '10px 14px 6px', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)' }}>
              Chat
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: '0 14px 12px', overflow: 'hidden' }}>
            <ChatPanel messages={roomChat} onSend={onSendChat} placeholder="Mensaje..." grow />
          </div>
        </div>

        {/* ── CENTER: Grid + word list ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', gap: 12, overflow: 'hidden' }}>

          <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

            {/* Grid container */}
            <div
              ref={gridContainerRef}
              style={{ flex: '0 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minWidth: 0 }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                  gap: 2,
                  userSelect: 'none', touchAction: 'none',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
                  borderRadius: 10,
                  padding: 4,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseLeave={() => { if (isDragging) handleMouseUp(); }}
              >
                {grid.map((row, r) =>
                  row.map((letter, c) => {
                    const foundColor = getFoundColor(r, c);
                    const sel = isSelected(r, c);
                    return (
                      <div
                        key={`${r}-${c}`}
                        onMouseDown={() => handleMouseDown(r, c)}
                        onMouseEnter={() => handleMouseEnter(r, c)}
                        onMouseUp={handleMouseUp}
                        style={{
                          width: cellSize, height: cellSize,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: Math.max(9, cellSize * 0.42), fontWeight: 900,
                          color: foundColor
                            ? '#fff'
                            : sel ? '#fff' : 'rgba(255,255,255,0.65)',
                          background: foundColor
                            ? foundColor + '55'
                            : sel ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${
                            foundColor ? foundColor + '40'
                            : sel ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.05)'
                          }`,
                          borderRadius: Math.max(3, cellSize * 0.15),
                          cursor: 'pointer',
                          transition: 'background .06s, border .06s',
                          boxShadow: sel ? '0 0 6px rgba(99,102,241,0.4)' : 'none',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {letter}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Word list — beside the grid */}
            <div style={{ flexShrink: 0, width: 160, display: 'flex', flexDirection: 'column', gap: 5, maxHeight: '100%', overflowY: 'auto' }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)', marginBottom: 4, flexShrink: 0 }}>
                Palabras
              </div>
              {words.map((w) => {
                const found = foundWords[w];
                const color = found ? FOUND_COLORS[found.colorIndex % FOUND_COLORS.length] : null;
                return (
                  <div key={w} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 8,
                    background: found ? `${color}12` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${found ? `${color}30` : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all .3s',
                  }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                      background: found ? color! : 'rgba(255,255,255,0.15)',
                      boxShadow: found ? `0 0 6px ${color}` : 'none',
                      transition: 'all .3s',
                    }} />
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      color: found ? color! : 'rgba(255,255,255,0.6)',
                      textDecoration: found ? 'line-through' : 'none',
                      textDecorationColor: color ?? 'transparent',
                      letterSpacing: '0.04em',
                    }}>
                      {w}
                    </span>
                    {found && (
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto', flexShrink: 0 }}>
                        {found.alias}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Timer + Scores ── */}
        <div style={{
          width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          borderLeft: '1px solid rgba(255,255,255,0.045)',
          background: 'rgba(0,0,0,0.25)',
        }}>
          {/* Timer */}
          <div style={{
            flexShrink: 0, padding: '16px 16px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.045)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>
              Tiempo
            </div>
            <CircularTimer
              key={timeLimitMs}
              durationMs={timeLimitMs}
              onExpire={handleTimeExpire}
              size={80}
              strokeWidth={5}
            />
          </div>

          {/* My score */}
          <div style={{
            flexShrink: 0, padding: '12px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.045)',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(99,102,241,0.06))',
              border: '1px solid rgba(99,102,241,0.22)',
              borderRadius: 12, padding: '10px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(99,102,241,0.6)', marginBottom: 2 }}>
                  Mi puntaje
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {myScore.toLocaleString()}
                </div>
              </div>
              <span style={{ fontSize: 22, opacity: 0.5 }}>🏆</span>
            </div>
          </div>

          {/* Players scoreboard */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)', marginBottom: 8 }}>
              Jugadores · {players.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[...players]
                .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                .map((p, i) => {
                  const isMe = p.alias === myAlias;
                  const color = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
                  return (
                    <div key={`${p.alias}-${i}`} style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '5px 8px', borderRadius: 8,
                      background: isMe ? 'rgba(99,102,241,0.1)' : 'transparent',
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                        background: color + '28', border: `1px solid ${color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 900, color,
                      }}>
                        {p.alias[0]?.toUpperCase()}
                      </div>
                      <div style={{
                        flex: 1, fontSize: 11, fontWeight: isMe ? 700 : 600,
                        color: isMe ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {p.alias}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                        {(p.score ?? 0).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wsFoundPop {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
