import Link from "next/link";
import Navbar from "@/shared/components/navigation/Navbar";

export default function MinigameHomePage() {
  return (
    <div className="min-h-screen bg-[#06080f] text-white overflow-x-hidden">
      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.6 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + "s",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 gap-10 py-16">
          {/* Hero */}
          <div className="text-center space-y-4 max-w-xl">
            <div className="text-6xl">🚀</div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              NO<span className="text-cyan-400">VI</span> Juegos
            </h1>
            <p className="text-white/60 text-lg">
              Jugá con tus compañeros en tiempo real. Elegí un juego y a competir.
            </p>
          </div>

          {/* Action cards */}
          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg">
            {/* Lobby multiplayer */}
            <Link href="/minigame/lobby.html" className="flex-1">
              <div className="group h-full flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur hover:border-cyan-400/60 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                <span className="text-4xl">🎮</span>
                <div className="text-center">
                  <div className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">
                    LOBBY
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Salas multijugador en vivo
                  </div>
                </div>
                <span className="mt-auto text-xs font-bold px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  MULTIJUGADOR
                </span>
              </div>
            </Link>

            {/* Solo play */}
            <Link href="/minigame/index.html" className="flex-1">
              <div className="group h-full flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur hover:border-purple-400/60 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                <span className="text-4xl">⚡</span>
                <div className="text-center">
                  <div className="text-xl font-black text-white group-hover:text-purple-400 transition-colors">
                    MODO SOLO
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Practicá a tu ritmo
                  </div>
                </div>
                <span className="mt-auto text-xs font-bold px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  INDIVIDUAL
                </span>
              </div>
            </Link>
          </div>

          {/* Game types preview */}
          <div className="flex gap-3 flex-wrap justify-center mt-2">
            {[
              { icon: "❓", label: "Quiz" },
              { icon: "🔤", label: "Sopa de letras" },
              { icon: "🔀", label: "Anagrama" },
            ].map((g) => (
              <div
                key={g.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60"
              >
                <span>{g.icon}</span>
                <span className="font-semibold">{g.label}</span>
              </div>
            ))}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
