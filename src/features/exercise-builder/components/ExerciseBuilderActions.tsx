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
        className="inline-flex items-center gap-1 rounded-lg border border-white/25  px-3 py-2 bg-gradient-to-br from-[#6C63FF]/30 to-[#9B5DE5]/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl text-white hover:bg-white/20"
      >
        <Save size={16} />
        Guardar borrador
      </button>
      <button
        type="button"
        onClick={onPreview}
        className="inline-flex items-center gap-1 rounded-lg border border-white/25  px-3 py-2 bg-gradient-to-br from-[#2DD4BF]/30 to-[#0d9488]/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl text-white hover:bg-white/20"
      >
        <Eye size={16} />
        Vista previa
      </button>
      <button
        type="button"
        onClick={onPublish}
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 * bg-gradient-to-br from-[#FFD700]/30 to-[#FF9500]/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl text-white hover:bg-white/20"
      >
        <Send size={16} />
        Publicar
      </button>
    </div>
  );
};

export default ExerciseBuilderActions;
