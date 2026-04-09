'use client';
import { useEffect, useMemo, useState } from 'react';
import { useMinigameStore } from '../../store/minigame.store';
import { GameSidebar } from '../../components/GameSidebar';
import type { QuizQuestion } from '../../types/game.types';

interface Props {
  onSubmitAnswer: (answer: string | Record<string, unknown>) => void;
  onSendChat: (text: string) => void;
  onExitGame?: () => void;
}

const OPT_COLORS = [
  { bg: 'rgba(239,68,68,0.14)', border: 'rgba(239,68,68,0.4)', solid: '#ef4444', label: 'A' },
  { bg: 'rgba(59,130,246,0.14)', border: 'rgba(59,130,246,0.4)', solid: '#3b82f6', label: 'B' },
  { bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.4)', solid: '#f59e0b', label: 'C' },
  { bg: 'rgba(16,185,129,0.14)', border: 'rgba(16,185,129,0.4)', solid: '#10b981', label: 'D' },
];

export function QuizGameScreen({ onSubmitAnswer, onSendChat, onExitGame }: Props) {
  const myAlias = useMinigameStore((s) => s.myAlias);
  const players = useMinigameStore((s) => s.players);
  const roomChat = useMinigameStore((s) => s.roomChat);
  const quiz = useMinigameStore((s) => s.quiz);
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    answered,
    answerCorrect,
    selectedOptionId,
    correctOptionId,
    correctAnswer,
    timeLimitMs,
    myScore,
  } = quiz;

  const [fillText, setFillText] = useState('');
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [matchMap, setMatchMap] = useState<Record<string, string>>({});

  if (!currentQuestion) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 36, animation: 'qs 1.2s ease-in-out infinite' }}>⏳</div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: 15 }}>Esperando pregunta...</p>
        <style>{`@keyframes qs { 0%,100%{transform:scale(1)}50%{transform:scale(1.15)} }`}</style>
      </div>
    );
  }

  const qt = currentQuestion.type ?? 'mcq';
  const pct = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  useEffect(() => {
    setFillText('');

    if (qt === 'order') {
      const items = (currentQuestion as QuizQuestion & { items?: unknown }).items;
      setOrderItems(Array.isArray(items) ? items.map((x) => String(x)) : []);
    } else {
      setOrderItems([]);
    }

    if (qt === 'match') {
      const left = (currentQuestion as QuizQuestion & { left?: unknown }).left;
      const init: Record<string, string> = {};
      (Array.isArray(left) ? left : []).forEach((l) => {
        init[String(l)] = '';
      });
      setMatchMap(init);
    } else {
      setMatchMap({});
    }
  }, [currentIndex, currentQuestion.text, qt]);

  const leftItems = useMemo(() => {
    if (qt !== 'match') return [];
    const left = (currentQuestion as QuizQuestion & { left?: unknown }).left;
    return Array.isArray(left) ? left.map((x) => String(x)) : [];
  }, [currentQuestion, qt]);

  const rightItems = useMemo(() => {
    if (qt !== 'match') return [];
    const right = (currentQuestion as QuizQuestion & { right?: unknown }).right;
    return Array.isArray(right) ? right.map((x) => String(x)) : [];
  }, [currentQuestion, qt]);

  const usedRights = useMemo(() => new Set(Object.values(matchMap).filter(Boolean)), [matchMap]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
      {/* Topbar */}
      <div
        style={{
          flexShrink: 0,
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.045)',
          background: 'rgba(2,4,9,0.4)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>
            {currentIndex + 1}
            <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}> / {totalQuestions}</span>
          </span>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                borderRadius: 99,
                background: 'linear-gradient(90deg, #4f46e5, #818cf8)',
                width: pct + '%',
                transition: 'width .6s ease',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {answered && answerCorrect !== null && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 11px',
                borderRadius: 8,
                background: answerCorrect ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${answerCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`,
                color: answerCorrect ? '#6ee7b7' : '#fca5a5',
              }}
            >
              {answerCorrect ? '✓ Correcto' : '✗ Incorrecto'}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        {/* Game area */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            padding: '28px 32px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Question */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 18,
              padding: '24px 28px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(16px, 2.2vw, 21px)',
                fontWeight: 700,
                color: '#f8fafc',
                lineHeight: 1.5,
                letterSpacing: '-0.01em',
              }}
            >
              {currentQuestion.text}
            </p>
          </div>

          {/* Answer area */}
          {(qt === 'mcq' || qt === 'true_false') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {((currentQuestion as QuizQuestion & { options?: any[] }).options ?? []).map((opt: any, i: number) => {
                const c = OPT_COLORS[i] ?? OPT_COLORS[0];
                const optId = String(opt.id ?? '');
                const isSel = optId === selectedOptionId;
                const isCorrect = optId === correctOptionId;
                const isWrong = answered && isSel && !isCorrect;

                let bg = c.bg;
                let border = c.border;
                let op = 1;
                if (answered) {
                  if (isCorrect) {
                    bg = c.solid + '22';
                    border = c.solid;
                  } else if (isWrong) {
                    bg = 'rgba(239,68,68,0.12)';
                    border = '#ef4444';
                  } else {
                    op = 0.35;
                  }
                } else if (isSel) {
                  bg = c.solid + '22';
                  border = c.solid;
                }

                return (
                  <button
                    key={optId || i}
                    onClick={() => !answered && onSubmitAnswer(optId)}
                    disabled={answered}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '15px 18px',
                      borderRadius: 14,
                      textAlign: 'left',
                      background: bg,
                      border: `2px solid ${border}`,
                      cursor: answered ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                      opacity: op,
                      transition: 'all .15s',
                      boxShadow: isSel && !answered ? `0 0 18px ${c.solid}25` : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        flexShrink: 0,
                        background: answered && isCorrect ? c.solid : c.solid + '1a',
                        border: `1.5px solid ${c.solid}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 900,
                        color: answered && isCorrect ? '#fff' : c.solid,
                        transition: 'all .15s',
                      }}
                    >
                      {answered && isCorrect ? '✓' : answered && isWrong ? '✗' : c.label}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.4 }}>{String(opt.text ?? '')}</span>
                  </button>
                );
              })}
            </div>
          )}

          {qt === 'fill_blank' && (
            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                padding: 14,
              }}
            >
              <input
                value={fillText}
                onChange={(e) => setFillText(e.target.value)}
                disabled={answered}
                placeholder="Escribí tu respuesta..."
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 12,
                  padding: '0 12px',
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(15,23,42,0.55)',
                  color: '#f1f5f9',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
              <button
                onClick={() => !answered && onSubmitAnswer({ text: fillText })}
                disabled={answered || !fillText.trim()}
                style={{
                  height: 40,
                  padding: '0 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(99,102,241,0.35)',
                  background: answered ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  color: answered ? 'rgba(255,255,255,0.35)' : '#fff',
                  cursor: answered ? 'default' : 'pointer',
                  fontWeight: 800,
                }}
              >
                Enviar
              </button>
            </div>
          )}

          {qt === 'order' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Ordená los elementos (arriba → abajo):</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {orderItems.map((it, i) => (
                  <div
                    key={`${i}-${it}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button
                        onClick={() =>
                          !answered &&
                          setOrderItems((xs) => {
                            if (i <= 0) return xs;
                            const a = [...xs];
                            [a[i - 1], a[i]] = [a[i], a[i - 1]];
                            return a;
                          })
                        }
                        disabled={answered || i === 0}
                        style={{
                          width: 28,
                          height: 22,
                          borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.10)',
                          background: 'rgba(255,255,255,0.03)',
                          color: 'rgba(255,255,255,0.55)',
                          cursor: answered ? 'default' : 'pointer',
                          fontWeight: 900,
                        }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() =>
                          !answered &&
                          setOrderItems((xs) => {
                            if (i >= xs.length - 1) return xs;
                            const a = [...xs];
                            [a[i + 1], a[i]] = [a[i], a[i + 1]];
                            return a;
                          })
                        }
                        disabled={answered || i === orderItems.length - 1}
                        style={{
                          width: 28,
                          height: 22,
                          borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.10)',
                          background: 'rgba(255,255,255,0.03)',
                          color: 'rgba(255,255,255,0.55)',
                          cursor: answered ? 'default' : 'pointer',
                          fontWeight: 900,
                        }}
                      >
                        ↓
                      </button>
                    </div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{it}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.25)' }}>#{i + 1}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => !answered && onSubmitAnswer({ order: orderItems })}
                disabled={answered || orderItems.length < 2}
                style={{
                  height: 42,
                  borderRadius: 14,
                  border: '1px solid rgba(99,102,241,0.35)',
                  background: answered ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  color: answered ? 'rgba(255,255,255,0.35)' : '#fff',
                  cursor: answered ? 'default' : 'pointer',
                  fontWeight: 900,
                }}
              >
                Confirmar orden
              </button>
            </div>
          )}

          {qt === 'match' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Relacioná cada elemento con su pareja:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {leftItems.map((l) => (
                  <div
                    key={l}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 18px 1fr',
                      gap: 10,
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{l}</div>
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontWeight: 900 }}>{'→'}</div>
                    <select
                      value={matchMap[l] ?? ''}
                      disabled={answered}
                      onChange={(e) => setMatchMap((m) => ({ ...m, [l]: e.target.value }))}
                      style={{
                        height: 40,
                        borderRadius: 12,
                        padding: '0 10px',
                        border: '1px solid rgba(255,255,255,0.10)',
                        background: 'rgba(15,23,42,0.55)',
                        color: '#f1f5f9',
                        fontWeight: 700,
                        outline: 'none',
                      }}
                    >
                      <option value="" disabled>
                        Elegí...
                      </option>
                      {rightItems.map((r) => {
                        const isUsedByOther = usedRights.has(r) && matchMap[l] !== r;
                        return (
                          <option key={r} value={r} disabled={isUsedByOther}>
                            {r}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ))}
              </div>
              <button
                onClick={() => !answered && onSubmitAnswer({ matches: matchMap })}
                disabled={answered || leftItems.length === 0 || leftItems.some((l) => !matchMap[l])}
                style={{
                  height: 42,
                  borderRadius: 14,
                  border: '1px solid rgba(99,102,241,0.35)',
                  background: answered ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  color: answered ? 'rgba(255,255,255,0.35)' : '#fff',
                  cursor: answered ? 'default' : 'pointer',
                  fontWeight: 900,
                }}
              >
                Confirmar relaciones
              </button>
            </div>
          )}

          {answered && answerCorrect === false && correctAnswer !== null && (qt === 'fill_blank' || qt === 'order' || qt === 'match') && (
            <div
              style={{
                marginTop: 6,
                padding: '14px 16px',
                borderRadius: 14,
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.18)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: 'rgba(248,113,113,0.75)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Respuesta correcta
              </div>
              {qt === 'fill_blank' && <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{String(correctAnswer)}</div>}
              {qt === 'order' && Array.isArray(correctAnswer) && (
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', lineHeight: 1.6 }}>
                  {(correctAnswer as any[]).map((x) => String(x)).join(' → ')}
                </div>
              )}
              {qt === 'match' && Array.isArray(correctAnswer) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(correctAnswer as any[]).map((p: any, i: number) => (
                    <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                      {String(p?.left ?? '')} → {String(p?.right ?? '')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Awaiting others */}
          {answered && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {players.map((p, i) => (
                  <div
                    key={`${p.alias}-${i}`}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      background: p.answered ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${p.answered ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.07)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      color: p.answered ? '#6ee7b7' : 'rgba(255,255,255,0.25)',
                      transition: 'all .3s',
                    }}
                  >
                    {p.alias[0]?.toUpperCase()}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>Esperando a los demás...</span>
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
          onExitGame={onExitGame}
          showAnswered
          timer={!answered ? { key: `${currentIndex}-${timeLimitMs}`, durationMs: timeLimitMs } : undefined}
        />
      </div>
    </div>
  );
}

