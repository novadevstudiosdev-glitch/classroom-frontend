import type { LessonParagraphBlock } from "@/features/lessons/types";

const ActiveLessonTextBlock = ({
  block,
  onContinue,
}: {
  block: LessonParagraphBlock;
  onContinue?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => {
        console.log("[ActiveLessonTextBlock] click en bloque de texto", block.id);
        onContinue?.();
      }}
      className="w-full rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-lg transition-all hover:scale-[1.01] hover:border-[#1CB0F6]/40 hover:shadow-xl"
      aria-label="Continuar al siguiente bloque"
    >
      <p className="text-base text-gray-800">{block.text}</p>
    </button>
  );
};

export default ActiveLessonTextBlock;
