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
    <section className="mx-auto grid h-64 w-80 grid-rows-[72px_132px] place-items-center text-center">
      <h3 className="self-end text-3xl font-black uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-[#1d4ed8] to-[#6d28d9] drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
        XP ganado
      </h3>
      <p className="self-start text-center text-8xl font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#FFD700] to-[#FF9500] drop-shadow-[0_6px_4px_rgba(120,53,15,0.45)]">
        +{displayXp}
      </p>
    </section>
  );
};

export default SessionResultXpCounter;
