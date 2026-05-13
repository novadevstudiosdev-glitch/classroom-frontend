"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useStudentDashboard } from "@/features/dashboard/student/hooks";
import {
  confirmStudentParentRequest,
  getStudentLinkCode,
  getStudentParentRequests,
  rejectStudentParentRequest,
  type ParentRequest,
} from "@/services/students/students.service";
import { extractApiErrorMessage } from "@/lib/axios/extract-api-error-message";

export default function StudentDashboardPage() {
  const { data, loading, error } = useStudentDashboard();
  const [missionProgress, setMissionProgress] = useState(0);

  const [parentRequests, setParentRequests] = useState<ParentRequest[]>([]);
  const [linkCode, setLinkCode] = useState<string>("");
  const [requestsMessage, setRequestsMessage] = useState<string>("");
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [actingRequestId, setActingRequestId] = useState<string | null>(null);

  const missionPercent = useMemo(() => {
    if (!data.mission.total) return 0;
    return Math.round((data.mission.completed / data.mission.total) * 100);
  }, [data.mission.completed, data.mission.total]);

  useEffect(() => {
    setTimeout(() => setMissionProgress(missionPercent), 500);
  }, [missionPercent]);

  const refreshRequests = async () => {
    const [requests, codePayload] = await Promise.all([
      getStudentParentRequests(),
      getStudentLinkCode(),
    ]);
    setParentRequests(requests);
    setLinkCode(codePayload.link_code);
  };

  useEffect(() => {
    const load = async () => {
      setIsLoadingRequests(true);
      try {
        await refreshRequests();
      } catch (err) {
        setRequestsMessage(
          extractApiErrorMessage(err, "No se pudieron cargar tus solicitudes familiares.")
        );
      } finally {
        setIsLoadingRequests(false);
      }
    };
    void load();
  }, []);

  const handleParentRequest = async (requestId: string, action: "confirm" | "reject") => {
    setRequestsMessage("");
    setActingRequestId(requestId);
    try {
      if (action === "confirm") {
        const response = await confirmStudentParentRequest(requestId);
        setRequestsMessage(response.message ?? "Vinculacion confirmada.");
      } else {
        const response = await rejectStudentParentRequest(requestId);
        setRequestsMessage(response.message ?? "Solicitud rechazada.");
      }
      await refreshRequests();
    } catch (err) {
      setRequestsMessage(extractApiErrorMessage(err, "No se pudo actualizar la solicitud."));
    } finally {
      setActingRequestId(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <main className="p-6 pt-20 md:pt-6 sm:p-6 md:p-8 overflow-x-hidden">
        {/* HEADER */}
        <header className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            {`Hola, ${data.profile.alias}!`} 👋
          </h2>
          <p className="text-sm sm:text-base text-white">
            ¿Lista para otra aventura de aprendizaje?
          </p>
        </header>

        {loading ? (
          <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85">
            Cargando dashboard del alumno...
          </section>
        ) : null}

        {!loading && error ? (
          <section className="mb-6 rounded-2xl border border-red-300/40 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </section>
        ) : null}

        {/* FAMILIA */}
        <section className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article className="rounded-[20px] bg-[#ffffff25] p-4 sm:p-5 shadow-lg text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-white/75">
              Codigo para tu familia
            </p>
            <p className="mt-2 text-3xl font-black tracking-[0.08em]">
              {linkCode || "--------"}
            </p>
            <p className="mt-2 text-sm text-white/85">
              Compartilo con tu padre/madre/tutor para que te vincule por codigo.
            </p>
          </article>

          <article className="rounded-[20px] bg-[#ffffff25] p-4 sm:p-5 shadow-lg text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-white/75">
              Solicitudes de vinculacion
            </p>
            {isLoadingRequests ? (
              <p className="mt-3 text-sm text-white/80">Cargando solicitudes...</p>
            ) : parentRequests.length === 0 ? (
              <p className="mt-3 text-sm text-white/80">No tienes solicitudes pendientes.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {parentRequests.map((request) => (
                  <li key={request.id} className="rounded-xl bg-black/15 p-3">
                    <p className="text-sm font-semibold">
                      {request.parent_name ?? "Padre/Madre/Tutor"}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleParentRequest(request.id, "confirm")}
                        disabled={actingRequestId === request.id}
                        className="rounded-lg bg-emerald-500/85 px-3 py-1.5 text-xs font-bold hover:bg-emerald-400 disabled:opacity-70"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleParentRequest(request.id, "reject")}
                        disabled={actingRequestId === request.id}
                        className="rounded-lg bg-red-500/85 px-3 py-1.5 text-xs font-bold hover:bg-red-400 disabled:opacity-70"
                      >
                        Rechazar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {requestsMessage ? (
              <p className="mt-3 text-xs text-white/85">{requestsMessage}</p>
            ) : null}
          </article>
        </section>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* MISION */}
          <motion.div className="md:col-span-2 bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-lg sm:text-xl font-black">Misión del Día</h3>
              <span className="text-2xl sm:text-3xl">✨</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
              <motion.div className="text-5xl sm:text-6xl">🎯</motion.div>

              <div className="flex-1 w-full">
                <h4 className="text-base sm:text-lg font-bold mb-2">
                  {data.mission.title}
                </h4>
                <p className="text-xs sm:text-sm opacity-90 mb-4">
                  {data.mission.description}
                </p>

                <div className="bg-white/20 rounded-xl h-5 overflow-hidden mb-2">
                  <motion.div
                    className="bg-[#FFD84D] h-full rounded-xl flex items-center justify-center text-xs font-bold text-gray-800"
                    animate={{ width: `${missionProgress}%` }}
                  >
                    {`${data.mission.completed}/${data.mission.total}`}
                  </motion.div>
                </div>

                <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-white/15 rounded-xl w-fit">
                  <span className="text-xl">🏅</span>
                  <span className="text-xs sm:text-sm font-bold">
                    {`+${data.mission.rewardXp} XP al completar`}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* MAPA DE MATERIAS */}
          <motion.div className="md:col-span-2 bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all">
            <h3 className="text-lg sm:text-xl font-black text-white mb-5">
              Mapa de Materias
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {data.subjects.map((subject) => (
                <div
                  key={subject.name}
                  className="aspect-square rounded-[20px] flex flex-col items-center justify-center gap-1 sm:gap-2 text-center"
                  style={{ backgroundColor: subject.color }}
                >
                  <span className="text-5xl sm:text-7xl">{subject.icon}</span>
                  <span className="font-bold text-sm sm:text-sm text-white">
                    {subject.name}
                  </span>
                  <span className="text-[20px] sm:text-xs text-white">
                    {`${subject.progress}%`}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ACTIVIDAD RECIENTE */}
          <motion.div className="bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all">
            <h3 className="text-lg sm:text-xl font-black text-white mb-4">
              Actividad Reciente
            </h3>

            <div className="flex flex-col gap-3">
              {data.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-[#ffffff45] rounded-xl"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-bold text-white">{activity.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-300">
                      {activity.whenLabel}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#FFD000]">
                    {activity.scoreLabel}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* LEADERBOARD */}
          <motion.div className="bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all">
            <h3 className="text-lg sm:text-xl font-black text-white mb-4">
              Tabla de Posiciones
            </h3>

            <div className="flex flex-col gap-3">
              {data.leaderboard.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 p-3 bg-[#ffffff45] rounded-xl"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-300 rounded-full text-xs font-bold text-gray-800">
                    {row.rank}
                  </div>
                  <span className="flex-1 text-xs sm:text-sm font-bold text-white">
                    {row.name}
                  </span>
                  <span className="text-xs sm:text-sm text-[#FFD000]">
                    {`${row.xp} XP`}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* LOGROS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-lg sm:text-xl font-black text-white">Mis Logros</h3>
              <span className="text-2xl sm:text-3xl">🎖️</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {data.badges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                  whileHover={{ scale: badge.unlocked ? 1.1 : 1 }}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all
                    ${
                      badge.unlocked
                        ? "bg-linear-to-br from-[#FFD84D] to-[#FB923C]"
                        : "bg-[#F3F0FF] opacity-30 grayscale"
                    }`}
                >
                  <span className="text-2xl sm:text-3xl">{badge.icon}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 text-center px-1 leading-tight">
                    {badge.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RACHA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-linear-to-br from-[#FFD000] to-[#bb6023] rounded-[20px] p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all text-center cursor-pointer hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg sm:text-xl font-black">Racha de Estudio</h3>
            </div>

            <motion.div
              className="text-5xl sm:text-6xl my-3 sm:my-4"
              animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔥
            </motion.div>

            <div className="text-5xl sm:text-7xl font-black my-2 sm:my-4">
              {data.streakDays}
            </div>

            <div className="text-sm sm:text-lg font-bold opacity-90">
              días consecutivos
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}