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
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      {/* ------------------Header------------- */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)]/20 text-3xl">
          {emoji}
        </div>
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-bold text-white">{name}</h3>
          <p className="text-sm text-white/70">{studentCount} alumnos</p>
          <div className="mt-2">
            <span
              className={`inline-block px-3 py-1 text-white text-xs rounded-full ${
                isActive ? "bg-[var(--color-secondary)]" : "bg-white/30"
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
          <p className="text-xs text-white/70">Completitud</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--color-primary)]">{activeToday}</p>
          <p className="text-xs text-white/70">Activos hoy</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#FF9600]">{behind}</p>
          <p className="text-xs text-white/70">Atrasados</p>
        </div>
      </div>

      {/* --------------Footer carrd------------- */}
      <div className="flex items-center justify-between border-t border-white/20 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70">Código:</span>
          <span className="rounded-full bg-[var(--color-primary)]/20 px-3 py-1 text-sm font-bold text-[var(--color-primary)]">
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
