import type { SessionResultLevelUpProps } from "@/features/lessons/types";

const SessionResultLevelUp = ({
  didLevelUp,
  levelBefore,
  levelAfter,
}: SessionResultLevelUpProps) => {
  if (!didLevelUp) {
    return (
      <section className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center shadow-lg">
        <p className="text-sm text-white/80">Nivel actual: {levelAfter}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#FFD000]/40 bg-[#FFD000]/15 p-4 text-center shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Subida de nivel</p>
      <p className="mt-1 animate-pulse text-xl font-black text-[#FFD000]">
        Nivel {levelBefore} → Nivel {levelAfter}
      </p>
    </section>
  );
};

export default SessionResultLevelUp;
