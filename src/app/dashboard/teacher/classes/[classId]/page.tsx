import Link from "next/link";

type TeacherClassDetailPageProps = {
  params: Promise<{
    classId: string;
  }>;
};

const TeacherClassDetailPage = async ({ params }: TeacherClassDetailPageProps) => {
  const { classId } = await params;

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold">Clase {classId}</h1>
        <p className="text-sm opacity-80">Detalle de clase pendiente de implementar.</p>
        <Link className="underline underline-offset-4" href="/dashboard/teacher">
          Volver al dashboard
        </Link>
      </div>
    </main>
  );
};

export default TeacherClassDetailPage;

