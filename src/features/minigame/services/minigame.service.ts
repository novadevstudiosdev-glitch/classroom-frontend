import { axiosClient } from '@/lib/axios/axios-client';

export type AIGameType = 'quiz' | 'wordsearch' | 'anagram';

export interface GenerateAIParams {
  topic: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  gameType: AIGameType;
  language?: string;
}

// Raw shapes the backend returns from /generate-ai
export interface AIOption { id: string; text: string; }

export type QuizQuestionType = 'mcq' | 'true_false' | 'fill_blank' | 'match' | 'order';

export interface AIQuestion {
  /** Optional for user-edited questions */
  type?: QuizQuestionType;
  text: string;
  // MCQ / True-False
  options?: AIOption[];
  correct_option_id?: string;
  // True-False (alternative shape)
  correct?: boolean;
  // Fill blank
  answer?: string;
  // Order
  items?: string[];
  // Match columns
  pairs?: { left: string; right: string }[];
  points_correct?: number;
  time_limit_ms?: number;
}

export interface AIQuizResponse {
  type: 'quiz';
  title: string;
  questions: AIQuestion[];
}

export interface AIWordsearchResponse {
  type: 'wordsearch' | 'anagram';
  title: string;
  words: string[];
  grid_size?: number;
}

export type AIGenerateResponse = AIQuizResponse | AIWordsearchResponse;

export const minigameService = {
  generateAI: (params: GenerateAIParams) =>
    axiosClient.post<AIGenerateResponse>('/minigame-instances/generate-ai', {
      type: params.gameType,
      topic: params.topic,
      count: params.questionCount,
      language: params.language,
    }),

  // content_json is the full object returned by generateAI (possibly edited)
  saveGeneratedGame: (body: { title: string; topic: string; content_json: Record<string, any> }) =>
    axiosClient.post('/minigame-instances/generate-ai/save', body),

  deleteGame: (id: string) =>
    axiosClient.delete(`/minigame-instances/${id}/force`),
};
