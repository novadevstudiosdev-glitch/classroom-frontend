import {
  Check,
  Eye,
  Share2,
} from "lucide-react";
import type { LessonBuilderControlBarProps } from "@/features/lesson-builder/types";

const LessonBuilderControlBar = ({
  className,
  draftLabel,
  isPublished,
  onTogglePublished,
}: LessonBuilderControlBarProps) => {
  return (
    <div className="border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="rounded-full bg-gradient-to-r from-sky-500/25 via-violet-500/25 to-emerald-500/25 px-3 py-1 text-base font-black text-white shadow-[0_10px_24px_rgba(2,6,26,0.4)]">
              {className}
            </h3>
            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                isPublished
                  ? "bg-green-200/20 text-green-200"
                  : "bg-white/10 text-white/70"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isPublished ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {draftLabel}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-500/20 to-cyan-500/20 px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,6,26,0.35)] hover:from-sky-500/30 hover:to-cyan-500/30"
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,6,26,0.35)] hover:from-violet-500/30 hover:to-fuchsia-500/30"
          >
            <Share2 size={16} />
            Compartir
          </button>
          <button
            type="button"
            onClick={onTogglePublished}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,6,26,0.35)] ${
              isPublished
                ? "bg-gradient-to-r from-emerald-500/45 to-teal-500/45 hover:from-emerald-500/60 hover:to-teal-500/60"
                : "bg-gradient-to-r from-amber-500/45 to-orange-500/45 hover:from-amber-500/60 hover:to-orange-500/60"
            }`}
          >
            <Check size={16} />
            Publicar clase
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonBuilderControlBar;
