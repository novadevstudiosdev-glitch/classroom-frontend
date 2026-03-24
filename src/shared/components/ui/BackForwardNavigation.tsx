import Link from "next/link";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import type { BackForwardNavigationProps } from "@/shared/types";

const BackForwardNavigation = ({
  previous,
  next,
  containerClassName = "",
  buttonClassName = "",
}: BackForwardNavigationProps) => {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Navegacion atras y adelante"
      className={`flex items-center justify-between gap-3 ${containerClassName}`}
    >
      <div className="min-w-0">
        {previous ? (
          <Link
            href={previous.href}
            className={`inline-flex items-center gap-1 text-sm font-semibold text-red-600 transition-colors hover:text-red-700 ${buttonClassName} ${previous.className ?? ""}`}
          >
            <CircleArrowLeft size={16} aria-hidden="true" />
            <span className="truncate">{previous.label ?? "Atras"}</span>
          </Link>
        ) : null}
      </div>

      <div className="min-w-0 ml-auto">
        {next ? (
          <Link
            href={next.href}
            className={`inline-flex items-center gap-1 text-sm font-semibold text-red-600 transition-colors hover:text-red-700 ${buttonClassName} ${next.className ?? ""}`}
          >
            <span className="truncate">{next.label ?? "Adelante"}</span>
            <CircleArrowRight size={16} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
};

export default BackForwardNavigation;
