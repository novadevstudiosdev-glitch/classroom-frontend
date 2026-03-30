"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { CSSProperties } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  da: number;
  speed: number;
  color: string;
};

export default function HomeView() {
  useEffect(() => {
    const canvas = document.getElementById("starfield") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;

    const stars: Star[] = Array.from({ length: 260 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: Math.random() * 1.8 + 0.2,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.007,
      speed: Math.random() * 0.12 + 0.015,
      color: Math.random() > 0.7 ? "#b8b0ff" : "#ffffff",
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        s.a += s.da;
        if (s.a <= 0 || s.a >= 1) s.da *= -1;
        s.y += s.speed;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
        ctx.save();
        ctx.globalAlpha = s.a * 0.9;
        ctx.fillStyle = s.color;
        if (s.r > 1.4) {
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 6;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".rv").forEach((node) => revealObserver.observe(node));

    const barsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.style.animationPlayState = "running";
          barsObserver.unobserve(target);
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".metric-fill").forEach((node) => {
      const target = node as HTMLElement;
      target.style.animationPlayState = "paused";
      barsObserver.observe(target);
    });

    return () => {
      revealObserver.disconnect();
      barsObserver.disconnect();
    };
  }, []);

  return (
    <div className="landing-root">
      <canvas id="starfield" />

      <nav>
        <Link href="/" className="logo" aria-label="Novi">Novi</Link>
        <Link href="/login" className="btn-nav">Empezar gratis</Link>
      </nav>

      <section id="hero">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="hero-planet" />
        <div className="hero-planet-ring" />

        <span className="flt" style={{ left: "52%", top: "22%", fontSize: "30px", "--d": "4s", "--dl": "0s" } as CSSProperties}>*</span>
        <span className="flt" style={{ left: "44%", top: "72%", fontSize: "22px", "--d": "5s", "--dl": "1s" } as CSSProperties}>+</span>
        <span className="flt" style={{ left: "66%", top: "45%", fontSize: "18px", "--d": "6s", "--dl": ".5s" } as CSSProperties}>x</span>
        <span className="flt" style={{ left: "34%", top: "18%", fontSize: "14px", "--d": "3.5s", "--dl": "2s" } as CSSProperties}>.</span>

        <div className="hero-headline">
          <div className="overline">Aprende jugando</div>
          <h1>
            <span className="h1-line1">Subí</span>
            <span className="h1-line2" data-text="de nivel">de nivel</span>
            <span className="h1-line3">aprendiendo.</span>
          </h1>
          <div className="hero-sub-wrap">
            <p className="hero-desc">Misiones, recompensas y aventuras espaciales para chicos de 6 a 12 años. Aprendé matemática, lengua y ciencias sin aburrirte.</p>
            <div className="hero-actions">
              <Link href="/login" className="btn-main">Empezar aventura <span className="arr">GO</span></Link>
              <a href="#como" className="btn-ghost">¿Cómo funciona? →</a>
            </div>
          </div>
          <div className="trust-strip">
            <span className="trust-item">100% gratis para alumnos</span>
            <span className="trust-dot" />
            <span className="trust-item">6 - 12 años</span>
            <span className="trust-dot" />
            <span className="trust-item">50.000 estudiantes</span>
          </div>
        </div>

      </section>

      <section id="roles">
        <div className="roles-blob rb1" /><div className="roles-blob rb2" />
        <div className="roles-eyebrow rv">¿Quién sos?</div>
        <h2 className="roles-title rv">Novi es para <span>todos</span></h2>

        <div className="role-row rv">
          <div className="role-visual"><div className="role-glow-circle role-alumno" style={{ "--rf": "5s" } as CSSProperties}><div className="role-emoji-wrap"><img src="/astronautaNiño.png" alt="Astronauta niño" className="role-emoji-img" /></div><span className="orbit-chip" style={{ top: "-10px", right: "-30px", "--oc": "5s", "--od": "0s" } as CSSProperties}>Misiones</span><span className="orbit-chip" style={{ bottom: "10px", left: "-40px", "--oc": "6s", "--od": ".8s" } as CSSProperties}>Logros</span><span className="orbit-chip" style={{ bottom: "-14px", right: "0px", "--oc": "4.5s", "--od": "1.5s" } as CSSProperties}>XP</span></div></div>
          <div className="role-text"><div className="role-num">01</div><span className="role-tag alumno-tag">Para estudiantes</span><h3 className="role-h">Soy alumno</h3><p className="role-desc">Completá misiones, ganás XP y desbloqueás logros mientras aprendés jugando. El universo del conocimiento te espera.</p><Link href="/login" className="role-btn rb-alumno">Empezar aventura <span>→</span></Link></div>
        </div>
        <div className="role-divider" />

        <div className="role-row reverse rv">
          <div className="role-visual"><div className="role-glow-circle role-docente" style={{ "--rf": "6s" } as CSSProperties}><div className="role-emoji-wrap role-emoji-wrap-docente"><img src="/maestra.png" alt="Maestra" className="role-emoji-img role-emoji-img-docente" /></div><span className="orbit-chip" style={{ top: "-8px", left: "-20px", "--oc": "5.5s", "--od": ".4s" } as CSSProperties}>Reportes</span><span className="orbit-chip" style={{ bottom: "0", right: "-30px", "--oc": "4s", "--od": "1.2s" } as CSSProperties}>Alumnos</span></div></div>
          <div className="role-text"><div className="role-num">02</div><span className="role-tag docente-tag">Para docentes</span><h3 className="role-h">Soy docente</h3><p className="role-desc">Creá clases, asigná misiones y seguí el progreso de cada alumno con reportes detallados en tiempo real.</p><Link href="/login" className="role-btn rb-docente">Crear mi clase <span>→</span></Link></div>
        </div>
      </section>
      <section id="como">
        <div className="como-bg" />
        <h2 className="como-title rv">¿Cómo <em>funciona</em>?</h2>
        <div className="timeline">
          <div className="tl-item rv"><div className="tl-side"><div className="tl-n">Paso 01</div><div className="tl-title">Explorás</div><div className="tl-desc">Elegís una materia y empezás una aventura espacial llena de mundos por descubrir.</div></div><div className="tl-dot">01</div><div className="tl-side" /></div>
          <div className="tl-item reverse rv rv1"><div className="tl-side" /><div className="tl-dot">02</div><div className="tl-side"><div className="tl-n">Paso 02</div><div className="tl-title">Jugás</div><div className="tl-desc">Aprendés con minijuegos, quizzes y misiones que te enganchan de verdad.</div></div></div>
          <div className="tl-item rv rv2"><div className="tl-side"><div className="tl-n">Paso 03</div><div className="tl-title">Ganás XP</div><div className="tl-desc">Cada respuesta correcta te da puntos y desbloquea recompensas especiales.</div></div><div className="tl-dot">03</div><div className="tl-side" /></div>
          <div className="tl-item reverse rv rv3"><div className="tl-side" /><div className="tl-dot">04</div><div className="tl-side"><div className="tl-n">Paso 04</div><div className="tl-title">Subís nivel</div><div className="tl-desc">Nuevos mundos, personajes y logros especiales te esperan en cada nivel alcanzado.</div></div></div>
        </div>
      </section>

      <section id="preview">
        <div className="prev-blob pb1" /><div className="prev-blob pb2" />
        <div className="preview-layout">
          <div className="prev-left rv">
            <div className="prev-eyebrow">Vista real</div>
            <h2 className="prev-title">Así se ve una<br />aventura <em>en Novi</em></h2>
            <p className="prev-desc">Tu progreso, tus logros, todo visible en tiempo real.</p>
            <div className="prev-metrics">
              <div className="metric-row"><span className="metric-icon">L</span><div className="metric-info"><div className="metric-label">Lecciones completadas</div><div className="metric-bar"><div className="metric-fill" style={{ background: "linear-gradient(90deg,#6C63FF,#b8b0ff)", "--w": "72%" } as CSSProperties} /></div></div><span className="metric-val">24</span></div>
              <div className="metric-row"><span className="metric-icon">D</span><div className="metric-info"><div className="metric-label">Días seguidos</div><div className="metric-bar"><div className="metric-fill" style={{ background: "linear-gradient(90deg,#FFD700,#FF9500)", "--w": "58%" } as CSSProperties} /></div></div><span className="metric-val">7</span></div>
              <div className="metric-row"><span className="metric-icon">G</span><div className="metric-info"><div className="metric-label">Logros desbloqueados</div><div className="metric-bar"><div className="metric-fill" style={{ background: "linear-gradient(90deg,#FF6B9D,#e11d48)", "--w": "48%" } as CSSProperties} /></div></div><span className="metric-val">12</span></div>
            </div>
          </div>
          <div className="prev-right rv rv2">
            <div className="game-panel">
              <div className="gp-header"><div className="gp-dots"><div className="gp-dot" style={{ background: "#FF6B9D" }} /><div className="gp-dot" style={{ background: "#FFD700" }} /><div className="gp-dot" style={{ background: "#4ADE80" }} /></div><span className="gp-title">novi.app — Panel de aventura</span></div>
              <div className="player-row"><div className="p-avatar">N</div><div><div className="p-name">Jugador aventurero</div><div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}><span className="p-lvl">Nivel 5</span></div></div><span className="p-xp">2.450 XP</span></div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,.35)", fontWeight: 700, marginBottom: "8px", display: "flex", justifyContent: "space-between" }}><span>Progreso al nivel 6</span><span style={{ color: "#6C63FF" }}>450 / 1000 XP</span></div>
              <div className="xp-track" style={{ marginBottom: "1.5rem" }}><div className="xp-fill" /></div>
              <div className="numbers-row">
                <div className="num-cell"><div className="num-big">24</div><div className="num-lbl">Lecciones</div></div>
                <div className="num-cell"><div className="num-big">7</div><div className="num-lbl">Días</div></div>
                <div className="num-cell"><div className="num-big">12</div><div className="num-lbl">Logros</div></div>
              </div>
            </div>
            <div className="game-panel-fade" />
          </div>
        </div>
      </section>

      <section id="testi">
        <h2 className="testi-title rv">Familias que ya <em>vuelan</em></h2>
        <div className="testi-scatter rv">
          <div className="testi"><div className="testi-stars">★★★★★</div><p className="testi-q">&quot;Mi hijo pide hacer tarea por primera vez en su vida. Novi lo enganchó completamente con las misiones espaciales.&quot;</p><div className="testi-who"><div className="testi-av">M</div><div><div className="testi-nm">María González</div><div className="testi-rl">Mamá de Mateo, 8 años</div></div></div></div>
          <div className="testi"><div className="testi-stars">★★★★★</div><p className="testi-q">&quot;Como docente, ver el progreso en tiempo real cambió mis clases por completo. Mis alumnos están más motivados que nunca.&quot;</p><div className="testi-who"><div className="testi-av">L</div><div><div className="testi-nm">Laura Pérez</div><div className="testi-rl">Maestra de 3° grado</div></div></div></div>
          <div className="testi"><div className="testi-stars">★★★★★</div><p className="testi-q">&quot;Subí 3 niveles en una semana. Las misiones son buenísimas y quiero desbloquear todos los astronautas.&quot;</p><div className="testi-who"><div className="testi-av">S</div><div><div className="testi-nm">Sofía Ramírez</div><div className="testi-rl">Alumna, 10 años</div></div></div></div>
        </div>
      </section>

      <section id="cta">
        <div className="cta-blob1" /><div className="cta-blob2" />
        <div className="cta-inner rv">
          <div className="cta-pre">¿Listo para despegar?</div>
          <h2 className="cta-h">Tu aventura<span>empieza hoy.</span></h2>
          <p className="cta-sub">Completamente gratis para estudiantes. Más de 50.000 chicos ya aprendiendo jugando cada día.</p>
          <div className="cta-row">
            <Link href="/login" className="btn-main" style={{ borderRadius: "16px" }}>Empezar gratis <span className="arr">GO</span></Link>
            <Link href="/login" className="btn-ghost" style={{ borderRadius: "16px" }}>Soy docente →</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="fl">Novi</div>
        <ul className="fl-links"><li><a href="#">Privacidad</a></li><li><a href="#">Términos</a></li><li><a href="#">Contacto</a></li></ul>
        <span className="fl-copy">© 2026 Novi</span>
      </footer>

      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Nunito',sans-serif;background:#07061a;color:#fff;overflow-x:hidden}
        #starfield{position:fixed;inset:0;z-index:0;pointer-events:none}
        nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:.9rem 5%;background:rgba(7,6,26,.5);backdrop-filter:blur(24px)}
        .logo{font-size:28px;font-weight:900;letter-spacing:-.5px;color:#fff;text-decoration:none}
        .btn-nav{background:linear-gradient(135deg,#6C63FF,#9B5DE5);color:#fff;border:none;border-radius:50px;padding:10px 26px;font-size:14px;font-weight:800;text-decoration:none;box-shadow:0 4px 20px rgba(108,99,255,.5);transition:transform .15s,box-shadow .15s}
        .btn-nav:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(108,99,255,.65)}

        #hero{min-height:100vh;position:relative;overflow:hidden;display:flex;align-items:center;padding:8rem 5% 4rem;z-index:10}
        .blob{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
        .b1{width:700px;height:700px;background:radial-gradient(circle,rgba(108,99,255,.22),transparent 70%);top:-10%;left:-5%}
        .b2{width:500px;height:500px;background:radial-gradient(circle,rgba(255,107,157,.14),transparent 70%);bottom:0;right:-10%}
        .b3{width:350px;height:350px;background:radial-gradient(circle,rgba(45,212,191,.1),transparent 70%);top:40%;right:30%}
        .hero-headline{position:relative;z-index:2;max-width:900px}
        .overline{font-size:12px;font-weight:900;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:1.5rem;display:flex;align-items:center;gap:10px}
        .overline::before{content:'';width:30px;height:1px;background:rgba(255,255,255,.25)}
        h1{font-size:clamp(54px,9vw,120px);font-weight:900;line-height:.95;letter-spacing:-3px;margin-bottom:2rem}
        .h1-line1{display:block;color:#fff}.h1-line2{display:block;-webkit-text-stroke:2px rgba(108,99,255,.8);color:transparent;position:relative}.h1-line3{display:block;color:#FFD700}
        .h1-line2::after{content:attr(data-text);position:absolute;left:0;top:0;background:linear-gradient(90deg,transparent 0%,rgba(108,99,255,.6) 40%,rgba(255,107,157,.6) 60%,transparent 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        @keyframes shimmer{0%{background-position:200%}100%{background-position:-200%}}
        .hero-sub-wrap{display:flex;align-items:flex-start;gap:3rem;flex-wrap:wrap}
        .hero-desc{font-size:18px;color:rgba(255,255,255,.6);line-height:1.75;max-width:380px}
        .hero-actions{display:flex;flex-direction:column;gap:14px;min-width:220px}
        .btn-main{background:linear-gradient(135deg,#FFD700,#FF9500);color:#1a0f00;border:none;border-radius:16px;padding:18px 36px;font-size:17px;font-weight:900;text-decoration:none;box-shadow:0 10px 40px rgba(255,215,0,.35);transition:transform .15s,box-shadow .15s;text-align:left;display:inline-flex;align-items:center;justify-content:space-between;gap:12px}
        .btn-main:hover{transform:translateY(-3px);box-shadow:0 18px 50px rgba(255,215,0,.5)}
        .btn-main .arr{width:36px;height:36px;border-radius:10px;background:rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);border-radius:16px;padding:16px 28px;font-size:15px;font-weight:800;text-decoration:none;transition:all .2s;text-align:left;display:inline-flex}
        .btn-ghost:hover{border-color:rgba(255,255,255,.4);color:#fff;background:rgba(255,255,255,.04)}
        .hero-planet{position:absolute;right:18%;top:8%;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#3a2f8a,#1a1060 55%,#07061a);box-shadow:inset -20px -14px 40px rgba(0,0,0,.5),0 0 60px rgba(108,99,255,.2);animation:planetSpin 30s linear infinite;z-index:2}
        @keyframes planetSpin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        .hero-planet-ring{position:absolute;right:calc(18% - 36px);top:calc(8% + 70px);width:252px;height:60px;border-radius:50%;border:10px solid rgba(108,99,255,.2);transform:rotateX(70deg);z-index:2}
        .flt{position:absolute;z-index:3;animation:flt var(--d,5s) ease-in-out infinite var(--dl,0s)}
        @keyframes flt{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-20px) rotate(15deg)}}
        .trust-strip{display:flex;gap:2rem;align-items:center;margin-top:3rem;flex-wrap:wrap}
        .trust-item{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:800;color:rgba(255,255,255,.5)}
        .trust-dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.2)}

        #roles{position:relative;z-index:10;padding:4rem 5% 8rem;overflow:hidden}
        .roles-blob{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}.rb1{width:500px;height:500px;background:rgba(108,99,255,.1);left:-10%;top:0}.rb2{width:400px;height:400px;background:rgba(45,212,191,.08);right:-5%;bottom:0}
        .roles-eyebrow{text-align:center;font-size:12px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:1rem}
        .roles-title{text-align:center;font-size:clamp(36px,5vw,64px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;margin-bottom:6rem}.roles-title span{color:#6C63FF}
        .role-row{display:flex;align-items:center;gap:4rem;margin-bottom:7rem;position:relative}.role-row.reverse{flex-direction:row-reverse}
        .role-visual{flex-shrink:0;width:340px;position:relative;display:flex;align-items:center;justify-content:center}
        .role-glow-circle{width:260px;height:260px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:110px;position:relative;animation:roleFloat var(--rf,5s) ease-in-out infinite}
        .role-emoji{line-height:1}
        .role-emoji-wrap{width:210px;height:210px;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;z-index:2;background:radial-gradient(circle at 45% 35%,rgba(255,255,255,.12),rgba(255,255,255,.02) 58%,transparent 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
        .role-emoji-img{width:185px;height:185px;display:block;object-fit:contain;position:relative;z-index:2;transform:translateY(6px) scale(1.04);filter:drop-shadow(0 14px 24px rgba(8,12,55,.45))}
        .role-emoji-wrap-docente{width:210px;height:210px;overflow:hidden;background:radial-gradient(circle at 45% 35%,rgba(45,212,191,.14),rgba(45,212,191,.04) 58%,transparent 100%);box-shadow:inset 0 0 0 1px rgba(45,212,191,.22)}
        .role-emoji-img-docente{width:100%;height:100%;object-fit:cover;object-position:center 58%;transform:scale(1.14);filter:drop-shadow(0 16px 26px rgba(0,56,56,.45))}
        @keyframes roleFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-18px) scale(1.04)}}
        .role-glow-circle::before{content:'';position:absolute;inset:-30px;border-radius:50%;background:var(--gc);filter:blur(50px);z-index:-1;opacity:.6;animation:glowPulse 3s ease-in-out infinite}
        @keyframes glowPulse{0%,100%{opacity:.4;transform:scale(.9)}50%{opacity:.8;transform:scale(1.1)}}
        .role-glow-circle::after{content:'';position:absolute;inset:0;border-radius:50%;border:1px solid var(--gc-border);opacity:.25}
        .role-alumno{--gc:radial-gradient(circle,rgba(108,99,255,.5),transparent);--gc-border:#6C63FF}.role-docente{--gc:radial-gradient(circle,rgba(45,212,191,.4),transparent);--gc-border:#2DD4BF}.role-familia{--gc:radial-gradient(circle,rgba(255,107,157,.4),transparent);--gc-border:#FF6B9D}
        .orbit-chip{position:absolute;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:50px;padding:6px 14px;font-size:12px;font-weight:800;color:rgba(255,255,255,.8);white-space:nowrap;animation:orbitChip var(--oc,6s) ease-in-out infinite var(--od,0s)}
        @keyframes orbitChip{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .role-text{flex:1;position:relative}.role-num{font-size:120px;font-weight:900;position:absolute;top:-60px;left:-20px;opacity:.04;line-height:1;letter-spacing:-5px;pointer-events:none;color:#fff}
        .role-tag{display:inline-block;border-radius:50px;padding:5px 16px;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem}
        .alumno-tag{background:rgba(108,99,255,.15);color:#a5b4fc;border:1px solid rgba(108,99,255,.25)}.docente-tag{background:rgba(45,212,191,.12);color:#5eead4;border:1px solid rgba(45,212,191,.2)}.familia-tag{background:rgba(255,107,157,.12);color:#fda4af;border:1px solid rgba(255,107,157,.2)}
        .role-h{font-size:clamp(34px,4vw,52px);font-weight:900;letter-spacing:-1px;line-height:1.1;margin-bottom:1rem}
        .role-desc{font-size:17px;color:rgba(255,255,255,.55);line-height:1.75;margin-bottom:2rem;max-width:420px}
        .role-btn{border:none;border-radius:14px;padding:15px 32px;font-size:15px;font-weight:900;text-decoration:none;transition:transform .15s,box-shadow .15s;display:inline-flex;align-items:center;gap:10px}.role-btn:hover{transform:translateY(-3px)}
        .rb-alumno{background:linear-gradient(135deg,#6C63FF,#9B5DE5);color:#fff;box-shadow:0 8px 30px rgba(108,99,255,.45)}.rb-docente{background:linear-gradient(135deg,#2DD4BF,#0d9488);color:#042f2e;box-shadow:0 8px 30px rgba(45,212,191,.4)}.rb-familia{background:linear-gradient(135deg,#FF6B9D,#e11d48);color:#fff;box-shadow:0 8px 30px rgba(255,107,157,.4)}
        .role-divider{width:1px;height:80px;background:linear-gradient(to bottom,transparent,rgba(255,255,255,.08),transparent);margin:0 auto 7rem}

        #como{position:relative;z-index:10;padding:4rem 5% 8rem;overflow:hidden}
        .como-bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(108,99,255,.07),transparent)}
        .como-title{font-size:clamp(36px,5vw,64px);font-weight:900;letter-spacing:-1.5px;text-align:center;margin-bottom:5rem}.como-title em{font-style:normal;color:#FFD700}
        .timeline{max-width:900px;margin:0 auto;position:relative;z-index:2}.timeline::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,rgba(108,99,255,.3) 20%,rgba(108,99,255,.3) 80%,transparent);transform:translateX(-50%)}
        .tl-item{display:flex;align-items:center;margin-bottom:4rem;position:relative;gap:0}.tl-item.reverse{flex-direction:row-reverse}
        .tl-side{flex:1;padding:0 3rem}.tl-item:not(.reverse) .tl-side{text-align:right}.tl-item.reverse .tl-side{text-align:left}
        .tl-dot{width:60px;height:60px;border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;z-index:2;position:relative;transition:transform .2s}
        .tl-item:hover .tl-dot{transform:scale(1.15) rotate(8deg)}
        .tl-item:nth-child(1) .tl-dot{background:rgba(108,99,255,.25);box-shadow:0 0 30px rgba(108,99,255,.4),0 0 0 8px rgba(108,99,255,.08)}
        .tl-item:nth-child(2) .tl-dot{background:rgba(255,107,157,.25);box-shadow:0 0 30px rgba(255,107,157,.4),0 0 0 8px rgba(255,107,157,.08)}
        .tl-item:nth-child(3) .tl-dot{background:rgba(255,215,0,.25);box-shadow:0 0 30px rgba(255,215,0,.4),0 0 0 8px rgba(255,215,0,.08)}
        .tl-item:nth-child(4) .tl-dot{background:rgba(74,222,128,.25);box-shadow:0 0 30px rgba(74,222,128,.4),0 0 0 8px rgba(74,222,128,.08)}
        .tl-n{font-size:11px;font-weight:900;letter-spacing:.15em;text-transform:uppercase;opacity:.35;margin-bottom:.4rem}.tl-title{font-size:24px;font-weight:900;letter-spacing:-.5px;margin-bottom:.5rem}.tl-desc{font-size:14px;color:rgba(255,255,255,.5);line-height:1.65}

        #preview{position:relative;z-index:10;padding:4rem 5% 8rem;overflow:hidden}
        .prev-blob{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}.pb1{width:600px;height:400px;background:rgba(108,99,255,.12);left:0;top:50%;transform:translateY(-50%)}.pb2{width:400px;height:400px;background:rgba(255,107,157,.08);right:0;top:30%}
        .preview-layout{max-width:1100px;margin:0 auto;display:flex;gap:5rem;align-items:center;position:relative;z-index:2;flex-wrap:wrap}
        .prev-left{flex:1;min-width:280px}.prev-eyebrow{font-size:12px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:1rem}
        .prev-title{font-size:clamp(36px,4.5vw,58px);font-weight:900;letter-spacing:-1.5px;line-height:1.05;margin-bottom:1.5rem}.prev-title em{font-style:normal;color:#6C63FF}
        .prev-desc{font-size:17px;color:rgba(255,255,255,.55);line-height:1.75;margin-bottom:2rem}
        .prev-metrics{display:flex;flex-direction:column;gap:1.2rem}.metric-row{display:flex;align-items:center;gap:1.2rem}.metric-icon{font-size:28px;width:50px;text-align:center;flex-shrink:0}.metric-info{flex:1}
        .metric-label{font-size:13px;color:rgba(255,255,255,.45);font-weight:700;margin-bottom:5px}.metric-bar{height:6px;background:rgba(255,255,255,.07);border-radius:100px;overflow:hidden}
        .metric-fill{height:100%;border-radius:100px;animation:barFill 1.5s ease-out forwards;width:0}.metric-val{font-size:14px;font-weight:900;color:#fff;flex-shrink:0;min-width:40px;text-align:right}
        .prev-right{flex:1;min-width:320px;position:relative}
        .game-panel{background:rgba(255,255,255,.03);border-top:1px solid rgba(108,99,255,.2);border-left:1px solid rgba(108,99,255,.1);border-right:1px solid rgba(108,99,255,.05);border-bottom:none;border-radius:28px 28px 0 0;padding:2rem;position:relative;box-shadow:0 -20px 80px rgba(108,99,255,.1)}
        .game-panel::before{content:'';position:absolute;inset:0;border-radius:28px 28px 0 0;background:linear-gradient(180deg,rgba(108,99,255,.06),transparent);pointer-events:none}
        .gp-header{display:flex;align-items:center;gap:12px;margin-bottom:1.5rem}.gp-dots{display:flex;gap:6px}.gp-dot{width:10px;height:10px;border-radius:50%}.gp-title{font-size:13px;color:rgba(255,255,255,.3);font-weight:700;margin-left:auto}
        .player-row{display:flex;align-items:center;gap:14px;margin-bottom:1.5rem}.p-avatar{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#6C63FF,#9B5DE5);display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 6px 20px rgba(108,99,255,.5)}
        .p-name{font-size:20px;font-weight:900;letter-spacing:-.3px}.p-lvl{display:inline-flex;align-items:center;gap:5px;background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.25);border-radius:50px;padding:3px 10px;font-size:11px;font-weight:900;color:#FFD700;margin-top:3px}
        .p-xp{margin-left:auto;font-size:13px;color:rgba(255,255,255,.35);font-weight:700}
        .xp-track{height:8px;background:rgba(255,255,255,.06);border-radius:100px;overflow:hidden;position:relative}.xp-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#6C63FF,#FF6B9D,#FFD700);background-size:200%;animation:xpGrad 3s linear infinite,xpFill 1.5s ease-out forwards;width:0}
        @keyframes xpGrad{0%{background-position:0%}100%{background-position:200%}}@keyframes xpFill{to{width:45%}}
        .numbers-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.04);border-radius:18px;overflow:hidden}
        .num-cell{padding:1.2rem .8rem;text-align:center;background:rgba(255,255,255,.02);transition:background .2s}.num-cell:hover{background:rgba(255,255,255,.06)}
        .num-big{font-size:36px;font-weight:900;line-height:1}.num-cell:nth-child(1) .num-big{background:linear-gradient(135deg,#6C63FF,#b8b0ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.num-cell:nth-child(2) .num-big{background:linear-gradient(135deg,#FFD700,#FF9500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.num-cell:nth-child(3) .num-big{background:linear-gradient(135deg,#FF6B9D,#e11d48);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .num-lbl{font-size:11px;color:rgba(255,255,255,.35);font-weight:700;margin-top:4px}.game-panel-fade{height:60px;background:linear-gradient(to bottom,transparent,#07061a);margin-top:-1px}
        #testi{position:relative;z-index:10;padding:4rem 5% 8rem;overflow:hidden}
        .testi-title{font-size:clamp(36px,5vw,64px);font-weight:900;letter-spacing:-1.5px;text-align:center;margin-bottom:5rem}.testi-title em{font-style:normal;color:#FF6B9D}
        .testi-scatter{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto auto;gap:0;align-items:start}
        .testi{padding:2rem 2.5rem;position:relative}.testi:nth-child(2){margin-top:3rem}.testi:nth-child(3){margin-top:1.5rem}
        .testi::before{content:'';position:absolute;left:0;top:2rem;bottom:2rem;width:2px;border-radius:2px;background:var(--tc)}.testi:nth-child(1){--tc:linear-gradient(to bottom,#6C63FF,#FF6B9D)}.testi:nth-child(2){--tc:linear-gradient(to bottom,#FFD700,#FF9500)}.testi:nth-child(3){--tc:linear-gradient(to bottom,#2DD4BF,#6C63FF)}
        .testi-stars{font-size:13px;letter-spacing:3px;color:#FFD700;margin-bottom:.8rem;opacity:.8}.testi-q{font-size:16px;color:rgba(255,255,255,.7);line-height:1.75;font-style:italic;margin-bottom:1.2rem}
        .testi-who{display:flex;align-items:center;gap:10px}.testi-av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0}
        .testi:nth-child(1) .testi-av{background:linear-gradient(135deg,#6C63FF,#4f46e5)}.testi:nth-child(2) .testi-av{background:linear-gradient(135deg,#FFD700,#F97316)}.testi:nth-child(3) .testi-av{background:linear-gradient(135deg,#2DD4BF,#0F766E)}
        .testi-nm{font-size:13px;font-weight:900}.testi-rl{font-size:11px;color:rgba(255,255,255,.35)}

        #cta{position:relative;z-index:10;padding:6rem 5% 8rem;text-align:center;overflow:hidden}
        .cta-blob1{position:absolute;width:700px;height:700px;border-radius:50%;filter:blur(100px);background:rgba(108,99,255,.15);top:50%;left:50%;transform:translate(-50%,-50%)}
        .cta-blob2{position:absolute;width:300px;height:300px;border-radius:50%;filter:blur(80px);background:rgba(255,107,157,.1);bottom:0;right:10%}
        .cta-inner{position:relative;z-index:2}.cta-pre{font-size:12px;font-weight:900;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:1.5rem}
        .cta-h{font-size:clamp(48px,8vw,100px);font-weight:900;letter-spacing:-3px;line-height:.95;margin-bottom:2rem}.cta-h span{-webkit-text-stroke:2px rgba(255,215,0,.6);color:transparent;display:block}
        .cta-sub{font-size:18px;color:rgba(255,255,255,.55);line-height:1.75;max-width:500px;margin:0 auto 3rem}.cta-row{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}

        footer{position:relative;z-index:10;padding:2rem 5%;border-top:1px solid rgba(255,255,255,.05);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
        .fl{font-size:22px;font-weight:900;color:rgba(255,255,255,.6)}.fl-links{display:flex;gap:1.5rem;list-style:none}.fl-links a{font-size:12px;color:rgba(255,255,255,.25);text-decoration:none;font-weight:700}.fl-links a:hover{color:rgba(255,255,255,.6)}.fl-copy{font-size:11px;color:rgba(255,255,255,.18)}

        .rv{opacity:0;transform:translateY(36px);transition:opacity .9s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1)}.rv.in{opacity:1;transform:none}
        .rv1{transition-delay:.1s}.rv2{transition-delay:.2s}.rv3{transition-delay:.3s}.rv4{transition-delay:.4s}
        @keyframes barFill{to{width:var(--w,70%)}}

        @media(max-width:768px){
          .hero-planet,.hero-planet-ring{display:none}
          .role-row,.role-row.reverse{flex-direction:column}
          .tl-item,.tl-item.reverse{flex-direction:column;text-align:center}
          .tl-item .tl-side{text-align:center!important}
          .timeline::before{display:none}
          .testi-scatter{grid-template-columns:1fr}
          .testi:nth-child(2),.testi:nth-child(3){margin-top:0}
          .preview-layout{flex-direction:column}
        }
      `}</style>
    </div>
  );
}



