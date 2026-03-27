import { useMemo, useState } from "react";
import type { MultipleChoiceProps } from "@/features/lessons/types";
import SolverOptionalMedia from "./SolverOptionalMedia";

const MultipleChoice = ({ block, onContinue }: MultipleChoiceProps) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const selectedOption = useMemo(
    () => block.options.find((option) => option.id === selectedOptionId),
    [block.options, selectedOptionId],
  );

  const correctOption = useMemo(
    () => block.options.find((option) => option.id === block.correctOptionId),
    [block.options, block.correctOptionId],
  );

  const isCorrect = selectedOptionId === block.correctOptionId;

  const handleActionButton = () => {
    if (isCorrect) {
      onContinue?.();
      return;
    }

    setSelectedOptionId(null);
    setShowFeedback(false);
  };

  return (
    <div className="space-y-4">
      <SolverOptionalMedia
        imageSrc={block.imageSrc}
        imageAlt={block.imageAlt}
        imageCaption={block.imageCaption}
      />

      <h2 className="text-xl font-bold text-white">{block.prompt}</h2>

      <div className="space-y-3">
        {block.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const showCorrect = showFeedback && option.id === block.correctOptionId;
          const showWrong = showFeedback && isSelected && option.id !== block.correctOptionId;

          let bgColor = "bg-white/5";
          let borderColor = "border-white/20";
          let badgeColor = "bg-[#1CB0F6]";

          if (showCorrect) {
            bgColor = "bg-[#58CC02]/10";
            borderColor = "border-[#58CC02]";
            badgeColor = "bg-[#58CC02]";
          } else if (showWrong) {
            bgColor = "bg-[#FF4B4B]/10";
            borderColor = "border-[#FF4B4B]";
            badgeColor = "bg-[#FF4B4B]";
          } else if (isSelected) {
            borderColor = "border-[#1CB0F6]";
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (showFeedback) return;
                setSelectedOptionId(option.id);
                setShowFeedback(true);
              }}
              disabled={showFeedback}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 ${borderColor} ${bgColor} p-4 text-left shadow-md transition-all hover:scale-[1.02] disabled:cursor-not-allowed`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white ${badgeColor}`}
              >
                {option.letter}
              </div>
              <span className="font-bold text-white">{option.text}</span>
              {showCorrect && <span className="ml-auto text-2xl">✓</span>}
              {showWrong && <span className="ml-auto text-2xl">✗</span>}
            </button>
          );
        })}
      </div>

      {showFeedback ? (
        <div
          className={`rounded-2xl p-5 text-white ${isCorrect ? "bg-[#58CC02]" : "bg-[#FF4B4B]"}`}
        >
          {isCorrect ? (
            <>
              <p className="text-lg font-bold">¡Excelente! Respuesta correcta ✓</p>
              <div className="mt-2 inline-flex items-center gap-2 text-sm font-bold">
                <span>⚡</span>
                <span>+{block.rewardXp ?? 10} XP</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-bold">Casi, intenta otra vez ✗</p>
              <p className="mt-2 text-sm">
                Correcta: {correctOption?.letter}. {correctOption?.text}
              </p>
              {block.explanation ? (
                <p className="mt-1 text-sm">{block.explanation}</p>
              ) : null}
            </>
          )}

          {selectedOption ? (
            <p className="mt-2 text-xs">Elegiste: {selectedOption.letter}</p>
          ) : null}

          <button
            type="button"
            onClick={handleActionButton}
            className={`mt-4 w-full rounded-xl py-3 text-sm font-bold transition-colors ${
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

export default MultipleChoice;
