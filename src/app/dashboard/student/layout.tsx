// app/dashboard/student/layout.tsx

import SidebarNav from "@/features/dashboard/student/components/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#FDFAF4]">
      
      {/* SIDEBAR */}
      <aside className="w-65 h-screen sticky top-0 bg-white p-6 shadow-[4px_0_20px_rgba(124,77,255,0.08)]">
        <SidebarNav />
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 h-screen overflow-y-auto p-6">
        {children}
      </main>

    </div>
  );
}