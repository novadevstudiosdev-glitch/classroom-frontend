"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  TeacherDashboardBottomNavigation,
  TeacherDashboardTopbar,
} from "@/features/dashboard/teacher/components";
import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import { createLesson } from "../services";

const subjectOptions = ["Matematica", "Lengua", "Ciencias", "Historia", "Geografia", "Ingles", "Tecnologia", "Arte"];
const difficultyOptions = ["facil", "medio", "dificil"] as const;
const educationLevelOptions = ["primaria", "secundaria", "bachillerato"] as const;
const iconOptions = ["📘", "🧮", "🧪", "🗺️", "💻", "🎨", "🧠", "📝"];
const defaultIconBySubject: Record<string, string> = {
  Matematica: "🧮",
  Lengua: "📘",
  Ciencias: "🧪",
  Historia: "🗺️",
  Geografia: "🌎",
  Ingles: "🗣️",
  Tecnologia: "💻",
  Arte: "🎨",
};

const gradeByLevel: Record<(typeof educationLevelOptions)[number], string[]> = {
  primaria: ["1° Primaria", "2° Primaria", "3° Primaria", "4° Primaria", "5° Primaria", "6° Primaria"],
  secundaria: ["1° Secundaria", "2° Secundaria", "3° Secundaria", "4° Secundaria", "5° Secundaria", "6° Secundaria"],
  bachillerato: ["1° Bachillerato", "2° Bachillerato", "3° Bachillerato"],
};

const CreateLessonView = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [educationLevel, setEducationLevel] = useState<(typeof educationLevelOptions)[number]>("primaria");
  const [grade, setGrade] = useState(gradeByLevel.primaria[3]);
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [difficulty, setDifficulty] = useState("");
  const [icon, setIcon] = useState(defaultIconBySubject[subjectOptions[0]]);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const levelGrades = useMemo(() => gradeByLevel[educationLevel], [educationLevel]);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!title.trim()) nextErrors.title = "El titulo es obligatorio.";
    if (!educationLevel.trim()) nextErrors.educationLevel = "El nivel educativo es obligatorio.";
    if (!grade.trim()) nextErrors.grade = "El grado/año es obligatorio.";
    if (!difficulty.trim()) nextErrors.difficulty = "La dificultad es obligatoria.";
    if (!subject.trim()) nextErrors.subject = "La materia es obligatoria.";
    if (!icon.trim()) nextErrors.icon = "El icono es obligatorio.";
    if (!description.trim()) nextErrors.description = "La descripcion es obligatoria.";

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const bottomNavigationItems = [
    { id: "home", icon: "🏠", label: "Inicio", href: "/dashboard/teacher" },
    { id: "lessons", icon: "📚", label: "Lecciones", isActive: true, href: "/lessons" },
    { id: "builder", icon: "🧩", label: "Crear ejercicios", href: "/lesson-builder" },
  ];

  const handleCreateLesson = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("El titulo es obligatorio.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const lesson = await createLesson({
        title: trimmedTitle,
        description: description.trim() || `Leccion de ${subject} para ${grade} (${difficulty}) - ${educationLevel}.`,
        education_level: educationLevel,
        subject,
        grade,
        difficulty: difficulty as "facil" | "medio" | "dificil",
        icon,
        content_json: { blocks: [] },
      });

      setShowConfirmModal(false);
      router.push(`/lesson-builder?lessonId=${lesson.id}`);
    } catch {
      setError("No se pudo crear la leccion. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <AuthBackgroundCanvas />
      </div>

      <div className="landing-module-shell relative z-10 pb-24">
        <TeacherDashboardTopbar />

        <div className="landing-module-content space-y-6 px-6 py-8">
          <section className="cosmic-hero">
            <div className="cosmic-hero-content">
              <span className="cosmic-badge"><span className="cosmic-badge-dot" />Nueva leccion</span>
              <h1 className="cosmic-title">Crear leccion</h1>
              <p className="cosmic-subtitle">Define la informacion base y luego continua en el constructor.</p>
            </div>
          </section>

          <section className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setError(null);
                if (!validateForm()) return;
                setShowConfirmModal(true);
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <label className="space-y-2 text-sm text-white/85 block">
                    Titulo de la leccion *
                    <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full rounded-xl bg-white/12 px-3 py-2 text-white outline-none ring-1 ring-white/20" />
                    {fieldErrors.title ? <span className="text-xs text-red-200">{fieldErrors.title}</span> : null}
                  </label>
                  <label className="space-y-2 text-sm text-white/85 block">
                    Nivel educativo *
                    <select value={educationLevel} onChange={(e)=> {
                      const nextLevel = e.target.value as (typeof educationLevelOptions)[number];
                      setEducationLevel(nextLevel);
                      setGrade(gradeByLevel[nextLevel][0]);
                    }} className="w-full rounded-xl bg-white/12 px-3 py-2 text-white outline-none ring-1 ring-white/20">
                      {educationLevelOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                    </select>
                    {fieldErrors.educationLevel ? <span className="text-xs text-red-200">{fieldErrors.educationLevel}</span> : null}
                  </label>
                  <label className="space-y-2 text-sm text-white/85 block">
                    Grado/Año *
                    <select value={grade} onChange={(e)=>setGrade(e.target.value)} className="w-full rounded-xl bg-white/12 px-3 py-2 text-white outline-none ring-1 ring-white/20">
                      {levelGrades.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                    </select>
                    {fieldErrors.grade ? <span className="text-xs text-red-200">{fieldErrors.grade}</span> : null}
                  </label>
                </div>
                <div className="space-y-4">
                  <label className="space-y-2 text-sm text-white/85 block">
                    Dificultad *
                    <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} className="w-full rounded-xl bg-white/12 px-3 py-2 text-white outline-none ring-1 ring-white/20">
                      <option value="" className="text-black">Selecciona dificultad</option>
                      {difficultyOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                    </select>
                    {fieldErrors.difficulty ? <span className="text-xs text-red-200">{fieldErrors.difficulty}</span> : null}
                  </label>
                  <label className="space-y-2 text-sm text-white/85 block">
                    Materia *
                    <select value={subject} onChange={(e)=> {
                      const nextSubject = e.target.value;
                      setSubject(nextSubject);
                      setIcon(defaultIconBySubject[nextSubject] ?? "📘");
                    }} className="w-full rounded-xl bg-white/12 px-3 py-2 text-white outline-none ring-1 ring-white/20">
                      {subjectOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                    </select>
                    {fieldErrors.subject ? <span className="text-xs text-red-200">{fieldErrors.subject}</span> : null}
                  </label>
                  <label className="space-y-2 text-sm text-white/85 block">
                    Icono de la leccion
                    <select value={icon} onChange={(e)=>setIcon(e.target.value)} className="w-full rounded-xl bg-white/12 px-3 py-2 text-white outline-none ring-1 ring-white/20">
                      {iconOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                    </select>
                    {fieldErrors.icon ? <span className="text-xs text-red-200">{fieldErrors.icon}</span> : null}
                  </label>
                </div>
                <label className="space-y-2 text-sm text-white/85 block md:col-span-2">
                  Descripcion *
                  <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} className="w-full rounded-xl bg-white/12 px-3 py-2 text-white outline-none ring-1 ring-white/20" />
                  {fieldErrors.description ? <span className="text-xs text-red-200">{fieldErrors.description}</span> : null}
                </label>
              </div>

              {error ? <p className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-100">{error}</p> : null}

              <div className="flex items-center gap-3">
                <button type="submit" disabled={isSaving} className="rounded-xl bg-gradient-to-r from-emerald-400/85 to-cyan-400/85 px-4 py-2 text-sm font-black text-[#03212a] disabled:opacity-60">
                  Crear y continuar
                </button>
                <Link href="/lessons" className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500/25 hover:text-red-100">Cancelar</Link>
              </div>
            </form>
          </section>
        </div>

        {showConfirmModal ? (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#020617]/70 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#070c22] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
              <h3 className="text-lg font-black text-white">Confirmar informacion de la leccion</h3>
              <div className="mt-4 grid gap-2 text-sm text-white/85 md:grid-cols-2">
                <p><span className="font-semibold text-white">Titulo:</span> {title || "-"}</p>
                <p><span className="font-semibold text-white">Nivel:</span> {educationLevel}</p>
                <p><span className="font-semibold text-white">Grado/Año:</span> {grade}</p>
                <p><span className="font-semibold text-white">Materia:</span> {subject}</p>
                <p><span className="font-semibold text-white">Dificultad:</span> {difficulty}</p>
                <p><span className="font-semibold text-white">Icono:</span> {icon}</p>
              </div>
              <p className="mt-3 text-sm text-white/70">
                {description.trim() || "Sin descripcion personalizada."}
              </p>
              <div className="mt-5 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowConfirmModal(false)} className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white">
                  Editar
                </button>
                <button type="button" onClick={handleCreateLesson} disabled={isSaving} className="rounded-xl bg-gradient-to-r from-emerald-400/85 to-cyan-400/85 px-4 py-2 text-sm font-black text-[#03212a] transition hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-60">
                  {isSaving ? "Creando..." : "Confirmar y crear"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <TeacherDashboardBottomNavigation items={bottomNavigationItems} />
      </div>
    </main>
  );
};

export default CreateLessonView;
