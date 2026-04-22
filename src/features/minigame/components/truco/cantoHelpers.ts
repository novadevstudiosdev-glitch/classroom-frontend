import type { TrucoEnvidoCall, TrucoTrucoCall } from "../../types/game.types";

export type CantoSource = "envido" | "truco";
export type ActionVariant = "primary" | "danger" | "accent" | "neutral";

export interface PlayerActionOption {
  actionType: string;
  label: string;
  variant: ActionVariant;
}

export interface CantoFlowState {
  isActive: boolean;
  source: CantoSource | null;
  callType: string | null;
  callLabel: string | null;
  callerAlias: string | null;
  responderAlias: string | null;
  waitingResponse: boolean;
  envidoCallCount: number;
  hasRealEnvido: boolean;
  hasFaltaEnvido: boolean;
}

interface BuildStateParams {
  envidoStatus?: "available" | "pending" | "resolved" | "expired";
  envidoChain?: TrucoEnvidoCall[];
  envidoResponderTeam?: "A" | "B" | null;
  trucoStatus?: "available" | "pending" | "resolved";
  trucoChain?: TrucoTrucoCall[];
  trucoResponderTeam?: "A" | "B" | null;
  teamAMembers?: { alias: string }[];
  teamBMembers?: { alias: string }[];
}

interface CallOptionsParams {
  phase?: "playing" | "show_envido" | "show_envido_points" | "hand_end" | "game_over";
  round?: number;
  envidoStatus?: "available" | "pending" | "resolved" | "expired";
  trucoStatus?: "available" | "pending" | "resolved";
  canGoMazo?: boolean;
}

function getResponderAlias(
  team: "A" | "B" | null | undefined,
  teamAMembers: { alias: string }[],
  teamBMembers: { alias: string }[],
): string | null {
  if (!team) return null;
  const members = team === "A" ? teamAMembers : teamBMembers;
  return members[0]?.alias ?? null;
}

export function getEnvidoLabel(type: string): string {
  if (type === "realenvido") return "REAL ENVIDO";
  if (type === "faltaenvido") return "FALTA ENVIDO";
  return "ENVIDO";
}

export function getTrucoLabel(type: string): string {
  if (type === "retruco") return "RETRUCO";
  if (type === "valecuatro") return "VALE CUATRO";
  return "TRUCO";
}

export function getResponseLabel(response: string): string {
  if (response === "noquiero") return "NO QUIERO";
  if (response === "quiero") return "QUIERO";
  if (response === "sonbuenas") return "SON BUENAS";
  if (response === "decirpuntos") return "DIGO PUNTOS";
  if (response === "realenvido") return "REAL ENVIDO";
  if (response === "faltaenvido") return "FALTA ENVIDO";
  if (response === "retruco") return "RETRUCO";
  if (response === "valecuatro") return "VALE CUATRO";
  return response.toUpperCase();
}

export function buildCantoFlowState({
  envidoStatus,
  envidoChain = [],
  envidoResponderTeam,
  trucoStatus,
  trucoChain = [],
  trucoResponderTeam,
  teamAMembers = [],
  teamBMembers = [],
}: BuildStateParams): CantoFlowState {
  if (envidoStatus === "pending" && envidoChain.length > 0) {
    const last = envidoChain[envidoChain.length - 1];
    return {
      isActive: true,
      source: "envido",
      callType: last.type,
      callLabel: getEnvidoLabel(last.type),
      callerAlias: last.alias,
      responderAlias: getResponderAlias(envidoResponderTeam, teamAMembers, teamBMembers),
      waitingResponse: true,
      envidoCallCount: envidoChain.filter((c) => c.type === "envido").length,
      hasRealEnvido: envidoChain.some((c) => c.type === "realenvido"),
      hasFaltaEnvido: envidoChain.some((c) => c.type === "faltaenvido"),
    };
  }

  if (trucoStatus === "pending" && trucoChain.length > 0) {
    const last = trucoChain[trucoChain.length - 1];
    return {
      isActive: true,
      source: "truco",
      callType: last.type,
      callLabel: getTrucoLabel(last.type),
      callerAlias: last.alias,
      responderAlias: getResponderAlias(trucoResponderTeam, teamAMembers, teamBMembers),
      waitingResponse: true,
      envidoCallCount: 0,
      hasRealEnvido: false,
      hasFaltaEnvido: false,
    };
  }

  return {
    isActive: false,
    source: null,
    callType: null,
    callLabel: null,
    callerAlias: null,
    responderAlias: null,
    waitingResponse: false,
    envidoCallCount: 0,
    hasRealEnvido: false,
    hasFaltaEnvido: false,
  };
}

export function getResponseOptions(state: CantoFlowState): PlayerActionOption[] {
  if (!state.waitingResponse || !state.source || !state.callType) return [];

  if (state.source === "envido") {
    const canRaiseEnvido =
      state.callType === "envido" &&
      state.envidoCallCount === 1 &&
      !state.hasRealEnvido &&
      !state.hasFaltaEnvido;
    const canRaiseReal = !state.hasRealEnvido && !state.hasFaltaEnvido;
    const canRaiseFalta = !state.hasFaltaEnvido;

    const base: PlayerActionOption[] = [
      { actionType: "quiero", label: "QUIERO", variant: "primary" },
      { actionType: "no-quiero", label: "NO QUIERO", variant: "danger" },
      { actionType: "decir-puntos", label: "DECIR PUNTOS", variant: "neutral" },
      { actionType: "son-buenas", label: "SON BUENAS", variant: "danger" },
    ];

    const raises: PlayerActionOption[] = [];
    if (canRaiseEnvido)
      raises.push({ actionType: "envido", label: "REDOBLAR: ENVIDO", variant: "accent" });
    if (canRaiseReal)
      raises.push({ actionType: "real-envido", label: "REDOBLAR: REAL ENVIDO", variant: "accent" });
    if (canRaiseFalta)
      raises.push({ actionType: "falta-envido", label: "REDOBLAR: FALTA ENVIDO", variant: "accent" });

    return [...base, ...raises];
  }

  const base: PlayerActionOption[] = [
    { actionType: "quiero", label: "QUIERO", variant: "primary" },
    { actionType: "no-quiero", label: "NO QUIERO", variant: "danger" },
  ];

  if (state.callType === "truco") {
    return [...base, { actionType: "retruco", label: "REDOBLAR: RETRUCO", variant: "accent" }];
  }
  if (state.callType === "retruco") {
    return [...base, { actionType: "vale-cuatro", label: "REDOBLAR: VALE CUATRO", variant: "accent" }];
  }
  return base;
}

export function getCallOptions({
  phase,
  round = 0,
  envidoStatus,
  trucoStatus,
  canGoMazo = false,
}: CallOptionsParams): PlayerActionOption[] {
  if (phase !== "playing") return [];

  const options: PlayerActionOption[] = [];

  if (envidoStatus === "available" && round === 0) {
    options.push({ actionType: "envido", label: "ENVIDO", variant: "primary" });
    options.push({ actionType: "real-envido", label: "REAL ENVIDO", variant: "primary" });
    options.push({ actionType: "falta-envido", label: "FALTA ENVIDO", variant: "accent" });
  }

  if (trucoStatus === "available" && envidoStatus !== "pending") {
    options.push({ actionType: "truco", label: "TRUCO", variant: "neutral" });
  }

  if (canGoMazo) {
    options.push({ actionType: "ir-al-mazo", label: "IR AL MAZO", variant: "danger" });
  }

  return options;
}
