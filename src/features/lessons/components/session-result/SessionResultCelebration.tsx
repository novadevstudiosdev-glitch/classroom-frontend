const SessionResultCelebration = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-lg">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-8 top-4 animate-bounce text-2xl">✨</div>
        <div className="absolute right-8 top-8 animate-pulse text-2xl">🎉</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce text-2xl">🌟</div>
      </div>
      <p className="relative text-sm font-semibold text-white/90">
        ¡Excelente trabajo! Completaste la sesión.
      </p>
    </section>
  );
};

export default SessionResultCelebration;
