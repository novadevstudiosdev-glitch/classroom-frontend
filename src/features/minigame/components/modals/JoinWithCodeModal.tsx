'use client';
import { useState } from 'react';
import { Overlay } from './Overlay';

interface Props {
  onJoin: (code: string, password?: string) => void;
  onClose: () => void;
  initialCode?: string;
  lockCode?: boolean;
}

export function JoinWithCodeModal({ onJoin, onClose, initialCode = '', lockCode = false }: Props) {
  const [code, setCode] = useState(initialCode);
  const [password, setPassword] = useState('');

  const ready = code.trim().length >= 4;

  const submit = () => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) return;
    onJoin(c, password.trim() || undefined);
    onClose();
  };

  return (
    <Overlay onClose={onClose} maxWidth={400}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.12) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, boxShadow: '0 0 20px rgba(99,102,241,0.1)',
        }}>🔑</div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            Unirse con código
          </h2>
          <p style={{ fontSize: 13, color: '#475569', margin: '2px 0 0', fontWeight: 500 }}>
            Ingresá el código de la sala
          </p>
        </div>
      </div>

      {/* Code display */}
      <div style={{
        background: 'rgba(99,102,241,0.05)',
        border: `1.5px solid ${ready ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 14, padding: '20px 24px', marginBottom: 14,
        textAlign: 'center', transition: 'border-color .2s, box-shadow .2s',
        boxShadow: ready ? '0 0 24px rgba(99,102,241,0.1)' : 'none',
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: '#334155',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
        }}>
          Código de sala
        </div>
        <input
          autoFocus
          value={code}
          onChange={(e) => !lockCode && setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="——————"
          maxLength={10}
          disabled={lockCode}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            textAlign: 'center', letterSpacing: '0.3em',
            fontSize: 32, fontWeight: 900,
            color: ready ? '#a5b4fc' : '#1e293b',
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            textTransform: 'uppercase', width: '100%',
            boxSizing: 'border-box',
            opacity: lockCode ? 0.7 : 1,
            cursor: lockCode ? 'default' : 'text',
          }}
        />
      </div>

      <div style={{ position: 'relative', marginBottom: 20 }}>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Contraseña — dejá vacío si no tiene"
          maxLength={32}
          type="password"
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'rgba(15,23,42,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '10px 14px',
            color: '#f1f5f9', fontSize: 14, fontWeight: 500,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onClose}
          style={{
            padding: '11px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)', color: '#64748b',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={submit}
          disabled={!ready}
          style={{
            flex: 1, padding: '11px 20px', borderRadius: 10,
            background: ready
              ? 'linear-gradient(135deg, #4f46e5, #6366f1)'
              : 'rgba(255,255,255,0.04)',
            border: `1px solid ${ready ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: ready ? '#fff' : '#334155',
            fontWeight: 700, fontSize: 14,
            cursor: ready ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            boxShadow: ready ? '0 4px 20px rgba(79,70,229,0.3)' : 'none',
            transition: 'all .2s',
          }}
        >
          Unirse →
        </button>
      </div>
    </Overlay>
  );
}
