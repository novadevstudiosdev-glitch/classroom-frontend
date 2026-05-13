import Link from "next/link";
import type { ParentBottomNavigationProps } from "@/features/dashboard/parent/types";

const ParentBottomNavigation = ({ items }: ParentBottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/15 bg-[#070c22]/90 backdrop-blur-md">
      <div className="flex justify-around py-3">
        {items.map((item) => {
          const content = (
            <>
              <span className={`text-2xl ${item.isActive ? "" : "opacity-50"}`}>{item.icon}</span>
              <span
                className={`text-xs ${
                  item.isActive ? "font-bold text-[#1CB0F6]" : "text-white/50"
                }`}
              >
                {item.label}
              </span>
            </>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className="flex flex-col items-center gap-1">
                {content}
              </Link>
            );
          }

          return (
            <button key={item.id} type="button" className="flex flex-col items-center gap-1">
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ParentBottomNavigation;
