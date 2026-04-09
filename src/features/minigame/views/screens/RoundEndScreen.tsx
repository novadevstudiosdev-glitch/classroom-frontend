'use client';
import { useMinigameStore } from '../../store/minigame.store';
import { GameSidebar } from '../../components/GameSidebar';

interface Props {
  onContinue: () => void;
  onSendChat: (text: string) => void;
  onExitGame?: () => void;
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export function RoundEndScreen({ onContinue, onSendChat, onExitGame }: Props) {
  const myAlias = useMinigameStore((s) => s.myAlias);
  const players  = useMinigameStore((s) => s.players);
  const roomChat = useMinigameStore((s) => s.roomChat);
  const roundScoreboard = useMinigameStore((s) => s.roundScoreboard);
  const quiz = useMinigameStore((s) => s.quiz);
  const isHost = useMinigameStore((s) => s.isHost);

  const myEntry = roundScoreboard.find((e) => e.alias === myAlias);
  const top3 = roundScoreboard.slice(0, 3);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Topbar ── */}
      <div style={{
        flexShrink: 0, height: 52, display: 'flex', alignItems: 'center',
        gap: 12, padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(2,4,9,0.4)', backdropFilter: 'blur(12px)',
      }}>
        <span style={{ fontSize: 18 }}>📊</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>
          Fin de ronda
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>
          Pregunta {quiz.currentIndex + 1} / {quiz.totalQuestions}
        </span>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

        {/* ── Left: results ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, padding: '28px 32px', overflowY: 'auto' }}>

          {/* My result card */}
          {myEntry && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.06))',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 16, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ fontSize: 40 }}>
                {myEntry.rank && myEntry.rank <= 3 ? RANK_MEDALS[myEntry.rank - 1] : '🎯'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(99,102,241,0.6)', marginBottom: 4 }}>
                  Tu puntaje esta ronda
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>
                  {(myEntry.score ?? 0).toLocaleString()}
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginLeft: 6 }}>pts</span>
                </div>
                {myEntry.rank && (
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                    Posición #{myEntry.rank}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top 3 podium */}
          {top3.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', marginBottom: 4 }}>
                Clasificación
              </div>
              {roundScoreboard.map((entry, i) => {
                const isMe = entry.alias === myAlias;
                return (
                  <div key={`${entry.alias}-${i}`} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 12,
                    background: isMe
                      ? 'rgba(99,102,241,0.12)'
                      : i < 3 ? 'rgba(255,255,255,0.04)' : 'transparent',
                    border: isMe
                      ? '1px solid rgba(99,102,241,0.25)'
                      : '1px solid transparent',
                  }}>
                    <div style={{ width: 24, textAlign: 'center', fontSize: 16, flexShrink: 0 }}>
                      {i < 3 ? RANK_MEDALS[i] : <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>#{i + 1}</span>}
                    </div>
                    <div style={{
                      flex: 1, fontSize: 14, fontWeight: isMe ? 700 : 600,
                      color: isMe ? '#c7d2fe' : 'rgba(255,255,255,0.65)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {entry.alias}
                    </div>
                    <div style={{
                      fontSize: 14, fontWeight: 800,
                      color: isMe ? '#818cf8' : 'rgba(255,255,255,0.4)',
                      flexShrink: 0,
                    }}>
                      {(entry.score ?? 0).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 8 }}>
            {isHost ? (
              <button
                onClick={onContinue}
                style={{
                  width: '100%', padding: '13px 0',
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  border: 'none', borderRadius: 14,
                  color: '#fff', fontWeight: 800, fontSize: 15,
                  cursor: 'pointer', letterSpacing: '0.01em',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                  transition: 'opacity .15s',
                }}
              >
                Siguiente pregunta →
              </button>
            ) : (
              <div style={{
                textAlign: 'center', padding: '13px 0',
                color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 600,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
              }}>
                Esperando al host...
              </div>
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
          onExitGame={onExitGame}
          showScores
        />
      </div>
    </div>
  );
}
