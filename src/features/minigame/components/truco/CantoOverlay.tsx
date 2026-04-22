"use client";

import { useEffect, useState } from "react";
import type { Canto } from "../../types/truco";

interface Props {
  canto: Canto;
  onDismiss: () => void;
}

export default function CantoOverlay({ canto, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  const wordClass = `canto-word ${canto.type}`;

  return (
    <div className={`canto-overlay ${visible ? "show" : ""}`} onClick={handleDismiss}>
      <div className="canto-backdrop" />
      <div className="canto-card" onClick={(e) => e.stopPropagation()}>
        <div className="canto-who">{canto.who} canta:</div>
        <div className={wordClass}>{canto.word}</div>
        <div className="canto-sub">Hace clic para responder</div>
        <button className="canto-dismiss" onClick={handleDismiss}>
          x
        </button>
      </div>
    </div>
  );
}