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
    <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Alumno</th>
            {lessons.map((lesson) => (
              <th
                key={lesson.id}
                className="text-center px-4 py-3 font-semibold text-gray-700"
              >
                {lesson.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b last:border-b-0">
              <td className="px-4 py-3 text-gray-700 font-medium">
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
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {progress.progressPercent}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
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
