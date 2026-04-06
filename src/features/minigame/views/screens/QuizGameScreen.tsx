'use client';
import { useMinigameStore } from '../../store/minigame.store';
import { GameSidebar } from '../../components/GameSidebar';

interface Props {
  onSubmitAnswer: (optionId: string) => void;
  onSendReaction: (emoji: string) => void;
  onSendChat: (text: string) => void;
  onExitGame: () => void;
}

const OPT_COLORS = [
  { bg: 'rgba(239,68,68,0.14)',   border: 'rgba(239,68,68,0.4)',   solid: '#ef4444', label: 'A' },
  { bg: 'rgba(59,130,246,0.14)',  border: 'rgba(59,130,246,0.4)',  solid: '#3b82f6', label: 'B' },
  { bg: 'rgba(245,158,11,0.14)',  border: 'rgba(245,158,11,0.4)',  solid: '#f59e0b', label: 'C' },
  { bg: 'rgba(16,185,129,0.14)',  border: 'rgba(16,185,129,0.4)',  solid: '#10b981', label: 'D' },
];

export function QuizGameScreen({ onSubmitAnswer, onSendReaction, onSendChat, onExitGame }: Props) {
  const myAlias  = useMinigameStore((s) => s.myAlias);
  const isHost   = useMinigameStore((s) => s.isHost);
  const players  = useMinigameStore((s) => s.players);
  const roomChat = useMinigameStore((s) => s.roomChat);
  const quiz     = useMinigameStore((s) => s.quiz);
  const { currentQuestion, currentIndex, totalQuestions, answered, selectedOptionId, correctOptionId, timeLimitMs, myScore } = quiz;

  if (!currentQuestion) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 36, animation: 'qs 1.2s ease-in-out infinite' }}>⏳</div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: 15 }}>Esperando pregunta...</p>
        <style>{`@keyframes qs { 0%,100%{transform:scale(1)}50%{transform:scale(1.15)} }`}</style>
      </div>
    );
  }

  const pct = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Topbar ── */}
      <div style={{
        flexShrink: 0, height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(2,4,9,0.4)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>
            {currentIndex + 1}
            <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}> / {totalQuestions}</span>
          </span>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: 'linear-gradient(90deg, #4f46e5, #818cf8)',
              width: pct + '%', transition: 'width .6s ease',
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {answered && (
            <div style={{
              fontSize: 12, fontWeight: 700, padding: '4px 11px', borderRadius: 8,
              background: selectedOptionId === correctOptionId ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${selectedOptionId === correctOptionId ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`,
              color: selectedOptionId === correctOptionId ? '#6ee7b7' : '#fca5a5',
            }}>
              {selectedOptionId === correctOptionId ? '✓ Correcto' : '✗ Incorrecto'}
            </div>
          )}
          {isHost && (
            <button onClick={onExitGame} style={{
              padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.28)', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            }}>Salir</button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {/* Game area */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '28px 32px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Question */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, padding: '24px 28px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
          }}>
            <p style={{
              margin: 0, fontSize: 'clamp(16px, 2.2vw, 21px)',
              fontWeight: 700, color: '#f8fafc', lineHeight: 1.5, letterSpacing: '-0.01em',
            }}>
              {currentQuestion.text}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {currentQuestion.options.map((opt, i) => {
              const c = OPT_COLORS[i] ?? OPT_COLORS[0];
              const isSel     = opt.id === selectedOptionId;
              const isCorrect = opt.id === correctOptionId;
              const isWrong   = answered && isSel && !isCorrect;

              let bg     = c.bg;
              let border = c.border;
              let op     = 1;
              if (answered) {
                if (isCorrect)  { bg = c.solid + '22'; border = c.solid; }
                else if (isWrong) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; }
                else              { op = 0.35; }
              } else if (isSel) { bg = c.solid + '22'; border = c.solid; }

              return (
                <button
                  key={opt.id}
                  onClick={() => !answered && onSubmitAnswer(opt.id)}
                  disabled={answered}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '15px 18px', borderRadius: 14, textAlign: 'left',
                    background: bg, border: `2px solid ${border}`,
                    cursor: answered ? 'default' : 'pointer', fontFamily: 'inherit',
                    opacity: op, transition: 'all .15s',
                    boxShadow: isSel && !answered ? `0 0 18px ${c.solid}25` : 'none',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: answered && isCorrect ? c.solid : c.solid + '1a',
                    border: `1.5px solid ${c.solid}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 900,
                    color: answered && isCorrect ? '#fff' : c.solid,
                    transition: 'all .15s',
                  }}>
                    {answered && isCorrect ? '✓' : answered && isWrong ? '✗' : c.label}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.4 }}>
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Awaiting others */}
          {answered && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {players.map((p, i) => (
                  <div key={`${p.alias}-${i}`} style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: p.answered ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${p.answered ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.07)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                    color: p.answered ? '#6ee7b7' : 'rgba(255,255,255,0.25)',
                    transition: 'all .3s',
                  }}>
                    {p.alias[0]?.toUpperCase()}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Esperando a los demás...
              </span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <GameSidebar
          myScore={myScore}
          myAlias={myAlias}
          players={players}
          roomChat={roomChat}
          onSendChat={onSendChat}
          onSendReaction={onSendReaction}
          showAnswered
          timer={!answered ? { key: `${currentIndex}-${timeLimitMs}`, durationMs: timeLimitMs } : undefined}
        />
      </div>
    </div>
  );
}
