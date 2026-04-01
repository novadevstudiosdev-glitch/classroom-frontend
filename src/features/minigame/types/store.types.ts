import type {
  GameType, PlayerInfo, RoomInfo, GameInstance,
  QuizQuestion, ScoreboardEntry, PQCategory,
  ChatMessage, WordCell,
} from './game.types';

export type MinigameScreen =
  | 'loading'
  | 'rooms'
  | 'lobby'
  | 'countdown'
  | 'quiz'
  | 'wordsearch'
  | 'anagram'
  | 'preguntados'
  | 'waiting'
  | 'round-end'
  | 'scoreboard';

// ── Partial game states ────────────────────────────────────────────────────

export interface QuizState {
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  totalQuestions: number;
  answered: boolean;
  selectedOptionId: string | null;
  correctOptionId: string | null;
  timeLimitMs: number;
  myScore: number;
}

export interface WordSearchState {
  grid: string[][];
  words: string[];
  placed: { word: string; cells: WordCell[] }[];
  foundWords: Record<string, { alias: string; cells: WordCell[]; colorIndex: number }>;
  timeLimitMs: number;
  myScore: number;
  scoreboard: ScoreboardEntry[];
  gridSize: number;
}

export interface AnagramState {
  word: string;
  hint: string;
  scrambled: string[];
  placed: (string | null)[];
  tileToSlot: Record<number, number>;
  slotToTile: Record<number, number>;
  solved: boolean;
  timeLimitMs: number;
  myScore: number;
}

export interface PreguntadosState {
  categories: PQCategory[];
  totalRounds: number;
  currentRound: number;
  isMyTurn: boolean;
  currentTurnAlias: string;
  currentCategoryIdx: number;
  playerOrder: PlayerInfo[];
  wedgesWon: Record<string, number[]>; // alias -> categoryIdx[]
  currentQuestion: QuizQuestion | null;
  categoryInfo: { icon: string; name: string; color: string } | null;
  panel: 'wheel' | 'question';
  scoreboard: ScoreboardEntry[];
  awaitingResult: boolean;
}

// ── Main store ─────────────────────────────────────────────────────────────

export interface MinigameStore {
  // ── Identity ──
  myAlias: string;
  isHost: boolean;

  // ── Screen ──
  currentScreen: MinigameScreen;

  // ── Room browser ──
  rooms: RoomInfo[];
  onlineUsers: { alias: string }[];
  lobbyChat: ChatMessage[];

  // ── Room ──
  roomCode: string;
  roomName: string;
  players: PlayerInfo[];
  hostAlias: string;
  roomChat: ChatMessage[];

  // ── Game selection ──
  availableGames: GameInstance[];
  selectedInstanceId: string | null;
  selectedGameTitle: string;
  currentGameType: GameType;
  gameTypeFilter: GameType | 'all';

  // ── Games ──
  quiz: QuizState;
  wordSearch: WordSearchState;
  anagram: AnagramState;
  preguntados: PreguntadosState;

  // ── Shared ──
  roundScoreboard: ScoreboardEntry[];
  finalScoreboard: ScoreboardEntry[];
  floatReaction: { emoji: string; alias: string; id: number } | null;

  // ── UI ──
  error: string | null;
  loadingText: string;
  volume: number;

  // ── Actions ──
  setScreen: (screen: MinigameScreen) => void;
  setAlias: (alias: string) => void;
  setIsHost: (v: boolean) => void;
  setRoomInfo: (roomCode: string, roomName: string) => void;
  setPlayers: (players: PlayerInfo[], hostAlias: string) => void;
  setRooms: (rooms: RoomInfo[]) => void;
  setOnlineUsers: (users: { alias: string }[]) => void;
  addLobbyChat: (msg: ChatMessage) => void;
  addRoomChat: (msg: ChatMessage) => void;
  setAvailableGames: (games: GameInstance[]) => void;
  setSelectedGame: (instanceId: string, title: string, gameType: GameType) => void;
  setGameTypeFilter: (filter: GameType | 'all') => void;
  setQuiz: (partial: Partial<QuizState>) => void;
  setWordSearch: (partial: Partial<WordSearchState>) => void;
  setAnagram: (partial: Partial<AnagramState>) => void;
  setPreguntados: (partial: Partial<PreguntadosState>) => void;
  setRoundScoreboard: (sb: ScoreboardEntry[]) => void;
  setFinalScoreboard: (sb: ScoreboardEntry[]) => void;
  setFloatReaction: (r: { emoji: string; alias: string; id: number } | null) => void;
  setError: (error: string | null) => void;
  setLoadingText: (text: string) => void;
  setVolume: (v: number) => void;
  resetRoom: () => void;
  resetGame: () => void;
}
