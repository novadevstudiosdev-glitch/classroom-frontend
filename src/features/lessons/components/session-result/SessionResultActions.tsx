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
        className="inline-flex w-full items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-[#6C63FF]/30 to-[#9B5DE5]/30 px-4 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(108,99,255,0.35)] backdrop-blur-xl transition hover:translate-y-[-1px] hover:bg-white/20"
      >
        {backLabel}
      </Link>
    </div>
  );
};

export default SessionResultActions;
