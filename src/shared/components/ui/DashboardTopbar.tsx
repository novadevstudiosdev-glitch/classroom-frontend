import React from 'react'
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
  return (
    <div className={`bg-white border-b px-6 py-4 ${containerClassName}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-12 h-12 bg-gradient-to-br from-[#1CB0F6] to-[#58CC02] rounded-xl flex items-center justify-center text-white font-bold ${avatarClassName}`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 text-lg truncate">{userName}</p>
            {showPlanLabel && (
              <p className="text-xs text-gray-600 bg-yellow-100 px-2 py-0.5 rounded-full inline-block">
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
                className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center ${action.className ?? ''}`}
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
