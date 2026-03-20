"use client";

import React from "react";
import { useState } from "react";
import {
  AddClassButton,
  ArchiveClassModal,
  EditClassModal,
  NewClassModal,
  TeacherDashboardTopbar,
  ClassCard,
} from "@/features/dashboard/teacher/components";
import { TeacherClass } from "../types";

const initialClasses: TeacherClass[] = [
  {
    emoji: "🔢",
    name: "Matemática 4° A",
    studentCount: 24,
    isActive: true,
    completionPercent: 87,
    activeToday: 18,
    behind: 3,
    code: "MAT4A-2026",
  },
  {
    emoji: "📖",
    name: "Lengua 4° B",
    studentCount: 22,
    isActive: true,
    completionPercent: 92,
    activeToday: 15,
    behind: 1,
    code: "LEN4B-2026",
  },
];

const TeacherDashboardView = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>(initialClasses);

  const handleCreateClass = (data: TeacherClass) => {
    setClasses((prev) => [data, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (classItem: TeacherClass) => {
    setSelectedClass(classItem);
    setIsEditModalOpen(true);
  };

  const handleOpenArchiveModal = (classItem: TeacherClass) => {
    setSelectedClass(classItem);
    setIsArchiveModalOpen(true);
  };

  const handleEditClass = (updatedClass: TeacherClass) => {
    const originalCode = selectedClass?.code;
    setClasses((prev) =>
      prev.map((item) =>
        item.code === originalCode ? updatedClass : item,
      ),
    );
    setIsEditModalOpen(false);
    setSelectedClass(null);
  };

  const handleArchiveClass = (classCode: string) => {
    setClasses((prev) =>
      prev.map((item) =>
        item.code === classCode ? { ...item, isActive: false } : item,
      ),
    );
    setIsArchiveModalOpen(false);
    setSelectedClass(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClass(null);
  };

  const handleCloseArchiveModal = () => {
    setIsArchiveModalOpen(false);
    setSelectedClass(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TeacherDashboardTopbar />
      {/* ----------Hero azul-------------- */}
      <div className="bg-[#1CB0F6] px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido/a de nuevo! 👋</h1>
        <p className="text-sm text-white/80 mb-6">Lunes, 16 de marzo de 2026</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">24</p>
            <p className="text-xs text-white/80">Alumnos</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">12</p>
            <p className="text-xs text-white/80">Lecciones</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">87%</p>
            <p className="text-xs text-white/80">Completitud</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <AddClassButton onClick={() => setIsCreateModalOpen(true)} />
      </div>

      <NewClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClass}
      />

      <EditClassModal
        key={selectedClass?.code ?? "edit-modal-empty"}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        initialData={selectedClass}
        onSubmit={handleEditClass}
      />

      <ArchiveClassModal
        isOpen={isArchiveModalOpen}
        onClose={handleCloseArchiveModal}
        classData={selectedClass}
        onConfirm={handleArchiveClass}
      />

      {/* Mis clases */}
      <div className="px-6 pb-6 ">
        <h2 className="text-xl text-gray-600 font-bold mb-4 ">Mis clases</h2>
        <div className="space-y-4">
          {classes.map((item) => (
            <ClassCard
              key={item.code}
              {...item}
              onView={() => console.log("Ver", item.code)}
              onEdit={() => handleOpenEditModal(item)}
              onArchive={() => handleOpenArchiveModal(item)}
            />
          ))}
        </div>
      </div>

      {/* Alumnos que necesitan atención */}
      <div className="px-6 pb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-600">
          Alumnos que necesitan atención
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border divide-y">
          {[
            {
              name: "Joaquín Pérez",
              issue: "Sin actividad hace 3 días",
              class: "Matemática 4° A",
            },
            {
              name: "Sofía Gómez",
              issue: "2 lecciones atrasadas",
              class: "Lengua 4° B",
            },
            {
              name: "Lucas Martínez",
              issue: "Racha perdida",
              class: "Matemática 4° A",
            },
          ].map((student, index) => (
            <div key={index} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                {student.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-600">
                  {student.name}
                </p>
                <p className="text-xs text-gray-600">{student.class}</p>
                <p className="text-xs text-[#FF9600] font-medium mt-1">
                  {student.issue}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center gap-1">
            <span className="text-2xl">🏠</span>
            <span className="text-xs text-[#1CB0F6] font-bold">Inicio</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <span className="text-2xl opacity-40">📚</span>
            <span className="text-xs text-gray-400">Lecciones</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <span className="text-2xl opacity-40">👥</span>
            <span className="text-xs text-gray-400">Alumnos</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <span className="text-2xl opacity-40">📊</span>
            <span className="text-xs text-gray-400">Progreso</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardView;
