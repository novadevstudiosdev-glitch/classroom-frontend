"use client";

import Link from "next/link";
import { LESSONS_MOCK } from "../data";

const LessonsListView = () => {
  return (
    <main className="min-h-screen p-6 bg-orange-400">
      <h1 className="text-2xl font-bold text-white mb-4">Lecciones</h1>

      <div className="space-y-3">
        {LESSONS_MOCK.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/lessons/${lesson.id}`}
            className="block rounded-xl border bg-green-500 p-4 hover:bg-gray-50"
          >
            <p className="font-semibold text-gray-800">{lesson.title}</p>
            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default LessonsListView;