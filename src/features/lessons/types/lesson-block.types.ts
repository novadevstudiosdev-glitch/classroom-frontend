
export type LessonBlockType =
  | "paragraph"
  | "question"
  | "multiple_choice"
  | "fill_blank"
  | "true_false"
  | "match_columns"
  | "order_elements";

export interface LessonParagraphBlock {
  id: string;
  type:"paragraph";
  text: string;
}

export interface LessonImageBlock {
  id: string;
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

export interface LessonMinigameBlock {
  id: string;
  type: "minigame";
  title: string;
  description: string;
  ctaLabel?: string;
}

export interface LessonQuestionOption {
  id: string;
  letter: string;
  text: string;
}

export interface LessonOptionalMedia {
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
}

export interface LessonQuestionBlock extends LessonOptionalMedia {
  id: string;
  type: "question" | "multiple_choice";
  prompt: string;
  rewardXp?: number;
  options: LessonQuestionOption[];
  correctOptionId: string;
  explanation?: string;
}

export interface FillBlankField {
  id: string;
  mode: "text" | "dropdown";
  answer: string;
  placeholder?: string;
  options?: string[];
}

export interface FillBlankBlock extends LessonOptionalMedia {
  id: string;
  type: "fill_blank";
  prompt: string;
  explanation?: string;
  fields: FillBlankField[];
}

export interface TrueFalseBlock extends LessonOptionalMedia {
  id: string;
  type: "true_false";
  prompt: string;
  explanation?: string;
  correctValue: boolean;
}

export interface MatchItem {
  id: string;
  label: string;
}

export interface MatchPair {
  leftId: string;
  rightId: string;
}

export interface MatchColumnsBlock extends LessonOptionalMedia {
  id: string;
  type: "match_columns";
  prompt: string;
  explanation?: string;
  leftItems: MatchItem[];
  rightItems: MatchItem[];
  correctPairs: MatchPair[];
}

export interface OrderElementsBlock extends LessonOptionalMedia {
  id: string;
  type: "order_elements";
  prompt: string;
  explanation?: string;
  items: string[];
}
export type LessonBlock =
  | LessonParagraphBlock
  | LessonImageBlock
  | LessonMinigameBlock
  | LessonQuestionBlock
  | FillBlankBlock
  | TrueFalseBlock
  | MatchColumnsBlock
  | OrderElementsBlock;

export interface LessonContentJson {
  blocks: LessonBlock[];
}
