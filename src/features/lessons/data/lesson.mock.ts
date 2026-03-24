import type { Lesson } from "../types";

export const LESSONS_MOCK: Lesson[] = [
  {
    id: "M34RSHC",
    title: "Introduccion a las sumas",
    description: "En esta leccion aprendemos a sumar numeros del 1 al 10.",
    status: "draft",
    content_json: {
      blocks: [
        {
          id: "b1",
          type: "paragraph",
          text: "Hola mundo",
        },
        {
          id: "b2",
          type: "question",
          prompt: "Si Juan tiene 8 manzanas y da 3 a María , cuantas le quedan?",
          options: [
            { id: "o1", letter: "A", text: "3 manzanas" },
            { id: "o2", letter: "B", text: "5 manzanas" },
            { id: "o3", letter: "C", text: "11 manzanas" },
            { id: "o4", letter: "D", text: "8 manzanas" },
          ],
          correctOptionId: "o2",
          explanation: "8 - 3 = 5",
        },
      ],
    },
  },
];