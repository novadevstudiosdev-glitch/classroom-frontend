import { LessonSessionResultView } from "@/features/lessons/views";

type LessonResultPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
  searchParams: Promise<{
    xp?: string;
    stars?: string;
    correct?: string;
    total?: string;
    levelBefore?: string;
    levelAfter?: string;
    lessonTitle?: string;
  }>;
};

const LessonResultPage = async ({ params, searchParams }: LessonResultPageProps) => {
  const { lessonId } = await params;
  const query = await searchParams;

  return <LessonSessionResultView lessonId={lessonId} searchParams={query} />;
};

export default LessonResultPage;
