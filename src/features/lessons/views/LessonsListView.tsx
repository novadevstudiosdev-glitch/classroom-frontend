"use client";

import Link from "next/link";
import { LESSONS_MOCK } from "../data";

const LessonsListView = () => {
  return (
    <main className="landing-module-shell p-6">
      <div className="landing-module-content">
        <h1 className="landing-module-title mb-4">Lecciones</h1>

        <div className="space-y-3">
          {LESSONS_MOCK.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className="landing-module-card block transition hover:border-white/30"
            >
              <p className="font-semibold text-white">{lesson.title}</p>
              <p className="mt-1 text-sm text-white/70">{lesson.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LessonsListView;
