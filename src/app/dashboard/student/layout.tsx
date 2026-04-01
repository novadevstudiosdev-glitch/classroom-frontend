import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import SidebarNav from "@/features/dashboard/student/components/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex">
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <AuthBackgroundCanvas />
      </div>

      <div className="fixed top-0 left-0 h-screen z-20">
        <SidebarNav />
      </div>

      {/* CONTENIDO */}
      <main className="relative z-10 w-full md:ml-65 p-4 md:p-8">
        <div className="max-w-6xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
