import type {
  FillBlankBlock,
  LessonQuestionBlock,
  MatchColumnsBlock,
  OrderElementsBlock,
  TrueFalseBlock,
} from "./lesson-block.types";

export type SolverFeedbackState = "idle" | "correct" | "incorrect";

export interface MultipleChoiceProps {
  block: LessonQuestionBlock;
  onContinue?: () => void;
}

export interface FillBlankProps {
  block: FillBlankBlock;
  onContinue?: () => void;
}

export interface TrueFalseProps {
  block: TrueFalseBlock;
  onContinue?: () => void;
}

export interface MatchColumnsProps {
  block: MatchColumnsBlock;
  onContinue?: () => void;
}

export interface OrderElementsProps {
  block: OrderElementsBlock;
  onContinue?: () => void;
}
