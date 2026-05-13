import type { LessonBuilderControlBarProps } from "@/features/lesson-builder/types";

const LessonBuilderControlBar = ({
  className,
  draftLabel,
}: LessonBuilderControlBarProps) => {
  return (
    <div className="border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="rounded-full bg-gradient-to-r from-sky-500/25 via-violet-500/25 to-emerald-500/25 px-3 py-1 text-base font-black text-white shadow-[0_10px_24px_rgba(2,6,26,0.4)]">
          {className}
        </h3>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          <span className="h-2 w-2 rounded-full bg-gray-400" />
          {draftLabel}
        </span>
      </div>
    </div>
  );
};

export default LessonBuilderControlBar;
