"use client";

import Link from "next/link";
import { EducationMascot } from "@/shared/components/mascots";

type LinkItem = {
  href: string;
  label: string;
  icon: string;
};

type SidebarContentProps = {
  links: LinkItem[];
  pathname: string;
  onNavigate?: () => void;
};

export default function SidebarContent({
  links,
  pathname,
  onNavigate,
}: SidebarContentProps) {
  const isActiveLink = (href: string) => {
    if (href === "/dashboard/student") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col gap-8 items-center text-center w-full">
      <div className="mt-4">
        <EducationMascot character="bounce" expression="happy" size={100} />
      </div>

      <h3 className="text-2xl font-bold text-[#8B67FF]">
        Sofía García
      </h3>

      <nav className="flex flex-col gap-2 w-full">
        {links.map((link) => {
          const isActive = isActiveLink(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
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