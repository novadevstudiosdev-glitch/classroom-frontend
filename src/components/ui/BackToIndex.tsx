import Link from "next/link";
import type { BackToIndexProps } from "@/types/back-to-index.types";

const BackToIndex = ({
  href = "/",
  icon = "🏠",
  className = "",
  ariaLabel = "Volver al inicio",
}: BackToIndexProps) => {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1CB0F6] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${className}`}
      style={{ boxShadow: "0 0 20px rgba(28, 176, 246, 0.5)" }}
    >
      <span className="text-2xl">{icon}</span>
    </Link>
  );
};

export default BackToIndex;
