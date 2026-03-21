"use client";

import React, { useEffect, useState } from 'react'
import {
  CLASS_PROGRESS_MATRIX_MOCK,
  CLASS_STUDENTS_PROGRESS_MOCK,
} from "@/features/dashboard/teacher/data";
import {
  ClassProgressMatrixTable,
  StudentsProgressTable,
} from "@/features/dashboard/teacher/components";
import type { ClassDetailData, ClassDetailViewProps } from "@/features/dashboard/teacher/types";
import { getClassroomDetailById } from "@/features/dashboard/teacher/services";

const ClassDetailView = ({classId}: ClassDetailViewProps) => {
  const [classDetail, setClassDetail] = useState<ClassDetailData | null>(() =>
    CLASS_STUDENTS_PROGRESS_MOCK.find((c) => c.classId === classId) ?? null,
  );

  useEffect(() => {
    let mounted = true;

    const loadClassDetail = async () => {
      try {
        const response = await getClassroomDetailById(classId);
        if (!mounted) return;
        setClassDetail(response);
      } catch {
        if (!mounted) return;
        setClassDetail(
          CLASS_STUDENTS_PROGRESS_MOCK.find((c) => c.classId === classId) ?? null,
        );
      }
    };

    loadClassDetail();

    return () => {
      mounted = false;
    };
  }, [classId]);

  const classProgress = CLASS_PROGRESS_MATRIX_MOCK.find(
    (progress) => progress.classroomId === classId,
  );
  if (!classDetail) {
    return (
      <main className="min-h-screen p-6">
        <p className="text-gray-600">Clase no encontrada.</p>
      </main>
    );
  }
  return (
     <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{classDetail.className}</h1>
        <p className="text-sm text-gray-500">Código: {classDetail.classCode}</p>
      </header>

      <section>
        <h2 className="text-lg font-bold text-gray-700 mb-3">Lista de alumnos</h2>
        <StudentsProgressTable students={classDetail.students} />
      </section>

      {classProgress && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-gray-700 mb-3">
            Tabla de progreso de la clase
          </h2>
          <ClassProgressMatrixTable
            lessons={classProgress.lessons}
            students={classProgress.students}
            matrix={classProgress.matrix}
          />
        </section>
      )}
    </main>
  )
}

export default ClassDetailView
