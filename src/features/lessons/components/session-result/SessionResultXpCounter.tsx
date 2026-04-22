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
    <section className="mx-auto flex h-60 w-60 flex-col items-center justify-center rounded-full border bg-gradient-to-br from-[#FFD700] to-[#FF9500] text-[#1a0f00] p-5 text-center shadow-[0_18px_40px_rgba(13,148,136,0.4)]">
      <h3 className="text-xl font-bold uppercase text-[#3B82F6]">XP ganado</h3>
      <h1 className="mt-2  font-black text-[red]">+{displayXp}</h1>
    </section>
  ); 
};

export default SessionResultXpCounter;
