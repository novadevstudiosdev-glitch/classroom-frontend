
export interface TeacherClass {
  id?: string;
  emoji: string;
  name: string;
  studentCount: number;
  isActive: boolean;
  completionPercent: number;
  activeToday: number;
  behind: number;
  code: string;
}

export interface ClassCardProps extends TeacherClass {
  onView?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
}

export type NewClassData = TeacherClass;

export interface NewClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewClassData) => void;
}

export interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: TeacherClass | null;
  onSubmit: (data: TeacherClass) => void;
}

export interface ArchiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Pick<TeacherClass, "name" | "code"> | null;
  onConfirm: (classCode: string) => void;
}

/* Swagger-confirmed parts */
export interface UpdateClassroomParams {
  id: string;
}

export interface UpdateClassroomRequest {
  name?: string;
  description?: string;
  grade_level?: string;
  is_archived?: boolean;
}

export interface RegenerateClassroomCodeParams {
  id: string;
}

export interface RegenerateClassroomCodeResponse {
  invite_code: string;
}

export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}
