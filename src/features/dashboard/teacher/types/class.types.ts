
export interface TeacherClass {
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
