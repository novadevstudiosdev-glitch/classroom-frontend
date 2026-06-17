export interface SessionResultData {
  lessonId: string;
  lessonTitle: string;
  earnedXp: number;
  stars: 1 | 2 | 3;
  correctAnswers: number;
  totalExercises: number;
  levelBefore: number;
  levelAfter: number;
  didLevelUp: boolean;
}

export interface CompleteLessonSessionInput {
  lessonId: string;
  lessonTitle: string;
  correctAnswers: number;
  totalExercises: number;
}

export interface CompleteLessonSessionRequest {
  score_pct: number;
}

export interface CompleteLessonSessionResponse {
  lesson_id?: string;
  lesson_title?: string;
  earned_xp: number;
  stars: 1 | 2 | 3;
  level_before: number;
  level_after: number;
}

export interface LessonSessionResultViewProps {
  lessonId: string;
  searchParams?: {
    xp?: string;
    stars?: string;
    correct?: string;
    total?: string;
    levelBefore?: string;
    levelAfter?: string;
    lessonTitle?: string;
  };
}

export interface SessionResultHeaderProps {
  lessonTitle: string;
}

export interface SessionResultXpCounterProps {
  earnedXp: number;
}

export interface SessionResultStarsProps {
  stars: 1 | 2 | 3;
}

export interface SessionResultLevelUpProps {
  didLevelUp: boolean;
  levelBefore: number;
  levelAfter: number;
}

export interface SessionResultActionsProps {
  backHref: string;
  backLabel?: string;
}
