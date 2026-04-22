"use client";

import type { PlayerActionOption } from "./cantoHelpers";

interface Props {
  title?: string;
  options: PlayerActionOption[];
  disabled?: boolean;
  onAction: (actionType: string) => void;
}

export default function PlayerActionButtons({ title, options, disabled = false, onAction }: Props) {
  if (options.length === 0) return null;

  return (
    <div className="player-actions">
      {title ? <div className="player-actions-title">{title}</div> : null}
      <div className="player-actions-grid">
        {options.map((opt) => (
          <button
            key={opt.actionType}
            className={`action-chip action-${opt.variant}`}
            onClick={() => onAction(opt.actionType)}
            disabled={disabled}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
