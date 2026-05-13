import { create } from "zustand";
import type { SessionStore } from "@/types/session.types";

export const useSessionStore = create<SessionStore>((set) => ({
  sessionId: null,
  courseId: null,
  classroomId: null,
  startedAt: null,
  lastActivityAt: null,
  online: true,

  startSession: (sessionId: string) =>
    set({
      sessionId,
      startedAt: Date.now(),
      lastActivityAt: Date.now(),
    }),

  endSession: () =>
    set({
      sessionId: null,
      courseId: null,
      classroomId: null,
      startedAt: null,
      lastActivityAt: null,
    }),

  setCourseId: (courseId: string | null) => set({ courseId }),
  setClassroomId: (classroomId: string | null) => set({ classroomId }),
  setOnline: (online: boolean) => set({ online }),
  touch: () => set({ lastActivityAt: Date.now() }),
}));
