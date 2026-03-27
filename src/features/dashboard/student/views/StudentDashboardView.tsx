'use client'

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EducationMascot } from "@/shared/components/mascots";

export default function StudentDashboardPage() {
  const [xpWidth, setXpWidth] = useState(0);
  const [missionProgress, setMissionProgress] = useState(0);
  const [avatarSeed] = useState('Sofia');

  useEffect(() => {
    // Animate XP bar on mount
    setTimeout(() => setXpWidth(65), 300);
    setTimeout(() => setMissionProgress(60), 500);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFAF4] flex">
      {/* SIDEBAR */}
      <aside className="w-70 bg-white p-8 flex flex-col gap-8 shadow-[4px_0_20px_rgba(124,77,255,0.08)]">
        <div className="text-center justify-center center">
          <div className="mt-6 justify-center center group-hover:scale-110 transition">
            <EducationMascot character="bounce" expression="happy" size={100} />
          </div>
          
          <h3 className="text-2xl font-bold text-[#8B67FF] mb-2">
            Sofía García
          </h3>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <a href="/dashboard/student" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-[#7C4DFF] to-[#E0569E] text-white shadow-[0_4px_12px_rgba(124,77,255,0.3)]">
            <span className="text-xl">🏠</span>
            <span>Inicio</span>
          </a>
          <a href="/dashboard/student/lessons" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-gray-600 hover:bg-[#F3F0FF] hover:text-[#7C4DFF] transition-all hover:translate-x-1">
            <span className="text-xl">📚</span>
            <span>Mis Clases</span>
          </a>
          <a href="/dashboard/student/lesson-builder" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-gray-600 hover:bg-[#F3F0FF] hover:text-[#7C4DFF] transition-all hover:translate-x-1">
            <span className="text-xl">🏆</span>
            <span>Logros</span>
          </a>
          <a href="/dashboard/student/friends" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-gray-600 hover:bg-[#F3F0FF] hover:text-[#7C4DFF] transition-all hover:translate-x-1">
            <span className="text-xl">👥</span>
            <span>Amigos</span>
          </a>
          <a href="/dashboard/student/settings" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-gray-600 hover:bg-[#F3F0FF] hover:text-[#7C4DFF] transition-all hover:translate-x-1">
            <span className="text-xl">⚙️</span>
            <span>Configuración</span>
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-[900] text-gray-800 mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
            ¡Hola, Sofía! 👋
          </h1>
          <p className="text-gray-00">¿Lista para otra aventura de aprendizaje?</p>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* DAILY MISSION CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-2 bg-gradient-to-br from-[#7C4DFF] to-[#E0569E] rounded-[20px] p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-xl font-[900]" style={{ fontFamily: "'Fredoka One', cursive" }}>Misión del Día</h3>
              <span className="text-3xl">✨</span>
            </div>
            
            <div className="flex gap-6 items-center">
              <motion.div 
                className="text-6xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎯
              </motion.div>
              
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-2">Completa 5 ejercicios de Matemática</h4>
                <p className="text-sm opacity-90 mb-4">¡Ya vas muy bien! Solo te faltan 2 ejercicios más.</p>
                
                <div className="bg-white/20 rounded-xl h-5 overflow-hidden mb-2">
                  <motion.div 
                    className="bg-[#FFD84D] h-full rounded-xl flex items-center justify-center text-xs font-bold text-gray-800"
                    initial={{ width: 0 }}
                    animate={{ width: `${missionProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  >
                    3/5
                  </motion.div>
                </div>
                
                <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-white/15 rounded-xl w-fit">
                  <span className="text-2xl">🏅</span>
                  <span className="text-sm font-bold">+150 XP al completar</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SUBJECT MAP */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-2 bg-white rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-xl font-[900] text-gray-800" style={{ fontFamily: "'Fredoka One', cursive" }}>Mapa de Materias</h3>
              <span className="text-3xl">🗺️</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🔢', name: 'Matemática', progress: '75%', color: '#FFD84D' },
                { icon: '🔬', name: 'Ciencias', progress: '60%', color: '#34D399' },
                { icon: '📖', name: 'Lengua', progress: '85%', color: '#A855F7' },
                { icon: '🏛️', name: 'Historia', progress: '45%', color: '#FB923C' },
                { icon: '🎨', name: 'Arte', progress: '90%', color: '#F43F5E' },
                { icon: '💻', name: 'Tecnología', progress: '70%', color: '#3B82F6' }
              ].map((subject, i) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square rounded-[20px] flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: subject.color }}
                >
                  <div className="absolute inset-0 opacity-10" style={{ backgroundColor: subject.color }} />
                  <span className="text-4xl relative z-10">{subject.icon}</span>
                  <span className="font-bold text-sm text-gray-800 relative z-10">{subject.name}</span>
                  <span className="text-xs font-semibold text-gray-600 relative z-10">{subject.progress} completo</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RECENT ACTIVITY */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-xl font-[900] text-gray-800" style={{ fontFamily: "'Fredoka One', cursive" }}>Actividad Reciente</h3>
              <span className="text-3xl">📊</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { icon: '🔢', name: 'Multiplicación básica', time: 'Hace 2 horas', score: 95, stars: 3, bg: '#FFD84D' },
                { icon: '🔬', name: 'El ciclo del agua', time: 'Ayer', score: 88, stars: 2, bg: '#34D399' },
                { icon: '📖', name: 'Comprensión lectora', time: 'Hace 2 días', score: 100, stars: 3, bg: '#A855F7' }
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-[#F3F0FF] transition-all hover:translate-x-1 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: activity.bg }}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-800">{activity.name}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#7C4DFF]">{activity.score}%</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(star => (
                        <span key={star} className={star <= activity.stars ? 'text-[#FFD84D]' : 'text-gray-300'}>⭐</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* LEADERBOARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-xl font-[900] text-gray-800" style={{ fontFamily: "'Fredoka One', cursive" }}>Tabla de Posiciones</h3>
              <span className="text-3xl">🏆</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { rank: 1, name: 'Lucas Martínez', xp: '1,250 XP', avatar: 'Lucas', current: false },
                { rank: 2, name: 'Emma Rodríguez', xp: '980 XP', avatar: 'Emma', current: false },
                { rank: 3, name: 'Sofía García (Tú)', xp: '650 XP', avatar: 'Sofia', current: true },
                { rank: 4, name: 'Mateo López', xp: '545 XP', avatar: 'Mateo', current: false },
                { rank: 5, name: 'Valentina Díaz', xp: '430 XP', avatar: 'Valentina', current: false }
              ].map((player, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:translate-x-1 ${
                    player.current 
                      ? 'bg-gradient-to-r from-[#F3F0FF] to-[#FFF4E6] border-2 border-[#7C4DFF]' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    player.rank <= 3 
                      ? 'bg-gradient-to-br from-[#FFD84D] to-[#FB923C] text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {player.rank}
                  </div>
                  <img 
                    src={`https://api.dicebear.com/9.x/micah/svg?seed=${player.avatar}`}
                    alt={player.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <span className="flex-1 font-bold text-sm text-gray-800">{player.name}</span>
                  <span className="font-bold text-sm text-[#7C4DFF]">{player.xp}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ACHIEVEMENTS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-xl font-[900] text-gray-800" style={{ fontFamily: "'Fredoka One', cursive" }}>Mis Logros</h3>
              <span className="text-3xl">🎖️</span>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: '🏆', name: 'Primera Victoria', unlocked: true },
                { icon: '📚', name: 'Lector Ávido', unlocked: true },
                { icon: '🔥', name: 'Racha de 7', unlocked: true },
                { icon: '⭐', name: 'Perfeccionista', unlocked: true },
                { icon: '🎨', name: 'Artista', unlocked: true },
                { icon: '💎', name: 'Nivel 10', unlocked: false },
                { icon: '🚀', name: 'Explorador', unlocked: false },
                { icon: '👑', name: 'Campeón', unlocked: false }
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                  whileHover={{ scale: badge.unlocked ? 1.1 : 1 }}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    badge.unlocked 
                      ? 'bg-gradient-to-br from-[#FFD84D] to-[#FB923C]' 
                      : 'bg-[#F3F0FF] opacity-30 grayscale'
                  }`}
                >
                  <span className="text-3xl">{badge.icon}</span>
                  <span className="text-[10px] font-bold text-gray-700 text-center px-1">{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* STREAK COUNTER */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-br from-[#FB923C] to-[#F43F5E] rounded-[20px] p-6 text-white shadow-lg hover:shadow-xl transition-all text-center cursor-pointer hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-[900]" style={{ fontFamily: "'Fredoka One', cursive" }}>Racha de Estudio</h3>
            </div>
            
            <motion.div 
              className="text-6xl my-4"
              animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔥
            </motion.div>
            
            <div className="text-7xl font-[900] my-4" style={{ fontFamily: "'Fredoka One', cursive", textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              7
            </div>
            
            <div className="text-lg font-bold opacity-90">días consecutivos</div>
          </motion.div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
