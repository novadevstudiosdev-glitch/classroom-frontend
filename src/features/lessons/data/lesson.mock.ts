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
          id: "b1-1",
          type: "image",
          src: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=1200&auto=format&fit=crop",
          alt: "Cuaderno con ejercicios de matemáticas",
          caption: "Observa la imagen y luego responde el ejercicio.",
        },
        {
          id: "b2",
          type: "multiple_choice",
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
        {
          id: "b3",
          type: "fill_blank",
          prompt: "Completa los espacios",
          explanation: "Piensa en la resta para encontrar el resultado.",
          fields: [
            { id: "f1", mode: "text", answer: "8" },
            { id: "f2", mode: "dropdown", answer: "5", options: ["3", "5", "10"] },
          ],
        },
        {
          id: "b4",
          type: "true_false",
          prompt: "Verdadero o falso: 2 + 2 = 4",
          correctValue: true,
          explanation: "Dos más dos siempre da cuatro.",
        },
        {
          id: "b5",
          type: "match_columns",
          prompt: "Relaciona cada operación con su resultado",
          leftItems: [
            { id: "l1", label: "2 + 3" },
            { id: "l2", label: "5 - 1" },
          ],
          rightItems: [
            { id: "r1", label: "4" },
            { id: "r2", label: "5" },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r2" },
            { leftId: "l2", rightId: "r1" },
          ],
        },
        {
          id: "b6",
          type: "order_elements",
          prompt: "Ordena de menor a mayor",
          items: ["1", "2", "3", "4"],
          explanation: "El orden correcto va de pequeño a grande.",
        },
        {
          id: "b7",
          type: "minigame",
          title: "Minijuego de repaso",
          description: "Haz un repaso rápido de lo aprendido en esta lección.",
          ctaLabel: "Jugar y continuar",
        },
      ],
    },
  },
];
