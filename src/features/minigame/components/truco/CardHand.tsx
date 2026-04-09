"use client";

import { getCardImageUrl } from "../SpanishCard";
import type { TrucoCard } from "../../types/game.types";

const FALLBACK_CARDS: TrucoCard[] = [
  { suit: "copas", value: 12 },
  { suit: "oros", value: 6 },
  { suit: "bastos", value: 1 },
];

interface Props {
  cards?: TrucoCard[];
  selected: number | null;
  onSelect: (i: number | null) => void;
}

const VALID_VALUES = new Set([1, 2, 3, 4, 5, 6, 7, 10, 11, 12]);

export default function CardHand({ cards, selected, onSelect }: Props) {
  const hand = cards && cards.length > 0 ? cards : FALLBACK_CARDS;

  return (
    <div className="cards-area">
      {hand.map((card, i) => {
        const safeValue = VALID_VALUES.has(card.value) ? card.value : 1;
        const imageUrl = getCardImageUrl(
          card.suit,
          safeValue as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12,
        );
        return (
        <div
          key={`${card.suit}-${card.value}-${i}`}
          className={`card ${selected === i ? "sel" : ""}`}
          onClick={() => onSelect(selected === i ? null : i)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={`${card.value} de ${card.suit}`} className="card-img" draggable={false} />
        </div>
      )})}
    </div>
  );
}
