import type { LessonBuilderData } from "@/features/lesson-builder/types";

export const LESSON_BUILDER_MOCK: LessonBuilderData = {
  className: "Matemática 4° A",
  draftLabel: "Borrador",
  metrics: [
    { id: "exercises", label: "Ejercicios", value: "12" },
    { id: "points", label: "Puntos", value: "240" },
    { id: "duration", label: "Duración total", value: "45 min" },
    { id: "students", label: "Estudiantes", value: "24" },
  ],
  video: {
    title: "Introducción a las sumas",
    subtitle: "Video inicial para contextualizar la lección y objetivos.",
  },
  exercises: [
    {
      id: "ex-1",
      title: "Suma básica",
      subtitle: "Selecciona la respuesta correcta para cada operación.",
      duration: "4 min",
      points: 10,
    },
    {
      id: "ex-2",
      title: "Problemas con manzanas",
      subtitle: "Resuelve situaciones cotidianas usando sumas y restas.",
      duration: "6 min",
      points: 15,
    },
    {
      id: "ex-3",
      title: "Desafío rápido",
      subtitle: "Completa 5 preguntas contrarreloj.",
      duration: "3 min",
      points: 8,
    },
  ],
  minigames: [
    {
      id: "quiz-relampago",
      name: "Quiz relámpago",
      description: "Preguntas rápidas contra reloj.",
    },
    {
      id: "memoria-numerica",
      name: "Memoria numérica",
      description: "Empareja operaciones y resultados.",
    },
    {
      id: "arrastra-resuelve",
      name: "Arrastra y resuelve",
      description: "Completa ejercicios moviendo piezas.",
    },
    {
      id: "reto-final",
      name: "Reto final",
      description: "Desafío mixto con puntaje acumulado.",
    },
  ],
  aiTools: {
    title: "Herramientas IA",
    subtitle: "Acelera la creación de la lección con sugerencias automáticas.",
    items: [
      { id: "ai-1", label: "Generar enunciado" },
      { id: "ai-2", label: "Sugerir pistas" },
      { id: "ai-3", label: "Reescribir instrucciones" },
      { id: "ai-4", label: "Crear variación de ejercicio" },
    ],
  },
  settings: {
    grade: "4° Primaria",
    subject: "Matemáticas",
    difficulty: "medio",
  },
  performance: {
    completionRate: "87%",
    averageScore: "8.9 / 10",
    averageTime: "14 min",
  },
};
