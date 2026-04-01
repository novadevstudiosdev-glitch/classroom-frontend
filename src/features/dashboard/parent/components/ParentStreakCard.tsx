import type { ParentStreakCardProps } from "@/features/dashboard/parent/types";

const ParentStreakCard = ({ streak }: ParentStreakCardProps) => {
  return (
    <section className="px-6 py-4">
      <div className="flex items-center justify-between rounded-2xl border-2 border-[#FFE000] bg-[#FFE000]/20 p-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔥</span>
          <div>
            <p className="text-sm text-white/80">{streak.label}</p>
            <p className="text-2xl font-bold text-[#FF9600]">{streak.days} días</p>
          </div>
        </div>

        <div className="text-5xl font-bold text-[#FFE000]">{streak.days}</div>
      </div>
    </section>
  );
};

export default ParentStreakCard;
