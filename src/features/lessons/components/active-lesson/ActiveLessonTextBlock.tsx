import type { LessonParagraphBlock } from "@/features/lessons/types";

const ActiveLessonTextBlock = ({
  block,
  onContinue,
}: {
  block: LessonParagraphBlock;
  onContinue?: () => void;
}) => {
  return (
    // --------LECCIN TIUTLO ----------
    <button
      type="button"
      onClick={() => {
        console.log("[ActiveLessonTextBlock] click en bloque de texto", block.id);
        onContinue?.();
      }}
      className="w-full rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF9500] text-[#1a0f00] p-6 text-left text-[#1a0f00] shadow-[0_10px_40px_rgba(255,215,0,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_18px_50px_rgba(255,215,0,0.5)]"
      aria-label="Continuar al siguiente bloque"
    >
      <p className="text-base font-bold text-black text-md">{block.text}</p>
    </button>
  );
};

export default ActiveLessonTextBlock;
