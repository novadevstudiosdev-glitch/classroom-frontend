import type { ReactNode } from 'react'

export type DashboardTopbarAction = {
  id: string
  icon: ReactNode
  ariaLabel: string
  className?: string
}

export type DashboardTopbarProps = {
  initials?: string
  userName?: string
  planLabel?: string
  showPlanLabel?: boolean
  actions?: DashboardTopbarAction[]
  containerClassName?: string
  avatarClassName?: string
  leftContent?: ReactNode
  rightContent?: ReactNode
}
