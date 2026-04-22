import { useMemo, useState } from "react";
import { EXERCISE_BUILDER_DRAFT_MOCK } from "@/features/exercise-builder/data";
import type {
  ExerciseBuilderBase,
  ExerciseBuilderDraft,
  ExerciseType,
} from "@/features/exercise-builder/types";

const buildDefaultOption = (index: number) => ({
  id: `opt-${crypto.randomUUID()}`,
  text: `Opción ${index + 1}`,
});

const countBlankMarkers = (template: string) => {
  return (template.match(/\[___\]/g) ?? []).length;
};

export const useExerciseBuilder = () => {
  const [draft, setDraft] = useState<ExerciseBuilderDraft>(EXERCISE_BUILDER_DRAFT_MOCK);

  const updateBase = (field: keyof ExerciseBuilderBase, value: string | number) => {
    setDraft((prev) => ({
      ...prev,
      base: {
        ...prev.base,
        [field]: value,
      },
    }));
  };

  const setType = (type: ExerciseType) => {
    setDraft((prev) => ({ ...prev, type }));
  };

  const setMultipleChoiceQuestion = (value: string) => {
    setDraft((prev) => ({
      ...prev,
      multipleChoice: { ...prev.multipleChoice, question: value },
    }));
  };

  const setMultipleChoiceOption = (optionId: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      multipleChoice: {
        ...prev.multipleChoice,
        options: prev.multipleChoice.options.map((opt) =>
          opt.id === optionId ? { ...opt, text: value } : opt,
        ),
      },
    }));
  };

  const addMultipleChoiceOption = () => {
    setDraft((prev) => ({
      ...prev,
      multipleChoice: {
        ...prev.multipleChoice,
        options: [
          ...prev.multipleChoice.options,
          buildDefaultOption(prev.multipleChoice.options.length),
        ],
      },
    }));
  };

  const removeMultipleChoiceOption = (optionId: string) => {
    setDraft((prev) => {
      const options = prev.multipleChoice.options.filter((opt) => opt.id !== optionId);
      const correctOptionId =
        prev.multipleChoice.correctOptionId === optionId
          ? null
          : prev.multipleChoice.correctOptionId;

      return {
        ...prev,
        multipleChoice: {
          ...prev.multipleChoice,
          options,
          correctOptionId,
        },
      };
    });
  };

  const markMultipleChoiceCorrect = (optionId: string) => {
    setDraft((prev) => ({
      ...prev,
      multipleChoice: { ...prev.multipleChoice, correctOptionId: optionId },
    }));
  };

  const setFillBlankTemplate = (value: string) => {
    setDraft((prev) => ({
      ...prev,
      fillBlank: { ...prev.fillBlank, template: value },
    }));
  };

  const syncFillBlankAnswersWithTemplate = (template: string) => {
    setDraft((prev) => {
      const needed = countBlankMarkers(template);
      const current = prev.fillBlank.answers;
      const answers = Array.from({ length: needed }, (_, idx) => current[idx] ?? "");
      return {
        ...prev,
        fillBlank: {
          ...prev.fillBlank,
          template,
          answers,
        },
      };
    });
  };

  const setFillBlankAnswer = (index: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      fillBlank: {
        ...prev.fillBlank,
        answers: prev.fillBlank.answers.map((ans, idx) =>
          idx === index ? value : ans,
        ),
      },
    }));
  };

  const setTrueFalseStatement = (value: string) => {
    setDraft((prev) => ({
      ...prev,
      trueFalse: { ...prev.trueFalse, statement: value },
    }));
  };

  const setTrueFalseCorrectValue = (value: boolean) => {
    setDraft((prev) => ({
      ...prev,
      trueFalse: { ...prev.trueFalse, correctValue: value },
    }));
  };

  const setMatchLeftLabel = (id: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      matchColumns: {
        ...prev.matchColumns,
        leftItems: prev.matchColumns.leftItems.map((item) =>
          item.id === id ? { ...item, label: value } : item,
        ),
      },
    }));
  };

  const setMatchRightLabel = (id: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      matchColumns: {
        ...prev.matchColumns,
        rightItems: prev.matchColumns.rightItems.map((item) =>
          item.id === id ? { ...item, label: value } : item,
        ),
      },
    }));
  };

  const addMatchLeftItem = () => {
    setDraft((prev) => ({
      ...prev,
      matchColumns: {
        ...prev.matchColumns,
        leftItems: [
          ...prev.matchColumns.leftItems,
          { id: `left-${crypto.randomUUID()}`, label: "Nueva columna izquierda" },
        ],
      },
    }));
  };

  const addMatchRightItem = () => {
    setDraft((prev) => ({
      ...prev,
      matchColumns: {
        ...prev.matchColumns,
        rightItems: [
          ...prev.matchColumns.rightItems,
          { id: `right-${crypto.randomUUID()}`, label: "Nueva columna derecha" },
        ],
      },
    }));
  };

  const removeMatchLeftItem = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      matchColumns: {
        ...prev.matchColumns,
        leftItems: prev.matchColumns.leftItems.filter((item) => item.id !== id),
        pairs: prev.matchColumns.pairs.filter((pair) => pair.leftId !== id),
      },
    }));
  };

  const removeMatchRightItem = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      matchColumns: {
        ...prev.matchColumns,
        rightItems: prev.matchColumns.rightItems.filter((item) => item.id !== id),
        pairs: prev.matchColumns.pairs.filter((pair) => pair.rightId !== id),
      },
    }));
  };

  const setMatchPair = (leftId: string, rightId: string) => {
    setDraft((prev) => {
      const pairsWithoutLeft = prev.matchColumns.pairs.filter((p) => p.leftId !== leftId);
      return {
        ...prev,
        matchColumns: {
          ...prev.matchColumns,
          pairs: [...pairsWithoutLeft, { leftId, rightId }],
        },
      };
    });
  };

  const clearMatchPair = (leftId: string) => {
    setDraft((prev) => ({
      ...prev,
      matchColumns: {
        ...prev.matchColumns,
        pairs: prev.matchColumns.pairs.filter((p) => p.leftId !== leftId),
      },
    }));
  };

  const setOrderItem = (index: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      orderElements: {
        ...prev.orderElements,
        items: prev.orderElements.items.map((item, idx) =>
          idx === index ? value : item,
        ),
      },
    }));
  };

  const addOrderItem = () => {
    setDraft((prev) => ({
      ...prev,
      orderElements: {
        ...prev.orderElements,
        items: [...prev.orderElements.items, `Paso ${prev.orderElements.items.length + 1}`],
      },
    }));
  };

  const removeOrderItem = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      orderElements: {
        ...prev.orderElements,
        items: prev.orderElements.items.filter((_, idx) => idx !== index),
      },
    }));
  };

  const moveOrderItem = (activeIndex: number, overIndex: number) => {
    setDraft((prev) => {
      if (activeIndex === overIndex) return prev;
      const next = [...prev.orderElements.items];
      const [moved] = next.splice(activeIndex, 1);
      next.splice(overIndex, 0, moved);
      return {
        ...prev,
        orderElements: {
          ...prev.orderElements,
          items: next,
        },
      };
    });
  };

  const diagnostics = useMemo(() => {
    return {
      blanksCount: countBlankMarkers(draft.fillBlank.template),
    };
  }, [draft.fillBlank.template]);

  return {
    draft,
    diagnostics,
    updateBase,
    setType,
    setMultipleChoiceQuestion,
    setMultipleChoiceOption,
    addMultipleChoiceOption,
    removeMultipleChoiceOption,
    markMultipleChoiceCorrect,
    setFillBlankTemplate,
    syncFillBlankAnswersWithTemplate,
    setFillBlankAnswer,
    setTrueFalseStatement,
    setTrueFalseCorrectValue,
    setMatchLeftLabel,
    setMatchRightLabel,
    addMatchLeftItem,
    addMatchRightItem,
    removeMatchLeftItem,
    removeMatchRightItem,
    setMatchPair,
    clearMatchPair,
    setOrderItem,
    addOrderItem,
    removeOrderItem,
    moveOrderItem,
  };
};
