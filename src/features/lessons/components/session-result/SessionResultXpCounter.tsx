import { useEffect, useState } from "react";
import type { SessionResultXpCounterProps } from "@/features/lessons/types";

const SessionResultXpCounter = ({ earnedXp }: SessionResultXpCounterProps) => {
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    const step = Math.max(1, Math.ceil(earnedXp / 40));
    const timer = window.setInterval(() => {
      setDisplayXp((prev) => {
        const next = Math.min(prev + step, earnedXp);
        if (next >= earnedXp) window.clearInterval(timer);
        return next;
      });
    }, 25);

    return () => window.clearInterval(timer);
  }, [earnedXp]);

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center shadow-lg">
      <p className="text-xs font-semibold uppercase text-white/70">XP ganado</p>
      <p className="mt-2 text-4xl font-black text-[#FFD000]">+{displayXp}</p>
    </section>
  );
};

export default SessionResultXpCounter;
