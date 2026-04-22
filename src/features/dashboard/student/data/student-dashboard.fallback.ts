import type { StudentDashboardData } from "@/features/dashboard/student/types/student-dashboard.types";

export const STUDENT_DASHBOARD_FALLBACK: StudentDashboardData = {
  profile: {
    id: "local-student",
    alias: "Sofia",
  },
  mission: {
    title: "Completa 5 ejercicios de Matematica",
    description: "Ya vas muy bien. Solo te faltan 2 ejercicios mas.",
    completed: 3,
    total: 5,
    rewardXp: 150,
  },
  subjects: [
    { icon: "🔢", name: "Matematica", progress: 75, color: "#FFD84D" },
    { icon: "🔬", name: "Ciencias", progress: 60, color: "#34D399" },
    { icon: "📖", name: "Lengua", progress: 85, color: "#A855F7" },
    { icon: "🏛️", name: "Historia", progress: 45, color: "#FB923C" },
    { icon: "🎨", name: "Arte", progress: 90, color: "#F43F5E" },
    { icon: "💻", name: "Tecnologia", progress: 70, color: "#3B82F6" },
  ],
  recentActivity: [
    { id: "a-1", title: "Actividad", whenLabel: "Hace poco", scoreLabel: "95%", icon: "🔢" },
    { id: "a-2", title: "Actividad", whenLabel: "Hace poco", scoreLabel: "95%", icon: "🔢" },
    { id: "a-3", title: "Actividad", whenLabel: "Hace poco", scoreLabel: "95%", icon: "🔢" },
  ],
  leaderboard: [
    { id: "l-1", rank: 1, name: "Usuario", xp: 500 },
    { id: "l-2", rank: 2, name: "Usuario", xp: 500 },
    { id: "l-3", rank: 3, name: "Usuario", xp: 500 },
  ],
  badges: [
    { id: "b-1", icon: "🏆", name: "Primera Victoria", unlocked: true },
    { id: "b-2", icon: "📚", name: "Lector Avido", unlocked: true },
    { id: "b-3", icon: "🔥", name: "Racha de 7", unlocked: true },
    { id: "b-4", icon: "⭐", name: "Perfeccionista", unlocked: true },
    { id: "b-5", icon: "🎨", name: "Artista", unlocked: true },
    { id: "b-6", icon: "💎", name: "Nivel 10", unlocked: false },
    { id: "b-7", icon: "🚀", name: "Explorador", unlocked: false },
    { id: "b-8", icon: "👑", name: "Campeon", unlocked: false },
  ],
  streakDays: 7,
  parentLinkCode: null,
  pendingParentRequests: [],
};
