import Link from "next/link";
import type { TeacherDashboardBottomNavigationProps } from "@/features/dashboard/teacher/types";

const TeacherDashboardBottomNavigation = ({
  items,
}: TeacherDashboardBottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="flex justify-around py-3">
        {items.map((item) => {
          const content = (
            <>
              <span className={`text-2xl ${item.isActive ? "" : "opacity-40"}`}>
                {item.icon}
              </span>
              <span
                className={`text-xs ${
                  item.isActive ? "font-bold text-[#1CB0F6]" : "text-gray-400"
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
                className="flex flex-col items-center gap-1"
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className="flex flex-col items-center gap-1"
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
