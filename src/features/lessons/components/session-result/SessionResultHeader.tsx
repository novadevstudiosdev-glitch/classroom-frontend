import type { SessionResultHeaderProps } from "@/features/lessons/types";

const SessionResultHeader = ({ lessonTitle }: SessionResultHeaderProps) => {
  return (
    <header className="space-y-4 text-center">
      <h4 className="text-lg font-black uppercase tracking-[0.28em] text-[#2DD4BF]">
        Resultado de sesión
      </h4>
      <h1
        className="animate-pulse text-6xl font-black uppercase leading-[0.9] tracking-tight text-transparent drop-shadow-[0_12px_26px_rgba(2,6,26,0.5)] md:text-8xl lg:text-9xl"
        style={{
          backgroundImage: "linear-gradient(90deg, #00F5FF 0%, #8B5CF6 40%, #FF4D6D 70%, #FFB703 80%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextStroke: "2px rgba(255,255,255,0.18)",
        }}
      >
        ¡Lo lograste!
      </h1>
      <h4 className="text-2xl font-black tracking-wide text-[#FFD700]">{lessonTitle}</h4>
    </header>
  );
};

export default SessionResultHeader;
