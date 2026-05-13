import type { FillBlankFormProps } from "@/features/exercise-builder/types";

const FillBlankForm = ({
  data,
  onChangeTemplate,
  onChangeAnswer,
  onSyncAnswersWithTemplate,
}: FillBlankFormProps) => {
  return (
    <section className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <h3 className="text-base font-bold text-white">
        Formulario Completar el espacio en blanco
      </h3>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-white/80">
          Enunciado (usa [___] como marcador)
        </label>
        <textarea
          value={data.template}
          onChange={(e) => {
            const value = e.target.value;
            onChangeTemplate(value);
            onSyncAnswersWithTemplate(value);
          }}
          className="min-h-24 w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
        />
      </div>

      <div className="space-y-2">
        {data.answers.map((answer, idx) => (
          <div key={`blank-${idx}`} className="space-y-1">
            <label className="text-xs font-semibold text-white/80">
              Respuesta marcador #{idx + 1}
            </label>
            <input
              value={answer}
              onChange={(e) => onChangeAnswer(idx, e.target.value)}
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FillBlankForm;
