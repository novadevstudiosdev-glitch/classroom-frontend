import type {
  ActiveLessonBlockRendererProps,
  FillBlankBlock,
  LessonImageBlock,
  LessonMinigameBlock,
  LessonParagraphBlock,
  LessonQuestionBlock,
  MatchColumnsBlock,
  OrderElementsBlock,
  TrueFalseBlock,
} from "@/features/lessons/types";
import {
  FillBlank,
  MatchColumns,
  MultipleChoice,
  OrderElements,
  TrueFalse,
} from "@/features/lessons/components/solver";
import ActiveLessonImageBlock from "./ActiveLessonImageBlock";
import ActiveLessonMinigameBlock from "./ActiveLessonMinigameBlock";
import ActiveLessonTextBlock from "./ActiveLessonTextBlock";

const ActiveLessonBlockRenderer = ({ block, onContinue }: ActiveLessonBlockRendererProps) => {
  // Comentario corto: este switch es el "centro" de render.
  // Cuando backend agregue nuevos tipos de bloque, se amplía aquí.
  switch (block.type) {
    case "paragraph":
      return <ActiveLessonTextBlock block={block as LessonParagraphBlock} onContinue={onContinue} />;

    case "image":
      return <ActiveLessonImageBlock block={block as LessonImageBlock} />;

    case "minigame":
      return <ActiveLessonMinigameBlock block={block as LessonMinigameBlock} onContinue={onContinue} />;

    case "question":
    case "multiple_choice":
      return <MultipleChoice block={block as LessonQuestionBlock} onContinue={onContinue} />;

    case "fill_blank":
      return <FillBlank block={block as FillBlankBlock} onContinue={onContinue} />;

    case "true_false":
      return <TrueFalse block={block as TrueFalseBlock} onContinue={onContinue} />;

    case "match_columns":
      return <MatchColumns block={block as MatchColumnsBlock} onContinue={onContinue} />;

    case "order_elements":
      return <OrderElements block={block as OrderElementsBlock} onContinue={onContinue} />;

    default:
      console.log("[ActiveLessonBlockRenderer] tipo de bloque no soportado", block);
      return (
        <div className="rounded-2xl border border-yellow-300 bg-yellow-100 p-4 text-sm text-yellow-900">
          Tipo de bloque no soportado todavía.
        </div>
      );
  }
};

export default ActiveLessonBlockRenderer;
