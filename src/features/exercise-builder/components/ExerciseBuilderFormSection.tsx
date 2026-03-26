import type { ExerciseBuilderFormSectionProps } from "@/features/exercise-builder/types";
import FillBlankForm from "@/features/exercise-builder/components/forms/FillBlankForm";
import MatchColumnsForm from "@/features/exercise-builder/components/forms/MatchColumnsForm";
import MultipleChoiceForm from "@/features/exercise-builder/components/forms/MultipleChoiceForm";
import OrderElementsForm from "@/features/exercise-builder/components/forms/OrderElementsForm";
import TrueFalseForm from "@/features/exercise-builder/components/forms/TrueFalseForm";

const ExerciseBuilderFormSection = ({
  draft,
  onChangeBase,
  onMultipleChoiceChangeQuestion,
  onMultipleChoiceChangeOption,
  onMultipleChoiceAddOption,
  onMultipleChoiceRemoveOption,
  onMultipleChoiceMarkCorrect,
  onFillBlankChangeTemplate,
  onFillBlankSyncAnswersWithTemplate,
  onFillBlankChangeAnswer,
  onTrueFalseChangeStatement,
  onTrueFalseChangeCorrectValue,
  onMatchColumnsChangeLeftLabel,
  onMatchColumnsChangeRightLabel,
  onMatchColumnsAddLeftItem,
  onMatchColumnsAddRightItem,
  onMatchColumnsSetPair,
  onMatchColumnsClearPair,
  onOrderElementsChangeItem,
  onOrderElementsAddItem,
  onOrderElementsMoveItem,
}: ExerciseBuilderFormSectionProps) => {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md md:grid-cols-2">
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold text-white/80">Título del ejercicio</label>
          <input
            value={draft.base.title}
            onChange={(e) => onChangeBase("title", e.target.value)}
            className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold text-white/80">Instrucciones</label>
          <textarea
            value={draft.base.instructions}
            onChange={(e) => onChangeBase("instructions", e.target.value)}
            className="min-h-20 w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-white/80">Puntos</label>
          <input
            type="number"
            value={draft.base.points}
            onChange={(e) => onChangeBase("points", Number(e.target.value))}
            className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-white/80">Duración (segundos)</label>
          <input
            type="number"
            value={draft.base.durationSec}
            onChange={(e) => onChangeBase("durationSec", Number(e.target.value))}
            className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
          />
        </div>
      </div>

      {draft.type === "multiple_choice" ? (
        <MultipleChoiceForm
          data={draft.multipleChoice}
          onChangeQuestion={onMultipleChoiceChangeQuestion}
          onChangeOption={onMultipleChoiceChangeOption}
          onAddOption={onMultipleChoiceAddOption}
          onRemoveOption={onMultipleChoiceRemoveOption}
          onMarkCorrect={onMultipleChoiceMarkCorrect}
        />
      ) : null}

      {draft.type === "fill_blank" ? (
        <FillBlankForm
          data={draft.fillBlank}
          onChangeTemplate={onFillBlankChangeTemplate}
          onChangeAnswer={onFillBlankChangeAnswer}
          onSyncAnswersWithTemplate={onFillBlankSyncAnswersWithTemplate}
        />
      ) : null}

      {draft.type === "true_false" ? (
        <TrueFalseForm
          data={draft.trueFalse}
          onChangeStatement={onTrueFalseChangeStatement}
          onChangeCorrectValue={onTrueFalseChangeCorrectValue}
        />
      ) : null}

      {draft.type === "match_columns" ? (
        <MatchColumnsForm
          data={draft.matchColumns}
          onChangeLeftLabel={onMatchColumnsChangeLeftLabel}
          onChangeRightLabel={onMatchColumnsChangeRightLabel}
          onAddLeftItem={onMatchColumnsAddLeftItem}
          onAddRightItem={onMatchColumnsAddRightItem}
          onSetPair={onMatchColumnsSetPair}
          onClearPair={onMatchColumnsClearPair}
        />
      ) : null}

      {draft.type === "order_elements" ? (
        <OrderElementsForm
          data={draft.orderElements}
          onChangeItem={onOrderElementsChangeItem}
          onAddItem={onOrderElementsAddItem}
          onMoveItem={onOrderElementsMoveItem}
        />
      ) : null}
    </section>
  );
};

export default ExerciseBuilderFormSection;
