"use client";

import React from "react";
import { ClassCardProps } from "../types";

const ClassCard = ({
  emoji,
  name,
  studentCount,
  isActive,
  completionPercent,
  activeToday,
  behind,
  code,
  onView,
  onEdit,
  onArchive,
}: ClassCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      {/* ------------------Header------------- */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
          {emoji}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-700 mb-1">{name}</h3>
          <p className="text-sm text-gray-500">{studentCount} alumnos</p>
          <div className="mt-2">
            <span
              className={`inline-block px-3 py-1 text-white text-xs rounded-full ${
                isActive ? "bg-[#58CC02]" : "bg-gray-400"
              }`}
            >
              {isActive ? "Activa" : "Inactiva"}
            </span>
          </div>
        </div>
      </div>

      {/* --------------- ESTDISTICAS---------------------*/}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-[#58CC02]">
            {completionPercent}%
          </p>
          <p className="text-xs text-gray-500">Completitud</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#1CB0F6]">{activeToday}</p>
          <p className="text-xs text-gray-500">Activos hoy</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#FF9600]">{behind}</p>
          <p className="text-xs text-gray-500">Atrasados</p>
        </div>
      </div>

      {/* --------------Footer carrd------------- */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Código:</span>
          <span className="px-3 py-1 bg-[#1CB0F6]/10 text-[#1CB0F6] text-sm font-bold rounded-full">
            {code}
          </span>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-[#1CB0F6] hover:underline"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onArchive}
          className="text-xs text-red-500 hover:underline"
        >
          Archivar
        </button>
        <button
          onClick={onView}
          className="text-[#1CB0F6] text-sm font-bold hover:underline"
        >
          Ver →
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
