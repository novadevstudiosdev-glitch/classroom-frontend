import type { LessonOptionalMedia } from "@/features/lessons/types";

const SolverOptionalMedia = ({ imageSrc, imageAlt, imageCaption }: LessonOptionalMedia) => {
  if (!imageSrc) return null;

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md">
      {/* Comentario corto:
          cuando el backend/editor del profe mande imagen en el bloque,
          aquí se renderiza automático sin tocar más lógica. */}
      <img
        src={imageSrc}
        alt={imageAlt ?? "Imagen del ejercicio"}
        className="h-auto w-full rounded-xl object-cover"
      />
      {imageCaption ? (
        <p className="mt-2 text-xs text-gray-600">{imageCaption}</p>
      ) : null}
    </article>
  );
};

export default SolverOptionalMedia;
