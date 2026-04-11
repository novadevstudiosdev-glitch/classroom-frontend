export type GameType = 'quiz' | 'wordsearch' | 'anagram' | 'preguntados' | 'truco';

export interface PlayerInfo {
  alias: string;
  score: number;
  rank?: number;
  correct?: number;
  answered?: boolean;
  finished?: boolean;
}

export type TableTheme = 'green' | 'wood' | 'plastic' | 'night';
export type TrucoGameMode = '1v1' | '2v2' | '3v3';

export interface TrucoConfig {
  mode: TrucoGameMode;
  maxPoints: 15 | 30;
  florEnabled: boolean;
  contraFlorEnabled: boolean;
  tableTheme: TableTheme;
}

export interface TrucoCard {
  suit: 'espadas' | 'bastos' | 'copas' | 'oros';
  value: number;
}

export interface TrucoEnvidoCall {
  alias: string;
  type: string;
}

export interface TrucoTrucoCall {
  alias: string;
  type: string;
}

export interface TrucoEnvidoResult {
  winnerTeam: 'A' | 'B';
  pts: number;
  /** Alias of the player with the best envido (winner representative) */
  winnerAlias?: string;
  reveals: { socketId: string; alias: string; value: number; cards?: TrucoCard[] }[];
  pendingShow: string[];
}

export interface TrucoHandEndResult {
  trucoWinnerTeam: 'A' | 'B' | null;
  mazoTeam: 'A' | 'B' | null;
  envPts: { A: number; B: number };
  trucoPts: { A: number; B: number };
  allCards: Record<string, TrucoCard[]>;
  newTeamAScore: number;
  newTeamBScore: number;
}

export interface TrucoPlayerView {
  config: TrucoConfig;
  teamAScore: number;
  teamBScore: number;
  teamAMembers: { socketId: string; alias: string }[];
  teamBMembers: { socketId: string; alias: string }[];
  myTeam: 'A' | 'B';
  phase: 'playing' | 'show_envido' | 'show_envido_points' | 'hand_end' | 'game_over';
  handNum: number;
  dealerAlias: string;
  manoAlias: string;
  currentTurnAlias: string;
  round: number;
  roundWinners: ('A' | 'B' | 'tie')[];
  lastPlayedCards: Record<string, TrucoCard>;
  currentRoundCards: Record<string, TrucoCard | null>;
  playedCardsHistory: { alias: string; round: number; card: TrucoCard }[];
  envidoStatus: 'available' | 'pending' | 'resolved' | 'expired';
  envidoChain: TrucoEnvidoCall[];
  envidoResponderTeam: 'A' | 'B' | null;
  envidoResult: TrucoEnvidoResult | null;
  envidoLastResponse: { alias: string; response: 'quiero' | 'noquiero' | 'sonbuenas' | 'decirpuntos' | string } | null;
  pendingShowEnvido: string[];
  myEnvidoValue: number;
  florStatus: 'none' | 'pending' | 'resolved';
  florMustDeclare: boolean;
  florDeclaredAliases: string[];
  florResponderTeam: 'A' | 'B' | null;
  trucoStatus: 'available' | 'pending' | 'resolved';
  trucoChain: TrucoTrucoCall[];
  trucoResponderTeam: 'A' | 'B' | null;
  trucoPtsIfWon: number;
  trucoAccepted: boolean;
  trucoLastResponse: { alias: string; response: 'quiero' | 'noquiero' | string } | null;
  mazoTeam: 'A' | 'B' | null;
  myHand: TrucoCard[];
  opponentCardCounts: Record<string, number>;
  allPlayerCardCounts: Record<string, number>;
  handEndResult: TrucoHandEndResult | null;
}

export interface RoomInfo {
  roomCode: string;
  roomName: string;
  hostAlias: string;
  playerCount: number;
  maxPlayers: number;
  locked: boolean;
  gameType?: GameType;
  trucoConfig?: TrucoConfig | null;
}

export interface GameInstance {
  id: string;
  title: string;
  type: GameType;
  questionCount?: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export type QuizQuestionType = 'mcq' | 'true_false' | 'fill_blank' | 'match' | 'order';

export interface QuizQuestionBase {
  type?: QuizQuestionType;
  text: string;
  image_url?: string;
  time_limit_ms?: number;
}

export interface QuizQuestionMCQ extends QuizQuestionBase {
  type?: 'mcq';
  options: QuizOption[];
}

export interface QuizQuestionTrueFalse extends QuizQuestionBase {
  type: 'true_false';
  options: QuizOption[];
}

export interface QuizQuestionFillBlank extends QuizQuestionBase {
  type: 'fill_blank';
  placeholder?: string;
}

export interface QuizQuestionOrder extends QuizQuestionBase {
  type: 'order';
  items: string[];
}

export interface QuizQuestionMatch extends QuizQuestionBase {
  type: 'match';
  left: string[];
  right: string[];
}

export type QuizQuestion =
  | QuizQuestionMCQ
  | QuizQuestionTrueFalse
  | QuizQuestionFillBlank
  | QuizQuestionOrder
  | QuizQuestionMatch;

export interface ScoreboardEntry {
  alias: string;
  score: number;
  rank: number;
  correct?: number;
}

export interface WordCell {
  r: number;
  c: number;
}

export interface WSGameData {
  words: string[];
  grid?: string[][];
  placed?: { word: string; cells: WordCell[] }[];
  gridSize?: number;
}

export interface AnagramGameData {
  word?: string;
  words?: string[];
  hint?: string;
}

export interface PQCategory {
  name: string;
  icon: string;
  color: string;
}

export interface PQGameData {
  categories: PQCategory[];
  rounds: number;
}

export interface ChatMessage {
  alias: string;
  text: string;
  system?: boolean;
}

// Quiz builder
export interface QBQuestion {
  text: string;
  options: [string, string, string, string];
  correct: number; // 0-3
  pointsCorrect?: number;
  timeLimitMs?: number;
}
