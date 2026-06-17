import { useState } from 'react';
import type { TrueFalseProps } from '@/features/lessons/types';
import { answerExercise, type CorrectionResult, type TrueFalseAnswer } from '@/features/lessons/services';
import SolverOptionalMedia from './SolverOptionalMedia';
import XPAnimation from './XPAnimation';

const TrueFalse = ({ block, onContinue }: TrueFalseProps) => {
  const [selectedValue, setSelectedValue] = useState<boolean | null>(null);
  const [serverResult, setServerResult] = useState<CorrectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const hasAnswered = serverResult !== null;
  const isCorrect = serverResult?.is_correct ?? false;

  const handleSelectValue = async (value: boolean) => {
    if (hasAnswered || isLoading) return;

    setSelectedValue(value);
    setIsLoading(true);

    try {
      const answer: TrueFalseAnswer = { answer: value };
      const result = await answerExercise(block.id, answer);
      setServerResult(result);
      if (result.is_correct) {
        setShowXPAnimation(true);
      }
    } catch (error) {
      console.error('Error al responder ejercicio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <XPAnimation amount={10} isVisible={showXPAnimation} />
      <SolverOptionalMedia imageSrc={block.imageSrc} imageAlt={block.imageAlt} imageCaption={block.imageCaption} />
      <h3 className="text-xl font-bold text-white">{block.prompt}</h3>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSelectValue(true)}
          disabled={hasAnswered || isLoading}
          className={`rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-50 ${
            selectedValue === true ? 'bg-[#1CB0F6] text-[#1a0f00]' : 'bg-gradient-to-br from-[#2DD4BF] to-[#0d9488] hover:bg-white/20'
          }`}
        >
          Verdadero
        </button>
        <button
          type="button"
          onClick={() => handleSelectValue(false)}
          disabled={hasAnswered || isLoading}
          className={`rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-50 ${
            selectedValue === false ? 'bg-[#1CB0F6] text-[#1a0f00]' : 'bg-gradient-to-br from-[#6C63FF] to-[#9B5DE5] hover:bg-white/20'
          }`}
        >
          Falso
        </button>
      </div>

      {hasAnswered && serverResult ? (
        <div className={`rounded-2xl p-5 text-white ${serverResult.is_correct ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'}`}>
          <h3 className="text-lg font-bold">{serverResult.feedback}</h3>

          {!serverResult.is_correct && serverResult.correct_answer ? (
            <div className="mt-3 rounded-lg bg-black/30 p-3">
              <p className="text-xs font-semibold text-white/70">Respuesta correcta:</p>
              <p className="mt-1 text-sm font-bold">{serverResult.correct_answer.correct_answer ? 'Verdadero' : 'Falso'}</p>
            </div>
          ) : null}

          {serverResult.is_correct && (
            <div className="mt-2 inline-flex items-center gap-2 text-sm font-bold">
              <span>⚡</span>
              <span>+10 XP</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (serverResult.is_correct) {
                onContinue?.();
                return;
              }
              setSelectedValue(null);
              setServerResult(null);
            }}
            className={`mt-4 w-full rounded-xl py-3 text-lg font-bold ${
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

export default TrueFalse;
