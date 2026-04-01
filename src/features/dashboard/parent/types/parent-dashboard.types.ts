export type ParentProfile = {
  initials: string;
  greeting: string;
  name: string;
};

export type ParentChild = {
  id: string;
  name: string;
  levelLabel: string;
  mascotEmoji: string;
};

export type ParentStreak = {
  days: number;
  label: string;
};

export type ParentLastSessionReport = {
  dateLabel: string;
  durationLabel: string;
  xpGained: number;
  solvedExercises: number;
};

export type ParentClassProgressItem = {
  id: string;
  className: string;
  completionPercent: number;
  completedLessons: number;
  totalLessons: number;
};

export type ParentRecentLesson = {
  id: string;
  icon: string;
  title: string;
  subject: string;
  dateLabel: string;
  stars: 1 | 2 | 3;
  xp: number;
};

export type ParentWeeklyActivityItem = {
  dayLabel: string;
  value: number;
};

export type ParentWeeklyXpItem = {
  dayLabel: string;
  xp: number;
};

export type ParentCompletedLesson = {
  id: string;
  title: string;
  subject: string;
  completedAtLabel: string;
  score: number;
};

export type ParentBottomNavigationItem = {
  id: string;
  icon: string;
  label: string;
  isActive?: boolean;
  href?: string;
};

export type ParentDashboardData = {
  profile: ParentProfile;
  children: ParentChild[];
  streak: ParentStreak;
  lastSessionReport: ParentLastSessionReport;
  classProgress: ParentClassProgressItem[];
  completedLessons: ParentCompletedLesson[];
  weeklyXp: ParentWeeklyXpItem[];
  recentLessons: ParentRecentLesson[];
  weeklyActivity: ParentWeeklyActivityItem[];
  bottomNavigation: ParentBottomNavigationItem[];
};

export type ParentChildrenSelectorProps = {
  items: ParentChild[];
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
};

export type ParentDashboardTopbarProps = {
  profile: ParentProfile;
};

export type ParentStreakCardProps = {
  streak: ParentStreak;
};

export type ParentLastSessionReportCardProps = {
  report: ParentLastSessionReport;
};

export type ParentClassProgressListProps = {
  items: ParentClassProgressItem[];
};

export type ParentRecentLessonsListProps = {
  lessons: ParentRecentLesson[];
};

export type ParentCompletedLessonsListProps = {
  lessons: ParentCompletedLesson[];
};

export type ParentWeeklyActivityChartProps = {
  activity: ParentWeeklyActivityItem[];
};

export type ParentWeeklyXpChartProps = {
  items: ParentWeeklyXpItem[];
};

export type ParentBottomNavigationProps = {
  items: ParentBottomNavigationItem[];
};
