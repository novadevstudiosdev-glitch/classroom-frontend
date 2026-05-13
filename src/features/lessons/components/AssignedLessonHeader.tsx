import type { AssignedLessonHeaderProps } from "../types";
import { EducationMascot } from "@/shared/components/mascots";

const AssignedLessonHeader = ({
  currentIndex,
  totalBlocks,
  hearts = 3,
}: AssignedLessonHeaderProps) => {
  const progressPercent = totalBlocks > 0 ? ((currentIndex + 1) / totalBlocks) * 100 : 0;
  const currentStep = Math.min(currentIndex + 1, totalBlocks);
  const roundedProgress = Math.round(progressPercent);

  return (
    <div className="p-8">
      <div className="mx-auto w-full max-w-6xl">
          {/* -----------Texto barra progeso y porcentaje ------------ */}
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-white">
          <span className="font-bold text-lg">
            Ejercicio {currentStep} de {totalBlocks}
          </span>
          <span className="text-green-700 font-bold text-lg">{roundedProgress}% completado</span>
        </div>

        {/* ----------- barra progreso ejercicio ------------ */}
        <div className="w-full h-2 rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-[#FFE000] shadow-[0_0_16px_rgba(255,224,0,0.75)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mx-auto mt-1 w-full max-w-7xl pt-8">
        <div className="flex items-start gap-4">
          {/* ----------- mascota ------------ */}
          <div className="flex-shrink-0 -mt-2">
            <EducationMascot character="focus" expression="happy" size={70} />
          </div>
          <div className="relative rounded-3xl border border-white/20 bg-white/5 p-4 shadow-[0_10px_24px_rgba(2,6,26,0.35)] backdrop-blur-sm">
            <div className="absolute -left-2 top-5 h-0 w-0 border-b-5 border-r-8 border-t-8 border-b-transparent border-r-white/2 border-t-transparent" />
            <p className="text-sm font-semibold text-white">
              ¡Hola! Resolvé este problema de matemática.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedLessonHeader;
