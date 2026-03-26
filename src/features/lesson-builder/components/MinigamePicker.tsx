import type { MinigamePickerProps } from "@/features/lesson-builder/types";

const MinigamePicker = ({
  isOpen,
  minigames,
  selectedMinigameId,
  onSelect,
  onClose,
}: MinigamePickerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-[#0f1636]/95 p-5 text-white shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Selecciona un minijuego</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {minigames.map((item) => {
            const isSelected = selectedMinigameId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full rounded-xl border p-3 text-left ${
                  isSelected
                    ? "border-[#1CB0F6] bg-[#1CB0F6]/10"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                <p className="text-sm font-bold text-white">{item.name}</p>
                <p className="mt-1 text-xs text-white/70">{item.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinigamePicker;
