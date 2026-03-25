export interface LessonBuilderMetric {
  id: string;
  label: string;
  value: string;
}

export interface LessonBuilderExercise {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  points: number;
}

export interface LessonBuilderVideoInfo {
  title: string;
  subtitle: string;
}

export interface LessonBuilderData {
  className: string;
  draftLabel: string;
  metrics: LessonBuilderMetric[];
  video: LessonBuilderVideoInfo;
  exercises: LessonBuilderExercise[];
  aiTools: LessonBuilderAiToolsData;
  settings: LessonBuilderSettingsData;
  performance: LessonBuilderPerformanceData;
}

export interface LessonBuilderTopBarProps {
  backHref: string;
  backLabel: string;
  className: string;
}

export interface LessonBuilderControlBarProps {
  className: string;
  draftLabel: string;
  isPublished: boolean;
  metrics: LessonBuilderMetric[];
  onTogglePublished: () => void;
}

export interface LessonBuilderVideoSectionProps {
  video: LessonBuilderVideoInfo;
}

export interface LessonBuilderExerciseCardProps {
  order: number;
  exercise: LessonBuilderExercise;
}

export interface LessonBuilderExercisesSectionProps {
  exercises: LessonBuilderExercise[];
}

export interface LessonBuilderAiToolItem {
  id: string;
  label: string;
}

export interface LessonBuilderAiToolsData {
  title: string;
  subtitle: string;
  items: LessonBuilderAiToolItem[];
}

export interface LessonBuilderSettingsData {
  grade: string;
  subject: string;
  difficulty: "facil" | "medio" | "dificil";
}

export interface LessonBuilderPerformanceData {
  completionRate: string;
  averageScore: string;
  averageTime: string;
}

export interface LessonBuilderAiToolsAsideProps {
  data: LessonBuilderAiToolsData;
}

export interface LessonBuilderSettingsCardProps {
  data: LessonBuilderSettingsData;
}

export interface LessonBuilderPerformanceCardProps {
  data: LessonBuilderPerformanceData;
}
