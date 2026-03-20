"use client";

import { useState } from "react";
import { EducationMascot } from "@/components/dolls/EducationMascot";

type CharacterType =
  | "orbit"
  | "spark"
  | "petal"
  | "focus"
  | "leaf"
  | "bounce";

const characters: { id: CharacterType; label: string }[] = [
  { id: "orbit", label: "Naranja" },
  { id: "spark", label: "Azul" },
  { id: "leaf", label: "Verde" },
  { id: "petal", label: "Violeta" },
  { id: "focus", label: "Rojo" },
  { id: "bounce", label: "Amarillo" },
];

export default function DashboardStudent() {
  const [selected, setSelected] = useState<CharacterType>("orbit");

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <section className="bg-[#1CB0F6] text-white text-center py-12 px-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Elegí tu personaje
        </h1>
        <p className="text-white/80 mt-2">
          Este es tu aventurero en Novi
        </p>

        {/* -----PREVIEW----- */}
        <div className="mt-6 flex flex-col items-center">
          <EducationMascot
            character={selected}
            expression="neutral"
            size={120}
          />

          <span className="mt-4 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
            {characters.find((c) => c.id === selected)?.label}
          </span>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 pb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <p className="text-center text-sm text-gray-500 mb-6">
            Tocá uno para elegirlo
          </p>
          
          {/* -------- GRID PERSONAJES -------- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {characters.map((char) => {
              const isSelected = selected === char.id;

              return (
                <button
                  key={char.id}
                  onClick={() => setSelected(char.id)}
                  className={`p-4 rounded-xl border transition flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? "bg-yellow-100 border-yellow-400 scale-[1.02]"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <EducationMascot
                    character={char.id}
                    expression="happy"
                    size={70}
                  />

                  <span className="text-xs mt-2 text-gray-600">
                    {char.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* -------- FORM -------- */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">
                ¿Cómo te llamás?
              </label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Código de tu clase
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="mt-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                  Verificar
                </button>
              </div>
            </div>

            <button className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
              ¡Empezar la aventura! →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}