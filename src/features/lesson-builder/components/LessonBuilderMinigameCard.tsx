import type { LessonBuilderMinigameCardProps } from "@/features/lesson-builder/types";

const LessonBuilderMinigameCard = ({
  selectedMinigameName,
  onOpenPicker,
}: LessonBuilderMinigameCardProps) => {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Elige tu minijuego</h2>
          <p className="mt-1 text-sm text-white/70">
            {selectedMinigameName
              ? `Seleccionado: ${selectedMinigameName}`
              : "Selecciona un minijuego para esta lección."}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenPicker}
          className="rounded-lg bg-[#1CB0F6] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1398d8]"
        >
          Elegir minijuego
        </button>
      </div>
    </section>
  );
};

export default LessonBuilderMinigameCard;
