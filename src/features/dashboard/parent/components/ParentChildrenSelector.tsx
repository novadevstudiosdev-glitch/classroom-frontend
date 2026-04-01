import type { ParentChildrenSelectorProps } from "@/features/dashboard/parent/types";

const ParentChildrenSelector = ({
  items,
  selectedChildId,
  onSelectChild,
}: ParentChildrenSelectorProps) => {
  return (
    <section className="px-6 py-4">
      <p className="mb-3 text-sm text-white/75">Seleccioná un hijo</p>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((child) => {
          const isSelected = child.id === selectedChildId;

          return (
            <button
              key={child.id}
              type="button"
              onClick={() => onSelectChild(child.id)}
              className={`min-w-[140px] flex-shrink-0 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                isSelected
                  ? "border-[#1CB0F6] bg-[#1CB0F6]/20"
                  : "border-white/20 bg-white/8 hover:bg-white/12"
              }`}
            >
              <div className="mb-2 flex justify-center text-3xl">{child.mascotEmoji}</div>
              <p className="text-sm font-bold text-white">{child.name}</p>
              <p className="text-xs text-white/70">{child.levelLabel}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ParentChildrenSelector;
