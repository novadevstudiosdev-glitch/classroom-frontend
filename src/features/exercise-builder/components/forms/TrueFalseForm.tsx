import type { TrueFalseFormProps } from "@/features/exercise-builder/types";

const TrueFalseForm = ({
  data,
  onChangeStatement,
  onChangeCorrectValue,
}: TrueFalseFormProps) => {
  return (
    <section className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <h3 className="text-base font-bold text-white">Formulario Verdadero o Falso</h3>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-white/80">Enunciado</label>
        <textarea
          value={data.statement}
          onChange={(e) => onChangeStatement(e.target.value)}
          className="min-h-24 w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChangeCorrectValue(true)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            data.correctValue
              ? "bg-gradient-to-br from-[#2DD4BF]/50 to-[#0d9488]/60 text-white shadow-lg backdrop-blur-xl text-[var(--color-secondary)]"
              : "bg-white/10 text-white/80"
          }`}
        >
          Verdadero
        </button>
        <button
          type="button"
          onClick={() => onChangeCorrectValue(false)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            !data.correctValue
              ? "bg-gradient-to-br from-[#2DD4BF]/50 to-[#0d9488]/60 text-white shadow-lg backdrop-blur-xl text-[var(--color-secondary)]"
              : "bg-white/10 text-white/80"
          }`}
        >
          Falso
        </button>
      </div>
    </section>
  );
};

export default TrueFalseForm;
