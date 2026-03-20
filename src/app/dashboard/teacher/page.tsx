import React from 'react'

const dashboardTeacher = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
     
      {/* Topbar 
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1CB0F6] to-[#58CC02] rounded-xl flex items-center justify-center text-white font-bold">
              MC
            </div>
            <div>
              <p className="font-bold text-lg">María Clara Rodríguez</p>
              <p className="text-xs text-gray-600 bg-yellow-100 px-2 py-0.5 rounded-full inline-block">
                Plan Gratuito
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              🔔
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              ⚙️
            </button>
          </div>
        </div>
      
      */}
      
     
      
      {/* Hero azul */}
      <div className="bg-[#1CB0F6] px-6 py-8 text-white">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido/a de nuevo! 👋</h1>
        <p className="text-sm text-white/80 mb-6">Lunes, 16 de marzo de 2026</p>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">24</p>
            <p className="text-xs text-white/80">Alumnos</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">12</p>
            <p className="text-xs text-white/80">Lecciones</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">87%</p>
            <p className="text-xs text-white/80">Completitud</p>
          </div>
        </div>
      </div>
      
      {/* Nueva clase */}
      <div className="px-6 py-6">
       
        ➕ Nueva clase
      
      </div>
      
      {/* Mis clases */}
      <div className="px-6 pb-6">
        <h2 className="text-xl font-bold mb-4">Mis clases</h2>
        
        <div className="space-y-4">
          {/* Clase 1 */}
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                🔢
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Matemática 4° A</h3>
                <p className="text-sm text-gray-600">24 alumnos</p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-[#58CC02] text-white text-xs rounded-full">
                    Activa
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-[#58CC02]">87%</p>
                <p className="text-xs text-gray-600">Completitud</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#1CB0F6]">18</p>
                <p className="text-xs text-gray-600">Activos hoy</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#FF9600]">3</p>
                <p className="text-xs text-gray-600">Atrasados</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Código:</span>
                <span className="px-3 py-1 bg-[#1CB0F6]/10 text-[#1CB0F6] text-sm font-bold rounded-full">
                  MAT4A-2026
                </span>
              </div>
              <button className="text-[#1CB0F6] text-sm font-bold">Ver →</button>
            </div>
          </div>
          
          {/* Clase 2 */}
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                📖
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Lengua 4° B</h3>
                <p className="text-sm text-gray-600">22 alumnos</p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-[#58CC02] text-white text-xs rounded-full">
                    Activa
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-[#58CC02]">92%</p>
                <p className="text-xs text-gray-600">Completitud</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#1CB0F6]">15</p>
                <p className="text-xs text-gray-600">Activos hoy</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#FF9600]">1</p>
                <p className="text-xs text-gray-600">Atrasados</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Código:</span>
                <span className="px-3 py-1 bg-[#1CB0F6]/10 text-[#1CB0F6] text-sm font-bold rounded-full">
                  LEN4B-2026
                </span>
              </div>
              <button className="text-[#1CB0F6] text-sm font-bold">Ver →</button>
            </div>
          </div>
          
          {/* Clase 3 */}
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                🌿
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Ciencias Naturales 5°</h3>
                <p className="text-sm text-gray-600">20 alumnos</p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-full">
                    Pausada
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-[#58CC02]">78%</p>
                <p className="text-xs text-gray-600">Completitud</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#1CB0F6]">8</p>
                <p className="text-xs text-gray-600">Activos hoy</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#FF9600]">5</p>
                <p className="text-xs text-gray-600">Atrasados</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Código:</span>
                <span className="px-3 py-1 bg-[#1CB0F6]/10 text-[#1CB0F6] text-sm font-bold rounded-full">
                  CNA5-2026
                </span>
              </div>
              <button className="text-[#1CB0F6] text-sm font-bold">Ver →</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alumnos que necesitan atención */}
      <div className="px-6 pb-6">
        <h2 className="text-xl font-bold mb-4">Alumnos que necesitan atención</h2>
        
        <div className="bg-white rounded-2xl shadow-sm border divide-y">
          {[
            { name: 'Joaquín Pérez', issue: 'Sin actividad hace 3 días', class: 'Matemática 4° A' },
            { name: 'Sofía Gómez', issue: '2 lecciones atrasadas', class: 'Lengua 4° B' },
            { name: 'Lucas Martínez', issue: 'Racha perdida', class: 'Matemática 4° A' }
          ].map((student, index) => (
            <div key={index} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                {student.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{student.name}</p>
                <p className="text-xs text-gray-600">{student.class}</p>
                <p className="text-xs text-[#FF9600] font-medium mt-1">{student.issue}</p>
              </div>
              <button className="text-[#FF9600] text-sm font-bold">Ver →</button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center gap-1">
            <span className="text-2xl">🏠</span>
            <span className="text-xs text-[#1CB0F6] font-bold">Inicio</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <span className="text-2xl opacity-40">📚</span>
            <span className="text-xs text-gray-400">Lecciones</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <span className="text-2xl opacity-40">👥</span>
            <span className="text-xs text-gray-400">Alumnos</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <span className="text-2xl opacity-40">📊</span>
            <span className="text-xs text-gray-400">Progreso</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default dashboardTeacher