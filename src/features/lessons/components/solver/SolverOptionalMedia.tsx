import type { LessonOptionalMedia } from "@/features/lessons/types";

const SolverOptionalMedia = ({ imageSrc, imageAlt, imageCaption }: LessonOptionalMedia) => {
  if (!imageSrc) return null;

  return (
    <article className="rounded-2xl border border-white/15 bg-transparent p-4 shadow-[0_12px_24px_rgba(2,6,26,0.4)]">
      {/* Comentario corto:
          cuando el backend/editor del profe mande imagen en el bloque,
          aquí se renderiza automático sin tocar más lógica. */}
      <img
        src={imageSrc}
        alt={imageAlt ?? "Imagen del ejercicio"}
        className="h-auto w-full rounded-xl object-cover"
      />
      {imageCaption ? (
        <p className="mt-2 text-xs text-white/75">{imageCaption}</p>
      ) : null}
    </article>
  );
};

export default SolverOptionalMedia;
