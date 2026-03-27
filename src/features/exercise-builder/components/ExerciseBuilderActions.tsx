import { Eye, Save, Send } from "lucide-react";
import type { ExerciseBuilderActionsProps } from "@/features/exercise-builder/types";

const ExerciseBuilderActions = ({
  onSaveDraft,
  onPreview,
  onPublish,
}: ExerciseBuilderActionsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={onSaveDraft}
        className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
      >
        <Save size={16} />
        Guardar borrador
      </button>
      <button
        type="button"
        onClick={onPreview}
        className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
      >
        <Eye size={16} />
        Vista previa
      </button>
      <button
        type="button"
        onClick={onPublish}
        className="inline-flex items-center gap-1 rounded-lg bg-[#1CB0F6] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1398d8]"
      >
        <Send size={16} />
        Publicar
      </button>
    </div>
  );
};

export default ExerciseBuilderActions;
