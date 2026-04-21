export type ExerciseType =
  | "multiple_choice"
  | "fill_blank"
  | "true_false"
  | "match_columns"
  | "order_elements";

export interface ExerciseBuilderBase {
  title: string;
  instructions: string;
  points: number;
  durationSec: number;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceData {
  question: string;
  options: MultipleChoiceOption[];
  correctOptionId: string | null;
}

export interface FillBlankData {
  template: string; // Usa [___] como marcador
  answers: string[];
}

export interface TrueFalseData {
  statement: string;
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

export interface MatchColumnsData {
  leftItems: MatchItem[];
  rightItems: MatchItem[];
  pairs: MatchPair[];
}

export interface OrderElementsData {
  items: string[];
}

export interface ExerciseBuilderDraft {
  type: ExerciseType;
  base: ExerciseBuilderBase;
  multipleChoice: MultipleChoiceData;
  fillBlank: FillBlankData;
  trueFalse: TrueFalseData;
  matchColumns: MatchColumnsData;
  orderElements: OrderElementsData;
}

export interface ExerciseTypeOption {
  id: ExerciseType;
  label: string;
}

export interface ExerciseTypeTabsProps {
  activeType: ExerciseType;
  options: ExerciseTypeOption[];
  onChangeType: (type: ExerciseType) => void;
}

export interface ExerciseBuilderHeaderProps {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle: string;
}

export interface ExerciseBuilderActionsProps {
  onSaveDraft: () => void;
  onPreview: () => void;
  onPublish: () => void;
}

export interface ExercisePreviewPanelProps {
  draft: ExerciseBuilderDraft;
}

export interface MultipleChoiceFormProps {
  data: MultipleChoiceData;
  onChangeQuestion: (value: string) => void;
  onChangeOption: (optionId: string, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onMarkCorrect: (optionId: string) => void;
}

export interface FillBlankFormProps {
  data: FillBlankData;
  onChangeTemplate: (value: string) => void;
  onChangeAnswer: (index: number, value: string) => void;
  onSyncAnswersWithTemplate: (template: string) => void;
}

export interface TrueFalseFormProps {
  data: TrueFalseData;
  onChangeStatement: (value: string) => void;
  onChangeCorrectValue: (value: boolean) => void;
}

export interface MatchColumnsFormProps {
  data: MatchColumnsData;
  onChangeLeftLabel: (id: string, value: string) => void;
  onChangeRightLabel: (id: string, value: string) => void;
  onAddLeftItem: () => void;
  onAddRightItem: () => void;
  onRemoveLeftItem: (id: string) => void;
  onRemoveRightItem: (id: string) => void;
  onSetPair: (leftId: string, rightId: string) => void;
  onClearPair: (leftId: string) => void;
}

export interface OrderElementsFormProps {
  data: OrderElementsData;
  onChangeItem: (index: number, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onMoveItem: (activeIndex: number, overIndex: number) => void;
}

export interface ExerciseBuilderFormSectionProps {
  draft: ExerciseBuilderDraft;
  onChangeBase: (field: keyof ExerciseBuilderBase, value: string | number) => void;
  onChangeType: (type: ExerciseType) => void;
  onMultipleChoiceChangeQuestion: (value: string) => void;
  onMultipleChoiceChangeOption: (optionId: string, value: string) => void;
  onMultipleChoiceAddOption: () => void;
  onMultipleChoiceRemoveOption: (optionId: string) => void;
  onMultipleChoiceMarkCorrect: (optionId: string) => void;
  onFillBlankChangeTemplate: (value: string) => void;
  onFillBlankSyncAnswersWithTemplate: (template: string) => void;
  onFillBlankChangeAnswer: (index: number, value: string) => void;
  onTrueFalseChangeStatement: (value: string) => void;
  onTrueFalseChangeCorrectValue: (value: boolean) => void;
  onMatchColumnsChangeLeftLabel: (id: string, value: string) => void;
  onMatchColumnsChangeRightLabel: (id: string, value: string) => void;
  onMatchColumnsAddLeftItem: () => void;
  onMatchColumnsAddRightItem: () => void;
  onMatchColumnsRemoveLeftItem: (id: string) => void;
  onMatchColumnsRemoveRightItem: (id: string) => void;
  onMatchColumnsSetPair: (leftId: string, rightId: string) => void;
  onMatchColumnsClearPair: (leftId: string) => void;
  onOrderElementsChangeItem: (index: number, value: string) => void;
  onOrderElementsAddItem: () => void;
  onOrderElementsRemoveItem: (index: number) => void;
  onOrderElementsMoveItem: (activeIndex: number, overIndex: number) => void;
}
