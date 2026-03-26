import type {
  ExerciseBuilderDraft,
  ExerciseTypeOption,
} from "@/features/exercise-builder/types";

export const EXERCISE_TYPE_OPTIONS: ExerciseTypeOption[] = [
  { id: "multiple_choice", label: "Opción múltiple" },
  { id: "fill_blank", label: "Completar espacios" },
  { id: "true_false", label: "Verdadero / Falso" },
  { id: "match_columns", label: "Relacionar columnas" },
  { id: "order_elements", label: "Ordenar elementos" },
];

export const EXERCISE_BUILDER_DRAFT_MOCK: ExerciseBuilderDraft = {
  type: "multiple_choice",
  base: {
    title: "Nuevo ejercicio",
    instructions: "Resuelve según las instrucciones.",
    points: 10,
    durationSec: 120,
  },
  multipleChoice: {
    question: "¿Cuánto es 8 - 3?",
    options: [
      { id: "opt-1", text: "3" },
      { id: "opt-2", text: "5" },
      { id: "opt-3", text: "8" },
      { id: "opt-4", text: "11" },
    ],
    correctOptionId: "opt-2",
  },
  fillBlank: {
    template: "Juan tiene [___] manzanas y regala [___].",
    answers: ["8", "3"],
  },
  trueFalse: {
    statement: "8 - 3 = 5",
    correctValue: true,
  },
  matchColumns: {
    leftItems: [
      { id: "left-1", label: "8 - 3" },
      { id: "left-2", label: "5 + 2" },
      { id: "left-3", label: "4 + 4" },
    ],
    rightItems: [
      { id: "right-1", label: "5" },
      { id: "right-2", label: "7" },
      { id: "right-3", label: "8" },
    ],
    pairs: [
      { leftId: "left-1", rightId: "right-1" },
      { leftId: "left-2", rightId: "right-2" },
      { leftId: "left-3", rightId: "right-3" },
    ],
  },
  orderElements: {
    items: ["Leer el problema", "Resolver operación", "Verificar resultado"],
  },
};
