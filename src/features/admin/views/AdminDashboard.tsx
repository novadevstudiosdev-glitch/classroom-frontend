"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  BookOpen,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  FileText,
  LogOut,
  Menu,
  Bell,
  Search,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

// Datos de ejemplo para gráficos
const salesData = [
  { name: "Lun", ventas: 4000, estudiantes: 2400 },
  { name: "Mar", ventas: 3000, estudiantes: 1398 },
  { name: "Mié", ventas: 5000, estudiantes: 3800 },
  { name: "Jue", ventas: 2780, estudiantes: 2908 },
  { name: "Vie", ventas: 6890, estudiantes: 4800 },
  { name: "Sáb", ventas: 4390, estudiantes: 3800 },
  { name: "Dom", ventas: 3490, estudiantes: 2300 },
];

const progressData = [
  { name: "Matemáticas", completado: 85 },
  { name: "Ciencias", completado: 72 },
  { name: "Historia", completado: 68 },
  { name: "Arte", completado: 94 },
];

const pieData = [
  { name: "Activos", value: 1450, color: "#3B82F6" },
  { name: "Inactivos", value: 320, color: "#9CA3AF" },
  { name: "Suspendidos", value: 45, color: "#EF4444" },
];

const recentActivities = [
  {
    id: 1,
    user: "María González",
    action: "completó el curso",
    item: "Matemáticas Avanzadas",
    time: "hace 5 min",
    avatar: "MG",
  },
  {
    id: 2,
    user: "Carlos López",
    action: "se inscribió en",
    item: "Programación Web",
    time: "hace 2 horas",
    avatar: "CL",
  },
  {
    id: 3,
    user: "Ana Martínez",
    action: "obtuvo certificación",
    item: "Diseño UX/UI",
    time: "hace 1 día",
    avatar: "AM",
  },
  {
    id: 4,
    user: "Pedro Ruiz",
    action: "compartió",
    item: "Proyecto Final",
    time: "hace 2 días",
    avatar: "PR",
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: "Reunión con profesores",
    date: "Hoy, 15:00",
    priority: "Alta",
  },
  {
    id: 2,
    title: "Revisar exámenes",
    date: "Mañana, 10:00",
    priority: "Media",
  },
  {
    id: 3,
    title: "Actualizar contenido",
    date: "10 Dic, 09:00",
    priority: "Baja",
  },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", color: "text-blue-400" },
    {
      id: "students",
      icon: Users,
      label: "Estudiantes",
      color: "text-green-400",
    },
    {
      id: "courses",
      icon: BookOpen,
      label: "Cursos",
      color: "text-purple-400",
    },
    {
      id: "certificates",
      icon: Award,
      label: "Certificados",
      color: "text-yellow-400",
    },
    {
      id: "calendar",
      icon: Calendar,
      label: "Calendario",
      color: "text-pink-400",
    },
    {
      id: "reports",
      icon: FileText,
      label: "Reportes",
      color: "text-orange-400",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Configuración",
      color: "text-gray-400",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Barra lateral */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900/90 backdrop-blur-xl border-r border-blue-500/20 transition-all duration-300 z-30 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo y toggle */}
          <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <Image
                  src="/NOVI.png"
                  alt="Logo Novi - classroom"
                  width={120}
                  height={120}
                  className="object-contain justify-centercursor-pointer"
                />
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-blue-500/20 text-blue-300"
            >
              {sidebarOpen ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 py-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-blue-500/20 border-r-2 border-blue-500 text-white"
                    : "text-blue-200/70 hover:bg-blue-500/10 hover:text-white"
                }`}
              >
                <item.icon
                  size={20}
                  className={
                    activeTab === item.id ? item.color : "text-blue-300"
                  }
                />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Botón de logout */}
          <div className="p-4 border-t border-blue-500/20">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200">
              <LogOut size={20} />
              {sidebarOpen && (
                <span className="text-sm font-medium">Cerrar Sesión</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main
        className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-blue-500/20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-blue-500/20 text-blue-300"
              >
                <Menu size={20} />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-blue-500/20 text-blue-300">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AD</span>
                </div>
                {sidebarOpen && (
                  <div className="hidden md:block">
                    <p className="text-white text-sm font-medium">Admin User</p>
                    <p className="text-blue-300 text-xs">Administrador</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Contenido del dashboard */}
        <div className="p-6">
          {/* Cards de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: Users,
                label: "Estudiantes Totales",
                value: "1,845",
                change: "+12%",
                color: "from-blue-500 to-blue-600",
                iconColor: "text-blue-300",
              },
              {
                icon: BookOpen,
                label: "Cursos Activos",
                value: "24",
                change: "+3",
                color: "from-green-500 to-green-600",
                iconColor: "text-green-300",
              },
              {
                icon: Award,
                label: "Certificados",
                value: "1,234",
                change: "+18%",
                color: "from-purple-500 to-purple-600",
                iconColor: "text-purple-300",
              },
              {
                icon: TrendingUp,
                label: "Tasa de Finalización",
                value: "87%",
                change: "+5%",
                color: "from-orange-500 to-orange-600",
                iconColor: "text-orange-300",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${card.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                />
                <div className="relative z-10">
                  <card.icon className={`w-8 h-8 ${card.iconColor} mb-4`} />
                  <p className="text-blue-200 text-sm">{card.label}</p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {card.value}
                  </p>
                  <p className="text-green-400 text-xs mt-2">
                    {card.change} vs mes anterior
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfico de barras */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4">
                Actividad Semanal
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderColor: "#3B82F6",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#F1F5F9" }}
                  />
                  <Bar dataKey="ventas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="estudiantes"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de líneas */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4">
                Progreso por Curso
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderColor: "#3B82F6",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#F1F5F9" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completado"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actividades recientes y tareas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actividades recientes */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-500/20">
                <h3 className="text-white font-semibold">
                  Actividades Recientes
                </h3>
              </div>
              <div className="divide-y divide-blue-500/20">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 hover:bg-blue-500/5 transition-colors"
                  >
                    <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold">
                        {activity.avatar}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold">{activity.user}</span>{" "}
                        {activity.action}{" "}
                        <span className="text-blue-300">{activity.item}</span>
                      </p>
                      <p className="text-blue-300/60 text-xs mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <MessageSquare className="w-4 h-4 text-blue-400/50" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tareas pendientes y gráfico circular */}
            <div className="space-y-6">
              {/* Tareas */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-500/20">
                  <h3 className="text-white font-semibold">Próximas Tareas</h3>
                </div>
                <div className="divide-y divide-blue-500/20">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 hover:bg-blue-500/5 transition-colors"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">
                          {task.title}
                        </p>
                        <p className="text-blue-300/60 text-xs mt-1">
                          {task.date}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === "Alta"
                            ? "bg-red-500/20 text-red-300"
                            : task.priority === "Media"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico circular */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                <h3 className="text-white font-semibold mb-4">
                  Estado de Estudiantes
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        borderColor: "#3B82F6",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#F1F5F9" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-blue-200 text-sm">{item.name}</span>
                      <span className="text-white text-sm font-medium">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
