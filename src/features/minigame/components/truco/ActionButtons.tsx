"use client";

import type { CantoType } from "../../types/truco";

interface Props {
  onCanto: (type: CantoType, word: string, who?: string) => void;
}

export default function ActionButtons({ onCanto }: Props) {
  return (
    <div className="actions">
      <div className="btn-row">
        <button className="btn b-env" onClick={() => onCanto("envido", "Envido")}>
          Envido
        </button>
        <button className="btn b-renv" onClick={() => onCanto("real-envido", "Real Envido")}>
          Real envido
        </button>
        <button className="btn b-falt" onClick={() => onCanto("falta-envido", "Falta Envido")}>
          Falta envido
        </button>
      </div>
      <div className="btn-row">
        <button className="btn b-truco" onClick={() => onCanto("truco", "TRUCO")}>
          TRUCO
        </button>
      </div>
      <button className="btn b-mazo">Ir al mazo</button>
    </div>
  );
}