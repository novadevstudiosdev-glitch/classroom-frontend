"use client";

import { useState } from "react";
import { Bell, LogOut, Settings } from "lucide-react";
import type { ParentDashboardTopbarProps } from "@/features/dashboard/parent/types";

const ParentDashboardTopbar = ({ profile, onLogout }: ParentDashboardTopbarProps) => {
  const [openMenu, setOpenMenu] = useState<"notifications" | "settings" | null>(null);

  const toggleMenu = (menu: "notifications" | "settings") => {
    setOpenMenu((currentMenu) => (currentMenu === menu ? null : menu));
  };

  const handleLogout = () => {
    setOpenMenu(null);
    onLogout?.();
  };

  return (
    <div className="border-b border-white/15 bg-white/10 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#1CB0F6] font-bold text-white">
            {profile.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white/70">{profile.greeting}</p>
            <p className="truncate text-lg font-bold text-white">{profile.name}</p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-label="Notificaciones"
              aria-expanded={openMenu === "notifications"}
              onClick={() => toggleMenu("notifications")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
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
              aria-label="Ajustes"
              aria-expanded={openMenu === "settings"}
              onClick={() => toggleMenu("settings")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
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

                {onLogout ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-100 hover:bg-red-500/15"
                  >
                    <LogOut size={18} />
                    Cerrar sesion
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardTopbar;
