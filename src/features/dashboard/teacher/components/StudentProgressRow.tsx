import React from 'react'
import type { ClassDetailStudent } from "@/features/dashboard/teacher/types";


type StudentProgressRowProps = {
  student: ClassDetailStudent;
};

const StudentProgressRow = ({ student }: StudentProgressRowProps) => {

  return (
    <div className="flex items-center justify-between border-b border-white/15 p-4 last:border-b-0">
      <div>
        <p className="font-semibold text-white">{student.fullName}</p>
        <p className="text-xs text-white/70">{student.lastActivity ?? "Sin actividad"}</p>
      </div>
      <div className="text-sm font-bold text-[var(--color-primary)]">{student.progressPercent}%</div>
    </div>
  )
}

export default StudentProgressRow
