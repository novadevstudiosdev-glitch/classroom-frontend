export type SessionStore = {
  sessionId: string | null;
  courseId: string | null;
  classroomId: string | null;
  startedAt: number | null;
  lastActivityAt: number | null;
  online: boolean;
  startSession: (sessionId: string) => void;
  endSession: () => void;
  setCourseId: (courseId: string | null) => void;
  setClassroomId: (classroomId: string | null) => void;
  setOnline: (online: boolean) => void;
  touch: () => void;
};
