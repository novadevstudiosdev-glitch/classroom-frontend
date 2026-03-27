import React from 'react'
import StudentProgressRow from "./StudentProgressRow";
import type { ClassDetailStudent } from "@/features/dashboard/teacher/types";

type StudentsProgressTableProps = {
  students: ClassDetailStudent[];
};

const StudentsProgressTable = ({ students }: StudentsProgressTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-sm backdrop-blur-md">
      {students.map((student) => (
        <StudentProgressRow key={student.id} student={student} />
      ))}
    </div>
  )
}

export default StudentsProgressTable
