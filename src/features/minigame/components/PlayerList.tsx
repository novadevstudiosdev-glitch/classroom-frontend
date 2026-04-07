'use client';
import type { PlayerInfo } from '../types/game.types';

interface Props {
  players: PlayerInfo[];
  hostAlias: string;
  myAlias: string;
  isHost: boolean;
  onKick?: (alias: string) => void;
  onPromote?: (alias: string) => void;
  showScore?: boolean;
}

const AVATAR_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export function PlayerList({ players, hostAlias, myAlias, isHost, onKick, onPromote, showScore = false }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {players.map((p, i) => {
        const isMe = p.alias === myAlias;
        const isPlayerHost = p.alias === hostAlias;
        const color = AVATAR_COLORS[i % AVATAR_COLORS.length];

        return (
          <div
            key={`${p.alias}-${i}`}
            className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
              isMe
                ? 'bg-indigo-500/10 border-indigo-400/30'
                : 'bg-white/[0.03] border-white/10'
            }`}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
              style={{ background: color }}
              aria-hidden="true"
            >
              {p.alias[0]?.toUpperCase()}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <div
                title={p.alias}
                className="text-sm font-semibold text-white/85 leading-snug break-words whitespace-normal"
              >
                {p.alias}
                {isPlayerHost && <span className="ml-2 text-[11px] text-amber-300 font-extrabold">👑</span>}
                {isMe && <span className="ml-2 text-[11px] text-white/40 font-semibold">(vos)</span>}
              </div>
              {showScore && <div className="text-xs text-white/40 mt-0.5">{p.score ?? 0} pts</div>}
            </div>

            {/* Answered indicator */}
            {p.answered && (
              <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-2" aria-label="Respondió" />
            )}

            {/* Host actions */}
            {isHost && !isMe && (
              <div className="flex gap-1.5 flex-shrink-0">
                {onPromote && !isPlayerHost && (
                  <button
                    onClick={() => onPromote(p.alias)}
                    title="Promover a host"
                    className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 hover:bg-amber-500/15 transition-colors text-xs font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/30"
                  >
                    👑
                  </button>
                )}
                {onKick && (
                  <button
                    onClick={() => onKick(p.alias)}
                    title="Expulsar"
                    className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-red-300 hover:bg-red-500/15 transition-colors text-xs font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/30"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
