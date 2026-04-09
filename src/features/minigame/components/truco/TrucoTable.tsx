"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import CantoOverlay from "./CantoOverlay";
import ChatPanel from "./ChatPanel";
import ScorePanel from "./ScorePanel";
import type { ChatMessage, TrucoCard, TrucoEnvidoCall, TrucoTrucoCall } from "../../types/game.types";
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
  currentTurnAlias?: string;
  canPlay?: boolean;
  phase?: "playing" | "show_envido" | "hand_end" | "game_over";
  handNum?: number;
  round?: number;
  dealerAlias?: string;
  currentRoundCards?: Record<string, TrucoCard | null>;
  envidoChain?: TrucoEnvidoCall[];
  trucoChain?: TrucoTrucoCall[];
  chatMessages?: ChatMessage[];
  onSendChat?: (text: string) => void;
  onCanto?: (type: CantoType) => void;
  onPlayCard?: (card: TrucoCard) => void;
}

const VALID_VALUES = new Set<CardValue>([1, 2, 3, 4, 5, 6, 7, 10, 11, 12]);
const CARD_W = 96;
const CARD_H = 144;
const HAND_SPACING = 94;
const DEAL_FROM_X = 300;
const SELECTED_LIFT = 24;
const OPPONENT_HAND_W = CARD_W + HAND_SPACING * 2 + 40;
const OPPONENT_HAND_H = CARD_H + 24;
const PLAYER_HAND_W = CARD_W + HAND_SPACING * 2 + 40;
const PLAYER_HAND_H = CARD_H + 42;

function toCardValue(value: number): CardValue {
  return VALID_VALUES.has(value as CardValue) ? (value as CardValue) : 1;
}

function formatEnvidoCall(type: string): string {
  if (type === "realenvido") return "Real Envido";
  if (type === "faltaenvido") return "Falta Envido";
  return "Envido";
}

function formatTrucoCall(type: string): string {
  if (type === "retruco") return "Retruco";
  if (type === "valecuatro") return "Vale Cuatro";
  return "Truco";
}

function normalizeAlias(alias: string): string {
  return alias.trim().toLowerCase();
}

export default function TrucoTable({
  playerName,
  scoreUs,
  scoreThem,
  hand,
  opponentName = "Rival",
  opponentCardCount = 3,
  currentTurnAlias,
  canPlay = false,
  phase = "playing",
  handNum = 1,
  round = 0,
  dealerAlias,
  currentRoundCards,
  envidoChain = [],
  trucoChain = [],
  chatMessages = [],
  onSendChat,
  onCanto,
  onPlayCard,
}: Props) {
  const [canto, setCanto] = useState<Canto | null>(null);
  const [playerHand, setPlayerHand] = useState<HandCard[]>([]);
  const [opponentHand, setOpponentHand] = useState<OpponentCard[]>([]);
  const [dealt, setDealt] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [pendingPlayedCard, setPendingPlayedCard] = useState<TrucoCard | null>(null);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevEnvidoLenRef = useRef(0);
  const prevTrucoLenRef = useRef(0);
  const prevHandCountRef = useRef(0);

  const handSignature = useMemo(
    () => (hand ?? []).map((card) => `${card.suit}-${card.value}`).join("|"),
    [hand],
  );

  const showCanto = (nextCanto: Canto) => {
    setCanto(nextCanto);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setCanto(null), 3200);
  };

  const handleCanto = (type: CantoType, word: string, who = playerName) => {
    showCanto({ type, word, who });
    onCanto?.(type);
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const normalizedHand = (hand ?? []).map((card, index) => ({
      ...card,
      uid: `${card.suit}-${card.value}-${index}`,
    }));

    setPlayerHand(normalizedHand);
    setOpponentHand(Array.from({ length: Math.max(0, opponentCardCount) }, (_, i) => ({ id: i + 1 })));

    if (selectedCardId && !normalizedHand.some((card) => card.uid === selectedCardId)) {
      setSelectedCardId(null);
    }

    if (pendingPlayedCard) {
      const myServerCard = currentRoundCards?.[playerName] ?? null;
      const stillInHand = normalizedHand.some(
        (card) => card.suit === pendingPlayedCard.suit && card.value === pendingPlayedCard.value,
      );
      if (myServerCard || !stillInHand) {
        setPendingPlayedCard(null);
      }
    }

    if (normalizedHand.length === 3 && prevHandCountRef.current !== 3) {
      setSelectedCardId(null);
      setPendingPlayedCard(null);
      setDealt(false);
      if (dealTimer.current) clearTimeout(dealTimer.current);
      dealTimer.current = setTimeout(() => setDealt(true), 50);
    }

    prevHandCountRef.current = normalizedHand.length;
  }, [hand, handSignature, opponentCardCount, selectedCardId, pendingPlayedCard, currentRoundCards, playerName]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const incoming = envidoChain ?? [];
    if (incoming.length > prevEnvidoLenRef.current) {
      const last = incoming[incoming.length - 1];
      if (last?.alias && normalizeAlias(last.alias) !== normalizeAlias(playerName)) {
        const overlayType: CantoType =
          last.type === "realenvido" ? "real-envido" : last.type === "faltaenvido" ? "falta-envido" : "envido";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        showCanto({
          type: overlayType,
          word: formatEnvidoCall(last.type),
          who: last.alias,
        });
      }
    }
    prevEnvidoLenRef.current = incoming.length;
  }, [envidoChain, playerName]);

  useEffect(() => {
    const incoming = trucoChain ?? [];
    if (incoming.length > prevTrucoLenRef.current) {
      const last = incoming[incoming.length - 1];
      if (last?.alias && normalizeAlias(last.alias) !== normalizeAlias(playerName)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        showCanto({
          type: "truco",
          word: formatTrucoCall(last.type),
          who: last.alias,
        });
      }
    }
    prevTrucoLenRef.current = incoming.length;
  }, [trucoChain, playerName]);

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (dealTimer.current) clearTimeout(dealTimer.current);
    },
    [],
  );

  const displayedPlayerHand = useMemo(() => {
    if (!pendingPlayedCard) return playerHand;
    let removed = false;
    return playerHand.filter((card) => {
      if (removed) return true;
      if (card.suit === pendingPlayedCard.suit && card.value === pendingPlayedCard.value) {
        removed = true;
        return false;
      }
      return true;
    });
  }, [playerHand, pendingPlayedCard]);

  const canInteract = canPlay && phase === "playing" && !pendingPlayedCard;

  const myRoundCard = currentRoundCards?.[playerName] ?? pendingPlayedCard;
  const opponentRoundCard = currentRoundCards?.[opponentName] ?? null;
  const bothCardsOnTable = !!myRoundCard && !!opponentRoundCard;

  const turnText =
    phase !== "playing"
      ? phase === "show_envido"
        ? "Mostrando Envido"
        : phase === "hand_end"
          ? "Fin de Mano"
          : "Partida Terminada"
      : currentTurnAlias
        ? normalizeAlias(currentTurnAlias) === normalizeAlias(playerName)
          ? "Te toca a vos"
          : `Turno de ${currentTurnAlias}`
        : "Esperando turno";

  const lastEnvidoCall = envidoChain[envidoChain.length - 1];
  const lastTrucoCall = trucoChain[trucoChain.length - 1];

  const handleSelectOrPlay = (card: HandCard) => {
    if (!canInteract) return;
    if (selectedCardId === card.uid) {
      setSelectedCardId(null);
      setPendingPlayedCard({ suit: card.suit, value: card.value });
      onPlayCard?.({ suit: card.suit, value: card.value });
      return;
    }
    setSelectedCardId(card.uid);
  };

  return (
    <div className="truco-root">
      <ScorePanel
        scoreUs={scoreUs}
        scoreThem={scoreThem}
        lastEnvido={lastEnvidoCall ? `${lastEnvidoCall.alias}: ${formatEnvidoCall(lastEnvidoCall.type)}` : "-"}
        lastTruco={lastTrucoCall ? `${lastTrucoCall.alias}: ${formatTrucoCall(lastTrucoCall.type)}` : "-"}
      />

      <div className="panel-center">
        <span className="brand">? T R U C O ?</span>
        <div className={`turn-pill ${normalizeAlias(currentTurnAlias ?? "") === normalizeAlias(playerName) ? "mine" : "other"}`}>
          {turnText}
        </div>

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
            top: 76,
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
            top: "35%",
            left: "50%",
            transform: "translateX(-50%)",
            width: CARD_W + 82,
            height: CARD_H + 108,
            zIndex: 16,
            pointerEvents: "none",
          }}
        >
          <AnimatePresence>
            {opponentRoundCard && (
              <motion.div
                key={`opponent-round-${opponentRoundCard.suit}-${opponentRoundCard.value}`}
                initial={{
                  x: 40,
                  y: -132,
                  rotate: 0,
                  scale: 0.82,
                  opacity: 0,
                }}
                animate={{
                  x: 40,
                  y: bothCardsOnTable ? -42 : 8,
                  rotate: bothCardsOnTable ? -7 : 0,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
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
                  src={getCardImageUrl(opponentRoundCard.suit, toCardValue(opponentRoundCard.value))}
                  alt={`Carta en mesa de ${opponentName}`}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {myRoundCard && (
              <motion.div
                key={`my-round-${myRoundCard.suit}-${myRoundCard.value}`}
                initial={{
                  x: 40,
                  y: 146,
                  rotate: 0,
                  scale: 0.82,
                  opacity: 0,
                }}
                animate={{
                  x: 40,
                  y: bothCardsOnTable ? 42 : 8,
                  rotate: bothCardsOnTable ? 8 : 0,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
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
                  src={getCardImageUrl(myRoundCard.suit, toCardValue(myRoundCard.value))}
                  alt={`${myRoundCard.value} de ${myRoundCard.suit}`}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 206,
            left: "50%",
            transform: "translateX(-50%)",
            width: PLAYER_HAND_W,
            height: PLAYER_HAND_H,
            zIndex: 20,
          }}
        >
          <AnimatePresence>
            {displayedPlayerHand.map((card, index) => {
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
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: dealt ? index * 0.2 + 0.8 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={
                    canInteract
                      ? {
                          y: isSelected ? -SELECTED_LIFT : -14,
                          scale: 1.04,
                        }
                      : undefined
                  }
                  whileTap={canInteract ? { scale: 0.98 } : undefined}
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
                    cursor: canInteract ? "pointer" : "default",
                    zIndex: 20 + index,
                    userSelect: "none",
                    padding: 0,
                    background: "#fff",
                    opacity: canInteract || !!isSelected ? 1 : 0.75,
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
          {canInteract
            ? "Toca una carta para seleccionarla y volve a tocar para tirarla a la mesa"
            : normalizeAlias(currentTurnAlias ?? "") === normalizeAlias(playerName)
              ? "Esperando confirmacion del servidor..."
              : `Esperando jugada de ${currentTurnAlias ?? "rival"}`}
        </p>

        <div style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", zIndex: 25 }}>
          <ActionButtons onCanto={handleCanto} />
        </div>

        <div className="mano-info">
          Mano Nro {handNum} - Ronda {(round ?? 0) + 1}/3
          <br />
          Dealer: {dealerAlias ?? playerName}
        </div>

        {canto && <CantoOverlay canto={canto} onDismiss={() => setCanto(null)} />}
      </div>

      <ChatPanel playerName={playerName} playerScore={scoreUs} messages={chatMessages} onSend={(text) => onSendChat?.(text)} />
    </div>
  );
}
