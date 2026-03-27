export interface TeacherDashboardHeroStat {
  id: string;
  value: string;
  label: string;
}

export interface TeacherDashboardHeroProps {
  title: string;
  subtitle: string;
  stats: TeacherDashboardHeroStat[];
}

export interface TeacherNeedsAttentionStudent {
  id: string;
  name: string;
  className: string;
  issue: string;
}

export interface TeacherNeedsAttentionSectionProps {
  title?: string;
  students: TeacherNeedsAttentionStudent[];
}

export interface TeacherBottomNavItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  href?: string;
}

export interface TeacherDashboardBottomNavigationProps {
  items: TeacherBottomNavItem[];
}
