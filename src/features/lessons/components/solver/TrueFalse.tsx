import { useState } from "react";
import type { TrueFalseProps } from "@/features/lessons/types";
import SolverOptionalMedia from "./SolverOptionalMedia";

const TrueFalse = ({ block, onContinue }: TrueFalseProps) => {
  const [selectedValue, setSelectedValue] = useState<boolean | null>(null);

  const hasAnswered = selectedValue !== null;
  const isCorrect = selectedValue === block.correctValue;

  return (
    <div className="space-y-4 bg">
      <SolverOptionalMedia
        imageSrc={block.imageSrc}
        imageAlt={block.imageAlt}
        imageCaption={block.imageCaption}
      />
      <h3 className="text-xl font-bold text-white">{block.prompt}</h3>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => !hasAnswered && setSelectedValue(true)}
          className={`rounded-xl px-4 py-3 text-sm font-bold ${
            selectedValue === true
              ? "bg-[#1CB0F6] text-[#1a0f00]"
              : "bg-gradient-to-br from-[#2DD4BF] to-[#0d9488] hover:bg-white/20"
          }`}
        >
          Verdadero
        </button>
        <button
          type="button"
          onClick={() => !hasAnswered && setSelectedValue(false)}
          className={`rounded-xl px-4 py-3 text-sm font-bold ${
            selectedValue === false
              ? "bg-[#1CB0F6] text-[#1a0f00]"
              : "bg-gradient-to-br from-[#6C63FF] to-[#9B5DE5] hover:bg-white/20"
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
            <h3 className="text-lg font-bold">¡Correcto! ✓</h3>
          ) : (
            <>
              <h3 className="text-lg font-bold">Incorrecto ✗</h3>
              <h4 className="mt-2 text-md">
                La respuesta correcta es: {block.correctValue ? "Verdadero" : "Falso"}
              </h4>
              {block.explanation ? (
                <p className="mt-1 text-lg">{block.explanation}</p>
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
            className={`mt-4 w-full rounded-xl py-3 text-lg font-bold ${
              isCorrect ? "bg-black/30 hover:bg-black/60" : "bg-black/30 hover:bg-black/60"
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
