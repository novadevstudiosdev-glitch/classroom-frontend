import type {
  ClassroomProgressCell,
  ClassroomProgressMatrixLesson,
  ClassroomProgressMatrixStudent,
} from '@/features/dashboard/teacher/types'

type ClassProgressMatrixTableProps = {
  lessons: ClassroomProgressMatrixLesson[]
  students: ClassroomProgressMatrixStudent[]
  matrix: ClassroomProgressCell[]
}

const ClassProgressMatrixTable = ({
  lessons,
  students,
  matrix,
}: ClassProgressMatrixTableProps) => {
  const getProgress = (studentId: string, lessonId: string) => {
    return matrix.find(
      (cell) => cell.studentId === studentId && cell.lessonId === lessonId,
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/10 shadow-sm backdrop-blur-md">
      <table className="min-w-full text-sm">
        <thead className="border-b border-white/20 bg-white/10">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-white">Alumno</th>
            {lessons.map((lesson) => (
              <th
                key={lesson.id}
                className="px-4 py-3 text-center font-semibold text-white"
              >
                {lesson.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b border-white/10 last:border-b-0">
              <td className="px-4 py-3 font-medium text-white">
                {student.firstName} {student.lastName}
              </td>
              {lessons.map((lesson) => {
                const progress = getProgress(student.id, lesson.id)
                return (
                  <td key={`${student.id}-${lesson.id}`} className="px-4 py-3 text-center">
                    {progress ? (
                      <span
                        className={`inline-flex items-center justify-center min-w-14 px-2 py-1 rounded-full text-xs font-bold ${
                          progress.completed
                            ? 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]'
                            : 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                        }`}
                      >
                        {progress.progressPercent}%
                      </span>
                    ) : (
                      <span className="text-white/50">-</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ClassProgressMatrixTable
