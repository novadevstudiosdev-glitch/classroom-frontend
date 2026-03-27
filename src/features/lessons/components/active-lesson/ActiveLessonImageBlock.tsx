import type { LessonImageBlock } from "@/features/lessons/types";

const ActiveLessonImageBlock = ({ block }: { block: LessonImageBlock }) => {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
      {/* Nota rápida: cuando venga la API, aquí block.src debe ser URL real del backend/CDN */}
      <img
        src={block.src}
        alt={block.alt}
        className="h-auto w-full rounded-xl object-cover"
      />
      {block.caption ? (
        <p className="mt-3 text-sm text-gray-600">{block.caption}</p>
      ) : null}
    </article>
  );
};

export default ActiveLessonImageBlock;
