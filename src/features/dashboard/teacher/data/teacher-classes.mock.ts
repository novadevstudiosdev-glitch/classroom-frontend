import type { TeacherClass } from '@/features/dashboard/teacher/types'

export const TEACHER_CLASSES_MOCK: TeacherClass[] = [
  {
    id: 'MAT4A-2026',
    emoji: '🔢',
    name: 'Matemática 4° A',
    studentCount: 24,
    isActive: true,
    completionPercent: 87,
    activeToday: 18,
    behind: 3,
    code: 'MAT4A-2026'
  },
  {
    id: 'LEN4B-2026',
    emoji: '📖',
    name: 'Lengua 4° B',
    studentCount: 22,
    isActive: true,
    completionPercent: 92,
    activeToday: 15,
    behind: 1,
    code: 'LEN4B-2026'
  }
]
