"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import CantoOverlay from "./CantoOverlay";
import ChatPanel from "./ChatPanel";
import ScorePanel from "./ScorePanel";
import type { TrucoCard } from "../../types/game.types";
import type { Canto, CantoType } from "../../types/truco";
import { BACK_URL, getCardImageUrl } from "../SpanishCard";
import type { CardValue } from "../SpanishCard";

type HandCard = TrucoCard & { uid: string };
type OpponentCard = { id: number };

interface Props {
  playerName: string;
  scoreUs: number;
  scoreThem: number;
  hand?: TrucoCard[];
  opponentName?: string;
  opponentCardCount?: number;
  onCanto?: (type: CantoType, word: string, who?: string) => void;
  onPlayCard?: (card: TrucoCard) => void;
}

const VALID_VALUES = new Set<CardValue>([1, 2, 3, 4, 5, 6, 7, 10, 11, 12]);
const CARD_W = 96;
const CARD_H = 144;
const HAND_SPACING = 94;
const TABLE_SPACING = 96;
const DEAL_FROM_X = 300;
const SELECTED_LIFT = 24;
const OPPONENT_HAND_W = CARD_W + HAND_SPACING * 2 + 40;
const OPPONENT_HAND_H = CARD_H + 24;
const TABLE_CARDS_W = CARD_W + TABLE_SPACING * 2;
const TABLE_CARDS_H = CARD_H + 16;
const PLAYER_HAND_W = CARD_W + HAND_SPACING * 2 + 40;
const PLAYER_HAND_H = CARD_H + 42;

function toCardValue(value: number): CardValue {
  return VALID_VALUES.has(value as CardValue) ? (value as CardValue) : 1;
}

export default function TrucoTable({
  playerName,
  scoreUs,
  scoreThem,
  hand,
  opponentName = "Rival",
  opponentCardCount = 3,
  onCanto,
  onPlayCard,
}: Props) {
  const [canto, setCanto] = useState<Canto | null>(null);
  const [playerHand, setPlayerHand] = useState<HandCard[]>([]);
  const [opponentHand, setOpponentHand] = useState<OpponentCard[]>([]);
  const [playerTable, setPlayerTable] = useState<HandCard[]>([]);
  const [opponentTable, setOpponentTable] = useState<OpponentCard[]>([]);
  const [dealt, setDealt] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rivalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handSignature = useMemo(
    () => (hand ?? []).map((card) => `${card.suit}-${card.value}`).join("|"),
    [hand],
  );

  const handleCanto = (type: CantoType, word: string, who = playerName) => {
    setCanto({ type, word, who });
    onCanto?.(type, word, who);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setCanto(null), 3200);
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const normalizedHand = (hand ?? []).map((card, index) => ({
      ...card,
      uid: `${card.suit}-${card.value}-${index}`,
    }));
    const nextCount = normalizedHand.length > 0 ? normalizedHand.length : opponentCardCount;

    setPlayerHand(normalizedHand);
    setOpponentHand(Array.from({ length: nextCount }, (_, i) => ({ id: i + 1 })));

    if (selectedCardId && !normalizedHand.some((card) => card.uid === selectedCardId)) {
      setSelectedCardId(null);
    }

    if (normalizedHand.length === 3) {
      setPlayerTable([]);
      setOpponentTable([]);
      setSelectedCardId(null);
      setDealt(false);
      if (dealTimer.current) clearTimeout(dealTimer.current);
      dealTimer.current = setTimeout(() => setDealt(true), 50);
    }
  }, [hand, handSignature, opponentCardCount, selectedCardId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleDeal = () => {
    setDealt(false);
    if (dealTimer.current) clearTimeout(dealTimer.current);
    dealTimer.current = setTimeout(() => setDealt(true), 50);
  };

  const handleSelectOrPlay = (card: HandCard) => {
    if (selectedCardId === card.uid) {
      setPlayerHand((prev) => prev.filter((c) => c.uid !== card.uid));
      setPlayerTable((prev) => [...prev, card]);
      setSelectedCardId(null);
      onPlayCard?.({ suit: card.suit, value: card.value });

      if (rivalTimer.current) clearTimeout(rivalTimer.current);
      rivalTimer.current = setTimeout(() => {
        setOpponentHand((prev) => {
          if (prev.length === 0) return prev;
          const rivalCard = prev[0];
          setOpponentTable((tablePrev) => [...tablePrev, rivalCard]);
          return prev.slice(1);
        });
      }, 700);
      return;
    }
    setSelectedCardId(card.uid);
  };

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (dealTimer.current) clearTimeout(dealTimer.current);
      if (rivalTimer.current) clearTimeout(rivalTimer.current);
    },
    [],
  );

  return (
    <div className="truco-root">
      <ScorePanel scoreUs={scoreUs} scoreThem={scoreThem} />

      <div className="panel-center">
        <button
          onClick={handleDeal}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 30,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(200,164,74,0.45)",
            background: "rgba(255,255,255,0.93)",
            color: "#1f1f1f",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
        >
          Repartir
        </button>

        <span className="brand">? T R U C O ?</span>
        <div className="timer">30s</div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 32,
            transform: "translateY(-50%)",
            width: 78,
            height: 114,
            borderRadius: 12,
            background: "linear-gradient(135deg, #ececec, #cfcfcf)",
            border: "2px solid #1f1f1f",
            boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#222",
            zIndex: 6,
            userSelect: "none",
          }}
        >
          MAZO
        </div>

        <div className="table-wrap">
          <div className="table-oval">
            <div className="table-shine" />
            <div className="table-ring" />
          </div>
          <div className="table-shadow" />
        </div>

        <div
          style={{
            position: "absolute",
            top: 70,
            left: "50%",
            transform: "translateX(-50%)",
            width: OPPONENT_HAND_W,
            height: OPPONENT_HAND_H,
            zIndex: 12,
          }}
        >
          <AnimatePresence>
            {opponentHand.map((card, index) => {
              const finalX = index * HAND_SPACING;
              const finalRotate = index === 0 ? -10 : index === 1 ? 0 : 10;
              return (
                <motion.div
                  key={card.id}
                  initial={
                    dealt
                      ? {
                          x: DEAL_FROM_X,
                          y: 170,
                          rotate: 0,
                          scale: 0.82,
                          opacity: 0,
                        }
                      : false
                  }
                  animate={{
                    x: finalX,
                    y: 0,
                    rotate: finalRotate,
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    x: 46,
                    y: 230,
                    rotate: 8,
                    scale: 0.98,
                    opacity: 0.98,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: dealt ? index * 0.2 + 0.15 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: CARD_W,
                    height: CARD_H,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "2px solid #f2f2f2",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={BACK_URL}
                    alt={`Carta rival ${card.id}`}
                    draggable={false}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div
          style={{
            position: "absolute",
            top: "33%",
            left: "50%",
            transform: "translateX(-50%)",
            width: TABLE_CARDS_W,
            height: TABLE_CARDS_H,
            zIndex: 14,
            pointerEvents: "none",
          }}
        >
          <AnimatePresence>
            {opponentTable.map((card, index) => (
              <motion.div
                key={`opponent-table-${card.id}-${index}`}
                initial={{
                  x: -24 + index * 14,
                  y: -150,
                  rotate: 0,
                  scale: 1.03,
                  opacity: 0.95,
                }}
                animate={{
                  x: index * TABLE_SPACING,
                  y: 0,
                  rotate: index === 0 ? -7 : index === 1 ? 3 : 8,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "2px solid #1d1d1d",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BACK_URL}
                  alt={`Carta en mesa de ${opponentName}`}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div
          style={{
            position: "absolute",
            top: "53%",
            left: "50%",
            transform: "translateX(-50%)",
            width: TABLE_CARDS_W,
            height: TABLE_CARDS_H,
            zIndex: 15,
            pointerEvents: "none",
          }}
        >
          <AnimatePresence>
            {playerTable.map((card, index) => (
              <motion.div
                key={`player-table-${card.uid}`}
                initial={{
                  x: -24 + index * 14,
                  y: 150,
                  rotate: 0,
                  scale: 1.07,
                  opacity: 0.95,
                }}
                animate={{
                  x: index * TABLE_SPACING,
                  y: 0,
                  rotate: index === 0 ? -8 : index === 1 ? 4 : 10,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "2px solid #1d1d1d",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCardImageUrl(card.suit, toCardValue(card.value))}
                  alt={`${card.value} de ${card.suit}`}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 204,
            left: "50%",
            transform: "translateX(-50%)",
            width: PLAYER_HAND_W,
            height: PLAYER_HAND_H,
            zIndex: 20,
          }}
        >
          <AnimatePresence>
            {playerHand.map((card, index) => {
              const finalX = index * HAND_SPACING;
              const finalRotate = index === 0 ? -12 : index === 1 ? 0 : 12;
              const isSelected = selectedCardId === card.uid;

              return (
                <motion.button
                  key={card.uid}
                  type="button"
                  layout
                  initial={
                    dealt
                      ? {
                          x: DEAL_FROM_X,
                          y: -300,
                          rotate: 0,
                          scale: 0.82,
                          opacity: 0,
                        }
                      : false
                  }
                  animate={{
                    x: finalX,
                    y: isSelected ? -SELECTED_LIFT : 0,
                    rotate: finalRotate,
                    scale: isSelected ? 1.06 : 1,
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: dealt ? index * 0.2 + 0.8 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: isSelected ? -SELECTED_LIFT : -14,
                    scale: 1.04,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOrPlay(card)}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: CARD_W,
                    height: CARD_H,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: isSelected ? "3px solid #f4c542" : "2px solid #1d1d1d",
                    boxShadow: isSelected
                      ? "0 14px 28px rgba(0,0,0,0.3)"
                      : "0 10px 20px rgba(0,0,0,0.22)",
                    cursor: "pointer",
                    zIndex: 20 + index,
                    userSelect: "none",
                    padding: 0,
                    background: "#fff",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getCardImageUrl(card.suit, toCardValue(card.value))}
                    alt={`${card.value} de ${card.suit}`}
                    draggable={false}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <p className="card-hint" style={{ position: "absolute", bottom: 188, marginBottom: 0 }}>
          Toca una carta para seleccionarla y volve a tocar para tirarla a la mesa
        </p>

        <div style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", zIndex: 25 }}>
          <ActionButtons onCanto={handleCanto} />
        </div>

        <div className="mano-info">
          Mano Nro 1 - Ronda 1/3
          <br />
          Dealer: {playerName}
        </div>

        {canto && <CantoOverlay canto={canto} onDismiss={() => setCanto(null)} />}
      </div>

      <ChatPanel playerName={playerName} playerScore={scoreUs} />
    </div>
  );
}
