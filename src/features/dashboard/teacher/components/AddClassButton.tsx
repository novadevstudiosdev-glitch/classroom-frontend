import type { AddClassButtonProps } from "@/features/dashboard/teacher/types";

const AddClassButton = ({
  label = "Nueva clase",
  icon = "➕",
  className = "",
  onClick,
}: AddClassButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1CB0F6] text-white font-semibold shadow-sm transition-all duration-150 hover:bg-[#0e8ed0] hover:shadow-[0_10px_20px_rgba(14,142,208,0.4)] active:scale-[0.98] active:translate-y-[1px] ${className}`}
      aria-label="Agregar nueva clase"
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default AddClassButton;
