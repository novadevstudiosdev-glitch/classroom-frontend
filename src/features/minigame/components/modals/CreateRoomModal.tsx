'use client';
import { useMemo, useState } from 'react';
import { Overlay } from './Overlay';
import type { TableTheme, TrucoConfig, TrucoGameMode } from '../../types/game.types';

/* ── Payload ─────────────────────────────────────────────────────────────── */
export type CreateRoomPayload = {
  roomName:    string;
  maxPlayers:  number;
  password?:   string;
  trucoConfig?: TrucoConfig;
};

interface Props {
  onCreate:       (payload: CreateRoomPayload) => void;
  onClose:        () => void;
  suggestedName?: string;
}

/* ── Shared input style ──────────────────────────────────────────────────── */
const inp: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(15,23,42,0.7)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10, padding: '10px 14px',
  color: '#f1f5f9', fontSize: 14, fontWeight: 500,
  outline: 'none', fontFamily: 'inherit',
  transition: 'border-color .15s',
};

/* ── Toggle chip group ───────────────────────────────────────────────────── */
function ChipGroup<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string; icon?: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            padding: '7px 14px', borderRadius: 9,
            background: active ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
            color: active ? '#fff' : '#64748b',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: active ? '0 4px 14px rgba(79,70,229,0.35)' : 'none',
            transition: 'all .15s',
          }}>
            {o.icon && <span>{o.icon}</span>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Toggle switch ───────────────────────────────────────────────────────── */
function Toggle({ checked, onChange, label, sublabel }: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; sublabel?: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', borderRadius: 10,
      background: checked ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${checked ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)'}`,
      transition: 'all .15s', cursor: 'pointer',
    }} onClick={() => onChange(!checked)}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: checked ? '#a5b4fc' : '#64748b' }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{sublabel}</div>}
      </div>
      <div style={{
        width: 40, height: 22, borderRadius: 99,
        background: checked ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background .2s', flexShrink: 0,
        boxShadow: checked ? '0 2px 8px rgba(79,70,229,0.4)' : 'none',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 20 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left .2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </div>
    </div>
  );
}

/* ── Section label ───────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontSize: 11, fontWeight: 700, color: '#475569',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 6, display: 'block',
    }}>
      {children}
    </label>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN MODAL
══════════════════════════════════════════════════════════════════════════ */
export function CreateRoomModal({ onCreate, onClose, suggestedName }: Props) {
  const placeholder = useMemo(
    () => suggestedName ? `Sala de ${suggestedName}` : 'Mi sala',
    [suggestedName],
  );

  /* ── Shared state ── */
  const [gameMode, setGameMode] = useState<'minigame' | 'truco'>('minigame');
  const [roomName,    setRoomName]    = useState('');
  const [password,    setPassword]    = useState('');
  const [maxPlayers,  setMaxPlayers]  = useState(10);
  const [error,       setError]       = useState<string | null>(null);

  /* ── Truco state ── */
  const [trucoMode,         setTrucoMode]         = useState<TrucoGameMode>('1v1');
  const [trucoMaxPts,       setTrucoMaxPts]        = useState<15 | 30>(30);
  const [florEnabled,       setFlorEnabled]        = useState(true);
  const [contraFlorEnabled, setContraFlorEnabled]  = useState(false);
  const [tableTheme,        setTableTheme]         = useState<TableTheme>('green');

  const isPrivate = password.trim().length > 0;

  /* ── Submit ── */
  const submit = () => {
    const name = roomName.trim() || placeholder;
    if (!name) { setError('Ingresá un nombre.'); return; }

    if (gameMode === 'truco') {
      const mp = trucoMode === '1v1' ? 2 : trucoMode === '2v2' ? 4 : 6;
      onCreate({
        roomName: name,
        maxPlayers: mp,
        password: password.trim() || undefined,
        trucoConfig: {
          mode:               trucoMode,
          maxPoints:          trucoMaxPts,
          florEnabled,
          contraFlorEnabled:  florEnabled ? contraFlorEnabled : false,
          tableTheme,
        },
      });
    } else {
      const mp = Math.max(2, Math.min(50, Math.floor(Number(maxPlayers) || 10)));
      onCreate({ roomName: name, maxPlayers: mp, password: password.trim() || undefined });
    }
    onClose();
  };

  /* ─── Render ─── */
  return (
    <Overlay onClose={onClose} maxWidth={500}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0,
          background: gameMode === 'truco'
            ? 'linear-gradient(135deg,rgba(251,191,36,0.14),rgba(239,68,68,0.14))'
            : 'linear-gradient(135deg,rgba(34,211,238,0.12),rgba(99,102,241,0.12))',
          border: gameMode === 'truco'
            ? '1px solid rgba(251,191,36,0.25)'
            : '1px solid rgba(34,211,238,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, boxShadow: '0 0 20px rgba(0,0,0,0.15)',
          transition: 'all .2s',
        }}>
          {gameMode === 'truco' ? '🃏' : '🚀'}
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            Crear sala
          </h2>
          <p style={{ fontSize: 13, color: '#475569', margin: '2px 0 0', fontWeight: 500 }}>
            Configurá tu sala multijugador
          </p>
        </div>
      </div>

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#fca5a5', borderRadius: 10, padding: '10px 14px',
          fontSize: 13, fontWeight: 600, marginBottom: 16,
        }}>
          <span>⚠</span> {error}
        </div>
      )}

      {/* ── Game type ── */}
      <div style={{ marginBottom: 18 }}>
        <SectionLabel>Tipo de juego</SectionLabel>
        <ChipGroup
          options={[
            { value: 'minigame', label: 'Minijuego', icon: '🎮' },
            { value: 'truco',    label: 'Truco Argentino', icon: '🃏' },
          ]}
          value={gameMode}
          onChange={v => { setGameMode(v); setError(null); }}
        />
      </div>

      {/* ── Room name (always visible) ── */}
      <div style={{ marginBottom: 16 }}>
        <SectionLabel>Nombre de la sala</SectionLabel>
        <input
          autoFocus
          value={roomName}
          onChange={e => { setRoomName(e.target.value); setError(null); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder={placeholder}
          maxLength={48}
          style={inp}
        />
      </div>

      {/* ══ TRUCO CONFIG ══════════════════════════════════════════════════ */}
      {gameMode === 'truco' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>

          {/* Mode */}
          <div>
            <SectionLabel>Modalidad</SectionLabel>
            <ChipGroup
              options={[
                { value: '1v1', label: '1v1 · 2 jugadores' },
                { value: '2v2', label: '2v2 · 4 jugadores' },
                { value: '3v3', label: '3v3 · 6 jugadores' },
              ]}
              value={trucoMode}
              onChange={setTrucoMode}
            />
          </div>

          {/* Max points */}
          <div>
            <SectionLabel>Puntos para ganar</SectionLabel>
            <ChipGroup
              options={[
                { value: '15', label: '15 puntos · Corto' },
                { value: '30', label: '30 puntos · Normal' },
              ]}
              value={String(trucoMaxPts)}
              onChange={v => setTrucoMaxPts(Number(v) as 15 | 30)}
            />
          </div>

          {/* Flor rules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SectionLabel>Reglas opcionales</SectionLabel>
            <Toggle
              checked={florEnabled}
              onChange={setFlorEnabled}
              label="Flor habilitada"
              sublabel="Si los 3 naipes son del mismo palo, se declara flor"
            />
            {florEnabled && (
              <Toggle
                checked={contraFlorEnabled}
                onChange={setContraFlorEnabled}
                label="Con Flor Me Gano"
                sublabel="Permite ganar la mano automáticamente con flor"
              />
            )}
          </div>

          {/* Table theme */}
          <div>
            <SectionLabel>Tapete de la mesa</SectionLabel>
            <ChipGroup
              options={[
                { value: 'green',   label: 'Tapete verde',   icon: '🟢' },
                { value: 'wood',    label: 'Madera',         icon: '🪵' },
                { value: 'plastic', label: 'Plástico azul',  icon: '🔵' },
                { value: 'night',   label: 'Modo noche',     icon: '🌙' },
              ]}
              value={tableTheme}
              onChange={v => setTableTheme(v as TableTheme)}
            />
          </div>

          {/* Players info */}
          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(251,191,36,0.06)',
            border: '1px solid rgba(251,191,36,0.14)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fde68a' }}>
                Sala para {trucoMode === '1v1' ? 2 : trucoMode === '2v2' ? 4 : 6} jugadores
              </div>
              <div style={{ fontSize: 11, color: '#78716c', marginTop: 2 }}>
                Los jugadores se sientan alternando equipos · asientos fijos al unirse
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MINIGAME CONFIG ═══════════════════════════════════════════════ */}
      {gameMode === 'minigame' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <SectionLabel>Máx. jugadores</SectionLabel>
            <input
              value={String(maxPlayers)}
              onChange={e => setMaxPlayers(parseInt(e.target.value || '0', 10))}
              min={2} max={50} type="number"
              style={inp}
            />
          </div>
          <div>
            <SectionLabel>Contraseña</SectionLabel>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Opcional"
              maxLength={32}
              type="password"
              style={inp}
            />
          </div>
        </div>
      )}

      {/* ── Password (for truco rooms) ── */}
      {gameMode === 'truco' && (
        <div style={{ marginBottom: 16 }}>
          <SectionLabel>Contraseña (opcional)</SectionLabel>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Dejar vacío para sala pública"
            maxLength={32}
            type="password"
            style={inp}
          />
        </div>
      )}

      {/* Privacy indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 10, marginBottom: 22,
        background: isPrivate ? 'rgba(139,92,246,0.06)' : 'rgba(34,211,238,0.04)',
        border: `1px solid ${isPrivate ? 'rgba(139,92,246,0.16)' : 'rgba(34,211,238,0.12)'}`,
        transition: 'all .2s',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isPrivate ? 'rgba(139,92,246,0.12)' : 'rgba(34,211,238,0.08)',
          fontSize: 14,
        }}>
          {isPrivate ? '🔒' : '🌐'}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: isPrivate ? '#c4b5fd' : '#67e8f9' }}>
            {isPrivate ? 'Sala privada' : 'Sala pública'}
          </div>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>
            {isPrivate ? 'Solo quienes tengan la contraseña pueden unirse' : 'Visible y accesible para todos'}
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{
          padding: '11px 20px', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.04)', color: '#64748b',
          fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Cancelar
        </button>
        <button onClick={submit} style={{
          flex: 1, padding: '11px 20px', borderRadius: 10,
          background: gameMode === 'truco'
            ? 'linear-gradient(135deg,#b45309,#d97706)'
            : 'linear-gradient(135deg,#4f46e5,#6366f1)',
          border: gameMode === 'truco'
            ? '1px solid rgba(245,158,11,0.4)'
            : '1px solid rgba(99,102,241,0.4)',
          color: '#fff', fontWeight: 700, fontSize: 14,
          cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: gameMode === 'truco'
            ? '0 4px 20px rgba(180,83,9,0.4)'
            : '0 4px 20px rgba(79,70,229,0.35)',
          transition: 'all .2s',
        }}>
          {gameMode === 'truco' ? '🃏 Crear sala de Truco →' : 'Crear sala →'}
        </button>
      </div>
    </Overlay>
  );
}
