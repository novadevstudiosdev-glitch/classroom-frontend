"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarContent from "./SidebarContent";

export default function SidebarNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/dashboard/student", label: "Inicio", icon: "🏠" },
    { href: "/dashboard/student/lessons", label: "Mis Clases", icon: "📚" },
    { href: "/dashboard/student/lesson-builder", label: "Logros", icon: "🏆" },
    { href: "/dashboard/student/friends", label: "Amigos", icon: "👥" },
    { href: "/dashboard/student/settings", label: "Configuración", icon: "⚙️" },
  ];

  return (
    <>
      {/* 🔹 BOTÓN HAMBURGUESA (mobile) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#ffffff25] p-2 rounded-lg shadow-md"
      >
        ☰
      </button>

      {/* 🔹 OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* 🔹 SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-65 bg-[#090f2a] z-50 p-4
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex
        `}
      >
        {/* cerrar en mobile */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden self-end mb-4 text-xl"
        >
          ✕
        </button>

        <SidebarContent
          links={links}
          pathname={pathname}
          onNavigate={() => setOpen(false)}
        />
      </aside>
    </>
  );
}