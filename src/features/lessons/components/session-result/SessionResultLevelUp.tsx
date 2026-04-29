import type { SessionResultLevelUpProps } from "@/features/lessons/types";

const SessionResultLevelUp = ({
  didLevelUp,
  levelBefore,
  levelAfter,
}: SessionResultLevelUpProps) => {
  if (!didLevelUp) {
    return (
      <section className="text-center">
        <h4 className="text-2xl font-black uppercase tracking-[0.12em] text-white ">
          Nivel actual: <span className="text-[#2DD4BF] text-3xl tracking-normal">{levelAfter}</span>
        </h4>
      </section>
    );
  }

  return (
    <section className="text-center">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-[#2DD4BF]">Subida de nivel</p>
      <p className="mt-2 animate-pulse text-4xl font-black uppercase tracking-[0.06em] text-[#FFD000] drop-shadow-[0_0_20px_rgba(255,208,0,0.7)]">
        Nivel {levelBefore} → Nivel {levelAfter}
      </p>
    </section>
  );
};

export default SessionResultLevelUp;
