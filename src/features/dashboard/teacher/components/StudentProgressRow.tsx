import React from 'react'
import type { ClassDetailStudent } from "@/features/dashboard/teacher/types";


type StudentProgressRowProps = {
  student: ClassDetailStudent;
};

const StudentProgressRow = ({ student }: StudentProgressRowProps) => {

  return (
    <div className="p-4 flex items-center justify-between border-b last:border-b-0">
      <div>
        <p className="font-semibold text-gray-800">{student.fullName}</p>
        <p className="text-xs text-gray-500">{student.lastActivity ?? "Sin actividad"}</p>
      </div>
      <div className="text-sm font-bold text-[#1CB0F6]">{student.progressPercent}%</div>
    </div>
  )
}

export default StudentProgressRow
