import { Sparkles, Wand2 } from "lucide-react";
import type { LessonBuilderAiToolsAsideProps } from "@/features/lesson-builder/types";

const LessonBuilderAiToolsAside = ({ data }: LessonBuilderAiToolsAsideProps) => {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <h3 className="mb-1 inline-flex items-center gap-2 text-sm font-bold text-white">
        <Sparkles size={16} className="text-[#1CB0F6]" />
        {data.title}
      </h3>
      <p className="mb-3 text-xs text-white/70">{data.subtitle}</p>
      <div className="space-y-2">
        {data.items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex w-full items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-left text-sm font-semibold text-white hover:bg-white/20"
          >
            <Wand2 size={14} className="text-white/70" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonBuilderAiToolsAside;
