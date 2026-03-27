import type { LessonMinigameBlock } from "@/features/lessons/types";

const ActiveLessonMinigameBlock = ({
  block,
  onContinue,
}: {
  block: LessonMinigameBlock;
  onContinue?: () => void;
}) => {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800">{block.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{block.description}</p>
      <button
        type="button"
        onClick={() => {
          // Log de control: útil para revisar si el flujo del minijuego se dispara bien.
          console.log("[ActiveLessonMinigameBlock] click en CTA de minijuego", block.id);
          onContinue?.();
        }}
        className="mt-4 w-full rounded-xl bg-[#1CB0F6] py-3 text-sm font-bold text-white hover:bg-[#1398d8]"
      >
        {block.ctaLabel ?? "Iniciar minijuego"}
      </button>
    </article>
  );
};

export default ActiveLessonMinigameBlock;
