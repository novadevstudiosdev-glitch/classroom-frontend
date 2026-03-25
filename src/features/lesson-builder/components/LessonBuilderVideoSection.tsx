import { PlayCircle } from "lucide-react";
import type { LessonBuilderVideoSectionProps } from "@/features/lesson-builder/types";

const LessonBuilderVideoSection = ({ video }: LessonBuilderVideoSectionProps) => {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-800">{video.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{video.subtitle}</p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <PlayCircle size={16} />
            Abrir preview
          </button>
        </div>

        <div className="aspect-video w-[30%] min-w-[220px] rounded-xl border bg-gray-100" />
      </div>
    </section>
  );
};

export default LessonBuilderVideoSection;
