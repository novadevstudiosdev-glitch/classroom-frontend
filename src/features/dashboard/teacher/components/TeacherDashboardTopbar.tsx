"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut, Settings } from "lucide-react";
import { DashboardTopbar } from "@/shared/components/ui";
import { useAuthStore } from "@/store/auth/auth.store";
import { useTeacherLogout } from "../hooks";
import { useTeacherIdentityStore } from "../store/teacher-identity.store";

type TeacherDashboardTopbarProps = {
  initials?: string;
  userName?: string;
  planLabel?: string;
  onLogout?: () => void;
};

const TeacherDashboardTopbar = ({ initials, userName, planLabel, onLogout }: TeacherDashboardTopbarProps) => {
  const [openMenu, setOpenMenu] = useState<"notifications" | "settings" | null>(null);
  const { isAuthenticated, user } = useAuthStore();
  const { identity, ensureLoaded } = useTeacherIdentityStore();
  const teacherLogout = useTeacherLogout();

  useEffect(() => {
    if (isAuthenticated && user?.role === "teacher") {
      void ensureLoaded();
    }
  }, [ensureLoaded, isAuthenticated, user?.role]);

  const toggleMenu = (menu: "notifications" | "settings") => {
    setOpenMenu((currentMenu) => (currentMenu === menu ? null : menu));
  };

  const handleLogout = () => {
    setOpenMenu(null);
    teacherLogout();
    onLogout?.();
  };

  const resolvedUserName = userName ?? identity.teacherName;
  const resolvedInitials = initials ?? identity.initials;
  const resolvedPlanLabel = planLabel ?? identity.planLabel;

  return (
    <DashboardTopbar
      initials={resolvedInitials}
      userName={resolvedUserName}
      planLabel={resolvedPlanLabel}
      rightContent={
        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-label="Notificaciones del docente"
              aria-expanded={openMenu === "notifications"}
              onClick={() => toggleMenu("notifications")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white shadow-[0_8px_16px_rgba(2,6,26,0.35)] transition-colors hover:bg-white/25"
            >
              <Bell size={20} />
            </button>

            {openMenu === "notifications" ? (
              <div className="absolute right-0 top-12 z-20 w-72 rounded-2xl border border-white/15 bg-[#070c22] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <p className="text-sm font-bold text-white">Notificaciones</p>
                <p className="mt-3 rounded-xl bg-white/8 px-3 py-3 text-sm text-white/70">
                  No hay notificaciones.
                </p>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Ajustes del docente"
              aria-expanded={openMenu === "settings"}
              onClick={() => toggleMenu("settings")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white shadow-[0_8px_16px_rgba(2,6,26,0.35)] transition-colors hover:bg-white/25"
            >
              <Settings size={20} />
            </button>

            {openMenu === "settings" ? (
              <div className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-2xl border border-white/15 bg-[#070c22] py-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-white/85 hover:bg-white/10"
                >
                  <Settings size={18} />
                  Ajustes
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-100 hover:bg-red-500/15"
                >
                  <LogOut size={18} />
                  Cerrar sesion
                </button>
              </div>
            ) : null}
          </div>
        </div>
      }
    />
  );
};

export default TeacherDashboardTopbar;
