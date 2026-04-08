'use client';
import { useMinigameStore } from '../../store/minigame.store';
import { GameSidebar } from '../../components/GameSidebar';

interface Props {
  onSendChat: (text: string) => void;
  onExitGame?: () => void;
}

export function WaitingScreen({ onSendChat, onExitGame }: Props) {
  const myAlias  = useMinigameStore((s) => s.myAlias);
  const players  = useMinigameStore((s) => s.players);
  const roomChat = useMinigameStore((s) => s.roomChat);
  const roundScoreboard = useMinigameStore((s) => s.roundScoreboard);
  const myScore = roundScoreboard.find((e) => e.alias === myAlias)?.score ?? 0;

  const answeredCount = players.filter((p) => p.answered).length;
  const total = players.length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Topbar ── */}
      <div style={{
        flexShrink: 0, height: 52, display: 'flex', alignItems: 'center',
        gap: 16, padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(2,4,9,0.4)', backdropFilter: 'blur(12px)',
      }}>
        <span style={{ fontSize: 18 }}>⏳</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>
          Esperando respuestas
        </span>
        {total > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <div style={{ width: 120, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: 'linear-gradient(90deg, #4f46e5, #818cf8)',
                width: `${(answeredCount / total) * 100}%`,
                transition: 'width .4s ease',
              }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
              {answeredCount}/{total}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

        {/* ── Left: waiting content ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 32 }}>

          {/* Spinner animation */}
          <div style={{ position: 'relative', width: 96, height: 96 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '3px solid rgba(99,102,241,0.1)',
            }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: '#6366f1',
              animation: 'wsSpin 1.2s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 12, borderRadius: '50%',
              border: '2px solid rgba(99,102,241,0.08)',
            }} />
            <div style={{
              position: 'absolute', inset: 12, borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: 'rgba(129,140,248,0.5)',
              animation: 'wsSpin 0.8s linear infinite reverse',
            }} />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
            }}>
              ⏳
            </div>
          </div>

          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0' }}>
              Esperando a los demás...
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
              {answeredCount === total && total > 0
                ? 'Todos han respondido'
                : `${total - answeredCount} jugador${total - answeredCount !== 1 ? 'es' : ''} pendiente${total - answeredCount !== 1 ? 's' : ''}`
              }
            </div>
          </div>

          {/* Players answered dots */}
          {players.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 320 }}>
              {players.map((p, i) => (
                <div
                  key={`${p.alias}-${i}`}
                  title={p.alias}
                  style={{
                    width: 34, height: 34, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 900,
                    background: p.answered ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${p.answered ? 'rgba(16,185,129,0.45)' : 'rgba(255,255,255,0.08)'}`,
                    color: p.answered ? '#34d399' : 'rgba(255,255,255,0.25)',
                    transition: 'all .3s',
                    boxShadow: p.answered ? '0 0 10px rgba(16,185,129,0.2)' : 'none',
                  }}
                >
                  {p.alias[0]?.toUpperCase()}
                </div>
              ))}
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
          showAnswered
        />
      </div>

      <style>{`
        @keyframes wsSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
