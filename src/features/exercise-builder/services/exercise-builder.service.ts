import { axiosClient } from "@/lib/axios/axios-client";
import type { ExerciseBuilderDraft } from "@/features/exercise-builder/types";

type SaveExerciseDraftParams = {
  draft: ExerciseBuilderDraft;
  lessonId?: string | null;
};

type PersistExerciseResult = {
  ok: boolean;
  lessonId: string;
  mode: "created" | "updated";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeLessonId = (payload: unknown): string | null => {
  if (!isRecord(payload)) return null;

  const directId = payload.id;
  if (typeof directId === "string" && directId.length > 0) return directId;

  const nestedData = payload.data;
  if (isRecord(nestedData) && typeof nestedData.id === "string" && nestedData.id.length > 0) {
    return nestedData.id;
  }

  return null;
};

// Mapea el constructor a un bloque serializable para backend.
const buildLessonContentJson = (draft: ExerciseBuilderDraft) => {
  const payloadByType = {
    multiple_choice: draft.multipleChoice,
    fill_blank: draft.fillBlank,
    true_false: draft.trueFalse,
    match_columns: draft.matchColumns,
    order_elements: draft.orderElements,
  };

  return {
    blocks: [
      {
        type: "exercise_builder",
        exercise_type: draft.type,
        base: draft.base,
        payload: payloadByType[draft.type],
      },
    ],
  };
};

const buildLessonBody = (draft: ExerciseBuilderDraft, status?: "draft" | "published") => {
  const body: Record<string, unknown> = {
    title: draft.base.title,
    description: draft.base.instructions,
    content_json: buildLessonContentJson(draft),
  };

  if (status) {
    body.status = status;
  }

  return body;
};

const createLesson = async (draft: ExerciseBuilderDraft): Promise<PersistExerciseResult> => {
  const body = buildLessonBody(draft, "draft");
  const { data } = await axiosClient.post("/lessons", body);
  const createdId = normalizeLessonId(data);

  if (!createdId) {
    throw new Error("No se pudo obtener el id de la lección creada.");
  }

  return {
    ok: true,
    lessonId: createdId,
    mode: "created",
  };
};

const updateLesson = async (
  lessonId: string,
  draft: ExerciseBuilderDraft,
  status: "draft" | "published",
): Promise<PersistExerciseResult> => {
  const body = buildLessonBody(draft, status);
  const { data } = await axiosClient.patch(`/lessons/${lessonId}`, body);
  const updatedId = normalizeLessonId(data) ?? lessonId;

  return {
    ok: true,
    lessonId: updatedId,
    mode: "updated",
  };
};

export const saveExerciseDraft = async ({
  draft,
  lessonId,
}: SaveExerciseDraftParams): Promise<PersistExerciseResult> => {
  if (!lessonId) {
    return createLesson(draft);
  }

  return updateLesson(lessonId, draft, "draft");
};

export const publishExercise = async ({
  draft,
  lessonId,
}: SaveExerciseDraftParams): Promise<PersistExerciseResult> => {
  if (!lessonId) {
    const created = await createLesson(draft);
    return updateLesson(created.lessonId, draft, "published");
  }

  return updateLesson(lessonId, draft, "published");
};
