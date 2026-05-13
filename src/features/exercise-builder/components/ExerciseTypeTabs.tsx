import type { ExerciseTypeTabsProps } from "@/features/exercise-builder/types";

const ExerciseTypeTabs = ({
  activeType,
  options,
  onChangeType,
}: ExerciseTypeTabsProps) => {
  return (
    <nav className="rounded-xl border border-white/15 bg-white/8 p-2 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChangeType(option.id)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              activeType === option.id
                ? "bg-gradient-to-br from-[#6C63FF] to-[#9B5DE5] border-white/20 shadow-xl rounded-3xl"
                : "bg-[#FFD700] text-black hover:bg-[#FFD700]/60"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ExerciseTypeTabs;
