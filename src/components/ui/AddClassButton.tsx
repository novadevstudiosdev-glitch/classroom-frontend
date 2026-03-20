import type { AddClassButtonProps } from '@/types/add-class-button.types'

const AddClassButton = ({
  label = 'Nueva clase',
  icon = '➕',
  className = ''
}: AddClassButtonProps) => {
  return (
    <button
      type="button"
      className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1CB0F6] text-white font-semibold shadow-sm ${className}`}
      aria-label="Agregar nueva clase"
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export default AddClassButton
