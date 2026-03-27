"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EducationMascot } from "@/shared/components/mascots";

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/student", label: "Inicio", icon: "🏠" },
    { href: "/dashboard/student/lessons", label: "Mis Clases", icon: "📚" },
    { href: "/dashboard/student/lesson-builder", label: "Logros", icon: "🏆" },
    { href: "/dashboard/student/friends", label: "Amigos", icon: "👥" },
    { href: "/dashboard/student/settings", label: "Configuración", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col gap-8 items-center text-center">
      <div className="mt-4">
        <EducationMascot character="bounce" expression="happy" size={100} />
      </div>

      <h3 className="text-2xl font-bold text-[#8B67FF]">Sofía García</h3>

      <nav className="flex flex-col gap-2 w-full">
        {links.map((link) => {
          const isActive = (() => {
            if (link.href === "/dashboard/student") {
              return pathname === link.href;
            }
            return pathname.startsWith(link.href);
          })();

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all w-full
                ${
                  isActive
                    ? "border-linear-to-r from-[#050816] to-[#3054FF] border text-gray-800 shadow-[0_4px_12px_rgba(124,77,255,0.3)]"
                    : "text-gray-600 hover:bg-[#F3F0FF] hover:text-[#7C4DFF]"
                }
              `}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
