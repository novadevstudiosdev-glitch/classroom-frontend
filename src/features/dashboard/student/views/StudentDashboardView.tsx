"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  confirmStudentParentRequest,
  getStudentLinkCode,
  getStudentParentRequests,
  rejectStudentParentRequest,
  type ParentRequest,
} from "@/services/students/students.service";
import { extractApiErrorMessage } from "@/lib/axios/extract-api-error-message";

export default function StudentDashboardPage() {
  const [xpWidth, setXpWidth] = useState(0);
  const [missionProgress, setMissionProgress] = useState(0);
  const [parentRequests, setParentRequests] = useState<ParentRequest[]>([]);
  const [linkCode, setLinkCode] = useState<string>("");
  const [requestsMessage, setRequestsMessage] = useState<string>("");
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [actingRequestId, setActingRequestId] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setXpWidth(65), 300);
    setTimeout(() => setMissionProgress(60), 500);
  }, []);

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
      } catch (error) {
        setRequestsMessage(
          extractApiErrorMessage(error, "No se pudieron cargar tus solicitudes familiares.")
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
    } catch (error) {
      setRequestsMessage(extractApiErrorMessage(error, "No se pudo actualizar la solicitud."));
    } finally {
      setActingRequestId(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <main className="p-6 pt-20 md:pt-6 sm:p-6 md:p-8 overflow-x-hidden text-white">
        <header className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Hola, estudiante</h2>
          <p className="text-sm sm:text-base text-white/85">Tu espacio para aprender y gestionar tus vinculos familiares.</p>
        </header>

        <section className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article className="rounded-[20px] bg-[#ffffff25] p-4 sm:p-5 shadow-lg">
            <p className="text-xs uppercase tracking-[0.18em] text-white/75">Codigo para tu familia</p>
            <p className="mt-2 text-3xl font-black tracking-[0.08em]">{linkCode || "--------"}</p>
            <p className="mt-2 text-sm text-white/85">
              Compartilo con tu padre/madre/tutor para que te vincule por codigo.
            </p>
          </article>

          <article className="rounded-[20px] bg-[#ffffff25] p-4 sm:p-5 shadow-lg">
            <p className="text-xs uppercase tracking-[0.18em] text-white/75">Solicitudes de vinculacion</p>
            {isLoadingRequests ? (
              <p className="mt-3 text-sm text-white/80">Cargando solicitudes...</p>
            ) : parentRequests.length === 0 ? (
              <p className="mt-3 text-sm text-white/80">No tienes solicitudes pendientes.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {parentRequests.map((request) => (
                  <li key={request.id} className="rounded-xl bg-black/15 p-3">
                    <p className="text-sm font-semibold">{request.parent_name ?? "Padre/Madre/Tutor"}</p>
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
            {requestsMessage ? <p className="mt-3 text-xs text-white/85">{requestsMessage}</p> : null}
          </article>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <motion.div className="bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg" animate={{ opacity: 1 }}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg sm:text-xl font-black">Mision del dia</h3>
              <span className="text-2xl">Target</span>
            </div>
            <p className="text-sm text-white/90 mb-3">Completa 5 ejercicios de matematica.</p>
            <div className="bg-white/20 rounded-xl h-5 overflow-hidden mb-2">
              <motion.div
                className="bg-[#FFD84D] h-full rounded-xl"
                animate={{ width: `${missionProgress}%` }}
              />
            </div>
            <p className="text-xs text-white/75">Progreso actual: 3/5</p>
          </motion.div>

          <motion.div className="bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg" animate={{ opacity: 1 }}>
            <h3 className="text-lg sm:text-xl font-black mb-4">Nivel y XP</h3>
            <p className="text-sm text-white/90 mb-3">Sigue avanzando para desbloquear recompensas.</p>
            <div className="bg-white/20 rounded-xl h-5 overflow-hidden mb-2">
              <motion.div
                className="bg-cyan-400 h-full rounded-xl"
                animate={{ width: `${xpWidth}%` }}
              />
            </div>
            <p className="text-xs text-white/75">Nivel actual: 7</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}