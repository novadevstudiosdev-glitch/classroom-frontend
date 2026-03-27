import type { SessionResultHeaderProps } from "@/features/lessons/types";

const SessionResultHeader = ({ lessonTitle }: SessionResultHeaderProps) => {
  return (
    <header className="text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
        Resultado de sesión
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-white">¡Lo lograste!</h1>
      <p className="mt-2 text-sm text-white/70">{lessonTitle}</p>
    </header>
  );
};

export default SessionResultHeader;
