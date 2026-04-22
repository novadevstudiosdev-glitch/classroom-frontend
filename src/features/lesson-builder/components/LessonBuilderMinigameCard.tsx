import type { LessonBuilderMinigameCardProps } from "@/features/lesson-builder/types";

const LessonBuilderMinigameCard = ({
  selectedMinigameName,
  onOpenPicker,
}: LessonBuilderMinigameCardProps) => {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <div className="space-y-4">
        <div>
          <h2 className="font-bold text-[#FF9500]">Elige tu minijuego</h2>
          <p className="mt-1 text-md text-white/70">
            {selectedMinigameName
              ? `Seleccionado: ${selectedMinigameName}`
              : "Selecciona un minijuego para esta lección."}
          </p>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={onOpenPicker}
            className="rounded-3xl border border-white/20 bg-gradient-to-r from-[#2c65f6]/30 via-[#00ffe4]/30 to-[#0ad3fb]/30 px-3 py-2 text-sm font-semibold text-white shadow-[0_0_40px_rgba(0,255,228,0.25)] backdrop-blur-2xl hover:bg-[#2c65f6]"
          >
            Elegir minijuego
          </button>
        </div>
      </div>
    </section>
  );
};

export default LessonBuilderMinigameCard;
