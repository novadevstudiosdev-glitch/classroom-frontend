"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedCard from "./AnimatedCard";
import ChatPanel from "./ChatPanel";
import GameCantoBanner from "./GameCantoBanner";
import PlayerActionButtons from "./PlayerActionButtons";
import ScorePanel from "./ScorePanel";
import {
  buildCantoFlowState,
  getDefaultCallOptions,
  getEnvidoLabel,
  getResponseLabel,
  getResponseOptions,
  getTrucoLabel,
  type PlayerActionOption,
} from "./cantoHelpers";
import type { ChatMessage, TrucoCard, TrucoEnvidoCall, TrucoTrucoCall } from "../../types/game.types";

type HandCard = TrucoCard & { uid: string };
type OpponentCard = { id: number };
type BannerTone = "envido" | "truco" | "accept" | "reject" | "raise" | "neutral";

interface TeamMember {
  alias: string;
  socketId?: string;
}

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
  myTeam?: "A" | "B";
  teamAMembers?: TeamMember[];
  teamBMembers?: TeamMember[];
  envidoStatus?: "available" | "pending" | "resolved" | "expired";
  envidoChain?: TrucoEnvidoCall[];
  envidoResponderTeam?: "A" | "B" | null;
  envidoLastResponse?: { alias: string; response: "quiero" | "noquiero" | string } | null;
  trucoStatus?: "available" | "pending" | "resolved";
  trucoChain?: TrucoTrucoCall[];
  trucoResponderTeam?: "A" | "B" | null;
  trucoLastResponse?: { alias: string; response: "quiero" | "noquiero" | string } | null;
  chatMessages?: ChatMessage[];
  onSendChat?: (text: string) => void;
  onAction?: (actionType: string) => void;
  onPlayCard?: (card: TrucoCard) => void;
}

const CARD_W = 96;
const CARD_H = 144;
const HAND_SPACING = 84;
const DEAL_FROM_X = 302;
const DEAL_FROM_Y_OPP = 172;
const DEAL_FROM_Y_ME = -302;
const SELECTED_LIFT = 24;

function normalizeAlias(alias: string): string {
  return alias.trim().toLowerCase();
}

function actionLabel(actionType: string): string {
  if (actionType === "real-envido") return "REAL ENVIDO";
  if (actionType === "falta-envido") return "FALTA ENVIDO";
  if (actionType === "no-quiero") return "NO QUIERO";
  if (actionType === "vale-cuatro") return "VALE CUATRO";
  if (actionType === "retruco") return "RETRUCO";
  if (actionType === "quiero") return "QUIERO";
  if (actionType === "truco") return "TRUCO";
  if (actionType === "envido") return "ENVIDO";
  if (actionType === "ir-al-mazo") return "AL MAZO";
  return actionType.toUpperCase();
}

function actionTone(actionType: string): BannerTone {
  if (actionType === "quiero") return "accept";
  if (actionType === "no-quiero") return "reject";
  if (actionType === "retruco" || actionType === "vale-cuatro" || actionType === "real-envido" || actionType === "falta-envido") return "raise";
  if (actionType === "envido") return "envido";
  if (actionType === "truco") return "truco";
  return "neutral";
}

function responseKey(r: { alias: string; response: string } | null | undefined): string {
  return r ? `${r.alias}-${r.response}` : "";
}

function fanRotate(index: number, count: number): number {
  if (count <= 1) return 0;
  const middle = (count - 1) / 2;
  return (index - middle) * 12;
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
  myTeam,
  teamAMembers = [],
  teamBMembers = [],
  envidoStatus,
  envidoChain = [],
  envidoResponderTeam,
  envidoLastResponse,
  trucoStatus,
  trucoChain = [],
  trucoResponderTeam,
  trucoLastResponse,
  chatMessages = [],
  onSendChat,
  onAction,
  onPlayCard,
}: Props) {
  const [playerHand, setPlayerHand] = useState<HandCard[]>([]);
  const [opponentHand, setOpponentHand] = useState<OpponentCard[]>([]);
  const [dealt, setDealt] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [pendingPlayedCard, setPendingPlayedCard] = useState<TrucoCard | null>(null);
  const [transientBanner, setTransientBanner] = useState<{
    text: string;
    actor: string | null;
    tone: BannerTone;
  } | null>(null);

  const dealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevEnvidoLenRef = useRef(0);
  const prevTrucoLenRef = useRef(0);
  const prevEnvidoRespKeyRef = useRef("");
  const prevTrucoRespKeyRef = useRef("");
  const prevHandCountRef = useRef(0);
  const eventsReadyRef = useRef(false);

  const handSignature = useMemo(
    () => (hand ?? []).map((card) => `${card.suit}-${card.value}`).join("|"),
    [hand],
  );

  const pushTransientBanner = (text: string, actor: string | null, tone: BannerTone) => {
    setTransientBanner({ text, actor, tone });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setTransientBanner(null), 3000);
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
      if (myServerCard || !stillInHand) setPendingPlayedCard(null);
    }

    if (normalizedHand.length === 3 && prevHandCountRef.current !== 3) {
      setSelectedCardId(null);
      setPendingPlayedCard(null);
      setDealt(false);
      if (dealTimer.current) clearTimeout(dealTimer.current);
      dealTimer.current = setTimeout(() => setDealt(true), 40);
    }

    prevHandCountRef.current = normalizedHand.length;
  }, [hand, handSignature, opponentCardCount, selectedCardId, pendingPlayedCard, currentRoundCards, playerName]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!eventsReadyRef.current) {
      prevEnvidoLenRef.current = envidoChain.length;
      prevTrucoLenRef.current = trucoChain.length;
      prevEnvidoRespKeyRef.current = responseKey(envidoLastResponse);
      prevTrucoRespKeyRef.current = responseKey(trucoLastResponse);
      eventsReadyRef.current = true;
      return;
    }

    if (envidoChain.length > prevEnvidoLenRef.current) {
      const last = envidoChain[envidoChain.length - 1];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (last) pushTransientBanner(getEnvidoLabel(last.type), last.alias, "envido");
    }
    if (trucoChain.length > prevTrucoLenRef.current) {
      const last = trucoChain[trucoChain.length - 1];
      if (last) pushTransientBanner(getTrucoLabel(last.type), last.alias, "truco");
    }

    const envidoRespKey = responseKey(envidoLastResponse);
    const trucoRespKey = responseKey(trucoLastResponse);

    if (envidoRespKey && envidoRespKey !== prevEnvidoRespKeyRef.current && envidoLastResponse) {
      pushTransientBanner(getResponseLabel(envidoLastResponse.response), envidoLastResponse.alias, envidoLastResponse.response === "quiero" ? "accept" : "reject");
    }
    if (trucoRespKey && trucoRespKey !== prevTrucoRespKeyRef.current && trucoLastResponse) {
      pushTransientBanner(getResponseLabel(trucoLastResponse.response), trucoLastResponse.alias, trucoLastResponse.response === "quiero" ? "accept" : "reject");
    }

    prevEnvidoLenRef.current = envidoChain.length;
    prevTrucoLenRef.current = trucoChain.length;
    prevEnvidoRespKeyRef.current = envidoRespKey;
    prevTrucoRespKeyRef.current = trucoRespKey;
  }, [envidoChain, trucoChain, envidoLastResponse, trucoLastResponse]);

  useEffect(
    () => () => {
      if (dealTimer.current) clearTimeout(dealTimer.current);
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
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

  const cantoFlow = buildCantoFlowState({
    envidoStatus,
    envidoChain,
    envidoResponderTeam,
    trucoStatus,
    trucoChain,
    trucoResponderTeam,
    teamAMembers,
    teamBMembers,
  });

  const isMyTurn = normalizeAlias(currentTurnAlias ?? "") === normalizeAlias(playerName);
  const isMyResponseTurn = normalizeAlias(cantoFlow.responderAlias ?? "") === normalizeAlias(playerName);

  const canInteract = canPlay && phase === "playing" && !pendingPlayedCard && !cantoFlow.waitingResponse;

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
      : isMyTurn
        ? "Te toca a vos"
        : `Turno de ${currentTurnAlias ?? "rival"}`;

  const playerCardCount = Math.max(1, displayedPlayerHand.length);
  const opponentCardFanCount = Math.max(1, opponentHand.length);
  const playerHandWidth = CARD_W + HAND_SPACING * Math.max(0, playerCardCount - 1) + 34;
  const opponentHandWidth = CARD_W + HAND_SPACING * Math.max(0, opponentCardFanCount - 1) + 34;

  const responseOptions = isMyResponseTurn ? getResponseOptions(cantoFlow) : [];
  const callOptions = getDefaultCallOptions();

  const actionOptions: PlayerActionOption[] =
    cantoFlow.waitingResponse ? responseOptions : phase === "playing" ? callOptions : [];

  const actionTitle =
    cantoFlow.waitingResponse && isMyResponseTurn
      ? "Responder canto"
      : cantoFlow.waitingResponse
        ? "Esperando respuesta rival"
        : "Cantar";

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

  const handleAction = (actionType: string) => {
    onAction?.(actionType);
    if (actionType !== "ir-al-mazo") {
      pushTransientBanner(actionLabel(actionType), playerName, actionTone(actionType));
    }
  };

  const activeBanner = transientBanner
    ? {
        text: transientBanner.text,
        actor: transientBanner.actor,
        responder: null,
        waitingResponse: false,
        tone: transientBanner.tone,
      }
    : null;

  const lastEnvidoCall = envidoChain[envidoChain.length - 1];
  const lastTrucoCall = trucoChain[trucoChain.length - 1];

  return (
    <div className="truco-root">
      <ScorePanel
        scoreUs={scoreUs}
        scoreThem={scoreThem}
        lastEnvido={lastEnvidoCall ? `${lastEnvidoCall.alias}: ${getEnvidoLabel(lastEnvidoCall.type)}` : "-"}
        lastTruco={lastTrucoCall ? `${lastTrucoCall.alias}: ${getTrucoLabel(lastTrucoCall.type)}` : "-"}
      />

      <div className="panel-center">
        <span className="brand">? T R U C O ?</span>
        <div className={`turn-pill ${isMyTurn ? "mine" : "other"}`}>{turnText}</div>

        <GameCantoBanner
          visible={!!activeBanner}
          text={activeBanner?.text ?? ""}
          actor={activeBanner?.actor}
          responder={activeBanner?.responder}
          waitingResponse={activeBanner?.waitingResponse}
          tone={activeBanner?.tone ?? "neutral"}
        />

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
            width: opponentHandWidth,
            height: CARD_H + 26,
            zIndex: 12,
          }}
        >
          <AnimatePresence>
            {opponentHand.map((card, index) => {
              const toX = index * HAND_SPACING;
              const rot = fanRotate(index, opponentHand.length);
              return (
                <AnimatedCard
                  key={`opp-${card.id}`}
                  id={`opp-${card.id}`}
                  back
                  alt={`Carta rival ${card.id}`}
                  width={CARD_W}
                  height={CARD_H}
                  dealt={dealt}
                  dealFrom={{ x: DEAL_FROM_X, y: DEAL_FROM_Y_OPP, rotate: 0, scale: 0.82 }}
                  to={{ x: toX, y: 0, rotate: rot }}
                  delay={dealt ? index * 0.24 : 0}
                  border="2px solid #f2f2f2"
                  zIndex={6 + index}
                />
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
                initial={{ x: 40, y: -132, rotate: 0, scale: 0.82, opacity: 0 }}
                animate={{ x: 40, y: bothCardsOnTable ? -42 : 8, rotate: bothCardsOnTable ? -7 : 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", width: CARD_W, height: CARD_H }}
              >
                <AnimatedCard
                  id={`opp-round-${opponentRoundCard.suit}-${opponentRoundCard.value}`}
                  card={opponentRoundCard}
                  alt={`Carta en mesa de ${opponentName}`}
                  width={CARD_W}
                  height={CARD_H}
                  dealt={false}
                  dealFrom={{ x: 0, y: 0 }}
                  to={{ x: 0, y: 0 }}
                  border="2px solid #1d1d1d"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {myRoundCard && (
              <motion.div
                key={`my-round-${myRoundCard.suit}-${myRoundCard.value}`}
                initial={{ x: 40, y: 146, rotate: 0, scale: 0.82, opacity: 0 }}
                animate={{ x: 40, y: bothCardsOnTable ? 42 : 8, rotate: bothCardsOnTable ? 8 : 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", width: CARD_W, height: CARD_H }}
              >
                <AnimatedCard
                  id={`my-round-${myRoundCard.suit}-${myRoundCard.value}`}
                  card={myRoundCard}
                  alt={`${myRoundCard.value} de ${myRoundCard.suit}`}
                  width={CARD_W}
                  height={CARD_H}
                  dealt={false}
                  dealFrom={{ x: 0, y: 0 }}
                  to={{ x: 0, y: 0 }}
                  border="2px solid #1d1d1d"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 214,
            left: "50%",
            transform: "translateX(-50%)",
            width: playerHandWidth,
            height: CARD_H + 36,
            zIndex: 20,
          }}
        >
          <AnimatePresence>
            {displayedPlayerHand.map((card, index) => {
              const toX = index * HAND_SPACING;
              const rot = fanRotate(index, displayedPlayerHand.length);
              const isSelected = selectedCardId === card.uid;

              return (
                <AnimatedCard
                  key={card.uid}
                  id={card.uid}
                  card={card}
                  alt={`${card.value} de ${card.suit}`}
                  width={CARD_W}
                  height={CARD_H}
                  dealt={dealt}
                  dealFrom={{ x: DEAL_FROM_X, y: DEAL_FROM_Y_ME, rotate: 0, scale: 0.82 }}
                  to={{ x: toX, y: isSelected ? -SELECTED_LIFT : 0, rotate: rot }}
                  delay={dealt ? index * 0.24 + 0.12 : 0}
                  selected={isSelected}
                  interactive
                  disabled={!canInteract}
                  onClick={() => handleSelectOrPlay(card)}
                  zIndex={20 + index}
                  opacity={canInteract || isSelected ? 1 : 0.75}
                />
              );
            })}
          </AnimatePresence>
        </div>

        <p className="card-hint" style={{ position: "absolute", bottom: 194, marginBottom: 0 }}>
          {canInteract
            ? "Toca una carta para seleccionarla y volve a tocar para tirarla"
            : cantoFlow.waitingResponse
              ? "Hay un canto pendiente de respuesta"
              : isMyTurn
                ? "Esperando confirmacion del servidor..."
                : `Esperando jugada de ${currentTurnAlias ?? "rival"}`}
        </p>

        <div style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", zIndex: 28 }}>
          <PlayerActionButtons
            title={actionTitle}
            options={actionOptions}
            disabled={phase !== "playing" || (cantoFlow.waitingResponse && !isMyResponseTurn)}
            onAction={handleAction}
          />
        </div>

        <div className="mano-info">
          Mano Nro {handNum} - Ronda {(round ?? 0) + 1}/3
          <br />
          Dealer: {dealerAlias ?? playerName}
          <br />
          {myTeam ? `Equipo ${myTeam}` : ""}
        </div>
      </div>

      <ChatPanel playerName={playerName} playerScore={scoreUs} messages={chatMessages} onSend={(text) => onSendChat?.(text)} />
    </div>
  );
}
