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
import { BackForwardNavigation } from "@/shared/components/ui";

const ClassDetailView = ({classId}: ClassDetailViewProps) => {
  const [activeTab, setActiveTab] = useState<"students" | "progress">("students");
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
      <section className="mb-4">
        <BackForwardNavigation
          previous={{ href: "/dashboard/teacher", label: "Atras" }}
        />
      </section>

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{classDetail.className}</h1>
        <p className="text-sm text-gray-500">Código: {classDetail.classCode}</p>
      </header>

      <section className="mb-6">
        <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "students"
                ? "bg-orange-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Lista de alumnos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "progress"
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Tabla de progreso
          </button>
        </div>
      </section>

      {activeTab === "students" && (
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-3">Lista de alumnos</h2>
          <StudentsProgressTable students={classDetail.students} />
        </section>
      )}

      {activeTab === "progress" && (
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-3">
            Tabla de progreso de la clase
          </h2>
          {classProgress ? (
            <ClassProgressMatrixTable
              lessons={classProgress.lessons}
              students={classProgress.students}
              matrix={classProgress.matrix}
            />
          ) : (
            <p className="text-sm text-gray-500">No hay datos de progreso para esta clase.</p>
          )}
        </section>
      )}
    </main>
  )
}

export default ClassDetailView
