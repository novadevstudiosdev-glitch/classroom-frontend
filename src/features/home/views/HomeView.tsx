"use client";
import { EducationMascot, NoviMascot } from "@/shared/components/mascots";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* -----HERO----- */}
      <section className="flex flex-col md:flex-row items-center justify-between min-h-screen px-6 sm:px-8 md:px-16 py-12 md:py-0 gap-10">
        {/* -----HERO IZQUIERDA----- */}
        <div className="max-w-xl w-full text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-6">
            <span className="text-yellow-300">⚡</span>
            <span className="text-sm text-white/80">
              Plataforma educativa gamificada
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Subí de nivel <br />
            mientras&nbsp;
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              aprendés
            </span>
          </h1>

          <p className="mt-6 text-white/60 text-base md:text-lg max-w-md mx-auto md:mx-0">
            Misiones, recompensas y aventuras para aprender jugando
          </p>

          <a href="/minigame/index.html" className="mt-8 inline-block px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold shadow-[0_0_25px_rgba(255,208,0,0.5)] hover:scale-105 transition">
            Empezar aventura 🚀
          </a>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-white/60 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              <span>100% Gratis para alumnos</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-blue-400">👥</span>
              <span>6-12 años</span>
            </div>
          </div>
        </div>

        {/* -----HERO DERECHA----- */}
        <div className="mt-6 md:mt-0 flex justify-center md:justify-end w-full">
          <NoviMascot
            size={220}
            className="md:scale-110"
            mood="happy"
            color="#8B67FF"
          />
        </div>
      </section>

      {/* -----QUIEN SOS----- */}
      <section className="relative flex items-center justify-center px-6 md:px-16 py-10 md:py-28">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-600/20" />

        <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-2">
          {/* DOCENTE */}
          <a href="/minigame/index.html" className="group relative rounded-2xl p-10 text-center overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] no-underline text-white">
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition duration-500 rounded-2xl" />

            <div className="relative z-10 flex flex-col items-center">
              <h3 className="text-3xl font-bold mb-4">Soy docente</h3>

              <p className="text-white/70 max-w-sm">
                Creá clases, asigná misiones y seguí el progreso en tiempo real
              </p>

              {/* mascot */}
              <div className="mt-6 group-hover:scale-110 transition">
                <EducationMascot
                  character="petal"
                  expression="happy"
                  size={100}
                />
              </div>

              <span className="mt-5 px-5 py-2 rounded-2xl border border-white/30 text-white backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                Empezar ✨
              </span>
            </div>
          </a>

          {/* ALUMNO */}
          <a href="/minigame/lobby.html" className="group relative rounded-2xl p-10 text-center overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] no-underline text-white">
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition duration-500 rounded-2xl" />

            <div className="relative z-10 flex flex-col items-center">
              <h3 className="text-3xl font-bold mb-4">Soy alumno</h3>

              <p className="text-white/70 max-w-sm">
                Completá misiones, ganá XP y subí de nivel
              </p>

              {/* mascot */}
              <div className="mt-6 group-hover:scale-110 transition">
                <EducationMascot
                  character="bounce"
                  expression="happy"
                  size={100}
                />
              </div>

              <span className="mt-5 px-5 py-2 rounded-2xl border border-white/30 text-white backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                Jugar 🚀
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* -----COMO FUNCIONA----- */}
      <section className="px-6 md:px-24 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          ¿Cómo funciona?
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl mx-auto">
          {[
            { title: "Explorás", icon: "🗺️" },
            { title: "Jugás", icon: "🎮" },
            { title: "Ganás XP", icon: "⚡" },
            { title: "Subís nivel", icon: "🏆" },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center group transition duration-300 hover:scale-110"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-white/20 transition">
                {step.icon}
              </div>

              <p className="font-semibold group-hover:text-white transition">
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* -----AVENTURA EN NOVI----- */}
      <section className="px-6 md:px-16 py-4 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Asi se ve una aventura en Novi
        </h2>
        <div className="max-w-5xl mx-auto rounded-2xl p-px bg-linear-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40">
          {/* CARD */}
          <div className="rounded-2xl bg-[#0B0F2A]/80 backdrop-blur-xl p-6 md:p-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* IZQUIERDA */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
                  🎮
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-bold">
                    Jugador aventurero
                  </h3>

                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-400 text-black font-semibold">
                      Nivel 5
                    </span>
                    <span className="text-white/60 text-sm">2,450 XP</span>
                  </div>
                </div>
              </div>

              {/* ICONOS */}
              <div className="flex gap-3">
                {["⭐", "🏆", "🎯"].map((icon, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* PROGRESO */}
            <div className="mt-8">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Progreso al nivel 6</span>
                <span className="text-blue-400 font-semibold">
                  450 / 1000 XP
                </span>
              </div>

              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="w-[45%] h-full bg-linear-to-r from-yellow-400 to-orange-500 rounded-full shadow-[0_0_15px_rgba(255,200,0,0.6)]" />
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                <p className="text-3xl font-bold text-green-400">24</p>
                <p className="text-sm text-white/60 mt-1">
                  Lecciones completadas
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                <p className="text-3xl font-bold text-yellow-400">7</p>
                <p className="text-sm text-white/60 mt-1">Días seguidos</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                <p className="text-3xl font-bold text-purple-400">12</p>
                <p className="text-sm text-white/60 mt-1">
                  Logros desbloqueados
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
