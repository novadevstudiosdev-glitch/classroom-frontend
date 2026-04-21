import { Plus, Trash2 } from "lucide-react";
import type { MultipleChoiceFormProps } from "@/features/exercise-builder/types";

const MultipleChoiceForm = ({
  data,
  onChangeQuestion,
  onChangeOption,
  onAddOption,
  onRemoveOption,
  onMarkCorrect,
}: MultipleChoiceFormProps) => {
  return (
    <section className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <h3 className="text-base font-bold text-white">Formulario Opción múltiple</h3>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-white/80">Pregunta</label>
        <input
          value={data.question}
          onChange={(e) => onChangeQuestion(e.target.value)}
          className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
        />
      </div>

      <div className="space-y-2">
        {data.options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onMarkCorrect(option.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                data.correctOptionId === option.id
                  ? "border border-white/20 bg-gradient-to-br from-[#2DD4BF]/50 to-[#0d9488]/60 text-white shadow-lg backdrop-blur-xl"
                  : "bg-gradient-to-br from-[#FFD700]/8 to-[#FF9500]/8 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl text-white"
              }`}
            >
              Correcta
            </button>
            <input
              value={option.text}
              onChange={(e) => onChangeOption(option.id, e.target.value)}
              className="flex-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
            />
            <button
              type="button"
              onClick={() => onRemoveOption(option.id)}
              className="rounded-lg border border-white/25 p-2 bg-[#8B0000]/40 text-white/60  hover:bg-[#FF0000]/60"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddOption}
        className="inline-flex items-center gap-1 rounded-2xl border border-white/20 bg-gradient-to-br from-[#6C63FF]/30 to-[#9B5DE5]/30 px-3 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-xl hover:bg-white/20"
      >
        <Plus size={16} />
        Agregar opción
      </button>
    </section>
  );
};

export default MultipleChoiceForm;
