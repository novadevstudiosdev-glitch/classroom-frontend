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
    <section className="mx-auto grid h-64 w-80 grid-rows-[72px_132px] place-items-center text-center">
      <h3 className="self-end text-3xl font-black uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#00E5FF]">
        Estrellas
      </h3>
      <div className="self-start flex items-center justify-center gap-4 text-7xl leading-none pt-8">
        {Array.from({ length: 3 }).map((_, idx) => (
          <span
            key={`star-${idx}`}
            className={
              idx < visibleStars
                ? "text-[#FFD000] drop-shadow-[0_0_24px_rgba(255,208,0,0.9)]"
                : "text-white/20"
            }
          >
            ★
          </span>
        ))}
      </div>
    </section>
  );
};

export default SessionResultStars;
