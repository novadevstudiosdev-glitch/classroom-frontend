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
