import type { LessonBlock } from "./lesson-block.types";

export interface ActiveLessonBlockRendererProps {
  block: LessonBlock;
  onContinue?: () => void;
}

export interface ActiveLessonNavigationProps {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}
