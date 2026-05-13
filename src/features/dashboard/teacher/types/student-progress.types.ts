export type StudentProgressStatus = "on_track" | "behind" | "completed";

export interface StudentProgressItem {
  studentId: string;
  fullName: string;
  progressPercent: number;
  status?: StudentProgressStatus;
  completedLessons?: number;
  totalLessons?: number;
}

export interface StudentProgressRowProps {
  item: StudentProgressItem;
}

export interface StudentsProgressTableProps {
  items: StudentProgressItem[];
  emptyMessage?: string;
}