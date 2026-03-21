
export interface GetClassroomByIdParams {
  id: string;
}

export interface ClassroomDetail {
  id: string;
  name: string;
  description?: string;
  level?: string;
  status: "active" | "archived" | "draft";
  inviteCode: string;
  studentsCount: number;
  lastActivityAt?: string;
}

export interface ClassroomDetailStudent {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatarUrl?: string;
  progressPercent: number;
}

export interface ClassDetailStudent {
  id: string;
  fullName: string;
  progressPercent: number;
  lastActivity?: string;
}

export interface ClassDetailData {
  classId: string;
  className: string;
  classCode: string;
  students: ClassDetailStudent[];
}

export interface ClassDetailViewProps {
  classId: string;
}

export interface GetClassroomDetailResponse {
  classroom: ClassroomDetail;
  students: ClassroomDetailStudent[];
}

export interface ClassroomProgressMatrixLesson {
  id: string;
  title: string;
}

export interface ClassroomProgressMatrixStudent {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ClassroomProgressCell {
  studentId: string;
  lessonId: string;
  progressPercent: number;
  completed: boolean;
  score?: number;
  lastActivityAt?: string;
}

export interface GetClassroomProgressResponse {
  classroomId: string;
  lessons: ClassroomProgressMatrixLesson[];
  students: ClassroomProgressMatrixStudent[];
  matrix: ClassroomProgressCell[];
}
