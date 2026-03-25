import Link from "next/link";
import type { LessonBuilderTopBarProps } from "@/features/lesson-builder/types";

const LessonBuilderTopBar = ({
  backHref,
  backLabel,
  className,
}: LessonBuilderTopBarProps) => {
  return (
    <div className="flex items-center gap-3 border-b bg-white px-6 py-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
      >
        <span aria-hidden="true">←</span>
        <span>{backLabel}</span>
      </Link>
      <h4 className="text-sm font-semibold text-gray-800">{className}</h4>
    </div>
  );
};

export default LessonBuilderTopBar;
