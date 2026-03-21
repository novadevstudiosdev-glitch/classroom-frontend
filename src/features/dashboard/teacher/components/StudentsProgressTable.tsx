import React from 'react'
import StudentProgressRow from "./StudentProgressRow";
import type { ClassDetailStudent } from "@/features/dashboard/teacher/types";

type StudentsProgressTableProps = {
  students: ClassDetailStudent[];
};

const StudentsProgressTable = ({ students }: StudentsProgressTableProps) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      {students.map((student) => (
        <StudentProgressRow key={student.id} student={student} />
      ))}
    </div>
  )
}

export default StudentsProgressTable
