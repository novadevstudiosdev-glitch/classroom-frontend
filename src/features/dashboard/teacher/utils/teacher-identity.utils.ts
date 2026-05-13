import type { TeacherProfile } from "../services";

export const getTeacherFullName = (profile: Pick<TeacherProfile, "first_name" | "last_name">) => {
  return `${profile.first_name} ${profile.last_name}`.trim();
};

export const getTeacherInitials = (name: string) => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "D"
  );
};

export const formatTeacherPlan = (plan?: string) => {
  if (!plan) return "Plan";
  return `Plan ${plan.charAt(0).toUpperCase()}${plan.slice(1)}`;
};
