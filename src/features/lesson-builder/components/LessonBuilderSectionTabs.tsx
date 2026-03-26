import Link from "next/link";
import type { LessonBuilderSectionTabsProps } from "@/features/lesson-builder/types";

const LessonBuilderSectionTabs = ({
  activeSection,
  builderHref = "/lesson-builder",
  exercisesHref = "/lesson-builder/exercises",
}: LessonBuilderSectionTabsProps) => {
  return (
    <nav
      className="border-b border-white/10 bg-white/5 px-6 backdrop-blur-md"
      aria-label="Secciones de lesson builder"
    >
      <div className="flex items-center gap-6">
        <Link
          href={builderHref}
          className={`border-b-2 px-1 py-3 text-sm font-semibold transition-colors ${
            activeSection === "builder"
              ? "border-[#1CB0F6] text-[#1CB0F6]"
              : "border-transparent text-white/70 hover:text-white"
          }`}
        >
          Builder
        </Link>
        <Link
          href={exercisesHref}
          className={`border-b-2 px-1 py-3 text-sm font-semibold transition-colors ${
            activeSection === "exercises"
              ? "border-[#1CB0F6] text-[#1CB0F6]"
              : "border-transparent text-white/70 hover:text-white"
          }`}
        >
          Ejercicios
        </Link>
      </div>
    </nav>
  );
};

export default LessonBuilderSectionTabs;
