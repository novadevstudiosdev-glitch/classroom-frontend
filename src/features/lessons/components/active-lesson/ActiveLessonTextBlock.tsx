import type { LessonParagraphBlock } from "@/features/lessons/types";

const ActiveLessonTextBlock = ({ block }: { block: LessonParagraphBlock }) => {
  return (
    <article className="w-full rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-lg">
      <p className="text-base text-gray-800">{block.text}</p>
    </article>
  );
};

export default ActiveLessonTextBlock;
