export type GameType = 'quiz' | 'wordsearch' | 'anagram' | 'preguntados';

export interface PlayerInfo {
  alias: string;
  score: number;
  rank?: number;
  correct?: number;
  answered?: boolean;
  finished?: boolean;
}

export interface RoomInfo {
  roomCode: string;
  roomName: string;
  hostAlias: string;
  playerCount: number;
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

export interface QuizQuestion {
  text: string;
  options: QuizOption[];
  image_url?: string;
  time_limit_ms?: number;
}

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
  word: string;
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
