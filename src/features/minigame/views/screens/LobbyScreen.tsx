'use client';
import { useState } from 'react';
import { useMinigameStore } from '../../store/minigame.store';
import { PlayerList } from '../../components/PlayerList';
import { ChatPanel } from '../../components/ChatPanel';
import { AIGeneratorModal } from '../../components/modals/AIGeneratorModal';
import type { GameType, TrucoConfig } from '../../types/game.types';

const TYPE_META: Record<GameType, { label: string; icon: string; color: string; bg: string; border: string }> = {
  quiz:        { label: 'Quiz',           icon: '❓', color: '#818cf8', bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.25)' },
  wordsearch:  { label: 'Sopa de letras', icon: '🔤', color: '#38bdf8', bg: 'rgba(14,165,233,0.1)',  border: 'rgba(14,165,233,0.25)' },
  anagram:     { label: 'Anagrama',       icon: '🔀', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  preguntados: { label: 'Preguntados',    icon: '🎡', color: '#c084fc', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.25)' },
  truco:       { label: 'Truco',          icon: '🃏', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
};

const FILTERS = ['all', 'quiz', 'wordsearch', 'anagram', 'preguntados'] as const;

interface Props {
  onPickGame:      (id: string) => void;
  onStartGame:     ()           => void;
  onExitLobby:    ()           => void;
  onKickPlayer:   (a: string)  => void;
  onPromotePlayer: (a: string) => void;
  onSendChat:     (t: string)  => void;
  onDeleteGame:   (id: string) => void;
  onRefreshGames: ()           => void;
}

export function LobbyScreen({
  onPickGame, onStartGame, onExitLobby,
  onKickPlayer, onPromotePlayer,
  onSendChat, onDeleteGame, onRefreshGames,
}: Props) {
  const myAlias        = useMinigameStore((s) => s.myAlias);
  const isHost         = useMinigameStore((s) => s.isHost);
  const roomCode       = useMinigameStore((s) => s.roomCode);
  const roomName       = useMinigameStore((s) => s.roomName);
  const players        = useMinigameStore((s) => s.players);
  const hostAlias      = useMinigameStore((s) => s.hostAlias);
  const availableGames = useMinigameStore((s) => s.availableGames);
  const selectedId     = useMinigameStore((s) => s.selectedInstanceId);
  const selectedTitle  = useMinigameStore((s) => s.selectedGameTitle);
  const currentType    = useMinigameStore((s) => s.currentGameType);
  const filter         = useMinigameStore((s) => s.gameTypeFilter);
  const setFilter      = useMinigameStore((s) => s.setGameTypeFilter);
  const roomChat       = useMinigameStore((s) => s.roomChat);
  const error          = useMinigameStore((s) => s.error);
  const trucoConfig    = useMinigameStore((s) => s.roomTrucoConfig);

  const [showAI, setShowAI] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exitHov, setExitHov] = useState(false);

  // ── Truco room: different logic ──
  const isTrucoRoom  = !!trucoConfig;
  const requiredPlayers = trucoConfig
    ? (trucoConfig.mode === '1v1' ? 2 : trucoConfig.mode === '2v2' ? 4 : 6)
    : 1;
  const canStartTruco = isTrucoRoom && players.length >= 1;

  const filtered     = filter === 'all' ? availableGames : availableGames.filter((g) => g.type === filter);
  const canStart     = isTrucoRoom ? canStartTruco : (!!selectedId && players.length >= 1);
  const selectedMeta = currentType ? TYPE_META[currentType] : null;

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(roomCode); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /**/ }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Topbar: room info only ── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px', height: 48,
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(2,4,9,0.4)', backdropFilter: 'blur(12px)',
      }}>
        <span style={{
          fontSize: 14, fontWeight: 800, color: '#f8fafc',
          letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: 220,
        }}>
          {roomName}
        </span>

        <button
          onClick={copyCode}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 7, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
            color: copied ? '#6ee7b7' : 'rgba(255,255,255,0.3)',
            fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
            letterSpacing: '0.12em', transition: 'all .2s',
          }}
        >
          {roomCode}
          <span style={{ fontFamily: 'inherit', letterSpacing: 0, fontSize: 11 }}>{copied ? '✓' : '⧉'}</span>
        </button>

        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>
          {players.length} jugador{players.length !== 1 ? 'es' : ''}
        </span>

        {/* Ready indicator */}
        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 700,
          color: canStart ? '#6ee7b7' : 'rgba(255,255,255,0.25)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: canStart ? '#10b981' : 'rgba(255,255,255,0.12)',
            boxShadow: canStart ? '0 0 8px rgba(16,185,129,0.7)' : 'none',
            animation: canStart ? 'none' : 'lobbyPulse 1.5s ease-in-out infinite',
          }} />
          {isTrucoRoom
            ? canStart
              ? '¡Listos para el truco!'
              : `${players.length}/${requiredPlayers} jugadores`
            : isHost
              ? (canStart ? 'Listo para iniciar' : 'Seleccioná un juego')
              : 'Esperando al host'
          }
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left: Truco lobby panel OR regular game list ── */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '20px 24px 16px' }}>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
              color: '#fca5a5', borderRadius: 10, padding: '10px 14px',
              fontSize: 13, fontWeight: 600,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          {isTrucoRoom && trucoConfig ? (
            <TrucoLobbyPanel
              config={trucoConfig}
              players={players}
              requiredPlayers={requiredPlayers}
              isHost={isHost}
              canStart={canStartTruco}
            />
          ) : (
            <>
              {/* Selected game banner */}
              {selectedId && selectedMeta && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 14, marginBottom: 20,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.04))',
                  border: '1px solid rgba(99,102,241,0.22)',
                  boxShadow: '0 0 24px rgba(99,102,241,0.07)',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0, fontSize: 20,
                    background: selectedMeta.bg, border: `1px solid ${selectedMeta.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selectedMeta.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#818cf8', marginBottom: 2 }}>
                      Juego seleccionado
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedTitle}
                    </div>
                  </div>
                </div>
              )}

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>Juegos disponibles</h2>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', fontWeight: 700 }}>({availableGames.length})</span>
                </div>
              </div>

              {/* Type filter */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {FILTERS.map((f) => {
                  const meta = f !== 'all' ? TYPE_META[f] : null;
                  const active = filter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: '5px 12px', borderRadius: 99, cursor: 'pointer',
                        background: active ? (meta ? meta.bg : 'rgba(99,102,241,0.12)') : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? (meta ? meta.border : 'rgba(99,102,241,0.3)') : 'rgba(255,255,255,0.07)'}`,
                        color: active ? (meta ? meta.color : '#818cf8') : 'rgba(255,255,255,0.3)',
                        fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                        transition: 'all .15s',
                      }}
                    >
                      {meta ? `${meta.icon} ${meta.label}` : 'Todos'}
                    </button>
                  );
                })}
              </div>

              {/* Game list */}
              {filtered.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 52, gap: 14, textAlign: 'center' }}>
                  <span style={{ fontSize: 36 }}>🎮</span>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                    {isHost ? 'No hay juegos. Generá uno con IA.' : 'Esperando que el host seleccione un juego.'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {filtered.map((g) => {
                    const sel  = selectedId === g.id;
                    const meta = TYPE_META[g.type] ?? TYPE_META.quiz;
                    return (
                      <div
                        key={g.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '11px 14px', borderRadius: 13,
                          background: sel ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${sel ? 'rgba(99,102,241,0.28)' : 'rgba(255,255,255,0.05)'}`,
                          boxShadow: sel ? '0 0 20px rgba(99,102,241,0.07)' : 'none',
                          transition: 'all .15s',
                        }}
                      >
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0, fontSize: 17,
                          background: meta.bg, border: `1px solid ${meta.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {meta.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                            {g.title}
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>
                            {meta.label}{g.questionCount ? ` · ${g.questionCount} preguntas` : ''}
                          </div>
                        </div>
                        {isHost ? (
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button onClick={() => onPickGame(g.id)} style={{
                              padding: '6px 14px', borderRadius: 9, cursor: 'pointer',
                              background: sel ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.1)',
                              border: `1px solid ${sel ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.2)'}`,
                              color: sel ? '#c7d2fe' : '#a5b4fc',
                              fontSize: 12, fontWeight: 700, fontFamily: 'inherit', transition: 'all .15s',
                            }}>
                              {sel ? '✓ Elegido' : 'Elegir'}
                            </button>
                            <button onClick={() => onDeleteGame(g.id)} style={{
                              width: 32, height: 32, borderRadius: 9, cursor: 'pointer',
                              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.14)',
                              color: 'rgba(248,113,113,0.55)', fontSize: 13, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all .15s',
                            }}>✕</button>
                          </div>
                        ) : (
                          sel && <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(129,140,248,0.55)', flexShrink: 0 }}>Seleccionado</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Right: sidebar ── */}
        <div style={{
          width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          borderLeft: '1px solid rgba(255,255,255,0.045)',
          background: 'rgba(0,0,0,0.25)',
        }}>
          {/* Players */}
          <div style={{ flexShrink: 0, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.045)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <SideLabel>Jugadores</SideLabel>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '1px 8px', borderRadius: 99,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)',
              }}>
                {players.length}
              </span>
            </div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              <PlayerList
                players={players}
                hostAlias={hostAlias}
                myAlias={myAlias}
                isHost={isHost}
                onKick={onKickPlayer}
                onPromote={onPromotePlayer}
              />
            </div>
          </div>

          {/* Chat */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '12px 16px 10px', gap: 8, overflow: 'hidden' }}>
            <SideLabel>Chat</SideLabel>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <ChatPanel messages={roomChat} onSend={onSendChat} placeholder="Mensaje..." grow />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom action bar ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(2,4,9,0.6)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Salir — left side */}
        <button
          onClick={onExitLobby}
          onMouseEnter={() => setExitHov(true)}
          onMouseLeave={() => setExitHov(false)}
          style={{
            height: 48, padding: '0 20px', borderRadius: 12, cursor: 'pointer',
            background: exitHov ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${exitHov ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)'}`,
            color: exitHov ? '#f87171' : 'rgba(255,255,255,0.35)',
            fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            transition: 'all .15s', flexShrink: 0,
          }}
        >
          Salir
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Generar con IA — solo para salas de minijuego */}
        {isHost && !isTrucoRoom && (
          <button
            onClick={() => setShowAI(true)}
            style={{
              height: 48, padding: '0 24px', borderRadius: 12, cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.14))',
              border: '1px solid rgba(139,92,246,0.35)',
              color: '#c4b5fd', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 2px 16px rgba(139,92,246,0.15)',
              transition: 'all .15s', flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 16 }}>✨</span>
            Generar con IA
          </button>
        )}

        {/* Iniciar */}
        {isHost && (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            style={{
              height: 48, padding: '0 32px', borderRadius: 12,
              cursor: canStart ? 'pointer' : 'not-allowed',
              background: canStart
                ? isTrucoRoom
                  ? 'linear-gradient(135deg,#b45309,#d97706)'
                  : 'linear-gradient(135deg,#059669,#10b981)'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${canStart ? (isTrucoRoom ? 'rgba(251,191,36,0.5)' : 'rgba(16,185,129,0.5)') : 'rgba(255,255,255,0.07)'}`,
              color: canStart ? '#fff' : 'rgba(255,255,255,0.2)',
              fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: canStart
                ? isTrucoRoom
                  ? '0 4px 24px rgba(180,83,9,0.4)'
                  : '0 4px 24px rgba(16,185,129,0.3)'
                : 'none',
              opacity: canStart ? 1 : 0.5,
              transition: 'all .2s', flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 16 }}>{isTrucoRoom ? '🃏' : '▶'}</span>
            {isTrucoRoom ? '¡A jugar al Truco!' : 'Iniciar partida'}
          </button>
        )}

        {/* Guest message */}
        {!isHost && (
          <div style={{
            height: 48, padding: '0 20px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center',
            fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 600,
          }}>
            {isTrucoRoom
              ? `Esperando jugadores... (${players.length}/${requiredPlayers})`
              : 'Esperando que el host inicie la partida...'}
          </div>
        )}
      </div>

      {showAI && (
        <AIGeneratorModal
          onClose={() => setShowAI(false)}
          onSaved={(id) => { onRefreshGames(); if (id) onPickGame(id); }}
        />
      )}
    </div>
  );
}

function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)' }}>
      {children}
    </div>
  );
}

/* ── Truco Lobby Panel ────────────────────────────────────────────────────── */
const THEME_LABELS: Record<string, string> = {
  green: '🟢 Tapete verde',
  wood: '🪵 Mesa de madera',
  plastic: '🔵 Plástico azul',
  night: '🌙 Modo noche',
};

function TrucoLobbyPanel({ config, players, requiredPlayers, isHost, canStart }: {
  config: TrucoConfig;
  players: { alias: string }[];
  requiredPlayers: number;
  isHost: boolean;
  canStart: boolean;
}) {
  const waiting = requiredPlayers - players.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Hero card */}
      <div style={{
        padding: '28px 32px',
        borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(120,53,15,0.3) 0%, rgba(146,64,14,0.15) 50%, rgba(251,191,36,0.06) 100%)',
        border: '1px solid rgba(251,191,36,0.2)',
        boxShadow: '0 0 40px rgba(251,191,36,0.06)',
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{ fontSize: 56, lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(251,191,36,0.3))' }}>🃏</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fde68a', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Truco Argentino
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            La sala está lista · esperando jugadores para comenzar
          </div>
        </div>
      </div>

      {/* Config summary */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', marginBottom: 12 }}>
          Configuración de la partida
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: '👥', label: 'Modalidad', value: config.mode.toUpperCase() },
            { icon: '🏆', label: 'Puntos para ganar', value: `${config.maxPoints} puntos` },
            { icon: '🌸', label: 'Flor', value: config.florEnabled ? 'Habilitada' : 'Deshabilitada' },
            { icon: '🎨', label: 'Mesa', value: THEME_LABELS[config.tableTheme] ?? config.tableTheme },
          ].map(item => (
            <div key={item.label} style={{
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player slots */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', marginBottom: 12 }}>
          Jugadores ({players.length}/{requiredPlayers})
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(requiredPlayers, 3)}, 1fr)`, gap: 8 }}>
          {Array.from({ length: requiredPlayers }).map((_, i) => {
            const player = players[i];
            const teamLabel = i % 2 === 0 ? 'Equipo A' : 'Equipo B';
            const teamColor = i % 2 === 0 ? '#10b981' : '#ef4444';
            return (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 12,
                background: player ? `rgba(${i % 2 === 0 ? '16,185,129' : '239,68,68'},0.07)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${player ? `rgba(${i % 2 === 0 ? '16,185,129' : '239,68,68'},0.25)` : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', flexDirection: 'column', gap: 4,
                transition: 'all .2s',
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: player ? teamColor : 'rgba(255,255,255,0.2)' }}>
                  {teamLabel}
                </div>
                {player ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {player.alias}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,255,255,0.12)',
                      animation: 'lobbyPulse 1.5s ease-in-out infinite',
                      animationDelay: `${i * 0.3}s`,
                    }} />
                    Esperando...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status message */}
      {!canStart && (
        <div style={{
          padding: '14px 18px', borderRadius: 12,
          background: 'rgba(251,191,36,0.06)',
          border: '1px solid rgba(251,191,36,0.15)',
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 13, color: '#fde68a', fontWeight: 600,
        }}>
          <span style={{ fontSize: 20 }}>⏳</span>
          {isHost
            ? `Faltan ${waiting} jugador${waiting !== 1 ? 'es' : ''} para poder iniciar`
            : `El host iniciará cuando se unan ${waiting} jugador${waiting !== 1 ? 'es' : ''} más`
          }
        </div>
      )}

      {canStart && (
        <div style={{
          padding: '14px 18px', borderRadius: 12,
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.25)',
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 13, color: '#6ee7b7', fontWeight: 600,
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
          {isHost ? '¡Todos listos! Podés iniciar la partida.' : '¡Todos listos! Esperando que el host inicie.'}
        </div>
      )}

      <style>{`@keyframes lobbyPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
