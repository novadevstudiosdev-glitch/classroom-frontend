'use client';
import { useRef } from 'react';
import { useMinigameStore } from '../../store/minigame.store';
import { GameSidebar } from '../../components/GameSidebar';

interface Props {
  onSubmitComplete: (score: number) => void;
  onSendReaction: (emoji: string) => void;
  onSendChat: (text: string) => void;
}

export function AnagramScreen({ onSubmitComplete, onSendReaction, onSendChat }: Props) {
  const myAlias  = useMinigameStore((s) => s.myAlias);
  const players  = useMinigameStore((s) => s.players);
  const roomChat = useMinigameStore((s) => s.roomChat);
  const anagram  = useMinigameStore((s) => s.anagram);
  const setAnagram = useMinigameStore((s) => s.setAnagram);
  const submittedRef = useRef(false);

  const { word, hint, scrambled, placed, tileToSlot, slotToTile, solved, timeLimitMs, myScore } = anagram;

  const handleTimeExpire = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmitComplete(myScore);
  };

  const clickTile = (tileIdx: number) => {
    if (solved) return;
    if (tileIdx in tileToSlot) {
      const slot = tileToSlot[tileIdx];
      const newPlaced = [...placed];
      newPlaced[slot] = null;
      const newTileToSlot = { ...tileToSlot };
      const newSlotToTile = { ...slotToTile };
      delete newTileToSlot[tileIdx];
      delete newSlotToTile[slot];
      setAnagram({ placed: newPlaced, tileToSlot: newTileToSlot, slotToTile: newSlotToTile });
      return;
    }
    const emptySlot = placed.findIndex((v) => v === null);
    if (emptySlot < 0) return;
    const newPlaced = [...placed];
    newPlaced[emptySlot] = scrambled[tileIdx];
    const newTileToSlot = { ...tileToSlot, [tileIdx]: emptySlot };
    const newSlotToTile = { ...slotToTile, [emptySlot]: tileIdx };
    setAnagram({ placed: newPlaced, tileToSlot: newTileToSlot, slotToTile: newSlotToTile });
    const filled = [...newPlaced];
    if (!filled.includes(null)) {
      const guess = filled.join('');
      if (guess === word) {
        setAnagram({ solved: true });
        if (!submittedRef.current) {
          submittedRef.current = true;
          onSubmitComplete(myScore + 100);
        }
      }
    }
  };

  const clickSlot = (slotIdx: number) => {
    if (solved || placed[slotIdx] === null) return;
    const tileIdx = slotToTile[slotIdx];
    const newPlaced = [...placed];
    newPlaced[slotIdx] = null;
    const newTileToSlot = { ...tileToSlot };
    const newSlotToTile = { ...slotToTile };
    delete newTileToSlot[tileIdx];
    delete newSlotToTile[slotIdx];
    setAnagram({ placed: newPlaced, tileToSlot: newTileToSlot, slotToTile: newSlotToTile });
  };

  const filledCount = placed.filter((v) => v !== null).length;
  const progress = placed.length > 0 ? (filledCount / placed.length) * 100 : 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Topbar ── */}
      <div style={{
        flexShrink: 0, height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, padding: '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(2,4,9,0.4)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔀</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>Anagrama</span>
        </div>
        {/* Progress */}
        <div style={{ flex: 1, maxWidth: 300, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: solved
                ? 'linear-gradient(90deg, #22c55e, #86efac)'
                : 'linear-gradient(90deg, #4f46e5, #818cf8)',
              width: progress + '%', transition: 'width .3s ease',
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
            {filledCount}/{placed.length}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

        {/* ── Left: game area ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '24px 32px', overflowY: 'auto' }}>

          {/* Hint */}
          {hint && (
            <div style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 12, padding: '10px 20px',
              fontSize: 14, color: 'rgba(255,255,255,0.55)',
              textAlign: 'center',
            }}>
              Pista:&nbsp;<strong style={{ color: '#c7d2fe', fontWeight: 700 }}>{hint}</strong>
            </div>
          )}

          {/* Answer slots */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)' }}>
              Tu respuesta
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {placed.map((letter, i) => (
                <div
                  key={i}
                  onClick={() => clickSlot(i)}
                  style={{
                    width: 48, height: 54,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 900,
                    background: letter
                      ? solved ? 'rgba(34,197,94,0.18)' : 'rgba(99,102,241,0.2)'
                      : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${letter ? (solved ? 'rgba(34,197,94,0.5)' : 'rgba(99,102,241,0.45)') : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 12,
                    color: solved ? '#86efac' : '#e2e8f0',
                    cursor: letter && !solved ? 'pointer' : 'default',
                    transition: 'all 0.15s',
                    boxShadow: letter && !solved ? '0 2px 12px rgba(99,102,241,0.15)' : 'none',
                  }}
                >
                  {letter ?? ''}
                </div>
              ))}
            </div>
          </div>

          {/* Solved banner */}
          {solved && (
            <div style={{
              fontSize: 20, fontWeight: 900, color: '#22c55e',
              display: 'flex', alignItems: 'center', gap: 8,
              animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              <span style={{ fontSize: 28 }}>🎉</span> ¡Correcto!
            </div>
          )}

          {/* Scrambled tiles */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)' }}>
              Letras disponibles
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {scrambled.map((letter, i) => {
                const isUsed = i in tileToSlot;
                return (
                  <div
                    key={i}
                    onClick={() => !isUsed && !solved && clickTile(i)}
                    style={{
                      width: 48, height: 54,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, fontWeight: 900,
                      background: isUsed ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.12)',
                      border: `2px solid ${isUsed ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.35)'}`,
                      borderRadius: 12,
                      color: isUsed ? 'rgba(255,255,255,0.08)' : '#c7d2fe',
                      cursor: isUsed || solved ? 'default' : 'pointer',
                      transform: isUsed ? 'scale(0.88)' : 'scale(1)',
                      transition: 'all 0.15s',
                      boxShadow: !isUsed && !solved ? '0 2px 10px rgba(99,102,241,0.1)' : 'none',
                    }}
                  >
                    {isUsed ? '' : letter}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: sidebar ── */}
        <GameSidebar
          myScore={myScore}
          myAlias={myAlias}
          players={players}
          roomChat={roomChat}
          onSendChat={onSendChat}
          onSendReaction={onSendReaction}
          timer={!solved ? { key: timeLimitMs, durationMs: timeLimitMs, onExpire: handleTimeExpire } : undefined}
          showAnswered
        />
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
