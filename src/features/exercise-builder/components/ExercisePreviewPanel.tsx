import type { ExercisePreviewPanelProps } from "@/features/exercise-builder/types";

const ExercisePreviewPanel = ({ draft }: ExercisePreviewPanelProps) => {
  return (
    <aside className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <h3 className="mb-2 text-base font-bold text-white">Vista previa</h3>
      <p className="text-sm font-semibold text-white">{draft.base.title}</p>
      <p className="mt-1 text-xs text-white/70">{draft.base.instructions}</p>

      <div className="mt-4 space-y-2 text-xs text-white/80">
        <p>Tipo: {draft.type}</p>
        <p>Puntos: {draft.base.points}</p>
        <p>Duración: {draft.base.durationSec}s</p>
      </div>

      <div className="mt-4 rounded-lg bg-[#0f1636] p-3 text-xs text-white/90">
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(draft[draft.type === "multiple_choice" ? "multipleChoice" : draft.type === "fill_blank" ? "fillBlank" : draft.type === "true_false" ? "trueFalse" : draft.type === "match_columns" ? "matchColumns" : "orderElements"], null, 2)}
        </pre>
      </div>
    </aside>
  );
};

export default ExercisePreviewPanel;
