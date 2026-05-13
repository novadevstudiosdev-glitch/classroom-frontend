import type { LessonImageBlock } from "@/features/lessons/types";

const ActiveLessonImageBlock = ({ block }: { block: LessonImageBlock }) => {
  return (
    <article className="rounded-2xl border border-white/15 bg-transparent p-4 shadow-[0_14px_28px_rgba(2,6,26,0.45)]">
      {/* Nota rápida: cuando venga la API, aquí block.src debe ser URL real del backend/CDN */}
      <img
        src={block.src}
        alt={block.alt}
        className="h-auto w-full rounded-xl object-cover"
      />
      {block.caption ? (
        <p className="mt-3 text-sm text-white/75">{block.caption}</p>
      ) : null}
    </article>
  );
};

export default ActiveLessonImageBlock;
