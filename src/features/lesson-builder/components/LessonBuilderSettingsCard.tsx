import type { LessonBuilderSettingsCardProps } from "@/features/lesson-builder/types";

const LessonBuilderSettingsCard = ({ data }: LessonBuilderSettingsCardProps) => {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-gray-800">Configuración</h3>

      <form className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Grado:</label>
          <input
            type="text"
            value={data.grade}
            readOnly
            className="w-full rounded-lg border px-3 py-2 text-sm text-gray-700"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Materia:</label>
          <input
            type="text"
            value={data.subject}
            readOnly
            className="w-full rounded-lg border px-3 py-2 text-sm text-gray-700"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Dificultad:</label>
          <select
            defaultValue={data.difficulty}
            className="w-full rounded-lg border px-3 py-2 text-sm text-gray-700"
          >
            <option value="facil">Fácil</option>
            <option value="medio">Medio</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default LessonBuilderSettingsCard;
