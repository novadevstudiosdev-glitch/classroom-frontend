import { useMemo, useState } from "react";
import type { FillBlankProps } from "@/features/lessons/types";
import SolverOptionalMedia from "./SolverOptionalMedia";

const FillBlank = ({ block, onContinue }: FillBlankProps) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    block.fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {}),
  );
  const [checked, setChecked] = useState(false);

  const isCorrect = useMemo(
    () =>
      block.fields.every((field) => {
        const currentValue = (values[field.id] ?? "").trim().toLowerCase();
        return currentValue === field.answer.trim().toLowerCase();
      }),
    [block.fields, values],
  );

  const handleRetry = () => {
    setValues(
      block.fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = "";
        return acc;
      }, {}),
    );
    setChecked(false);
  };

  return (
    <div className="space-y-4">
      <SolverOptionalMedia
        imageSrc={block.imageSrc}
        imageAlt={block.imageAlt}
        imageCaption={block.imageCaption}
      />
      <h2 className="text-xl font-bold text-white">{block.prompt}</h2>

      <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-4">
        {block.fields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <label className="text-xs font-semibold text-white/80">
              Espacio #{index + 1}
            </label>
            {field.mode === "dropdown" ? (
              <select
                value={values[field.id] ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [field.id]: event.target.value }))
                }
                className="w-full rounded-lg border border-white/25 bg-[#0f1636] px-3 py-2 text-sm text-white"
              >
                <option value="">Selecciona una opción</option>
                {(field.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={values[field.id] ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [field.id]: event.target.value }))
                }
                placeholder={field.placeholder ?? "Escribe tu respuesta"}
                className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
              />
            )}
          </div>
        ))}
      </div>

      {!checked ? (
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="w-full rounded-xl bg-[#1CB0F6] py-3 text-sm font-bold text-white hover:bg-[#1398d8]"
        >
          Validar respuestas
        </button>
      ) : (
        <div
          className={`rounded-2xl p-5 text-white ${isCorrect ? "bg-[#58CC02]" : "bg-[#FF4B4B]"}`}
        >
          {isCorrect ? (
            <p className="text-lg font-bold">¡Muy bien! Todo correcto ✓</p>
          ) : (
            <>
              <p className="text-lg font-bold">Hay respuestas por corregir ✗</p>
              <p className="mt-2 text-sm">
                {block.explanation ?? "Revisa tus respuestas y vuelve a intentar."}
              </p>
            </>
          )}

          <button
            type="button"
            onClick={isCorrect ? onContinue : handleRetry}
            className={`mt-4 w-full rounded-xl py-3 text-sm font-bold ${
              isCorrect ? "bg-[#3fae01] hover:bg-[#379a01]" : "bg-[#d93b3b] hover:bg-[#be3333]"
            }`}
          >
            {isCorrect ? "Continuar" : "Intentar de nuevo"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FillBlank;
