"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  getParentChildren,
  getParentProfile,
  linkChildByEmail,
  type ParentChildSummary,
  type ParentProfile as ParentApiProfile,
} from "@/services/parents/parents.service";
import { useAuthStore } from "@/store/auth/auth.store";
import { extractApiErrorMessage } from "@/lib/axios/extract-api-error-message";
import { getParentDashboardData } from "@/features/dashboard/parent/services";
import type {
  ParentChild,
  ParentDashboardData,
  ParentProfile,
} from "@/features/dashboard/parent/types";
import {
  ParentBottomNavigation,
  ParentChildrenSelector,
  ParentClassProgressList,
  ParentCompletedLessonsList,
  ParentDashboardTopbar,
  ParentLastSessionReportCard,
  ParentRecentLessonsList,
  ParentRegistrationMissingAlert,
  ParentStreakCard,
  ParentWeeklyActivityChart,
  ParentWeeklyXpChart,
} from "../components";

const REGISTRATION_NOT_FOUND_MESSAGE = "registro no econtrado";

const getFullName = (profile: ParentApiProfile) => {
  return `${profile.first_name} ${profile.last_name}`.trim();
};

const getInitials = (name: string) => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P"
  );
};

const mapLinkedStudentToChild = (
  student: ParentChildSummary,
): ParentChild => ({
  id: student.student_id,
  name: student.alias,
  levelLabel: student.level !== null ? `Nivel ${student.level}` : "",
  mascotEmoji: student.avatar_id ?? "",
});

export default function ParentDashboardView() {
  const router = useRouter();
  const { initialized, isAuthenticated, status, user, logout } = useAuthStore();
  const [profile, setProfile] = useState<ParentApiProfile | null>(null);
  const [children, setChildren] = useState<ParentChildSummary[]>([]);
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistrationMissing, setIsRegistrationMissing] = useState(false);
  const [childEmail, setChildEmail] = useState("");
  const [linkMessage, setLinkMessage] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isWaitingForAuth =
    !initialized || status === "loading" || (isAuthenticated && !user);
  const canSeeParentDashboard = initialized && isAuthenticated && user?.role === "parent";

  if (!isLoggingOut && !isWaitingForAuth && !canSeeParentDashboard) {
    notFound();
  }

  const loadProfile = useCallback(async () => {
    if (!canSeeParentDashboard) {
      return;
    }

    setIsProfileLoading(true);
    setError(null);
    setIsRegistrationMissing(false);

    try {
      const [data, confirmedChildren] = await Promise.all([
        getParentProfile(),
        getParentChildren(),
      ]);
      const parentName = getFullName(data);
      const hasInvalidChildRecord = confirmedChildren.some(
        (child) => !child.student_id?.trim() || !child.alias?.trim(),
      );

      if (
        !data.id ||
        !data.user_id ||
        !data.first_name.trim() ||
        !data.last_name.trim() ||
        !parentName ||
        hasInvalidChildRecord
      ) {
        setProfile(null);
        setChildren([]);
        setSelectedChildId("");
        setIsRegistrationMissing(true);
        return;
      }

      setProfile(data);
      setChildren(confirmedChildren);

      setSelectedChildId((currentChildId) => {
        if (confirmedChildren.length === 0) {
          return "";
        }

        if (!confirmedChildren.some((student) => student.student_id === currentChildId)) {
          return confirmedChildren[0].student_id;
        }

        return currentChildId;
      });
    } catch {
      setProfile(null);
      setChildren([]);
      setSelectedChildId("");
      setDashboardData(null);
      setIsRegistrationMissing(true);
    } finally {
      setIsProfileLoading(false);
    }
  }, [canSeeParentDashboard]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!selectedChildId || !canSeeParentDashboard) {
      setDashboardData(null);
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
      } catch {
        if (isMounted) {
          setDashboardData(null);
          setIsRegistrationMissing(true);
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
  }, [canSeeParentDashboard, selectedChildId]);

  const selectorChildren = useMemo(
    () => children.map(mapLinkedStudentToChild),
    [children],
  );
  const topbarProfile = useMemo<ParentProfile>(() => {
    const authProfileName = user?.name?.trim() ?? "";
    const parentProfileName = profile ? getFullName(profile) : "";
    const name = authProfileName && authProfileName !== user?.email ? authProfileName : parentProfileName;

    return {
      initials: getInitials(name),
      greeting: "Hola,",
      name,
    };
  }, [profile, user?.email, user?.name]);

  useEffect(() => {
    if (isRegistrationMissing) {
      window.alert(REGISTRATION_NOT_FOUND_MESSAGE);
    }
  }, [isRegistrationMissing]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.replace("/");
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

  if (isWaitingForAuth || isLoggingOut) {
    return (
      <main className="landing-module-shell min-h-screen bg-[#070c22] p-6">
        <div className="landing-module-card text-white/80">
          {isLoggingOut ? "Cerrando sesion..." : "Validando acceso..."}
        </div>
      </main>
    );
  }

  return (
    <main className="landing-module-shell min-h-screen bg-[#070c22] pb-24">
      {profile ? <ParentDashboardTopbar profile={topbarProfile} onLogout={handleLogout} /> : null}

      <div className="landing-module-content">
        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Dashboard de familia</p>
            <p className="text-sm text-white/70">
              {children.length} alumnos vinculados confirmados
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

        {!isProfileLoading && isRegistrationMissing ? (
          <ParentRegistrationMissingAlert message={REGISTRATION_NOT_FOUND_MESSAGE} />
        ) : null}

        {!isProfileLoading && !isRegistrationMissing && error ? (
          <section className="px-6 py-4">
            <div className="landing-module-card border-red-300/40 bg-red-500/10">
              <p className="font-semibold text-red-100">{error}</p>
              <p className="mt-2 text-sm text-red-100/80">
                Verifica que tu cuenta de padre/madre tenga un perfil activo y alumnos vinculados.
              </p>
            </div>
          </section>
        ) : null}

        {!isProfileLoading && !isRegistrationMissing && !error ? (
          <>
            {children.length > 0 ? (
              <ParentChildrenSelector
                items={selectorChildren}
                selectedChildId={selectedChildId}
                onSelectChild={setSelectedChildId}
              />
            ) : null}

            {children.length === 0 ? (
              <section className="px-6 py-4">
                <div className="landing-module-card">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Acción recomendada
                  </p>
                  <p className="mt-2 text-sm text-white/80">
                    Todavía no tienes alumnos confirmados. Envía una solicitud ingresando su email.
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

            {dashboardData ? (
              <>
                <ParentStreakCard streak={dashboardData.streak} />
                <ParentLastSessionReportCard report={dashboardData.lastSessionReport} />

                <div className="grid gap-2 lg:grid-cols-2">
                  <ParentWeeklyActivityChart activity={dashboardData.weeklyActivity} />
                  <ParentWeeklyXpChart items={dashboardData.weeklyXp} />
                </div>

                <div className="grid gap-2 lg:grid-cols-2">
                  <ParentClassProgressList items={dashboardData.classProgress} />
                  <ParentRecentLessonsList lessons={dashboardData.recentLessons} />
                </div>

                <ParentCompletedLessonsList lessons={dashboardData.completedLessons} />
              </>
            ) : null}
          </>
        ) : null}
      </div>

      {dashboardData ? <ParentBottomNavigation items={dashboardData.bottomNavigation} /> : null}
    </main>
  );
}
