import Link from "next/link";
import Navbar from "@/shared/components/navigation/Navbar";

// Deterministic star field — avoids hydration mismatch with Math.random()
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  size: (((i * 137.508) % 16) / 10 + 0.8).toFixed(1),
  top:  ((i * 97.31)  % 100).toFixed(2),
  left: ((i * 61.803) % 100).toFixed(2),
  opacity: (((i * 43.7) % 5) / 10 + 0.05).toFixed(2),
  dur:   (((i * 29.1) % 26) / 10 + 2.5).toFixed(1),
  delay: (((i * 17.3) % 24) / 10).toFixed(1),
}));

export default function MinigameHomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020409', color: '#f8fafc', overflowX: 'hidden', fontFamily: 'inherit' }}>

      {/* ── Background ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {/* Stars */}
        {STARS.map((s) => (
          <div key={s.id} style={{
            position: 'absolute', borderRadius: '50%', background: '#fff',
            width: s.size + 'px', height: s.size + 'px',
            top: s.top + '%', left: s.left + '%',
            opacity: +s.opacity,
            animation: `homeTwinkle ${s.dur}s ease-in-out infinite ${s.delay}s`,
          }} />
        ))}
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '-15%', left: '-8%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.09) 0%, transparent 65%)', filter: 'blur(2px)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)', width: 1000, height: 350, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />
        {/* Noise vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(2,4,9,0.6) 100%)' }} />
      </div>

      {/* ── Navbar ── */}
      <div style={{ position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2,4,9,0.7)', backdropFilter: 'blur(20px)' }}>
        <Navbar />
      </div>

      {/* ── Main ── */}
      <main style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        padding: '60px 24px 80px',
        gap: 56,
      }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: 640 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 14px', borderRadius: 99, marginBottom: 24,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.18)',
            fontSize: 11, fontWeight: 700, color: '#818cf8',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px rgba(99,102,241,0.8)', display: 'inline-block' }} />
            Multijugador en tiempo real
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 900,
            lineHeight: 0.95, margin: '0 0 20px', letterSpacing: '-0.04em',
          }}>
            <span style={{ color: '#f8fafc' }}>NO</span>
            <span style={{
              background: 'linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>VI</span>
            <br />
            <span style={{ fontSize: '55%', color: 'rgba(255,255,255,0.5)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Juegos
            </span>
          </h1>

          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Competí con tus compañeros, generá quizzes con IA<br />y aprendé sin darte cuenta.
          </p>
        </div>

        {/* Mode cards */}
        <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 720, flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* LOBBY */}
          <Link href="/minigame/lobby" style={{ flex: '1 1 280px', textDecoration: 'none' }}>
            <ModeCard
              icon="🎮"
              title="Lobby"
              subtitle="Salas multijugador en vivo"
              description="Creá o unite a una partida con amigos. Genera quizzes con IA y competí en tiempo real."
              badge="Multijugador"
              accentH={195}
              features={['Quiz', 'Sopa de letras', 'Anagrama', 'Preguntados']}
            />
          </Link>

          {/* SOLO */}
          <Link href="/minigame/lobby" style={{ flex: '1 1 280px', textDecoration: 'none' }}>
            <ModeCard
              icon="⚡"
              title="Modo Solo"
              subtitle="Practicá a tu ritmo"
              description="Sin presión, sin contrincantes. Practicá cuándo y cómo quieras."
              badge="Individual"
              accentH={265}
              features={['Sin límite de tiempo', 'Práctica libre']}
            />
          </Link>
        </div>

        {/* Game types row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '❓', label: 'Quiz',           color: '#818cf8' },
            { icon: '🔤', label: 'Sopa de letras', color: '#38bdf8' },
            { icon: '🔀', label: 'Anagrama',       color: '#fbbf24' },
            { icon: '🎡', label: 'Preguntados',    color: '#c084fc' },
            { icon: '✨', label: 'Generador IA',   color: '#a78bfa' },
          ].map((g) => (
            <div
              key={g.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 14px', borderRadius: 99,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)',
              }}
            >
              <span style={{ fontSize: 15 }}>{g.icon}</span>
              <span>{g.label}</span>
            </div>
          ))}
        </div>

      </main>

      <style>{`
        @keyframes homeTwinkle {
          0%,100% { opacity: .05; }
          50%      { opacity: .5; }
        }
        @keyframes cardGlow {
          0%,100% { opacity: .6; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Mode card ─────────────────────────────────────────────────────────────────

function ModeCard({
  icon, title, subtitle, description, badge, accentH, features,
}: {
  icon: string; title: string; subtitle: string;
  description: string; badge: string; accentH: number; features: string[];
}) {
  return (
    <div style={{
      position: 'relative', height: '100%',
      display: 'flex', flexDirection: 'column', gap: 20,
      padding: '28px 26px 24px', borderRadius: 20, overflow: 'hidden',
      background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.03)',
      transition: 'border-color .25s, box-shadow .25s, transform .2s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = `hsla(${accentH},80%,65%,0.25)`;
      el.style.boxShadow   = `0 0 0 1px hsla(${accentH},80%,65%,0.06), 0 20px 60px rgba(0,0,0,0.4), 0 0 60px hsla(${accentH},80%,50%,0.06)`;
      el.style.transform   = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = 'rgba(255,255,255,0.07)';
      el.style.boxShadow   = '0 0 0 1px rgba(255,255,255,0.03)';
      el.style.transform   = 'translateY(0)';
    }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: `linear-gradient(90deg, transparent, hsla(${accentH},80%,65%,0.4), transparent)`,
      }} />

      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 15, fontSize: 26,
        background: `linear-gradient(135deg, hsla(${accentH},80%,50%,0.12), hsla(${accentH},80%,50%,0.06))`,
        border: `1px solid hsla(${accentH},80%,65%,0.2)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 20px hsla(${accentH},80%,50%,0.08)`,
      }}>
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.025em', marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginBottom: 10 }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', lineHeight: 1.6, fontWeight: 400 }}>
          {description}
        </div>
      </div>

      {/* Feature chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {features.map((f) => (
          <span key={f} style={{
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {f}
          </span>
        ))}
      </div>

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, width: 'fit-content',
        padding: '7px 14px', borderRadius: 10,
        background: `hsla(${accentH},80%,50%,0.1)`,
        border: `1px solid hsla(${accentH},80%,65%,0.2)`,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: `hsl(${accentH},80%,65%)`, boxShadow: `0 0 6px hsl(${accentH},80%,65%)` }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: `hsl(${accentH},80%,70%)`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {badge}
        </span>
      </div>
    </div>
  );
}
