import Link from "next/link";
import type { TeacherDashboardBottomNavigationProps } from "@/features/dashboard/teacher/types";

const TeacherDashboardBottomNavigation = ({
  items,
}: TeacherDashboardBottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[130] bg-[#07061a]/55 backdrop-blur-2xl shadow-[0_-14px_30px_rgba(2,6,26,0.5)]">
      <div className="flex justify-around py-3">
        {items.map((item) => {
          const content = (
            <>
              <span className={`text-2xl ${item.isActive ? "" : "opacity-40"}`}>
                {item.icon}
              </span>
              <span
                className={`text-xs ${
                  item.isActive ? "font-bold text-[#FFD700]" : "text-white/55"
                }`}
              >
                {item.label}
              </span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-2"
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className="flex items-center gap-2"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherDashboardBottomNavigation;
