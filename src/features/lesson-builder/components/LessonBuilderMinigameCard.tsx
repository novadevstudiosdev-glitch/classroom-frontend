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
          className="rounded-lg bg-gradient-to-r from-[#2c65f6] via-[#00ffe4] to-[#0ad3fb] px-3 py-2 text-sm font-semibold text-black hover:bg-gradient-to-br from-[#FFD700] to-[#FF9500] text-[#1a0f00] "
        >
          Elegir minijuego
        </button>
      </div>
    </section>
  );
};

export default LessonBuilderMinigameCard;
