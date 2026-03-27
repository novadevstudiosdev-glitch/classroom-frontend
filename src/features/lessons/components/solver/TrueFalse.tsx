import { useState } from "react";
import type { TrueFalseProps } from "@/features/lessons/types";
import SolverOptionalMedia from "./SolverOptionalMedia";

const TrueFalse = ({ block, onContinue }: TrueFalseProps) => {
  const [selectedValue, setSelectedValue] = useState<boolean | null>(null);

  const hasAnswered = selectedValue !== null;
  const isCorrect = selectedValue === block.correctValue;

  return (
    <div className="space-y-4">
      <SolverOptionalMedia
        imageSrc={block.imageSrc}
        imageAlt={block.imageAlt}
        imageCaption={block.imageCaption}
      />
      <h2 className="text-xl font-bold text-white">{block.prompt}</h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => !hasAnswered && setSelectedValue(true)}
          className={`rounded-xl px-4 py-3 text-sm font-bold ${
            selectedValue === true
              ? "bg-[#1CB0F6] text-white"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Verdadero
        </button>
        <button
          type="button"
          onClick={() => !hasAnswered && setSelectedValue(false)}
          className={`rounded-xl px-4 py-3 text-sm font-bold ${
            selectedValue === false
              ? "bg-[#1CB0F6] text-white"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Falso
        </button>
      </div>

      {hasAnswered ? (
        <div
          className={`rounded-2xl p-5 text-white ${isCorrect ? "bg-[#58CC02]" : "bg-[#FF4B4B]"}`}
        >
          {isCorrect ? (
            <p className="text-lg font-bold">¡Correcto! ✓</p>
          ) : (
            <>
              <p className="text-lg font-bold">Incorrecto ✗</p>
              <p className="mt-2 text-sm">
                La respuesta correcta es: {block.correctValue ? "Verdadero" : "Falso"}
              </p>
              {block.explanation ? (
                <p className="mt-1 text-sm">{block.explanation}</p>
              ) : null}
            </>
          )}

          <button
            type="button"
            onClick={() => {
              if (isCorrect) {
                onContinue?.();
                return;
              }
              setSelectedValue(null);
            }}
            className={`mt-4 w-full rounded-xl py-3 text-sm font-bold ${
              isCorrect ? "bg-[#3fae01] hover:bg-[#379a01]" : "bg-[#d93b3b] hover:bg-[#be3333]"
            }`}
          >
            {isCorrect ? "Continuar" : "Intentar de nuevo"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TrueFalse;
