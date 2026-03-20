import React from 'react'
import { DashboardTopbar } from '@/shared/components/ui'
import type { DashboardTopbarAction } from '@/shared/types'

const teacherActions: DashboardTopbarAction[] = [
  { id: 'notifications', icon: '🔔', ariaLabel: 'Notificaciones del docente' },
  { id: 'settings', icon: '⚙️', ariaLabel: 'Configuración del docente' }
]

const TeacherDashboardTopbar = () => {
  return (
    <DashboardTopbar
      initials="MC"
      userName="María Clara Rodríguez"
      planLabel="Plan Gratuito"
      actions={teacherActions}
    />
  )
}

export default TeacherDashboardTopbar
