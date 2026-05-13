"use client";

import React, { useEffect, useState } from 'react'
import type { DashboardTopbarProps } from '@/shared/types'

const DashboardTopbar = ({
  initials = 'AA',
  userName = 'Name ',
  planLabel = 'Plan ',
  showPlanLabel = true,
  actions = [
    { id: 'notifications', icon: '🔔', ariaLabel: 'Notificaciones' },
    { id: 'settings', icon: '⚙️', ariaLabel: 'Configuración' }
  ],
  containerClassName = '',
  avatarClassName = '',
  leftContent,
  rightContent
}: DashboardTopbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-[140] px-6 py-4 backdrop-blur-2xl transition-all ${
        isScrolled
          ? "border-white/20 bg-[#07061a]/65 shadow-[0_10px_24px_rgba(2,6,26,0.45)]"
          : "bg-[#07061a]/40 shadow-[0_8px_20px_rgba(2,6,26,0.3)]"
      } ${containerClassName}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-12 h-12 bg-gradient-to-br from-[#1CB0F6] to-[#58CC02] rounded-xl flex items-center justify-center text-white font-bold ${avatarClassName}`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-lg truncate">{userName}</p>
            {showPlanLabel && (
              <p className="text-xs text-[#FFD700] bg-[#FFD700]/15 px-2 py-0.5 rounded-full inline-block border border-[#FFD700]/25">
                {planLabel}
              </p>
            )}
          </div>
          {leftContent}
        </div>
        {rightContent ?? (
          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                className={`w-10 h-10 bg-white/12 rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(2,6,26,0.35)] ${action.className ?? ''}`}
                type="button"
                aria-label={action.ariaLabel}
              >
                {action.icon}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardTopbar
