"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getParentProfile,
  linkChildByEmail,
  type ParentLinkedStudent,
  type ParentProfile as ParentApiProfile,
} from "@/services/parents/parents.service";
import { useAuthStore } from "@/store/auth/auth.store";
import { extractApiErrorMessage } from "@/lib/axios/extract-api-error-message";
import { PARENT_DASHBOARD_MOCK } from "@/features/dashboard/parent/data";
import { getParentDashboardData } from "@/features/dashboard/parent/services";
import type {
  ParentChild,
  ParentDashboardData,
  ParentProfile,
} from "@/features/dashboard/parent/types";
import {
  ParentChildrenSelector,
  ParentClassProgressList,
  ParentDashboardTopbar,
  ParentRecentLessonsList,
} from "../components";

const getFullName = (profile: ParentApiProfile | null) => {
  if (!profile) {
    return PARENT_DASHBOARD_MOCK.profile.name;
  }

  return `${profile.first_name} ${profile.last_name}`.trim() || PARENT_DASHBOARD_MOCK.profile.name;
};

const getInitials = (profile: ParentApiProfile | null) => {
  if (!profile) {
    return PARENT_DASHBOARD_MOCK.profile.initials;
  }

  return (
    [profile.first_name, profile.last_name]
      .map((name) => name.trim().charAt(0))
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || PARENT_DASHBOARD_MOCK.profile.initials
  );
};

const mapLinkedStudentToChild = (
  student: ParentLinkedStudent,
  index: number,
): ParentChild => ({
  id: student.student_id,
  name: `Alumno ${index + 1}`,
  levelLabel: student.status === "confirmed" ? "Vinculo confirmado" : `Estado: ${student.status}`,
  mascotEmoji: "🎓",
});

export default function ParentDashboardView() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [profile, setProfile] = useState<ParentApiProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<ParentDashboardData>(PARENT_DASHBOARD_MOCK);
  const [selectedChildId, setSelectedChildId] = useState(PARENT_DASHBOARD_MOCK.children[0]?.id ?? "");
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childEmail, setChildEmail] = useState("");
  const [linkMessage, setLinkMessage] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const loadProfile = useCallback(async () => {
    setIsProfileLoading(true);
    setError(null);

    try {
      const data = await getParentProfile();
      const confirmedChildren = data.children.filter((student) => student.status === "confirmed");

      setProfile(data);

      setSelectedChildId((currentChildId) => {
        if (
          confirmedChildren.length > 0 &&
          !confirmedChildren.some((student) => student.student_id === currentChildId)
        ) {
          return confirmedChildren[0].student_id;
        }

        return currentChildId;
      });
    } catch {
      setError("No se pudo cargar tu dashboard de familia.");
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!selectedChildId) {
      return;
    }

    let isMounted = true;

    const loadDashboard = async () => {
      setIsDashboardLoading(true);

      try {
        const data = await getParentDashboardData(selectedChildId);

        if (isMounted) {
          setDashboardData(data);
        }
      } finally {
        if (isMounted) {
          setIsDashboardLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [selectedChildId]);

  const linkedStudents = useMemo(() => profile?.children ?? [], [profile]);
  const confirmedStudents = useMemo(
    () => linkedStudents.filter((student) => student.status === "confirmed"),
    [linkedStudents],
  );
  const selectorChildren = useMemo(() => {
    const confirmedChildren = confirmedStudents.map(mapLinkedStudentToChild);

    return confirmedChildren.length > 0 ? confirmedChildren : dashboardData.children;
  }, [confirmedStudents, dashboardData.children]);
  const topbarProfile = useMemo<ParentProfile>(
    () => ({
      initials: getInitials(profile),
      greeting: "Hola,",
      name: getFullName(profile),
    }),
    [profile],
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleLinkChild = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLinkMessage(null);

    if (!childEmail.trim()) {
      setLinkMessage("Ingresa un email de alumno.");
      return;
    }

    setIsLinking(true);
    try {
      const response = await linkChildByEmail(childEmail);
      setLinkMessage(response.message ?? "Solicitud de vinculacion enviada.");
      setChildEmail("");
      await loadProfile();
    } catch (linkError) {
      setLinkMessage(
        extractApiErrorMessage(linkError, "No se pudo enviar la solicitud de vinculacion."),
      );
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <main className="landing-module-shell min-h-screen bg-[#070c22] pb-24">
      <ParentDashboardTopbar profile={topbarProfile} onLogout={handleLogout} />

      <div className="landing-module-content">
        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Dashboard de familia</p>
            <p className="text-sm text-white/70">
              {confirmedStudents.length} alumnos vinculados confirmados
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white/90 hover:bg-white/10"
          >
            Inicio
          </Link>
        </div>

        {isProfileLoading ? (
          <section className="px-6 py-4">
            <div className="landing-module-card text-white/80">Cargando datos de familia...</div>
          </section>
        ) : null}

        {!isProfileLoading && error ? (
          <section className="px-6 py-4">
            <div className="landing-module-card border-red-300/40 bg-red-500/10">
              <p className="font-semibold text-red-100">{error}</p>
              <p className="mt-2 text-sm text-red-100/80">
                Si recien creaste tu cuenta, verifica tu email y vuelve a iniciar sesion.
              </p>
            </div>
          </section>
        ) : null}

        <ParentChildrenSelector
          items={selectorChildren}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
        />

        {!isProfileLoading && !error && confirmedStudents.length === 0 ? (
          <section className="px-6 py-4">
            <div className="landing-module-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Accion recomendada</p>
              <p className="mt-2 text-sm text-white/80">
                Si no ves alumnos, envia una solicitud ingresando su email. Mientras tanto, se muestran
                datos de ejemplo para que puedas revisar los componentes.
              </p>
              <form onSubmit={handleLinkChild} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={childEmail}
                  onChange={(event) => setChildEmail(event.target.value)}
                  placeholder="alumno@email.com"
                  className="min-h-11 flex-1 rounded-xl border border-white/20 bg-black/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-blue-300/60"
                />
                <button
                  type="submit"
                  disabled={isLinking}
                  className="min-h-11 rounded-xl border border-blue-300/40 bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-100 hover:bg-blue-500/30 disabled:opacity-70"
                >
                  {isLinking ? "Enviando..." : "Vincular alumno"}
                </button>
              </form>
              {linkMessage ? <p className="mt-3 text-sm text-white/80">{linkMessage}</p> : null}
            </div>
          </section>
        ) : null}

        {isDashboardLoading ? (
          <section className="px-6 py-2">
            <p className="text-sm text-white/60">Actualizando reporte del alumno...</p>
          </section>
        ) : null}

        <div className="grid gap-2 lg:grid-cols-2">
          <ParentClassProgressList items={dashboardData.classProgress} />
          <ParentRecentLessonsList lessons={dashboardData.recentLessons} />
        </div>
      </div>

    </main>
  );
}
