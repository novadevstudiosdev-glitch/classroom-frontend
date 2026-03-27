
import type { Lesson } from "./lesson.types";

export interface AssignedLessonViewProps {
  lessonId: string;
}

export interface AssignLessonRequest {
  classroom_id: string;
  due_date?: string;
}

export interface AssignLessonResponse {
  id: string;
  lesson_id: string;
  classroom_id: string;
  due_date?: string;
}

export interface AssignedLessonHeaderProps {
  currentIndex: number;
  totalBlocks: number;
  hearts?: number;
}

export interface AssignedLessonSummaryProps {
  lesson: Lesson;
}

export interface AssignedLessonBlocksProps {
  lesson: Lesson;
  activeBlockIndex: number;
  totalBlocks: number;
  onContinue?: () => void;
}

export interface LessonBlockNavigationProps {
  currentIndex: number;
  totalBlocks: number;
  onNext: () => void;
}
