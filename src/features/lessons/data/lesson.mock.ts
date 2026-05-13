import type { Lesson } from "../types";

const COVER_IMAGES = [
  "/mercurio.png",
  "/astronauta-verde.svg",
  "/tierra.png",
  "/marte.png",
  "/saturno.png",
  "/neptuno.png",
  "/urano.png",
  "/maestra.png",
];

const LESSON_SEEDS: Array<{ title: string; description: string; subject: string }> = [
  { title: "Sumas hasta 20", description: "Practica sumas rapidas con apoyo visual.", subject: "Matematica" },
  { title: "Restas sin llevar", description: "Resuelve restas basicas paso a paso.", subject: "Matematica" },
  { title: "Problemas de dos pasos", description: "Aplica operaciones en situaciones reales.", subject: "Matematica" },
  { title: "Fracciones iniciales", description: "Identifica mitades y cuartos en objetos.", subject: "Matematica" },
  { title: "Multiplicacion por 2 y 3", description: "Descubre patrones de multiplicacion simples.", subject: "Matematica" },
  { title: "Lectura comprensiva I", description: "Lee un cuento corto y responde preguntas.", subject: "Lengua" },
  { title: "Uso de mayusculas", description: "Aprende reglas clave de escritura correcta.", subject: "Lengua" },
  { title: "Signos de puntuacion", description: "Domina coma, punto y signos de pregunta.", subject: "Lengua" },
  { title: "Sinonimos y antonimos", description: "Amplia vocabulario con pares de palabras.", subject: "Lengua" },
  { title: "Texto descriptivo", description: "Escribe una descripcion con detalles precisos.", subject: "Lengua" },
  { title: "Sistema solar basico", description: "Conoce planetas y sus caracteristicas.", subject: "Ciencias" },
  { title: "Estados del agua", description: "Observa cambios de solido, liquido y gas.", subject: "Ciencias" },
  { title: "Partes de la planta", description: "Identifica raiz, tallo, hoja y flor.", subject: "Ciencias" },
  { title: "Ciclo de vida animal", description: "Explora etapas de crecimiento de animales.", subject: "Ciencias" },
  { title: "Cuidado del ambiente", description: "Acciones simples para proteger tu entorno.", subject: "Ciencias" },
  { title: "Civilizaciones antiguas", description: "Descubre aportes de culturas historicas.", subject: "Historia" },
  { title: "Linea del tiempo", description: "Ordena hechos importantes por fecha.", subject: "Historia" },
  { title: "Heroes de la independencia", description: "Reconoce protagonistas y eventos clave.", subject: "Historia" },
  { title: "Mapas y regiones", description: "Ubica regiones y sus caracteristicas.", subject: "Geografia" },
  { title: "Climas del mundo", description: "Compara climas y paisajes distintos.", subject: "Geografia" },
  { title: "Colores primarios", description: "Mezcla colores para crear nuevas tonalidades.", subject: "Arte" },
  { title: "Figuras geometricas en arte", description: "Dibuja composiciones con formas simples.", subject: "Arte" },
  { title: "Musica y ritmo", description: "Reconoce patrones ritmicos basicos.", subject: "Arte" },
  { title: "Computacion basica", description: "Partes de una computadora y su uso.", subject: "Tecnologia" },
  { title: "Seguridad en internet", description: "Buenas practicas para navegar seguro.", subject: "Tecnologia" },
  { title: "Pensamiento computacional", description: "Resuelve retos con pasos logicos.", subject: "Tecnologia" },
  { title: "English: Classroom words", description: "Vocabulario esencial del aula.", subject: "Ingles" },
  { title: "English: Daily routines", description: "Frases cortas para rutinas diarias.", subject: "Ingles" },
  { title: "Convivencia y respeto", description: "Estrategias para una mejor convivencia.", subject: "Formacion" },
  { title: "Trabajo en equipo", description: "Dinamicas para colaborar en clase.", subject: "Formacion" },
];

const toLesson = (
  seed: { title: string; description: string; subject: string },
  index: number,
): Lesson => {
  const id = `LES${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    title: seed.title,
    description: seed.description,
    subject: seed.subject,
    coverImage: COVER_IMAGES[index % COVER_IMAGES.length],
    status: index % 4 === 0 ? "draft" : "published",
    content_json: {
      blocks: [
        {
          id: `${id}-p1`,
          type: "paragraph",
          text: `Leccion ${index + 1}: ${seed.title}.`,
        },
        {
          id: `${id}-tf1`,
          type: "true_false",
          prompt: `El tema principal es ${seed.subject}.`,
          correctValue: true,
          explanation: "Corresponde con la materia de la leccion.",
        },
      ],
    },
  };
};

export const LESSONS_MOCK: Lesson[] = LESSON_SEEDS.map(toLesson);
