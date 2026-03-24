
export type LessonBlockType = "paragraph" | "question";

export interface LessonParagraphBlock {
  id: string;
  type:"paragraph";
  text: string;
}

export interface LessonQuestionOption {
  id: string;
  letter: string;
  text: string;
}

export interface LessonQuestionBlock {
  id: string;
  type: "question";
  prompt: string;
  options: LessonQuestionOption[];
  correctOptionId: string;
  explanation?: string;
}

export type LessonBlock = LessonParagraphBlock | LessonQuestionBlock;

export interface LessonContentJson {
  blocks: LessonBlock[];
}