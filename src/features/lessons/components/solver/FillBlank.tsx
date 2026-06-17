import { useState } from 'react';
import type { FillBlankProps } from '@/features/lessons/types';
import { answerExercise, type CorrectionResult, type FillBlankAnswer } from '@/features/lessons/services';
import SolverOptionalMedia from './SolverOptionalMedia';
import XPAnimation from './XPAnimation';

const FillBlank = ({ block, onContinue }: FillBlankProps) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    block.fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {}),
  );
  const [serverResult, setServerResult] = useState<CorrectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const isCorrect = serverResult?.is_correct ?? false;
  const answered = serverResult !== null;

  const handleValidate = async () => {
    if (isLoading || answered) return;

    setIsLoading(true);
    try {
      const answers = block.fields.map((field) => values[field.id] ?? '');
      const answer: FillBlankAnswer = { answers };
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

  const handleRetry = () => {
    setValues(
      block.fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = '';
        return acc;
      }, {}),
    );
    setServerResult(null);
  };

  return (
    <div className="space-y-4">
      <XPAnimation amount={10} isVisible={showXPAnimation} />
      <SolverOptionalMedia imageSrc={block.imageSrc} imageAlt={block.imageAlt} imageCaption={block.imageCaption} />
      <h2 className="text-xl font-bold text-white">{block.prompt}</h2>

      <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-4">
        {block.fields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <label className="text-xs font-semibold text-white/80">Espacio #{index + 1}</label>
            {field.mode === 'dropdown' ? (
              <select
                value={values[field.id] ?? ''}
                onChange={(event) => setValues((prev) => ({ ...prev, [field.id]: event.target.value }))}
                disabled={answered || isLoading}
                className="w-full rounded-lg border border-white/25 bg-[#0f1636] px-3 py-2 text-sm text-white disabled:opacity-50"
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
                value={values[field.id] ?? ''}
                onChange={(event) => setValues((prev) => ({ ...prev, [field.id]: event.target.value }))}
                placeholder={field.placeholder ?? 'Escribe tu respuesta'}
                disabled={answered || isLoading}
                className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white disabled:opacity-50"
              />
            )}
          </div>
        ))}
      </div>

      {!answered ? (
        <button
          type="button"
          onClick={handleValidate}
          disabled={isLoading}
          className="w-full rounded-xl bg-[#1CB0F6] py-3 text-sm font-bold text-white hover:bg-[#1398d8] disabled:opacity-50"
        >
          {isLoading ? 'Validando...' : 'Validar respuestas'}
        </button>
      ) : serverResult ? (
        <div className={`rounded-2xl p-5 text-white ${serverResult.is_correct ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'}`}>
          <p className="text-lg font-bold">{serverResult.feedback}</p>

          {!serverResult.is_correct && serverResult.correct_answer ? (
            <div className="mt-3 rounded-lg bg-black/30 p-3">
              <p className="text-xs font-semibold text-white/70">Respuestas correctas:</p>
              <div className="mt-2 space-y-1">
                {serverResult.correct_answer.answers?.map((answer: string, idx: number) => (
                  <p key={idx} className="text-sm font-bold">
                    Espacio {idx + 1}: {answer}
                  </p>
                )) ?? <p className="text-sm">Sin detalles disponibles</p>}
              </div>
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
            onClick={() => (serverResult.is_correct ? onContinue?.() : handleRetry())}
            className={`mt-4 w-full rounded-xl py-3 text-sm font-bold ${
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

export default FillBlank;
