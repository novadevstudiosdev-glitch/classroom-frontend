import { axiosClient } from '@/lib/axios/axios-client';

export interface CorrectionResult {
  is_correct: boolean;
  feedback: string;
  correct_answer: Record<string, any>;
  detail?: Record<string, any>;
}

export interface MultipleChoiceAnswer {
  selected_index: number;
}

export interface FillBlankAnswer {
  answers: string[];
}

export interface TrueFalseAnswer {
  answer: boolean;
}

export interface MatchColumnsAnswer {
  pairs: Array<{ left_index: number; right_index: number }>;
}

export interface OrderItemsAnswer {
  order: number[];
}

export type ExerciseAnswer = MultipleChoiceAnswer | FillBlankAnswer | TrueFalseAnswer | MatchColumnsAnswer | OrderItemsAnswer;

export const answerExercise = async (exerciseId: string, answer: ExerciseAnswer): Promise<CorrectionResult> => {
  try {
    const { data } = await axiosClient.post(`/exercises/${exerciseId}/answer`, {
      answer,
    });

    const result: CorrectionResult = data;

    console.log(`[answerExercise] Ejercicio ${exerciseId} respondido:`, result);

    return result;
  } catch (error: unknown) {
    const err = error as any;
    console.error(`[answerExercise] Error al responder ejercicio:`, error);
    throw err;
  }
};
