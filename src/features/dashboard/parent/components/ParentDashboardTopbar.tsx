import type { ParentDashboardTopbarProps } from "@/features/dashboard/parent/types";

const ParentDashboardTopbar = ({ profile }: ParentDashboardTopbarProps) => {
  return (
    <div className="border-b border-white/15 bg-white/10 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1CB0F6] font-bold text-white">
            {profile.initials}
          </div>
          <div>
            <p className="text-sm text-white/70">{profile.greeting}</p>
            <p className="text-lg font-bold text-white">{profile.name}</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Notificaciones"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
        >
          🔔
        </button>
      </div>
    </div>
  );
};

export default ParentDashboardTopbar;
