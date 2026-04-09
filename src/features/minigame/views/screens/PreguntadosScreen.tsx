'use client';
import { useEffect, useRef } from 'react';
import { useMinigameStore } from '../../store/minigame.store';
import { CircularTimer } from '../../components/CircularTimer';
import { GameSidebar } from '../../components/GameSidebar';

interface Props {
  onSpinWheel: () => void;
  onSubmitPQAnswer: (optionId: string) => void;
  onSendChat: (text: string) => void;
  onExitGame?: () => void;
}

const WHEEL_SIZE = 260;
const OPT_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981'];

export function PreguntadosScreen({ onSpinWheel, onSubmitPQAnswer, onSendChat, onExitGame }: Props) {
  const myAlias  = useMinigameStore((s) => s.myAlias);
  const players  = useMinigameStore((s) => s.players);
  const roomChat = useMinigameStore((s) => s.roomChat);
  const pq = useMinigameStore((s) => s.preguntados);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinRef = useRef<{ angle: number; velocity: number; spinning: boolean }>({ angle: 0, velocity: 0, spinning: false });
  const rafRef = useRef<number>(0);

  const { categories, isMyTurn, currentTurnAlias, panel, currentQuestion, categoryInfo, scoreboard, awaitingResult, currentRound, totalRounds } = pq;

  const myScore = scoreboard.find((e) => e.alias === myAlias)?.score ?? 0;

  // Draw wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || categories.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = WHEEL_SIZE / 2;
    const r = cx - 10;
    const sliceAngle = (2 * Math.PI) / categories.length;

    const draw = (angle: number) => {
      ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);
      categories.forEach((cat, i) => {
        const start = angle + i * sliceAngle;
        const end = start + sliceAngle;
        const mid = start + sliceAngle / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cx);
        ctx.arc(cx, cx, r, start, end);
        ctx.closePath();
        ctx.fillStyle = cat.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.save();
        ctx.translate(cx + Math.cos(mid) * r * 0.65, cx + Math.sin(mid) * r * 0.65);
        ctx.font = `${r * 0.18}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cat.icon, 0, 0);
        ctx.restore();
      });
      // Center
      ctx.beginPath();
      ctx.arc(cx, cx, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Pointer
      ctx.beginPath();
      ctx.moveTo(cx - 10, 0);
      ctx.lineTo(cx + 10, 0);
      ctx.lineTo(cx, 22);
      ctx.closePath();
      ctx.fillStyle = '#fff';
      ctx.fill();
    };

    draw(spinRef.current.angle);
  }, [categories]);

  const startSpin = () => {
    if (!isMyTurn || spinRef.current.spinning) return;
    spinRef.current.velocity = 0.25 + Math.random() * 0.2;
    spinRef.current.spinning = true;
    onSpinWheel();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const cx = WHEEL_SIZE / 2;
    const r = cx - 10;
    const sliceAngle = (2 * Math.PI) / categories.length;

    const tick = () => {
      spinRef.current.velocity *= 0.985;
      spinRef.current.angle += spinRef.current.velocity;

      ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);
      categories.forEach((cat, i) => {
        const start = spinRef.current.angle + i * sliceAngle;
        const end = start + sliceAngle;
        const mid = start + sliceAngle / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cx);
        ctx.arc(cx, cx, r, start, end);
        ctx.closePath();
        ctx.fillStyle = cat.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.save();
        ctx.translate(cx + Math.cos(mid) * r * 0.65, cx + Math.sin(mid) * r * 0.65);
        ctx.font = `${r * 0.18}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cat.icon, 0, 0);
        ctx.restore();
      });
      ctx.beginPath();
      ctx.arc(cx, cx, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - 10, 0);
      ctx.lineTo(cx + 10, 0);
      ctx.lineTo(cx, 22);
      ctx.closePath();
      ctx.fillStyle = '#fff';
      ctx.fill();

      if (spinRef.current.velocity > 0.003) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        spinRef.current.spinning = false;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Topbar ── */}
      <div style={{
        flexShrink: 0, height: 52, display: 'flex', alignItems: 'center',
        gap: 12, padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(2,4,9,0.4)', backdropFilter: 'blur(12px)',
      }}>
        <span style={{ fontSize: 18 }}>🎡</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>Preguntados</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>
          Ronda {currentRound} / {totalRounds}
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{
            padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: isMyTurn ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isMyTurn ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: isMyTurn ? '#818cf8' : 'rgba(255,255,255,0.35)',
          }}>
            {isMyTurn ? '🎯 Tu turno' : `⏳ ${currentTurnAlias}`}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

        {/* ── Left: game area ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '20px 32px', overflowY: 'auto' }}>

          {/* Category indicator */}
          {categoryInfo && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: `${categoryInfo.color}18`,
              border: `1px solid ${categoryInfo.color}40`,
              borderRadius: 12, padding: '10px 20px',
            }}>
              <span style={{ fontSize: 22 }}>{categoryInfo.icon}</span>
              <span style={{ fontWeight: 800, color: '#e2e8f0', fontSize: 15 }}>{categoryInfo.name}</span>
            </div>
          )}

          {/* ── Wheel panel ── */}
          {panel === 'wheel' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <canvas
                  ref={canvasRef}
                  width={WHEEL_SIZE}
                  height={WHEEL_SIZE}
                  style={{
                    borderRadius: '50%', display: 'block',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 3px rgba(255,255,255,0.06)',
                  }}
                />
              </div>

              {isMyTurn && !awaitingResult && !categoryInfo && (
                <button
                  onClick={startSpin}
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                    border: 'none', borderRadius: 14,
                    padding: '12px 40px', color: '#fff',
                    fontWeight: 800, fontSize: 15, cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                  }}
                >
                  🎡 Girar ruleta
                </button>
              )}
              {!isMyTurn && !awaitingResult && (
                <div style={{
                  fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 600,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: '10px 20px',
                }}>
                  Esperando a <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{currentTurnAlias}</strong>...
                </div>
              )}
            </div>
          )}

          {/* ── Question panel ── */}
          {panel === 'question' && currentQuestion && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 520 }}>
              {categoryInfo && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: `${categoryInfo.color}18`, borderRadius: 10, padding: '8px 14px',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{categoryInfo.icon}</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{categoryInfo.name}</span>
                  </div>
                  <CircularTimer key={`pq-${currentQuestion.text}`} durationMs={30000} size={40} strokeWidth={3} />
                </div>
              )}

              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '18px 20px',
                fontSize: 17, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.5,
              }}>
                {currentQuestion.text}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(Array.isArray((currentQuestion as any).options) ? ((currentQuestion as any).options as { id: string; text: string }[]) : []).map((opt: { id: string; text: string }, i: number) => {
                  const col = OPT_COLORS[i] ?? '#6366f1';
                  const active = isMyTurn && !awaitingResult;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => active && onSubmitPQAnswer(opt.id)}
                      disabled={!active}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: `${col}18`, border: `2px solid ${col}${active ? '55' : '22'}`,
                        borderRadius: 12, padding: '12px 14px',
                        cursor: active ? 'pointer' : 'default',
                        opacity: !isMyTurn ? 0.55 : awaitingResult ? 0.7 : 1,
                        transition: 'all .15s',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: col, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#fff',
                      }}>
                        {['A', 'B', 'C', 'D'][i]}
                      </div>
                      <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, textAlign: 'left' }}>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {!isMyTurn && (
                <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.3)', padding: '8px 0' }}>
                  Solo <strong style={{ color: 'rgba(255,255,255,0.5)' }}>{currentTurnAlias}</strong> puede responder
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: sidebar ── */}
        <GameSidebar
          myScore={myScore}
          myAlias={myAlias}
          players={players}
          roomChat={roomChat}
          onSendChat={onSendChat}
          onExitGame={onExitGame}
          showScores
        />
      </div>
    </div>
  );
}
