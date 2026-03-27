import { useEffect, useState } from "react";
import type { SessionResultStarsProps } from "@/features/lessons/types";

const SessionResultStars = ({ stars }: SessionResultStarsProps) => {
  const [visibleStars, setVisibleStars] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisibleStars((prev) => {
        const next = Math.min(prev + 1, stars);
        if (next >= stars) window.clearInterval(timer);
        return next;
      });
    }, 180);

    return () => window.clearInterval(timer);
  }, [stars]);

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center shadow-lg">
      <p className="text-xs font-semibold uppercase text-white/70">Estrellas</p>
      <div className="mt-3 flex items-center justify-center gap-3 text-4xl">
        {Array.from({ length: 3 }).map((_, idx) => (
          <span key={`star-${idx}`} className={idx < visibleStars ? "scale-110 text-[#FFD000]" : "text-white/20"}>
            ★
          </span>
        ))}
      </div>
    </section>
  );
};

export default SessionResultStars;
