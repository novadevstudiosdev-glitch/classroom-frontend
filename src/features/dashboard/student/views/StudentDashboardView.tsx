"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function StudentDashboardPage() {
  const [xpWidth, setXpWidth] = useState(0);
  const [missionProgress, setMissionProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => setXpWidth(65), 300);
    setTimeout(() => setMissionProgress(60), 500);
  }, []);

  return (
    <div className="relative min-h-screen">

      <main className="p-6  pt-20 md:pt-6 sm:p-6 md:p-8 overflow-x-hidden">
        {/* HEADER */}
        <header className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            ¡Hola, Sofía! 👋
          </h2>
          <p className="text-sm sm:text-base text-white">
            ¿Lista para otra aventura de aprendizaje?
          </p>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* MISION */}
          <motion.div className="md:col-span-2 bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-lg sm:text-xl font-black">Misión del Día</h3>
              <span className="text-2xl sm:text-3xl">✨</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
              <motion.div className="text-5xl sm:text-6xl">🎯</motion.div>

              <div className="flex-1 w-full">
                <h4 className="text-base sm:text-lg font-bold mb-2">
                  Completa 5 ejercicios de Matemática
                </h4>
                <p className="text-xs sm:text-sm opacity-90 mb-4">
                  ¡Ya vas muy bien! Solo te faltan 2 ejercicios más.
                </p>

                <div className="bg-white/20 rounded-xl h-5 overflow-hidden mb-2">
                  <motion.div
                    className="bg-[#FFD84D] h-full rounded-xl flex items-center justify-center text-xs font-bold text-gray-800"
                    animate={{ width: `${missionProgress}%` }}
                  >
                    3/5
                  </motion.div>
                </div>

                <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-white/15 rounded-xl w-fit">
                  <span className="text-xl">🏅</span>
                  <span className="text-xs sm:text-sm font-bold">
                    +150 XP al completar
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SUBJECT MAP */}
          <motion.div className="md:col-span-2 bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg">
            <h3 className="text-lg sm:text-xl font-black text-white mb-5">
              Mapa de Materias
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  icon: "🔢",
                  name: "Matemática",
                  progress: "75%",
                  color: "#FFD84D",
                },
                {
                  icon: "🔬",
                  name: "Ciencias",
                  progress: "60%",
                  color: "#34D399",
                },
                {
                  icon: "📖",
                  name: "Lengua",
                  progress: "85%",
                  color: "#A855F7",
                },
                {
                  icon: "🏛️",
                  name: "Historia",
                  progress: "45%",
                  color: "#FB923C",
                },
                { icon: "🎨", name: "Arte", progress: "90%", color: "#F43F5E" },
                {
                  icon: "💻",
                  name: "Tecnología",
                  progress: "70%",
                  color: "#3B82F6",
                },
              ].map((subject) => (
                <div
                  key={subject.name}
                  className="aspect-square rounded-[20px] flex flex-col items-center justify-center gap-1 sm:gap-2 text-center"
                  style={{ backgroundColor: subject.color }}
                >
                  <span className="text-5xl sm:text-7xl">{subject.icon}</span>
                  <span className="font-bold text-sm sm:text-sm text-white">
                    {subject.name}
                  </span>
                  <span className="text-[20px] sm:text-xs text-white">
                    {subject.progress}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ACTIVITY */}
          <motion.div className="bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg">
            <h3 className="text-lg sm:text-xl font-black mb-4">
              Actividad Reciente
            </h3>

            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-[#ffffff45] rounded-xl"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg">
                    🔢
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-bold">Actividad</p>
                    <p className="text-[10px] sm:text-xs text-gray-300">
                      Hace poco
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#FFD000]">
                    95%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* LEADERBOARD */}
          <motion.div className="bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg">
            <h3 className="text-lg sm:text-xl font-black mb-4">
              Tabla de Posiciones
            </h3>

            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((rank) => (
                <div
                  key={rank}
                  className="flex items-center gap-3 p-3 bg-[#ffffff45] rounded-xl"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-300 rounded-full text-xs font-bold">
                    {rank}
                  </div>
                  <span className="flex-1 text-xs sm:text-sm font-bold">
                    Usuario
                  </span>
                  <span className="text-xs sm:text-sm text-[#FFD000]">
                    500 XP
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ACHIEVEMENTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#ffffff25] rounded-[20px] p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Mis Logros
              </h3>
              <span className="text-2xl sm:text-3xl">🎖️</span>
            </div>

            {/* 🔥 GRID RESPONSIVE */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { icon: "🏆", name: "Primera Victoria", unlocked: true },
                { icon: "📚", name: "Lector Ávido", unlocked: true },
                { icon: "🔥", name: "Racha de 7", unlocked: true },
                { icon: "⭐", name: "Perfeccionista", unlocked: true },
                { icon: "🎨", name: "Artista", unlocked: true },
                { icon: "💎", name: "Nivel 10", unlocked: false },
                { icon: "🚀", name: "Explorador", unlocked: false },
                { icon: "👑", name: "Campeón", unlocked: false },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                  whileHover={{ scale: badge.unlocked ? 1.1 : 1 }}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all
          ${
            badge.unlocked
              ? "bg-linear-to-br from-[#FFD84D] to-[#FB923C]"
              : "bg-[#F3F0FF] opacity-30 grayscale"
          }`}
                >
                  <span className="text-2xl sm:text-3xl">{badge.icon}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 text-center px-1 leading-tight">
                    {badge.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* STREAK COUNTER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-linear-to-br from-[#FFD000] to-[#bb6023] rounded-[20px] p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all text-center cursor-pointer hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg sm:text-xl font-black">
                Racha de Estudio
              </h3>
            </div>

            <motion.div
              className="text-5xl sm:text-6xl my-3 sm:my-4"
              animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔥
            </motion.div>

            <div className="text-5xl sm:text-7xl font-black my-2 sm:my-4">
              7
            </div>

            <div className="text-sm sm:text-lg font-bold opacity-90">
              días consecutivos
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
