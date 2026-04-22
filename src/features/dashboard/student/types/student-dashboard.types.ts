export type StudentProfile = {
  id: string;
  user_id?: string;
  alias: string;
  email?: string;
  avatar_id?: string;
  bio?: string;
  status_message?: string;
  birth_date?: string;
};

export type StudentFeedItem = {
  id: string;
  title: string;
  type: "lesson" | "minigame" | string;
  progress_percent?: number;
  class_name?: string;
  updated_at?: string;
};

export type StudentFeedClass = {
  classroom_id?: string;
  class_name?: string;
  items?: StudentFeedItem[];
};

export type StudentFeed = {
  classes?: StudentFeedClass[];
};

export type StudentParentRequest = {
  id: string;
  parent_name?: string;
  parent_email?: string;
  created_at?: string;
};

export type UpdateStudentProfileInput = {
  alias?: string;
  avatar_id?: string;
  bio?: string;
  status_message?: string;
  birth_date?: string;
};

export type StudentSubjectCard = {
  name: string;
  progress: number;
  icon: string;
  color: string;
};

export type StudentActivityItem = {
  id: string;
  title: string;
  whenLabel: string;
  scoreLabel: string;
  icon: string;
};

export type StudentLeaderboardRow = {
  id: string;
  rank: number;
  name: string;
  xp: number;
};

export type StudentBadge = {
  id: string;
  icon: string;
  name: string;
  unlocked: boolean;
};

export type StudentMissionSummary = {
  title: string;
  description: string;
  completed: number;
  total: number;
  rewardXp: number;
};

export type StudentDashboardData = {
  profile: StudentProfile;
  subjects: StudentSubjectCard[];
  recentActivity: StudentActivityItem[];
  leaderboard: StudentLeaderboardRow[];
  badges: StudentBadge[];
  streakDays: number;
  mission: StudentMissionSummary;
  parentLinkCode: string | null;
  pendingParentRequests: StudentParentRequest[];
};

export type StudentDashboardState = {
  data: StudentDashboardData;
  loading: boolean;
  error: string | null;
};
