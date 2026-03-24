import type { AssignedLessonHeaderProps } from "../types";
import { EducationMascot } from "@/shared/components/mascots";
import Link from "next/link";

const AssignedLessonHeader = ({
  currentIndex,
  totalBlocks,
  hearts = 3,
}: AssignedLessonHeaderProps) => {
  const progressPercent = totalBlocks > 0 ? ((currentIndex + 1) / totalBlocks) * 100 : 0;

  return (
    <div className="bg-[#1CB0F6] px-6 py-4">
      <div className="mb-3 flex items-center justify-between">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
          aria-label="Volver a lecciones"
        >
          <span>←</span>
          <span>Atras</span>
        </Link>
        <div className="flex items-center gap-2">
          {Array.from({ length: hearts }).map((_, idx) => (
            <span key={idx} className="text-white text-lg">❤️</span>
          ))}
        </div>
      </div>

      <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FFE000] rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-5 flex items-start gap-4">
        <div className="flex-shrink-0 -mt-2">
          <EducationMascot character="focus" expression="happy" size={96} />
        </div>
        <div className="relative rounded-2xl bg-white p-4 shadow-md">
          <div className="absolute -left-2 top-5 h-0 w-0 border-b-8 border-r-8 border-t-8 border-b-transparent border-r-white border-t-transparent" />
          <p className="text-sm font-semibold text-gray-700">
            ¡Hola! Resolvé este problema de matemática.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignedLessonHeader;
