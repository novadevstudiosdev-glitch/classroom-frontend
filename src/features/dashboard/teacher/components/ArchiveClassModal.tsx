"use client";

import { ArchiveClassModalProps } from "../types";

const ArchiveClassModal = ({ isOpen, onClose, classData, onConfirm }: ArchiveClassModalProps) => {
  if (!isOpen || !classData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-700 mb-2">Archivar clase</h2>
        <p className="text-sm text-gray-800 mb-4">
          ¿Seguro que quieres archivar <span className="font-semibold">{classData.name}</span>?
        </p>
        <p className="text-xs text-gray-800 mb-6">Código: {classData.code}</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(classData.code)}
            className="flex-1 py-2 rounded-xl bg-[#FF9600] text-white text-sm font-bold hover:bg-[#FF9600]/90 transition-colors"
          >
            Archivar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveClassModal;
