import React from 'react'
import ClassDetailView from "@/features/dashboard/teacher/views/ClassDetailView";

type ClassDetailPageProps = {
  params: Promise<{
    classId: string;
  }>;
};

const ClassDetailPage = async ({ params }: ClassDetailPageProps) => {
  const { classId } = await params;
  return <ClassDetailView classId={classId} />;
};

export default ClassDetailPage
