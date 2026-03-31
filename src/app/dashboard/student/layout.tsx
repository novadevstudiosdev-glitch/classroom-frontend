


import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import SidebarNav from "@/features/dashboard/student/components/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex ">
      
      {/* SIDEBAR */}
       <SidebarNav />
      
      <AuthBackgroundCanvas />

      {/* CONTENIDO */}
      <main className="relative z-10 w-full md:p-8">
        {children}
      </main>

    </div>
  );
}