'use client';
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '@/lib/axios/token-storage';
import { useAuthStore } from '@/store/auth/auth.store';
import { useMinigameStore } from '../store/minigame.store';
import { useAudioEngine } from './useAudioEngine';
import type { GameType, PlayerInfo, ScoreboardEntry } from '../types/game.types';

// WebSocket base URL — mirrors lobby.html logic
function getWsBase(): string {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  const { hostname, protocol } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:3000`;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  return apiUrl.replace('/api', '') || 'https://classroom-backend.up.railway.app';
}

const OPT_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4'];

// ── Hook ───────────────────────────────────────────────────────────────────

export function useGameSocket() {
  const socketRef = useRef<Socket | null>(null);
  const audio = useAudioEngine();
  const store = useMinigameStore;

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getStore = useCallback(() => store.getState(), [store]);

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  // ── Connect ───────────────────────────────────────────────────────────────

  const pendingRoomRef = useRef<string | null>(null);

  const connect = useCallback(async (autoJoinRoom?: string) => {
    if (autoJoinRoom) pendingRoomRef.current = autoJoinRoom;
    if (socketRef.current?.connected) {
      // Already connected — just join the room now
      if (autoJoinRoom) {
        const s = getStore();
        emit('join-room', { roomCode: autoJoinRoom.toUpperCase(), alias: s.myAlias });
        pendingRoomRef.current = null;
      }
      return;
    }
    // Already connecting (socket exists but handshake not done yet) — wait for connect event
    if (socketRef.current && !socketRef.current.connected) return;

    const s = getStore();

    const auth = useAuthStore.getState();
    let displayName = auth.user?.name?.trim();
    if (!displayName) {
      await auth.refreshUser();
      displayName = useAuthStore.getState().user?.name?.trim();
    }

    const alias = (displayName || 'Jugador').slice(0, 48);
    s.setAlias(alias);
    s.setScreen('loading');
    s.setLoadingText('Conectando...');

    const token = tokenStorage.getAccessToken() ?? '';
    const socket = io(`${getWsBase()}/game`, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      forceNew: true,
      auth: { token },
    });
    socketRef.current = socket;

    // ── Connection events ──

    socket.on('connect', () => {
      const s = getStore();
      const pending = pendingRoomRef.current;
      pendingRoomRef.current = null;
      // Priority: pending URL room > existing store room > lobby
      if (pending) {
        emit('join-room', { roomCode: pending.toUpperCase(), alias });
      } else if (s.roomCode) {
        emit('join-room', { roomCode: s.roomCode, alias: s.myAlias });
      } else {
        emit('join-lobby', { alias });
      }
      s.setLoadingText(`Conectado como ${s.myAlias}`);
    });

    socket.on('connect_error', () => {
      getStore().setError('No se pudo conectar al servidor.');
      getStore().setScreen('rooms');
    });

    socket.on('disconnect', (reason: string) => {
      // El servidor cerró la conexión activamente (token inválido, etc.)
      if (reason === 'io server disconnect') {
        getStore().setError('Conexión cerrada por el servidor. Intentá recargar la página.');
        getStore().setScreen('rooms');
      }
      // Para desconexiones de red, socket.io reconecta automáticamente
    });

    // ── Lobby browser events ──

    socket.on('rooms-list', ({ rooms }) => {
      getStore().setRooms(rooms);
      // Solo ir a la pantalla de salas si el usuario no está ya en una sala
      if (!getStore().roomCode) {
        getStore().setScreen('rooms');
      }
    });

    socket.on('lobby-joined', ({ alias: a }: { alias: string }) => {
      getStore().setAlias(a);
    });

    socket.on('lobby-update', ({ users }) => {
      getStore().setOnlineUsers(users);
    });

    socket.on('lobby-chat', ({ alias: a, text }: { alias: string; text: string }) => {
      getStore().addLobbyChat({ alias: a, text, system: false });
    });

    // ── Room events ──

    socket.on('room-created', (d: {
      roomCode: string; roomName: string; alias: string;
      trucoConfig?: import('../types/game.types').TrucoConfig | null;
    }) => {
      const s = getStore();
      s.setError(null);
      s.setAlias(d.alias);
      s.setRoomInfo(d.roomCode, d.roomName);
      s.setIsHost(true);
      s.setRoomTrucoConfig(d.trucoConfig ?? null);
      s.setScreen('lobby');
      // Only load quizzes for non-Truco rooms
      if (!d.trucoConfig) emit('get-quizzes');
    });

    socket.on('joined', (d: {
      roomCode: string; roomName: string; alias: string;
      isHost: boolean; selectedInstanceId?: string; selectedTitle?: string; gameType?: string;
      trucoConfig?: import('../types/game.types').TrucoConfig | null;
    }) => {
      const s = getStore();
      s.setError(null);
      s.setAlias(d.alias);
      s.setRoomInfo(d.roomCode, d.roomName);
      s.setIsHost(d.isHost);
      s.setRoomTrucoConfig(d.trucoConfig ?? null);
      if (d.selectedInstanceId && d.selectedTitle) {
        s.setSelectedGame(d.selectedInstanceId, d.selectedTitle, (d.gameType ?? 'quiz') as GameType);
      }
      s.setScreen('lobby');
      // Only load quizzes for non-Truco rooms
      if (!d.trucoConfig) emit('get-quizzes');
    });

    socket.on('room-update', (d: { players: PlayerInfo[]; hostAlias: string; gameType?: string }) => {
      const s = getStore();
      s.setPlayers(d.players, d.hostAlias);
      s.setIsHost(d.hostAlias === s.myAlias);
      if (d.gameType) s.setSelectedGame(
        s.selectedInstanceId ?? '',
        s.selectedGameTitle,
        d.gameType as GameType,
      );
    });

    socket.on('quizzes-list', ({ quizzes }) => {
      getStore().setAvailableGames(quizzes);
    });

    socket.on('game-picked', (d: { instanceId: string; title: string; gameType: string }) => {
      getStore().setSelectedGame(d.instanceId, d.title, d.gameType as GameType);
    });

    socket.on('chat', (d: { alias: string; text: string; system?: boolean }) => {
      getStore().addRoomChat(d);
    });

    socket.on('reaction', (d: { alias: string; emoji: string }) => {
      const id = Date.now();
      getStore().setFloatReaction({ ...d, id });
      setTimeout(() => getStore().setFloatReaction(null), 2500);
    });

    socket.on('room-restarted', (d: { roomCode: string; roomName: string }) => {
      audio.stop();
      getStore().resetGame();
      getStore().setRoomInfo(d.roomCode, d.roomName);
      getStore().setScreen('lobby');
      emit('get-quizzes');
    });

    socket.on('error', (d: { message: string }) => {
      getStore().setError(d.message ?? 'Error desconocido.');
      // Only kick back to rooms if we're stuck in a pre-game connection state.
      // Never kick during active gameplay — errors can be valid feedback (invalid move, etc.)
      const s = getStore();
      const gameScreens = ['quiz', 'wordsearch', 'anagram', 'preguntados', 'truco', 'round-end', 'scoreboard'];
      const isInGame = gameScreens.includes(s.currentScreen);
      if (!isInGame && s.roomCode && s.currentScreen !== 'lobby') {
        s.resetRoom();
        s.setScreen('rooms');
      }
    });

    socket.on('kicked', (d: { message?: string }) => {
      audio.stop();
      alert(d.message ?? 'Fuiste expulsado de la sala.');
      getStore().resetRoom();
      getStore().resetGame();
      getStore().setScreen('rooms');
    });

    socket.on('reconnected', (d: { alias: string; score: number; isHost: boolean; roomCode: string; roomName?: string; gameType: string }) => {
      const s = getStore();
      s.setAlias(d.alias);
      s.setIsHost(d.isHost);
      s.setRoomInfo(d.roomCode, d.roomName ?? s.roomName);
      // Restore score and navigate to the correct game screen
      const type = d.gameType as GameType;
      if (type === 'quiz') {
        s.setQuiz({ myScore: d.score });
        s.setScreen('quiz');
      } else if (type === 'wordsearch') {
        s.setWordSearch({ myScore: d.score });
        s.setScreen('wordsearch');
      } else if (type === 'anagram') {
        s.setAnagram({ myScore: d.score });
        s.setScreen('anagram');
      } else if (type === 'preguntados') {
        s.setScreen('preguntados');
      } else {
        s.setScreen('waiting');
      }
      s.setError('🔄 Reconectado a la partida en curso.');
    });

    // ── Quiz game events ──

    socket.on('game-started', (d: { gameType: string; totalQuestions?: number; gameData?: unknown; timeLimitMs?: number; players?: PlayerInfo[]; turnAlias?: string }) => {
      getStore().resetGame();
      const type = d.gameType as GameType;

      if (type === 'quiz') {
        getStore().setQuiz({ totalQuestions: d.totalQuestions ?? 0, myScore: 0 });
        startCountdown(() => getStore().setScreen('quiz'));
        audio.start();
      } else if (type === 'wordsearch') {
        const gd = d.gameData as { words: string[]; grid: string[][]; placed: { word: string; cells: { r: number; c: number }[] }[]; gridSize: number };
        getStore().setWordSearch({
          words: gd.words ?? [],
          grid: gd.grid ?? [],
          placed: gd.placed ?? [],
          foundWords: {},
          timeLimitMs: d.timeLimitMs ?? 120000,
          myScore: 0,
          scoreboard: [],
          gridSize: gd.gridSize ?? 10,
        });
        startCountdown(() => getStore().setScreen('wordsearch'));
        audio.start();
      } else if (type === 'anagram') {
        const gd = d.gameData as { word: string; hint?: string };
        const word = (gd.word ?? '').toUpperCase();
        const scrambled = shuffleArray(word.split(''));
        getStore().setAnagram({
          word,
          hint: gd.hint ?? '',
          scrambled,
          placed: Array(word.length).fill(null),
          tileToSlot: {},
          slotToTile: {},
          solved: false,
          timeLimitMs: d.timeLimitMs ?? 45000,
          myScore: 0,
        });
        startCountdown(() => getStore().setScreen('anagram'));
        audio.start();
      } else if (type === 'preguntados') {
        const gd = d.gameData as { categories: { name: string; icon: string; color: string }[]; rounds: number };
        const playerOrder = d.players ?? [];
        const wedgesWon: Record<string, number[]> = {};
        playerOrder.forEach((p) => { wedgesWon[p.alias] = []; });
        getStore().setPreguntados({
          categories: gd.categories ?? [],
          totalRounds: gd.rounds ?? 6,
          currentRound: 1,
          isMyTurn: d.turnAlias === getStore().myAlias,
          currentTurnAlias: d.turnAlias ?? '',
          playerOrder,
          wedgesWon,
          scoreboard: playerOrder.map((p, i) => ({ alias: p.alias, score: 0, rank: i + 1 })),
          panel: 'wheel',
          currentCategoryIdx: -1,
          currentQuestion: null,
          categoryInfo: null,
          awaitingResult: false,
        });
        startCountdown(() => {
          getStore().setScreen('preguntados');
          audio.startPq();
        });
      } else if (type === 'truco') {
        // State will arrive via truco-state event
        startCountdown(() => getStore().setScreen('truco'));
      }
    });

    // ── Truco events ──────────────────────────────────────────────────────────

    socket.on('truco-state', (view: import('../types/game.types').TrucoPlayerView) => {
      getStore().setTruco(view);
      // If game over, show scoreboard
      if (view.phase === 'game_over') {
        const isA = view.myTeam === 'A';
        const winnerScore = Math.max(view.teamAScore, view.teamBScore);
        const winnerTeam = view.teamAScore >= view.teamBScore ? 'A' : 'B';
        const sb = [
          ...view.teamAMembers.map((m) => ({
            alias: m.alias,
            score: view.teamAScore,
            rank: winnerTeam === 'A' ? 1 : 2,
          })),
          ...view.teamBMembers.map((m) => ({
            alias: m.alias,
            score: view.teamBScore,
            rank: winnerTeam === 'B' ? 1 : 2,
          })),
        ].sort((a, b) => a.rank - b.rank);
        getStore().setFinalScoreboard(sb);
        setTimeout(() => getStore().setScreen('scoreboard'), 3000);
      }
    });

    socket.on('question', (d: { index: number; total: number; question: { text: string; options: { id: string; text: string }[]; time_limit_ms?: number }; timeLimitMs: number }) => {
      getStore().setQuiz({
        currentQuestion: d.question,
        currentIndex: d.index,
        totalQuestions: d.total,
        answered: false,
        selectedOptionId: null,
        correctOptionId: null,
        timeLimitMs: d.timeLimitMs,
      });
    });

    socket.on('answer-result', (d: { correct: boolean; correctOptionId: string; score: number }) => {
      if (d.correct) audio.correct(); else audio.wrong();
      getStore().setQuiz({
        answered: true,
        correctOptionId: d.correctOptionId,
        myScore: d.score,
      });
    });

    socket.on('player-answered', (_d: { alias: string }) => {
      // UI handles this via players list
    });

    socket.on('round-end', (d: { correctOptionId: string; scoreboard: ScoreboardEntry[] }) => {
      getStore().setQuiz({ correctOptionId: d.correctOptionId, answered: true });
      getStore().setRoundScoreboard(d.scoreboard);
      setTimeout(() => getStore().setScreen('round-end'), 800);
    });

    socket.on('game-over', (d: { scoreboard: ScoreboardEntry[] }) => {
      audio.stop();
      getStore().setFinalScoreboard(d.scoreboard);
      getStore().setScreen('scoreboard');
    });

    // ── Wordsearch events ──

    socket.on('word-found', (d: { word: string; alias: string; cells: { r: number; c: number }[]; colorIndex: number; points: number; scoreboard?: ScoreboardEntry[] }) => {
      const ws = getStore().wordSearch;
      getStore().setWordSearch({
        foundWords: {
          ...ws.foundWords,
          [d.word]: { alias: d.alias, cells: d.cells, colorIndex: d.colorIndex },
        },
        scoreboard: d.scoreboard ?? ws.scoreboard,
      });
    });

    socket.on('player-finished', (d: { alias: string; score: number; scoreboard: ScoreboardEntry[] }) => {
      getStore().setWordSearch({ scoreboard: d.scoreboard });
      getStore().setAnagram({ myScore: getStore().anagram.myScore });
    });

    // ── Preguntados events ──

    socket.on('pq-spin-result', (d: { categoryIdx: number; categoryName: string; categoryColor: string; categoryIcon: string; turnAlias: string }) => {
      getStore().setPreguntados({
        currentCategoryIdx: d.categoryIdx,
        categoryInfo: { icon: d.categoryIcon, name: d.categoryName, color: d.categoryColor },
        currentTurnAlias: d.turnAlias,
        isMyTurn: d.turnAlias === getStore().myAlias,
        awaitingResult: false,
      });
      audio.spinStop();
    });

    socket.on('pq-question', (d: { question: { text: string; options: { id: string; text: string }[] }; categoryName: string; categoryColor: string; categoryIcon: string; turnAlias: string; timeLimitMs: number }) => {
      getStore().setPreguntados({
        currentQuestion: d.question,
        panel: 'question',
        categoryInfo: { icon: d.categoryIcon, name: d.categoryName, color: d.categoryColor },
        currentTurnAlias: d.turnAlias,
        isMyTurn: d.turnAlias === getStore().myAlias,
        awaitingResult: false,
      });
    });

    socket.on('pq-answer-result', (d: { correct: boolean; answered: boolean; correctOptionId: string; answererAlias: string; scoreboard: ScoreboardEntry[] }) => {
      if (d.correct) audio.correct(); else if (d.answered) audio.wrong(); else audio.timeout();
      const pq = getStore().preguntados;
      const newWedges = { ...pq.wedgesWon };
      if (d.correct && d.answererAlias && pq.currentCategoryIdx >= 0) {
        newWedges[d.answererAlias] = [...(newWedges[d.answererAlias] ?? []), pq.currentCategoryIdx];
      }
      getStore().setPreguntados({
        scoreboard: d.scoreboard,
        wedgesWon: newWedges,
        awaitingResult: true,
      });
    });

    socket.on('pq-next-turn', (d: { turnAlias: string; round: number; totalRounds: number; scoreboard: ScoreboardEntry[] }) => {
      setTimeout(() => {
        getStore().setPreguntados({
          currentTurnAlias: d.turnAlias,
          isMyTurn: d.turnAlias === getStore().myAlias,
          currentRound: d.round,
          totalRounds: d.totalRounds,
          scoreboard: d.scoreboard,
          panel: 'wheel',
          currentQuestion: null,
          awaitingResult: false,
        });
      }, 3000);
    });

    return socket;
  }, [audio, emit, getStore]);

  // ── Disconnect ────────────────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    audio.stop();
    socketRef.current?.removeAllListeners();
    socketRef.current?.disconnect();
    socketRef.current = null;
  }, [audio]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => () => { disconnect(); }, [disconnect]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const createRoom = useCallback((payload: {
    roomName: string; maxPlayers: number; password?: string;
    trucoConfig?: import('../types/game.types').TrucoConfig;
  }) => {
    const alias = getStore().myAlias;
    emit('create-room', {
      alias,
      roomName: payload.roomName,
      maxPlayers: payload.maxPlayers,
      password: payload.password,
      trucoConfig: payload.trucoConfig,
    });
  }, [emit, getStore]);

  const joinRoom = useCallback((roomCode: string, password?: string) => {
    if (!socketRef.current?.connected) {
      // Socket lost — reconnect first, then join
      connect(roomCode);
      return;
    }
    const alias = getStore().myAlias;
    emit('join-room', { roomCode: roomCode.toUpperCase(), alias, password });
  }, [connect, emit, getStore]);

  const sendLobbyChat = useCallback((text: string) => {
    emit('lobby-chat', { text });
  }, [emit]);

  const pickGame = useCallback((instanceId: string) => {
    emit('pick-game', { instanceId });
  }, [emit]);

  const startGame = useCallback(() => {
    emit('start-game');
  }, [emit]);

  const exitLobby = useCallback(() => {
    disconnect();
    getStore().resetRoom();
    getStore().resetGame();
    // reconnect to lobby browser
    connect();
  }, [disconnect, connect, getStore]);

  const kickPlayer = useCallback((alias: string) => {
    emit('kick-player', { alias });
  }, [emit]);

  const promotePlayer = useCallback((alias: string) => {
    emit('promote-player', { alias });
  }, [emit]);

  const sendChat = useCallback((text: string) => {
    emit('chat-message', { text });
  }, [emit]);

  const sendReaction = useCallback((emoji: string) => {
    emit('react', { emoji });
  }, [emit]);

  const submitAnswer = useCallback((optionId: string) => {
    getStore().setQuiz({ answered: true, selectedOptionId: optionId });
    emit('submit-answer', { optionId });
  }, [emit, getStore]);

  const findWord = useCallback((word: string, cells: { r: number; c: number }[]) => {
    emit('find-word', { word, cells });
  }, [emit]);

  const submitGameComplete = useCallback((score: number) => {
    emit('game-complete', { score });
    getStore().setScreen('waiting');
  }, [emit, getStore]);

  const spinWheel = useCallback(() => {
    audio.spinStart();
    emit('pq-spin');
  }, [audio, emit]);

  const submitPQAnswer = useCallback((optionId: string) => {
    emit('pq-answer', { optionId });
  }, [emit]);

  const restartRoom = useCallback(() => {
    emit('restart-room');
  }, [emit]);

  const getRooms = useCallback(() => {
    emit('get-rooms');
  }, [emit]);

  const getQuizzes = useCallback(() => {
    emit('get-quizzes');
  }, [emit]);

  const exitGame = useCallback(() => {
    audio.stop();
    disconnect();
    getStore().resetRoom();
    getStore().resetGame();
    connect();
  }, [audio, disconnect, connect, getStore]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendTrucoAction = useCallback((action: { type: string; [key: string]: any }) => {
    emit('truco-action', action);
  }, [emit]);

  return {
    connect,
    disconnect,
    getRooms,
    createRoom,
    joinRoom,
    sendLobbyChat,
    pickGame,
    startGame,
    exitLobby,
    exitGame,
    kickPlayer,
    promotePlayer,
    sendChat,
    sendReaction,
    sendTrucoAction,
    submitAnswer,
    findWord,
    submitGameComplete,
    getQuizzes,
    spinWheel,
    submitPQAnswer,
    restartRoom,
    optColors: OPT_COLORS,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startCountdown(onDone: () => void) {
  const store = useMinigameStore.getState();
  store.setScreen('countdown');
  let n = 3;
  const iv = setInterval(() => {
    n--;
    if (n <= 0) { clearInterval(iv); onDone(); }
  }, 1000);
}
