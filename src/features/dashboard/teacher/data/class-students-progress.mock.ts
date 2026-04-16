import type {
  ClassDetailData,
  GetClassroomProgressResponse,
} from '@/features/dashboard/teacher/types'

export const CLASS_STUDENTS_PROGRESS_MOCK: ClassDetailData[] = [
  {
    classId: 'MAT4A-2026',
    className: 'Matemática 4° A',
    classCode: 'MAT4A-2026',
    students: [
      {
        id: 's1',
        fullName: 'Salvador Gerardo De la Tijera Martínez',
        progressPercent: 87,
        lastActivity: 'Hoy',
      },
      {
        id: 's2',
        fullName: 'Sofía Gómez',
        progressPercent: 72,
        lastActivity: 'Ayer',
      },
    ],
  },
  {
    classId: 'LEN4B-2026',
    className: 'Lengua 4° B',
    classCode: 'LEN4B-2026',
    students: [
      {
        id: 's3',
        fullName: 'Lucas Martínez',
        progressPercent: 92,
        lastActivity: 'Hoy',
      },
      {
        id: 's4',
        fullName: 'Valentina Ruiz',
        progressPercent: 66,
        lastActivity: 'Hace 2 días',
      },
    ],
  },
]

export const CLASS_PROGRESS_MATRIX_MOCK: GetClassroomProgressResponse[] = [
  {
    classroomId: 'MAT4A-2026',
    lessons: [
      { id: 'l1', title: 'Lección 1' },
      { id: 'l2', title: 'Lección 2' },
      { id: 'l3', title: 'Lección 3' },
    ],
    students: [
      { id: 's1', firstName: 'Joaquín', lastName: 'Pérez' },
      { id: 's2', firstName: 'Sofía', lastName: 'Gómez' },
    ],
    matrix: [
      { studentId: 's1', lessonId: 'l1', progressPercent: 100, completed: true },
      { studentId: 's1', lessonId: 'l2', progressPercent: 90, completed: false },
      { studentId: 's1', lessonId: 'l3', progressPercent: 70, completed: false },
      { studentId: 's2', lessonId: 'l1', progressPercent: 100, completed: true },
      { studentId: 's2', lessonId: 'l2', progressPercent: 65, completed: false },
      { studentId: 's2', lessonId: 'l3', progressPercent: 50, completed: false },
    ],
  },
  {
    classroomId: 'LEN4B-2026',
    lessons: [
      { id: 'l4', title: 'Lectura 1' },
      { id: 'l5', title: 'Lectura 2' },
      { id: 'l6', title: 'Escritura' },
    ],
    students: [
      { id: 's3', firstName: 'Lucas', lastName: 'Martínez' },
      { id: 's4', firstName: 'Valentina', lastName: 'Ruiz' },
    ],
    matrix: [
      { studentId: 's3', lessonId: 'l4', progressPercent: 100, completed: true },
      { studentId: 's3', lessonId: 'l5', progressPercent: 95, completed: false },
      { studentId: 's3', lessonId: 'l6', progressPercent: 82, completed: false },
      { studentId: 's4', lessonId: 'l4', progressPercent: 88, completed: false },
      { studentId: 's4', lessonId: 'l5', progressPercent: 72, completed: false },
      { studentId: 's4', lessonId: 'l6', progressPercent: 60, completed: false },
    ],
  },
]
