import { create } from "zustand";
import { getTeacherProfile, type TeacherProfile } from "../services";
import { formatTeacherPlan, getTeacherFullName, getTeacherInitials } from "../utils/teacher-identity.utils";

type TeacherIdentity = {
  teacherName: string;
  initials: string;
  planLabel: string;
};

type TeacherIdentityStore = {
  profile: TeacherProfile | null;
  identity: TeacherIdentity;
  status: "idle" | "loading" | "ready" | "error";
  ensureLoaded: () => Promise<void>;
  setFromProfile: (profile: TeacherProfile) => void;
  reset: () => void;
};

const defaultIdentity: TeacherIdentity = {
  teacherName: "Docente",
  initials: "D",
  planLabel: "Plan",
};

const buildIdentity = (profile: TeacherProfile): TeacherIdentity => {
  const teacherName = getTeacherFullName(profile) || defaultIdentity.teacherName;
  return {
    teacherName,
    initials: getTeacherInitials(teacherName),
    planLabel: formatTeacherPlan(profile.plan_type),
  };
};

export const useTeacherIdentityStore = create<TeacherIdentityStore>((set, get) => ({
  profile: null,
  identity: defaultIdentity,
  status: "idle",

  ensureLoaded: async () => {
    const { status } = get();
    if (status === "loading" || status === "ready") {
      return;
    }

    set({ status: "loading" });

    try {
      const profile = await getTeacherProfile();
      set({
        profile,
        identity: buildIdentity(profile),
        status: "ready",
      });
    } catch {
      set({ status: "error" });
    }
  },

  setFromProfile: (profile) => {
    set({
      profile,
      identity: buildIdentity(profile),
      status: "ready",
    });
  },

  reset: () => {
    set({
      profile: null,
      identity: defaultIdentity,
      status: "idle",
    });
  },
}));
