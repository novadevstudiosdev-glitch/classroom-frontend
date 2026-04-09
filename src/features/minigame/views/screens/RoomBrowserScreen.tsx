'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMinigameStore } from '../../store/minigame.store';
import { ChatPanel } from '../../components/ChatPanel';
import { CreateRoomModal, type CreateRoomPayload } from '../../components/modals/CreateRoomModal';
import { JoinWithCodeModal } from '../../components/modals/JoinWithCodeModal';
import type { RoomInfo, TrucoConfig } from '../../types/game.types';

interface Props {
  onCreateRoom: (payload: CreateRoomPayload) => void;
  onJoinRoom: (code: string, password?: string) => void;
  onSendLobbyChat: (text: string) => void;
  onRefresh: () => void;
}

export function RoomBrowserScreen({ onCreateRoom, onJoinRoom, onSendLobbyChat, onRefresh }: Props) {
  const router = useRouter();
  const rooms       = useMinigameStore((s) => s.rooms);
  const onlineUsers = useMinigameStore((s) => s.onlineUsers);
  const lobbyChat   = useMinigameStore((s) => s.lobbyChat);
  const error       = useMinigameStore((s) => s.error);
  const myAlias     = useMinigameStore((s) => s.myAlias);

  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [joinModal, setJoinModal] = useState<{ open: boolean; code: string; lock: boolean }>({ open: false, code: '', lock: false });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rooms.filter((r) => r.roomName.toLowerCase().includes(q)) : rooms;
  }, [rooms, search]);

  const handleJoin = (room: RoomInfo) => {
    if (room.locked) { setJoinModal({ open: true, code: room.roomCode, lock: true }); return; }
    onJoinRoom(room.roomCode);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Topbar ── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12,
        padding: '0 20px', height: 52,
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        background: 'rgba(2,4,9,0.4)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.7)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.01em' }}>
              Sala de juegos
            </span>
          </div>
          {myAlias && (
            <span style={{
              fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.2)',
              padding: '2px 10px', borderRadius: 99,
              border: '1px solid rgba(255,255,255,0.07)',
              display: 'none',
            }}>
              {myAlias}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TopBtn onClick={() => setJoinModal({ open: true, code: '', lock: false })}>
            🔑 Código
          </TopBtn>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(99,102,241,0.15))',
              border: '1px solid rgba(34,211,238,0.3)',
              color: '#67e8f9', fontSize: 12, fontWeight: 800,
              fontFamily: 'inherit', letterSpacing: '-0.01em',
              boxShadow: '0 0 16px rgba(34,211,238,0.08)',
              transition: 'opacity .15s',
            }}
          >
            + Crear sala
          </button>
          <TopBtn onClick={onRefresh}>↻</TopBtn>
          <TopBtn onClick={() => router.push('/minigame/home')} danger>Salir</TopBtn>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {/* Left: rooms */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '24px 24px 32px' }}>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
              color: '#fca5a5', borderRadius: 10, padding: '10px 14px',
              fontSize: 13, fontWeight: 600,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.03em' }}>
                Salas
              </h2>
              <span style={{
                fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.25)',
                padding: '1px 8px', borderRadius: 99,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                {rooms.length}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.22)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              {onlineUsers.length} en línea
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <span style={{
              position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.18)', fontSize: 14, pointerEvents: 'none',
            }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar sala..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '9px 14px 9px 38px',
                color: '#f1f5f9', fontSize: 14, fontWeight: 500,
                outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Rooms */}
          {filtered.length === 0 ? (
            <EmptyRooms searching={!!search} onCreate={() => setShowCreate(true)} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((r) => <RoomCard key={r.roomCode} room={r} onJoin={() => handleJoin(r)} />)}
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <div style={{
          width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          borderLeft: '1px solid rgba(255,255,255,0.045)',
          background: 'rgba(0,0,0,0.25)',
        }}>
          {/* Online users */}
          <div style={{ flexShrink: 0, padding: '16px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.045)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <SideLabel>En línea</SideLabel>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99,
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)',
                color: '#6ee7b7',
              }}>
                {onlineUsers.length}
              </span>
            </div>
            <div style={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {onlineUsers.length === 0 ? (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', fontStyle: 'italic' }}>Nadie conectado.</p>
              ) : onlineUsers.map((u, i) => (
                <div key={u.socketId ?? `${u.alias}-${i}`} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 8px', borderRadius: 8,
                  background: u.alias === myAlias ? 'rgba(34,211,238,0.06)' : 'transparent',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: u.alias === myAlias ? '#22d3ee' : 'rgba(16,185,129,0.5)',
                  }} />
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: u.alias === myAlias ? '#67e8f9' : 'rgba(255,255,255,0.45)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {u.alias}{u.alias === myAlias ? ' · vos' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '14px 16px 16px', gap: 10, overflow: 'hidden' }}>
            <SideLabel>Chat del lobby</SideLabel>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <ChatPanel messages={lobbyChat} onSend={onSendLobbyChat} grow />
            </div>
          </div>
        </div>
      </div>

      {showCreate && <CreateRoomModal onCreate={onCreateRoom} onClose={() => setShowCreate(false)} suggestedName={myAlias} />}
      {joinModal.open && (
        <JoinWithCodeModal
          onJoin={onJoinRoom}
          onClose={() => setJoinModal({ open: false, code: '', lock: false })}
          initialCode={joinModal.code}
          lockCode={joinModal.lock}
        />
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function TopBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
        background: hov && danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hov && danger ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`,
        color: hov && danger ? '#f87171' : hov ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.32)',
        fontSize: 12, fontWeight: 600, fontFamily: 'inherit', transition: 'all .15s',
      }}
    >
      {children}
    </button>
  );
}

function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)' }}>
      {children}
    </div>
  );
}

function EmptyRooms({ searching, onCreate }: { searching: boolean; onCreate: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16, textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: 22, fontSize: 34,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {searching ? '🔍' : '🏠'}
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.45)', margin: '0 0 6px' }}>
          {searching ? 'Sin resultados' : 'No hay salas abiertas'}
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: 0, fontWeight: 500 }}>
          {searching ? 'Probá con otro nombre.' : '¡Creá la primera sala y empezá a jugar!'}
        </p>
      </div>
      {!searching && (
        <button
          onClick={onCreate}
          style={{
            marginTop: 4, padding: '9px 24px', borderRadius: 10, cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(99,102,241,0.14))',
            border: '1px solid rgba(34,211,238,0.25)',
            color: '#67e8f9', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
          }}
        >
          + Crear sala
        </button>
      )}
    </div>
  );
}

function TrucoBadge({ config }: { config: TrucoConfig }) {
  const THEME_ICONS: Record<string, string> = { green: '🟢', wood: '🪵', plastic: '🔵', night: '🌙' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      {/* Game type badge */}
      <span style={{
        padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800,
        background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)',
        color: '#fbbf24', letterSpacing: '0.05em',
      }}>🃏 TRUCO</span>

      {/* Mode */}
      <span style={{
        padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700,
        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
        color: '#a5b4fc',
      }}>{config.mode.toUpperCase()}</span>

      {/* Points */}
      <span style={{
        padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700,
        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
        color: '#6ee7b7',
      }}>{config.maxPoints} pts</span>

      {/* Flor */}
      {config.florEnabled && (
        <span style={{
          padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700,
          background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
          color: '#c084fc',
        }}>Flor</span>
      )}

      {/* Theme */}
      <span style={{ fontSize: 12 }}>{THEME_ICONS[config.tableTheme] ?? '🟢'}</span>
    </div>
  );
}

function RoomCard({ room, onJoin }: { room: RoomInfo; onJoin: () => void }) {
  const [hov, setHov] = useState(false);
  const isFull = room.playerCount >= room.maxPlayers;
  const pct = Math.round((room.playerCount / room.maxPlayers) * 100);
  const initial = room.roomName.charAt(0).toUpperCase();
  const isTruco = room.gameType === 'truco' && room.trucoConfig;

  // Pick a stable hue from the room name
  const hue = isTruco
    ? 35  // warm amber for truco rooms
    : room.roomName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', borderRadius: 14,
        background: hov
          ? isTruco ? 'rgba(251,191,36,0.05)' : 'rgba(255,255,255,0.04)'
          : isTruco ? 'rgba(251,191,36,0.02)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hov
          ? isTruco ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.1)'
          : isTruco ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all .15s', cursor: 'default',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: isTruco
          ? 'linear-gradient(135deg, #78350f, #92400e)'
          : `linear-gradient(135deg, hsl(${hue},60%,30%), hsl(${(hue+40)%360},50%,20%))`,
        border: isTruco
          ? '1px solid rgba(251,191,36,0.3)'
          : `1px solid hsl(${hue},50%,40%)25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isTruco ? 20 : 17, fontWeight: 900,
        color: isTruco ? '#fbbf24' : `hsl(${hue},80%,80%)`,
      }}>
        {isTruco ? '🃏' : initial}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {room.roomName}
          </span>
          {room.locked && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>🔒</span>}
        </div>

        {/* Truco badges or regular info */}
        {isTruco && room.trucoConfig ? (
          <div style={{ marginBottom: 6 }}>
            <TrucoBadge config={room.trucoConfig} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500, marginBottom: 6 }}>
            <span>{room.hostAlias}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>
          <span>{room.hostAlias}</span>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
          <span style={{ color: isFull ? '#f87171' : 'rgba(255,255,255,0.25)' }}>
            {room.playerCount}/{room.maxPlayers} jugadores
          </span>
        </div>

        {/* Fill bar */}
        <div style={{ height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99, width: pct + '%',
            background: isFull
              ? 'rgba(239,68,68,0.5)'
              : isTruco
              ? 'linear-gradient(90deg,#b45309,#d97706)'
              : `linear-gradient(90deg, hsl(${hue},70%,55%), hsl(${(hue+40)%360},70%,65%))`,
            transition: 'width .4s ease',
          }} />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onJoin}
        disabled={isFull}
        style={{
          flexShrink: 0, padding: '8px 18px', borderRadius: 10, cursor: isFull ? 'not-allowed' : 'pointer',
          background: isFull
            ? 'rgba(255,255,255,0.03)'
            : isTruco
            ? 'linear-gradient(135deg,rgba(251,191,36,0.2),rgba(217,119,6,0.15))'
            : 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(99,102,241,0.15))',
          border: `1px solid ${isFull ? 'rgba(255,255,255,0.07)' : isTruco ? 'rgba(251,191,36,0.35)' : 'rgba(34,211,238,0.3)'}`,
          color: isFull ? 'rgba(255,255,255,0.2)' : isTruco ? '#fde68a' : '#67e8f9',
          fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
          opacity: isFull ? 0.5 : 1,
          transition: 'all .15s',
        }}
      >
        {isFull ? 'Llena' : 'Unirse →'}
      </button>
    </div>
  );
}
