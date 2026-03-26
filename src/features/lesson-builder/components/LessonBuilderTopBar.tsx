import Link from "next/link";
import type { LessonBuilderTopBarProps } from "@/features/lesson-builder/types";

const LessonBuilderTopBar = ({
  backHref,
  backLabel,
  className,
  forwardHref,
  forwardLabel = "Adelante",
}: LessonBuilderTopBarProps) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="landing-module-link"
        >
          <span aria-hidden="true">←</span>
          <span>{backLabel}</span>
        </Link>
        <h4 className="text-sm font-semibold text-white">{className}</h4>
      </div>

      {forwardHref ? (
        <Link
          href={forwardHref}
          className="landing-module-link"
        >
          <span>{forwardLabel}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  );
};

export default LessonBuilderTopBar;
