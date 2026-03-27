import Link from "next/link";
import type { SessionResultActionsProps } from "@/features/lessons/types";

const SessionResultActions = ({
  backHref,
  backLabel = "Volver al mapa",
}: SessionResultActionsProps) => {
  return (
    <div>
      <Link
        href={backHref}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#1CB0F6] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1398d8]"
      >
        {backLabel}
      </Link>
    </div>
  );
};

export default SessionResultActions;
