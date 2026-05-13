import type { LessonBuilderSettingsCardProps } from "@/features/lesson-builder/types";

const LessonBuilderSettingsCard = ({ data }: LessonBuilderSettingsCardProps) => {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <h4 className="mb-3 text-[20px] font-bold text-white">Configuración</h4>

      <form className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-white/80">Grado:</label>
          <input
            type="text"
            value={data.grade}
            readOnly
            className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-white/80">Materia:</label>
          <input
            type="text"
            value={data.subject}
            readOnly
            className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-white/80">Dificultad:</label>
          <input
            type="text"
            value={data.difficulty || "Sin definir"}
            readOnly
            className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default LessonBuilderSettingsCard;
