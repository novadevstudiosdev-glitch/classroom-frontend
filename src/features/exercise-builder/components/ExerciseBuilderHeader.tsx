import Link from "next/link";
import type { ExerciseBuilderHeaderProps } from "@/features/exercise-builder/types";

const ExerciseBuilderHeader = ({
  backHref,
  backLabel,
  title,
  subtitle,
}: ExerciseBuilderHeaderProps) => {
  return (
    <header className="border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
      <div className="mb-2 flex items-center gap-3">
        <Link
          href={backHref}
          className="landing-module-link"
        >
          <span aria-hidden="true">←</span>
          <span>{backLabel}</span>
        </Link>
      </div>
      <h2 className="text-md font-bold text-[#FFD700]">{title}</h2>
      <p className="mt-1 text-md text-white/70">{subtitle}</p>
    </header>
  );
};

export default ExerciseBuilderHeader;
