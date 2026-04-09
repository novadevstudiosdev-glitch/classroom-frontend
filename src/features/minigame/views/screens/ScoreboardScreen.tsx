'use client';
import { useEffect, useRef } from 'react';
import { useMinigameStore } from '../../store/minigame.store';
import { GameSidebar } from '../../components/GameSidebar';

interface Props {
  onRestart: () => void;
  onExit: () => void;
  onSendChat: (text: string) => void;
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export function ScoreboardScreen({ onRestart, onExit, onSendChat }: Props) {
  const myAlias = useMinigameStore((s) => s.myAlias);
  const isHost  = useMinigameStore((s) => s.isHost);
  const players  = useMinigameStore((s) => s.players);
  const roomChat = useMinigameStore((s) => s.roomChat);
  const finalScoreboard = useMinigameStore((s) => s.finalScoreboard);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 4,
      h: Math.random() * 6 + 4,
      color: ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#a855f7'][Math.floor(Math.random() * 6)],
      speed: Math.random() * 3 + 1.5,
      tilt: Math.random() * 20 - 10,
      tiltSpeed: Math.random() * 0.1,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.speed;
        p.tilt += p.tiltSpeed;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.tilt * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const t = setTimeout(() => cancelAnimationFrame(raf), 6000);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);

  const myEntry = finalScoreboard.find((e) => e.alias === myAlias);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }} />

      {/* ── Topbar ── */}
      <div style={{
        flexShrink: 0, height: 52, display: 'flex', alignItems: 'center',
        gap: 12, padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(2,4,9,0.4)', backdropFilter: 'blur(12px)',
        position: 'relative', zIndex: 10,
      }}>
        <span style={{ fontSize: 20 }}>🏆</span>
        <span style={{ fontSize: 14, fontWeight: 900, color: '#e2e8f0', letterSpacing: '-0.01em' }}>
          ¡Fin del juego!
        </span>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden', position: 'relative', zIndex: 10 }}>

        {/* ── Left: scoreboard ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, padding: '28px 32px', overflowY: 'auto' }}>

          {/* Winner hero */}
          {finalScoreboard[0] && (
            <div style={{
              textAlign: 'center', padding: '24px 20px',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 20,
            }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🥇</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fef3c7' }}>
                {finalScoreboard[0].alias}
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#f59e0b', lineHeight: 1.1, marginTop: 4 }}>
                {(finalScoreboard[0].score ?? 0).toLocaleString()}
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(245,158,11,0.5)', marginLeft: 6 }}>pts</span>
              </div>
            </div>
          )}

          {/* My result */}
          {myEntry && myEntry.alias !== finalScoreboard[0]?.alias && (
            <div style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 14, padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ fontSize: 28 }}>
                {myEntry.rank && myEntry.rank <= 3 ? RANK_MEDALS[myEntry.rank - 1] : '🎯'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(99,102,241,0.6)' }}>
                  Tu resultado
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', lineHeight: 1.1 }}>
                  {(myEntry.score ?? 0).toLocaleString()} pts
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'rgba(255,255,255,0.35)' }}>
                #{myEntry.rank}
              </div>
            </div>
          )}

          {/* Full leaderboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', marginBottom: 4 }}>
              Tabla final
            </div>
            {finalScoreboard.map((entry, i) => {
              const isMe = entry.alias === myAlias;
              return (
                <div key={`${entry.alias}-${i}`} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12,
                  background: isMe ? 'rgba(99,102,241,0.12)' : i === 0 ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isMe ? 'rgba(99,102,241,0.25)' : i === 0 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  transition: 'background .2s',
                }}>
                  <div style={{ width: 26, textAlign: 'center', flexShrink: 0 }}>
                    {i < 3
                      ? <span style={{ fontSize: 16 }}>{RANK_MEDALS[i]}</span>
                      : <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>#{i + 1}</span>
                    }
                  </div>
                  <div style={{
                    flex: 1, fontSize: 14, fontWeight: isMe ? 700 : 600,
                    color: isMe ? '#c7d2fe' : i === 0 ? '#fef3c7' : 'rgba(255,255,255,0.6)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {entry.alias}
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 800, flexShrink: 0,
                    color: isMe ? '#818cf8' : i === 0 ? '#f59e0b' : 'rgba(255,255,255,0.35)',
                  }}>
                    {(entry.score ?? 0).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onExit} style={{
              flex: 1, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '12px 0',
              color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'all .15s',
            }}>
              Salir
            </button>
            {isHost && (
              <button onClick={onRestart} style={{
                flex: 2,
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                border: 'none', borderRadius: 12, padding: '12px 0',
                color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                transition: 'opacity .15s',
              }}>
                Jugar de nuevo
              </button>
            )}
          </div>
        </div>

        {/* ── Right: sidebar ── */}
        <GameSidebar
          myScore={myEntry?.score ?? 0}
          myAlias={myAlias}
          players={players}
          roomChat={roomChat}
          onSendChat={onSendChat}
          showScores
        />
      </div>
    </div>
  );
}
