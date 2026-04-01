import { PlayCircle } from "lucide-react";
import type { LessonBuilderVideoSectionProps } from "@/features/lesson-builder/types";

const LessonBuilderVideoSection = ({ video }: LessonBuilderVideoSectionProps) => {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">{video.title}</h2>
          <p className="mt-1 text-sm text-white/70">{video.subtitle}</p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            <PlayCircle size={16} />
            Abrir preview
          </button>
        </div>

        <div className="aspect-video w-[30%] min-w-55 rounded-xl border border-white/20 bg-[#0f1636]/70" />
      </div>
    </section>
  );
};

export default LessonBuilderVideoSection;
