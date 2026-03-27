import {
  LessonBuilderAiToolsAside,
  LessonBuilderPerformanceCard,
  LessonBuilderSettingsCard,
} from "@/features/lesson-builder/components";
import type {
  LessonBuilderAiToolsData,
  LessonBuilderPerformanceData,
  LessonBuilderSettingsData,
} from "@/features/lesson-builder/types";

type LessonBuilderAsideProps = {
  aiTools: LessonBuilderAiToolsData;
  settings: LessonBuilderSettingsData;
  performance: LessonBuilderPerformanceData;
};

const LessonBuilderAside = ({
  aiTools,
  settings,
  performance,
}: LessonBuilderAsideProps) => {
  return (
    <aside className="space-y-4">
      <LessonBuilderAiToolsAside data={aiTools} />
      <LessonBuilderSettingsCard data={settings} />
      <LessonBuilderPerformanceCard data={performance} />
    </aside>
  );
};

export default LessonBuilderAside;
