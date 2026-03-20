"use client";

import { useState } from "react";
import { EditClassModalProps, NewClassData } from "../types";

const EMOJI_OPTIONS = ["🔢", "📚", "🧪", "🌍", "🎨", "🏃", "🎵", "💻", "✏️", "🔬"];

const EMPTY_FORM: NewClassData = {
  emoji: "📚",
  name: "",
  studentCount: 0,
  isActive: true,
  completionPercent: 0,
  activeToday: 0,
  behind: 0,
  code: "",
};

const EditClassModal = ({ isOpen, onClose, initialData, onSubmit }: EditClassModalProps) => {
  const [form, setForm] = useState<NewClassData>(initialData ?? EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewClassData, string>>>({});

  if (!isOpen || !initialData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
              ? value === ""
                ? 0
                : Number(value)
              : value,
      };
    });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewClassData, string>> = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!form.code.trim()) newErrors.code = "El código es obligatorio";
    if (form.studentCount < 0) newErrors.studentCount = "No puede ser negativo";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700">Editar Clase</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Ícono</label>
          <div className="flex gap-2 flex-wrap">
            {EMOJI_OPTIONS.map((em) => (
              <button
                type="button"
                key={em}
                onClick={() => setForm((p) => ({ ...p, emoji: em }))}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                  form.emoji === em
                    ? "border-[#1CB0F6] bg-[#1CB0F6]/10"
                    : "border-transparent bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre de la clase</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#1CB0F6] ${
              errors.name ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Código de clase</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#1CB0F6] ${
              errors.code ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Cantidad de alumnos</label>
          <input
            name="studentCount"
            type="number"
            min={0}
            value={form.studentCount === 0 ? "" : form.studentCount}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#1CB0F6] ${
              errors.studentCount ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.studentCount && <p className="text-xs text-red-500 mt-1">{errors.studentCount}</p>}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="edit-isActive"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="w-4 h-4 accent-[#58CC02]"
          />
          <label htmlFor="edit-isActive" className="text-sm font-semibold text-gray-600">
            Marcar como activa
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-xl bg-[#1CB0F6] text-white text-sm font-bold hover:bg-[#1CB0F6]/90 transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClassModal;
