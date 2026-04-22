"use client";

import { motion } from "motion/react";
import type { TrucoCard } from "../../types/game.types";
import { BACK_URL, getCardImageUrl } from "../SpanishCard";

interface DealPoint {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
}

interface AnimatedCardProps {
  id: string;
  card?: TrucoCard;
  back?: boolean;
  alt: string;
  width: number;
  height: number;
  dealt?: boolean;
  dealFrom: DealPoint;
  to: DealPoint;
  delay?: number;
  duration?: number;
  border?: string;
  shadow?: string;
  zIndex?: number;
  selected?: boolean;
  disabled?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  whileHoverLift?: number;
  whileTapScale?: number;
  opacity?: number;
}

export default function AnimatedCard({
  id,
  card,
  back = false,
  alt,
  width,
  height,
  dealt = true,
  dealFrom,
  to,
  delay = 0,
  duration = 0.52,
  border = "2px solid #1d1d1d",
  shadow = "0 10px 20px rgba(0,0,0,0.25)",
  zIndex = 1,
  selected = false,
  disabled = false,
  interactive = false,
  onClick,
  whileHoverLift = 14,
  whileTapScale = 0.98,
  opacity = 1,
}: AnimatedCardProps) {
  const src = back || !card ? BACK_URL : getCardImageUrl(card.suit, card.value as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12);

  const baseStyle = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    width,
    height,
    borderRadius: 12,
    overflow: "hidden",
    border: selected ? "3px solid #f4c542" : border,
    boxShadow: selected ? "0 14px 28px rgba(0,0,0,0.3)" : shadow,
    zIndex,
    userSelect: "none" as const,
    padding: 0,
    background: "#fff",
    opacity,
    cursor: interactive && !disabled ? "pointer" : "default",
  };

  const sharedProps = {
    layout: interactive ? true : undefined,
    initial: dealt
      ? {
          x: dealFrom.x,
          y: dealFrom.y,
          rotate: dealFrom.rotate ?? 0,
          scale: dealFrom.scale ?? 0.82,
          opacity: 0,
        }
      : false,
    animate: {
      x: to.x,
      y: to.y,
      rotate: to.rotate ?? 0,
      scale: 1,
      opacity: 1,
    },
    transition: {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
    style: baseStyle,
  };

  if (interactive) {
    return (
      <motion.button
        key={id}
        type="button"
        {...sharedProps}
        whileHover={disabled ? undefined : { y: selected ? -24 : -whileHoverLift, scale: 1.04 }}
        whileTap={disabled ? undefined : { scale: whileTapScale }}
        onClick={disabled ? undefined : onClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </motion.button>
    );
  }

  return (
    <motion.div key={id} {...sharedProps}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </motion.div>
  );
}
