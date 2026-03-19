"use client";
import { NoviMascot } from "@/components/dolls/NoviMascot";
import { EducationMascot } from "@/components/dolls/EducationMascot";

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
            mientras a
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              aprendés
            </span>
          </h1>

          <p className="mt-6 text-white/60 text-base md:text-lg max-w-md mx-auto md:mx-0">
            Misiones, recompensas y aventuras para aprender jugando
          </p>

          <button className="mt-8 px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold shadow-[0_0_25px_rgba(255,208,0,0.5)] hover:scale-105 transition">
            Empezar aventura 🚀
          </button>

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
          <NoviMascot size={220} className="md:scale-110" mood="happy" color="#8B67FF" />
        </div>
      </section>

      {/* -----QUIEN SOS----- */}
      <section className="px-6 md:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">¿Quién sos?</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* -----DOCENTE----- */}
          <div className="p-6 rounded-2xl border border-blue-500/30 bg-white/5 backdrop-blur-md text-left">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 mb-4">
              🎓
            </div>
            <h3 className="text-xl font-bold mb-2">Soy docente</h3>
            <p className="text-white/60 text-sm mb-4">
              Creá clases, asigná lecciones y seguí el progreso de tus alumnos
              en tiempo real
            </p>

            <ul className="text-sm text-white/60 space-y-2 mb-6">
              <li>• Crea contenido gamificado</li>
              <li>• Dashboard con analíticas</li>
              <li>• Gestión de clases y alumnos</li>
            </ul>

            <button className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition">
              Empezar gratis ✨
            </button>
          </div>

          {/* -----ALUMNO----- */}
          <div className="p-6 rounded-2xl border border-green-500/30 bg-white/5 backdrop-blur-md text-left">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 mb-4">
              🎮
            </div>
            <h3 className="text-xl font-bold mb-2">Soy alumno</h3>
            <p className="text-white/60 text-sm mb-4">
              Completá misiones, ganá XP y convertite en el mejor aventurero de
              tu clase
            </p>

            <ul className="text-sm text-white/60 space-y-2 mb-6">
              <li>• Gana XP y sube de nivel</li>
              <li>• Colecciona logros y badges</li>
              <li>• Explora mundos y aventuras</li>
            </ul>

            <button className="w-full py-3 rounded-full bg-green-600 hover:bg-green-500 transition">
              Unirme ahora 🚀
            </button>
          </div>
        </div>
      </section>

      {/* -----POR QUE NOVI----- */}
      <section className="px-6 md:px-16 pb-20 text-center pt-20">
        <h2 className="text-3xl md:text-4xl font-bold">¿Por qué Novi?</h2>
        <p className="text-white/60 mt-2 mb-12">
          Una plataforma diseñada para hacer del aprendizaje una aventura
          inolvidable
        </p>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: "⚡",
              title: "Sistema de XP y niveles",
              desc: "Cada acierto suma puntos de experiencia",
              tag: "XP",
              color: "from-yellow-400 to-orange-500",
            },
            {
              icon: "🗺️",
              title: "Mapa de mundos",
              desc: "Navegá por misiones y descubrí contenido",
              tag: "Nuevo",
              color: "from-blue-400 to-cyan-500",
            },
            {
              icon: "📊",
              title: "Progreso en tiempo real",
              desc: "Docentes y padres ven el avance al instante",
              tag: "Live",
              color: "from-green-400 to-emerald-500",
            },
            {
              icon: "🎮",
              title: "Minijuegos integrados",
              desc: "Aprendé jugando con ejercicios interactivos",
              tag: "Beta",
              color: "from-purple-400 to-pink-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/5 border border-white/10 text-left hover:border-white/20 transition"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg mb-3 bg-gradient-to-br ${item.color}`}
              >
                {item.icon}
              </div>

              <h4 className="font-semibold">{item.title}</h4>

              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gradient-to-r ${item.color} text-white font-semibold`}
              >
                {item.tag}
              </span>

              <p className="text-sm text-white/60 mt-3">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -----CARDS TRIPLE----- */}
      <section className="px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center hover:border-white/20 transition flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg mb-3 bg-blue-500">
              🎮
            </div>
            <h1 className="text-5xl font-semibold">100%</h1>
            <p className="text-m text-white/60 mt-3">Gamificado</p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center hover:border-white/20 transition flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg mb-3 bg-blue-500">
              👥
            </div>
            <h1 className="text-5xl font-semibold">6-12</h1>
            <p className="text-m text-white/60 mt-3">Edad ideal</p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center hover:border-white/20 transition flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg mb-3 bg-blue-500">
              🏅
            </div>
            <h1 className="text-5xl font-semibold">FREE</h1>
            <p className="text-m text-white/60 mt-3">Para alumnos</p>
          </div>
        </div>
      </section>

      {/* -----LISTO PARA EMPEZAR----- */}
      <section className="w-full flex justify-center px-4 py-16">
        <div className="w-full max-w-5xl rounded-2xl  bg-white/5 border border-white/10 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

          {/* -----MUÑEQUITOS----- */}
          <div className="flex flex-col items-center gap-6 mb-10 relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 place-items-center mb-10 relative z-10">
                <EducationMascot character="orbit" expression="happy" size={70} />
                <EducationMascot character="spark" expression="happy" size={70} />
                <EducationMascot character="petal" expression="neutral" size={70} />
                <EducationMascot character="focus" expression="happy" size={70} />
                <EducationMascot character="leaf" expression="neutral" size={70} />
                <EducationMascot character="bounce" expression="happy" size={80} />
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
              ¿Listo para empezar?
            </h2>

            <p className="text-gray-300 mb-8 max-w-xl mx-auto text-sm md:text-base">
              Creá tu primera clase gratis y empezá a gamificar el aprendizaje
              hoy mismo
            </p>

            <button
              className="bg-yellow-400 hover:bg-yellow-300 transition 
          text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105"
            >
              Crear mi clase gratis ✨
            </button>

            <p className="text-xs text-gray-400 mt-4">
              No se requiere tarjeta de crédito • Configuración en 2 minutos
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
