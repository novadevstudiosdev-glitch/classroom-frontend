import { useMemo, useState } from 'react';
import type { MultipleChoiceProps } from '@/features/lessons/types';
import { answerExercise, type CorrectionResult, type MultipleChoiceAnswer } from '@/features/lessons/services';
import SolverOptionalMedia from './SolverOptionalMedia';
import XPAnimation from './XPAnimation';

const MultipleChoice = ({ block, onContinue }: MultipleChoiceProps) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [serverResult, setServerResult] = useState<CorrectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const selectedOption = useMemo(() => block.options.find((option) => option.id === selectedOptionId), [block.options, selectedOptionId]);

  const correctOptionIndex = block.options.findIndex((option) => option.id === block.correctOptionId);

  const selectedOptionIndex = selectedOptionId ? block.options.findIndex((option) => option.id === selectedOptionId) : -1;

  const answered = serverResult !== null;

  const handleSelectOption = async (optionId: string) => {
    if (answered || isLoading) return;

    setSelectedOptionId(optionId);
    setIsLoading(true);

    try {
      const selectedIdx = block.options.findIndex((o) => o.id === optionId);
      const answer: MultipleChoiceAnswer = { selected_index: selectedIdx };
      const result = await answerExercise(block.id, answer);
      setServerResult(result);
      setShowFeedback(true);
      if (result.is_correct) {
        setShowXPAnimation(true);
      }
    } catch (error) {
      console.error('Error al responder ejercicio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCorrect = serverResult?.is_correct ?? false;

  const handleActionButton = () => {
    if (isCorrect) {
      onContinue?.();
      return;
    }

    setSelectedOptionId(null);
    setShowFeedback(false);
    setServerResult(null);
  };

  return (
    <div className="space-y-4">
      <XPAnimation amount={block.rewardXp ?? 10} isVisible={showXPAnimation} />
      <SolverOptionalMedia imageSrc={block.imageSrc} imageAlt={block.imageAlt} imageCaption={block.imageCaption} />

      <h2 className="text-xl font-bold text-white">{block.prompt}</h2>

      <div className="space-y-3">
        {block.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const showCorrect = showFeedback && serverResult?.is_correct && idx === correctOptionIndex;
          const showWrong = showFeedback && isSelected && !serverResult?.is_correct;

          let bgColor = 'bg-white/5';
          let borderColor = 'border-white/20';
          let badgeColor = 'bg-[#1CB0F6]';

          if (showCorrect) {
            bgColor = 'bg-[#58CC02]/10';
            borderColor = 'border-[#58CC02]';
            badgeColor = 'bg-[#58CC02]';
          } else if (showWrong) {
            bgColor = 'bg-[#FF4B4B]/10';
            borderColor = 'border-[#FF4B4B]';
            badgeColor = 'bg-[#FF4B4B]';
          } else if (isSelected) {
            borderColor = 'border-[#1CB0F6]';
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectOption(option.id)}
              disabled={answered || isLoading}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 ${borderColor} ${bgColor} p-4 text-left shadow-md transition-all hover:scale-[1.02] disabled:cursor-not-allowed`}
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white ${badgeColor}`}>{option.letter}</div>
              <span className="font-bold text-white">{option.text}</span>
              {showCorrect && <span className="ml-auto text-2xl">✓</span>}
              {showWrong && <span className="ml-auto text-2xl">✗</span>}
            </button>
          );
        })}
      </div>

      {answered && serverResult ? (
        <div className={`rounded-2xl p-5 text-white ${serverResult.is_correct ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'}`}>
          <p className="text-lg font-bold">{serverResult.feedback}</p>

          {!serverResult.is_correct && serverResult.correct_answer ? (
            <div className="mt-3 rounded-lg bg-black/30 p-3">
              <p className="text-xs font-semibold text-white/70">Respuesta correcta:</p>
              <p className="mt-1 text-sm font-bold">
                {serverResult.correct_answer.correct_text || block.options[serverResult.correct_answer.correct_index]?.text}
              </p>
            </div>
          ) : null}

          {serverResult.is_correct && (
            <div className="mt-2 inline-flex items-center gap-2 text-sm font-bold">
              <span>⚡</span>
              <span>+{block.rewardXp ?? 10} XP</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleActionButton}
            className={`mt-4 w-full rounded-xl py-3 text-sm font-bold transition-colors ${
              serverResult.is_correct ? 'bg-[#3fae01] hover:bg-[#379a01]' : 'bg-[#d93b3b] hover:bg-[#be3333]'
            }`}
          >
            {serverResult.is_correct ? 'Continuar' : 'Intentar de nuevo'}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default MultipleChoice;
