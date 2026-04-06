import { create } from 'zustand';
import type { MinigameStore, QuizState, WordSearchState, AnagramState, PreguntadosState } from '../types/store.types';
import type { GameInstance, GameType, PlayerInfo, RoomInfo, ScoreboardEntry, ChatMessage, TrucoPlayerView, TrucoConfig } from '../types/game.types';

const defaultQuiz: QuizState = {
  currentQuestion: null,
  currentIndex: 0,
  totalQuestions: 0,
  answered: false,
  selectedOptionId: null,
  correctOptionId: null,
  timeLimitMs: 20000,
  myScore: 0,
};

const defaultWordSearch: WordSearchState = {
  grid: [],
  words: [],
  placed: [],
  foundWords: {},
  timeLimitMs: 120000,
  myScore: 0,
  scoreboard: [],
  gridSize: 10,
};

const defaultAnagram: AnagramState = {
  word: '',
  hint: '',
  scrambled: [],
  placed: [],
  tileToSlot: {},
  slotToTile: {},
  solved: false,
  timeLimitMs: 45000,
  myScore: 0,
};

const defaultPreguntados: PreguntadosState = {
  categories: [],
  totalRounds: 6,
  currentRound: 1,
  isMyTurn: false,
  currentTurnAlias: '',
  currentCategoryIdx: -1,
  playerOrder: [],
  wedgesWon: {},
  currentQuestion: null,
  categoryInfo: null,
  panel: 'wheel',
  scoreboard: [],
  awaitingResult: false,
};

export const useMinigameStore = create<MinigameStore>((set) => ({
  // ── Identity ──
  myAlias: '',
  isHost: false,

  // ── Screen ──
  currentScreen: 'loading',

  // ── Room browser ──
  rooms: [],
  onlineUsers: [],
  lobbyChat: [],

  // ── Room ──
  roomCode: '',
  roomName: '',
  players: [],
  hostAlias: '',
  roomChat: [],
  roomTrucoConfig: null,

  // ── Game selection ──
  availableGames: [],
  selectedInstanceId: null,
  selectedGameTitle: '',
  currentGameType: 'quiz',
  gameTypeFilter: 'all',

  // ── Games ──
  quiz: defaultQuiz,
  wordSearch: defaultWordSearch,
  anagram: defaultAnagram,
  preguntados: defaultPreguntados,
  truco: null,

  // ── Shared ──
  roundScoreboard: [],
  finalScoreboard: [],
  floatReaction: null,

  // ── UI ──
  error: null,
  loadingText: 'Conectando...',
  volume: 70,

  // ── Actions ──
  setScreen: (screen) => set({ currentScreen: screen }),
  setAlias: (alias) => set({ myAlias: alias }),
  setIsHost: (v) => set({ isHost: v }),
  setRoomInfo: (roomCode, roomName) => set({ roomCode, roomName }),

  setPlayers: (players: PlayerInfo[], hostAlias: string) =>
    set({ players, hostAlias }),

  setRooms: (rooms: RoomInfo[]) => set({ rooms }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addLobbyChat: (msg: ChatMessage) =>
    set((s) => ({ lobbyChat: [...s.lobbyChat.slice(-99), msg] })),

  addRoomChat: (msg: ChatMessage) =>
    set((s) => ({ roomChat: [...s.roomChat.slice(-99), msg] })),

  setAvailableGames: (games: GameInstance[]) => set({ availableGames: games }),

  setSelectedGame: (instanceId: string, title: string, gameType: GameType) =>
    set({ selectedInstanceId: instanceId, selectedGameTitle: title, currentGameType: gameType }),

  setGameTypeFilter: (filter) => set({ gameTypeFilter: filter }),

  setQuiz: (partial) =>
    set((s) => ({ quiz: { ...s.quiz, ...partial } })),

  setWordSearch: (partial) =>
    set((s) => ({ wordSearch: { ...s.wordSearch, ...partial } })),

  setAnagram: (partial) =>
    set((s) => ({ anagram: { ...s.anagram, ...partial } })),

  setPreguntados: (partial) =>
    set((s) => ({ preguntados: { ...s.preguntados, ...partial } })),

  setRoomTrucoConfig: (config: TrucoConfig | null) => set({ roomTrucoConfig: config }),
  setTruco: (view: TrucoPlayerView | null) => set({ truco: view }),

  setRoundScoreboard: (sb: ScoreboardEntry[]) => set({ roundScoreboard: sb }),
  setFinalScoreboard: (sb: ScoreboardEntry[]) => set({ finalScoreboard: sb }),

  setFloatReaction: (r) => set({ floatReaction: r }),
  setError: (error) => set({ error }),
  setLoadingText: (loadingText) => set({ loadingText }),
  setVolume: (volume) => set({ volume }),

  resetRoom: () =>
    set({
      roomCode: '',
      roomName: '',
      players: [],
      hostAlias: '',
      roomChat: [],
      roomTrucoConfig: null,
      selectedInstanceId: null,
      selectedGameTitle: '',
      currentGameType: 'quiz',
      gameTypeFilter: 'all',
      availableGames: [],
      isHost: false,
    }),

  resetGame: () =>
    set({
      quiz: defaultQuiz,
      wordSearch: defaultWordSearch,
      anagram: defaultAnagram,
      preguntados: defaultPreguntados,
      truco: null,
      roundScoreboard: [],
      finalScoreboard: [],
    }),
}));
