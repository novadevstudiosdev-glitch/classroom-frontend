'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from '@/shared/components/navigation/Navbar';
import { useMinigameStore } from '../store/minigame.store';
import { useGameSocket } from '../hooks/useGameSocket';
import { FloatReaction } from '../components/FloatReaction';
import { minigameService } from '../services/minigame.service';
import {
  LoadingScreen, CountdownScreen, WaitingScreen, RoundEndScreen,
  ScoreboardScreen, RoomBrowserScreen, LobbyScreen,
  QuizGameScreen, WordSearchScreen, AnagramScreen, PreguntadosScreen,
  TrucoScreen,
} from './screens';

// Deterministic star field (avoids hydration mismatch)
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  size: (((i * 137.508) % 18) / 10 + 0.7).toFixed(1),
  top:  ((i * 97.31)  % 100).toFixed(3),
  left: ((i * 61.803) % 100).toFixed(3),
  opacity: (((i * 43.7) % 5) / 10 + 0.06).toFixed(2),
  dur:   (((i * 29.1) % 28) / 10 + 2.2).toFixed(1),
  delay: (((i * 17.3) % 26) / 10).toFixed(1),
}));

export function MinigameLobbyView() {
  const screen      = useMinigameStore((s) => s.currentScreen);
  const roomCode    = useMinigameStore((s) => s.roomCode);
  const floatReaction = useMinigameStore((s) => s.floatReaction);
  const socket      = useGameSocket();
  const router      = useRouter();
  const searchParams = useSearchParams();
  // ── On mount: connect, auto-join if URL has ?room=CODE ──
  useEffect(() => {
    // Replace any stale history entry (e.g. lobby.html) so back button stays within the app
    if (typeof window !== 'undefined' && window.location.pathname === '/minigame/lobby') {
      window.history.replaceState(null, '', window.location.href);
    }

    const urlRoom = searchParams.get('room')?.toUpperCase() ?? undefined;
    socket.connect(urlRoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync URL with room state ──
  useEffect(() => {
    if (screen === 'lobby' && roomCode) {
      const target = `/minigame/lobby?room=${roomCode}`;
      if (typeof window !== 'undefined' && !window.location.search.includes(roomCode)) {
        router.replace(target, { scroll: false });
      }
    } else if (screen === 'rooms') {
      if (typeof window !== 'undefined' && window.location.search) {
        router.replace('/minigame/lobby', { scroll: false });
      }
    }
  }, [screen, roomCode, router]);

  const handleDeleteGame = async (id: string) => {
    try {
      await minigameService.deleteGame(id);
      socket.getRooms();
    } catch {
      useMinigameStore.getState().setError('No se pudo eliminar el juego.');
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: '#020409', color: '#f8fafc' }}>

      {/* ── Background layer ── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        {/* Stars */}
        {STARS.map((s) => (
          <div key={s.id} className="absolute rounded-full bg-white" style={{
            width: s.size + 'px', height: s.size + 'px',
            top: s.top + '%', left: s.left + '%',
            opacity: +s.opacity,
            animation: `mgTwinkle ${s.dur}s ease-in-out infinite ${s.delay}s`,
          }} />
        ))}
        {/* Ambient gradient orbs */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)',
          filter: 'blur(1px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.025) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── Navbar ── */}
      <div className="relative z-10 flex-shrink-0" style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(2,4,9,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <Navbar />
      </div>

      {/* ── Screen content ── */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="flex-1 flex flex-col min-h-0"
          >
            {screen === 'loading' && <LoadingScreen />}

            {screen === 'rooms' && (
              <RoomBrowserScreen
                onCreateRoom={socket.createRoom}
                onJoinRoom={socket.joinRoom}
                onSendLobbyChat={socket.sendLobbyChat}
                onRefresh={socket.getRooms}
              />
            )}

            {screen === 'lobby' && (
              <LobbyScreen
                onPickGame={socket.pickGame}
                onStartGame={socket.startGame}
                onExitLobby={socket.exitLobby}
                onKickPlayer={socket.kickPlayer}
                onPromotePlayer={socket.promotePlayer}
                onSendChat={socket.sendChat}
                onSendReaction={socket.sendReaction}
                onDeleteGame={handleDeleteGame}
                onRefreshGames={socket.getQuizzes}
              />
            )}

            {screen === 'countdown'  && <CountdownScreen />}
            {screen === 'quiz'       && <QuizGameScreen onSubmitAnswer={socket.submitAnswer} onSendReaction={socket.sendReaction} onSendChat={socket.sendChat} onExitGame={socket.exitGame} />}
            {screen === 'wordsearch' && <WordSearchScreen onFindWord={socket.findWord} onSubmitComplete={socket.submitGameComplete} onSendReaction={socket.sendReaction} onSendChat={socket.sendChat} />}
            {screen === 'anagram'    && <AnagramScreen onSubmitComplete={socket.submitGameComplete} onSendReaction={socket.sendReaction} onSendChat={socket.sendChat} />}
            {screen === 'preguntados'&& <PreguntadosScreen onSpinWheel={socket.spinWheel} onSubmitPQAnswer={socket.submitPQAnswer} onSendReaction={socket.sendReaction} onSendChat={socket.sendChat} />}
            {screen === 'truco'      && <TrucoScreen sendTrucoAction={socket.sendTrucoAction} onSendReaction={socket.sendReaction} onSendChat={socket.sendChat} />}
            {screen === 'waiting'    && <WaitingScreen onSendChat={socket.sendChat} onSendReaction={socket.sendReaction} />}
            {screen === 'round-end'  && <RoundEndScreen onContinue={() => socket.getRooms()} onSendChat={socket.sendChat} onSendReaction={socket.sendReaction} />}
            {screen === 'scoreboard' && <ScoreboardScreen onRestart={socket.restartRoom} onExit={socket.exitGame} onSendChat={socket.sendChat} onSendReaction={socket.sendReaction} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <FloatReaction reaction={floatReaction} />

      <style>{`
        @keyframes mgTwinkle {
          0%,100% { opacity: .06; }
          50%      { opacity: .5;  }
        }
      `}</style>
    </div>
  );
}
