"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  TeacherDashboardBottomNavigation,
  TeacherDashboardTopbar,
} from "@/features/dashboard/teacher/components";
import {
  EXERCISE_TYPE_OPTIONS,
} from "@/features/exercise-builder/data";
import {
  ExerciseBuilderActions,
  ExerciseBuilderFormSection,
  ExerciseBuilderHeader,
  ExerciseTypeTabs,
} from "@/features/exercise-builder/components";
import { useExerciseBuilder } from "@/features/exercise-builder/hooks/useExerciseBuilder";
import {
  publishExercise,
  saveExerciseDraft,
} from "@/features/exercise-builder/services";

const ExerciseBuilderView = () => {
  const router = useRouter();
  const bottomNavigationItems = [
    { id: "home", icon: "🏠", label: "Inicio", href: "/dashboard/teacher" },
    { id: "lessons", icon: "📚", label: "Lecciones", href: "/lessons" },
    { id: "builder", icon: "🧩", label: "Crear ejercicios", href: "/lesson-builder", isActive: true },
  ];
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const {
    draft,
    updateBase,
    setType,
    setMultipleChoiceQuestion,
    setMultipleChoiceOption,
    addMultipleChoiceOption,
    removeMultipleChoiceOption,
    markMultipleChoiceCorrect,
    setFillBlankTemplate,
    syncFillBlankAnswersWithTemplate,
    setFillBlankAnswer,
    setTrueFalseStatement,
    setTrueFalseCorrectValue,
    setMatchLeftLabel,
    setMatchRightLabel,
    addMatchLeftItem,
    addMatchRightItem,
    removeMatchLeftItem,
    removeMatchRightItem,
    setMatchPair,
    clearMatchPair,
    setOrderItem,
    addOrderItem,
    removeOrderItem,
    moveOrderItem,
  } = useExerciseBuilder();

  const handleSaveDraft = async () => {
    const result = await saveExerciseDraft({ draft, lessonId });
    setLessonId(result.lessonId);
    setSaveMessage(
      result.mode === "created"
        ? "Borrador creado correctamente."
        : "Borrador actualizado correctamente.",
    );
  };

  const handlePublish = async () => {
    const result = await publishExercise({ draft, lessonId });
    setLessonId(result.lessonId);
    setSaveMessage("Lección publicada correctamente.");
  };

  return (
    <div className="landing-module-shell pb-24">
      <TeacherDashboardTopbar />

      <ExerciseBuilderHeader
        backHref="/lesson-builder?from=exercise-new"
        backLabel="Volver al lesson-builder"
        title="Constructor de ejercicios"
        subtitle="Crea y revisa los 5 tipos de ejercicio con diseño consistente."
      />

      <main className="landing-module-content space-y-4 p-6">
        {saveMessage ? (
          <div className="rounded-lg border border-green-300/40 bg-green-500/20 px-3 py-2 text-sm font-semibold text-green-100">
            {saveMessage}
          </div>
        ) : null}

        <ExerciseTypeTabs
          activeType={draft.type}
          options={EXERCISE_TYPE_OPTIONS}
          onChangeType={setType}
        />

        <ExerciseBuilderActions
          onSaveDraft={handleSaveDraft}
          onPreview={() => router.refresh()}
          onPublish={handlePublish}
        />

        <div>
          <ExerciseBuilderFormSection
            draft={draft}
            onChangeBase={updateBase}
            onChangeType={setType}
            onMultipleChoiceChangeQuestion={setMultipleChoiceQuestion}
            onMultipleChoiceChangeOption={setMultipleChoiceOption}
            onMultipleChoiceAddOption={addMultipleChoiceOption}
            onMultipleChoiceRemoveOption={removeMultipleChoiceOption}
            onMultipleChoiceMarkCorrect={markMultipleChoiceCorrect}
            onFillBlankChangeTemplate={setFillBlankTemplate}
            onFillBlankSyncAnswersWithTemplate={syncFillBlankAnswersWithTemplate}
            onFillBlankChangeAnswer={setFillBlankAnswer}
            onTrueFalseChangeStatement={setTrueFalseStatement}
            onTrueFalseChangeCorrectValue={setTrueFalseCorrectValue}
            onMatchColumnsChangeLeftLabel={setMatchLeftLabel}
            onMatchColumnsChangeRightLabel={setMatchRightLabel}
            onMatchColumnsAddLeftItem={addMatchLeftItem}
            onMatchColumnsAddRightItem={addMatchRightItem}
            onMatchColumnsRemoveLeftItem={removeMatchLeftItem}
            onMatchColumnsRemoveRightItem={removeMatchRightItem}
            onMatchColumnsSetPair={setMatchPair}
            onMatchColumnsClearPair={clearMatchPair}
            onOrderElementsChangeItem={setOrderItem}
            onOrderElementsAddItem={addOrderItem}
            onOrderElementsRemoveItem={removeOrderItem}
            onOrderElementsMoveItem={moveOrderItem}
          />
        </div>
      </main>

      <TeacherDashboardBottomNavigation items={bottomNavigationItems} />
    </div>
  );
};

export default ExerciseBuilderView;
