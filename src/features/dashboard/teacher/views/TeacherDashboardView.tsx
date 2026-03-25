"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AddClassButton,
  ArchiveClassModal,
  EditClassModal,
  NewClassModal,
  TeacherDashboardTopbar,
  ClassCard,
  TeacherDashboardHero,
  TeacherNeedsAttentionSection,
  TeacherDashboardBottomNavigation,
} from "@/features/dashboard/teacher/components";
import { TeacherClass } from "../types";
import { TEACHER_CLASSES_MOCK } from "../data";
import { getTeacherClassrooms } from "../services";

const TeacherDashboardView = () => {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>(TEACHER_CLASSES_MOCK);
  const heroStats = [
    { id: "students", value: "24", label: "Alumnos" },
    { id: "lessons", value: "12", label: "Lecciones" },
    { id: "completion", value: "87%", label: "Completitud" },
  ];
  const studentsNeedingAttention = [
    {
      id: "student-1",
      name: "Joaquín Pérez",
      issue: "Sin actividad hace 3 días",
      className: "Matemática 4° A",
    },
    {
      id: "student-2",
      name: "Sofía Gómez",
      issue: "2 lecciones atrasadas",
      className: "Lengua 4° B",
    },
    {
      id: "student-3",
      name: "Lucas Martínez",
      issue: "Racha perdida",
      className: "Matemática 4° A",
    },
  ];
  const bottomNavigationItems = [
    { id: "home", icon: "🏠", label: "Inicio", isActive: true, href: "/dashboard/teacher" },
    { id: "lessons", icon: "📚", label: "Lecciones", href: "/lessons" },
    { id: "students", icon: "👥", label: "Alumnos", href: "/dashboard/teacher/students" },
    { id: "progress", icon: "📊", label: "Progreso", href: "/dashboard/teacher/progress" },
  ];

  useEffect(() => {
    let mounted = true;

    const loadTeacherClassrooms = async () => {
      try {
        const response = await getTeacherClassrooms();
        if (!mounted || response.length === 0) return;
        setClasses(response);
      } catch {
        // para cuando funione el back....
      }
    };

    loadTeacherClassrooms();

    return () => {
      mounted = false;
    };
  }, []);

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
      <TeacherDashboardHero
        title="¡Bienvenido/a de nuevo! 👋"
        subtitle="Lunes, 16 de marzo de 2026"
        stats={heroStats}
      />

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
              onView={() =>
                router.push(`/dashboard/teacher/classes/${item.id ?? item.code}`)
              }
              onEdit={() => handleOpenEditModal(item)}
              onArchive={() => handleOpenArchiveModal(item)}
            />
          ))}
        </div>
      </div>

      <TeacherNeedsAttentionSection students={studentsNeedingAttention} />

      <TeacherDashboardBottomNavigation items={bottomNavigationItems} />
    </div>
  );
};

export default TeacherDashboardView;
