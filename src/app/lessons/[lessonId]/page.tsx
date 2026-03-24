import { AssignedLessonView } from "@/features/lessons/views";

type LessonDetailPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

const LessonDetailPage = async ({ params }: LessonDetailPageProps) => {
  const { lessonId } = await params;
  return <AssignedLessonView lessonId={lessonId} />;
};

export default LessonDetailPage;
