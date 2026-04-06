"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  da: number;
  speed: number;
  color: string;
};

type HeroParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  da: number;
  color: string;
  pulse: number;
  burst?: boolean;
};

export default function HomeView() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const lastMouseYRef = useRef(0);
  const [xpText, setXpText] = useState("0 XP");
  const materiasTrackRef = useRef<HTMLDivElement | null>(null);
  const materiasDraggingRef = useRef(false);
  const materiasStartXRef = useRef(0);
  const materiasScrollLeftRef = useRef(0);
  const [isMateriasDragging, setIsMateriasDragging] = useState(false);

  const materias = [
    {
      emoji: "📐",
      nombre: "Matemática",
      descripcion: "Números, geometría y lógica",
      glow: "#6C63FF",
    },
    {
      emoji: "📖",
      nombre: "Lengua",
      descripcion: "Lectura, escritura y comprensión",
      glow: "#FF6B9D",
    },
    {
      emoji: "🔬",
      nombre: "Ciencias",
      descripcion: "El mundo natural y el universo",
      glow: "#2DD4BF",
    },
    {
      emoji: "🌍",
      nombre: "Historia",
      descripcion: "Civilizaciones y culturas del mundo",
      glow: "#FFD700",
    },
    {
      emoji: "🎨",
      nombre: "Arte",
      descripcion: "Creatividad y expresión visual",
      glow: "#f472b6",
    },
    {
      emoji: "💻",
      nombre: "Tecnología",
      descripcion: "Pensamiento computacional",
      glow: "#38bdf8",
    },
  ];

  const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const revealTransition = (index = 0) => ({
    duration: 0.7,
    ease: revealEase,
    delay: index * 0.1,
  });

  const stopMateriasDrag = () => {
    if (!materiasDraggingRef.current) return;
    materiasDraggingRef.current = false;
    setIsMateriasDragging(false);
  };

  const handleMateriasMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    const track = materiasTrackRef.current;
    if (!track) return;

    materiasDraggingRef.current = true;
    setIsMateriasDragging(true);
    materiasStartXRef.current = event.pageX - track.offsetLeft;
    materiasScrollLeftRef.current = track.scrollLeft;
  };

  const handleMateriasMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const track = materiasTrackRef.current;
    if (!track || !materiasDraggingRef.current) return;

    event.preventDefault();
    const currentX = event.pageX - track.offsetLeft;
    const walk = (currentX - materiasStartXRef.current) * 1.25;
    track.scrollLeft = materiasScrollLeftRef.current - walk;
  };

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
    const hero = document.getElementById("hero");
    if (!hero) return;

    const revealOffset = 80;
    let heroBottom = 0;

    const updateHeroBottom = () => {
      heroBottom = hero.getBoundingClientRect().top + window.scrollY + hero.offsetHeight;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isBelowHero = currentScrollY > heroBottom - revealOffset;

      if (!isBelowHero) {
        setIsNavVisible(true);
      } else {
        const scrollingUp = currentScrollY < lastScrollYRef.current - 4;
        const scrollingDown = currentScrollY > lastScrollYRef.current + 4;

        if (scrollingUp) setIsNavVisible(true);
        if (scrollingDown) setIsNavVisible(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const currentScrollY = window.scrollY;
      const isBelowHero = currentScrollY > heroBottom - revealOffset;

      if (!isBelowHero) {
        lastMouseYRef.current = event.clientY;
        return;
      }

      const movedMouseUp = event.clientY < lastMouseYRef.current - 10;
      const nearTopEdge = event.clientY <= 120;

      if (movedMouseUp || nearTopEdge) {
        setIsNavVisible(true);
      }

      lastMouseYRef.current = event.clientY;
    };

    updateHeroBottom();
    lastScrollYRef.current = window.scrollY;
    lastMouseYRef.current = window.innerHeight / 2;

    window.addEventListener("resize", updateHeroBottom);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", updateHeroBottom);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    const mouse = { x: -999, y: -999 };
    let particles: HeroParticle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 2.5 + 0.5,
      a: Math.random() * 0.8 + 0.1,
      da: (Math.random() - 0.5) * 0.012,
      color: ["#6C63FF", "#FF6B9D", "#FFD700", "#2DD4BF", "#ffffff"][
        Math.floor(Math.random() * 5)
      ],
      pulse: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const burst = (bx: number, by: number) => {
      const colors = ["#FFD700", "#FF6B9D", "#6C63FF", "#4ADE80", "#2DD4BF", "#ffffff"];
      const burstParticles: HeroParticle[] = Array.from({ length: 28 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        return {
          x: bx,
          y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 3 + 1,
          a: 1,
          da: -0.025,
          color: colors[Math.floor(Math.random() * colors.length)],
          burst: true,
          pulse: 0,
        };
      });
      particles = [...particles, ...burstParticles];
    };

    const onClick = (event: globalThis.MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      burst(event.clientX - rect.left, event.clientY - rect.top);
    };

    const onMove = (event: globalThis.MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter((p) => p.a > 0);

      particles.forEach((p) => {
        p.pulse += 0.04;
        p.a += p.da;

        if (!p.burst && (p.a <= 0.1 || p.a >= 0.9)) p.da *= -1;

        p.x += p.vx;
        p.y += p.vy;

        if (!p.burst) {
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 120 && distance > 0 && !p.burst) {
          p.vx += (dx / distance) * 0.08;
          p.vy += (dy / distance) * 0.08;
        }

        if (!p.burst) {
          p.vx *= 0.99;
          p.vy *= 0.99;
        }

        const radius = p.r * (p.burst ? 1 : 0.9 + 0.2 * Math.sin(p.pulse));

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.a);
        ctx.fillStyle = p.color;

        if (p.r > 1.5) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.burst ? 16 : 8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let frame = 0;
      const target = 2450;
      const duration = 2000;
      const start = performance.now();

      const tick = (time: number) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        setXpText(`${value.toLocaleString()} XP`);

        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        }
      };

      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, 2200);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
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
      barsObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMateriasDragging) return;

    const onMouseUp = () => {
      materiasDraggingRef.current = false;
      setIsMateriasDragging(false);
    };

    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [isMateriasDragging]);

  return (
    <div className="landing-root">
      <canvas id="starfield" />

      <nav className={`landing-nav ${isNavVisible ? "is-visible" : "is-hidden"}`}>
        <Link href="/" className="logo" aria-label="Novi">
          <Image
            src="/NOVI.png"
            alt="Novi"
            width={140}
            height={44}
            className="logo-img"
            priority
          />
        </Link>
        <div className="landing-nav-links">
          <a href="#roles" className="landing-nav-link">Para vos</a>
          <a href="#materias" className="landing-nav-link">Materias</a>
          <a href="#como" className="landing-nav-link">Cómo funciona</a>
          <a href="#preview" className="landing-nav-link">Aventuras</a>
        </div>
        <Link href="/login" className="btn-nav">Empezar gratis</Link>
      </nav>

      <section id="hero">
        <canvas id="hero-canvas" />
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="hero-grid-floor" />
        <div className="hero-planet" />
        <div className="hero-planet-ring" />

        <span className="flt" style={{ left: "52%", top: "22%", fontSize: "30px", "--d": "4s", "--dl": "0s" } as CSSProperties}>*</span>
        <span className="flt" style={{ left: "44%", top: "72%", fontSize: "22px", "--d": "5s", "--dl": "1s" } as CSSProperties}>+</span>
        <span className="flt" style={{ left: "66%", top: "45%", fontSize: "18px", "--d": "6s", "--dl": ".5s" } as CSSProperties}>x</span>
        <span className="flt" style={{ left: "34%", top: "18%", fontSize: "14px", "--d": "3.5s", "--dl": "2s" } as CSSProperties}>.</span>

        <div className="hero-headline">
          <div className="hero-badge">
            <span className="badge-dot" />
            50.000 aventureros activos ahora mismo
          </div>
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

          <div className="xp-bar-wrap">
            <span className="xp-label">TU XP</span>
            <div className="hero-xp-track">
              <div className="xp-fill-bar" />
            </div>
            <span className="xp-val">{xpText}</span>
          </div>
        </div>

        <div className="scroll-hint">
          <span>Explorar</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      <section id="roles">
        <div className="roles-blob rb1" /><div className="roles-blob rb2" />
        <motion.div
          className="roles-eyebrow"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(0)}
        >
          ¿Quién sos?
        </motion.div>
        <motion.div
          className="roles-title"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(1)}
        >
          Novi es para <span>todos</span>
        </motion.div>

        <motion.div
          className="role-row"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(0)}
        >
          <div className="role-visual"><div className="role-glow-circle role-alumno" style={{ "--rf": "5s" } as CSSProperties}><div className="role-emoji-wrap"><video src="/ni%C3%B1o%20astronauta.mp4" autoPlay loop muted playsInline className="role-emoji-img role-emoji-img-alumno-video" aria-label="Niño astronauta" /></div><span className="orbit-chip" style={{ top: "-10px", right: "-30px", "--oc": "5s", "--od": "0s" } as CSSProperties}>Misiones</span><span className="orbit-chip" style={{ bottom: "10px", left: "-40px", "--oc": "6s", "--od": ".8s" } as CSSProperties}>Logros</span><span className="orbit-chip" style={{ bottom: "-14px", right: "0px", "--oc": "4.5s", "--od": "1.5s" } as CSSProperties}>XP</span></div></div>
          <div className="role-text"><div className="role-num">01</div><span className="role-tag alumno-tag">Para estudiantes</span><h3 className="role-h">Soy alumno</h3><p className="role-desc">Completá misiones, ganás XP y desbloqueás logros mientras aprendés jugando. El universo del conocimiento te espera.</p><button className="role-btn rb-alumno" onClick={() => { window.location.href = "/parental-gate.html"; }}>Empezar aventura <span>→</span></button></div>
        </motion.div>
        <div className="role-divider" />

        <motion.div
          className="role-row reverse"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(1)}
        >
          <div className="role-visual"><div className="role-glow-circle role-docente" style={{ "--rf": "6s" } as CSSProperties}><div className="role-emoji-wrap role-emoji-wrap-docente"><video src="/profesores.mp4" autoPlay loop muted playsInline className="role-emoji-img role-emoji-img-docente" aria-label="Profesores" /></div><span className="orbit-chip" style={{ top: "-8px", left: "-20px", "--oc": "5.5s", "--od": ".4s" } as CSSProperties}>Reportes</span><span className="orbit-chip" style={{ bottom: "0", right: "-30px", "--oc": "4s", "--od": "1.2s" } as CSSProperties}>Alumnos</span></div></div>
          <div className="role-text"><div className="role-num">02</div><span className="role-tag docente-tag">Para docentes</span><h3 className="role-h">Soy docente</h3><p className="role-desc">Creá clases, asigná misiones y seguí el progreso de cada alumno con reportes detallados en tiempo real.</p><Link href="/register.html?role=teacher" className="role-btn rb-docente">Crear mi clase <span>→</span></Link></div>
        </motion.div>
      </section>

      <section id="materias">
        <div className="materias-bg" />
        <motion.div
          className="materias-eyebrow"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(0)}
        >
          ¿Qué vas a aprender?
        </motion.div>
        <motion.div
          className="materias-title"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(1)}
        >
          Explorá todos los mundos
        </motion.div>

        <motion.div
          ref={materiasTrackRef}
          className={`materias-track ${isMateriasDragging ? "is-dragging" : ""}`}
          onMouseDown={handleMateriasMouseDown}
          onMouseMove={handleMateriasMouseMove}
          onMouseUp={stopMateriasDrag}
          onMouseLeave={stopMateriasDrag}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(2)}
        >
          {materias.map((materia) => (
            <article
              key={materia.nombre}
              className="materia-card"
              style={{ "--subject-glow": materia.glow } as CSSProperties}
            >
              <span className="materia-emoji">{materia.emoji}</span>
              <h3 className="materia-name">{materia.nombre}</h3>
              <p className="materia-desc">{materia.descripcion}</p>
            </article>
          ))}
        </motion.div>
      </section>

      <section id="como">
        <div className="como-bg" />
        <motion.div
          className="como-title"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(0)}
        >
          ¿Cómo <em>funciona</em>?
        </motion.div>
        <div className="timeline">
          <motion.div
            className="tl-item"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition(0)}
          >
            <div className="tl-side">
              <div className="tl-n">Paso 01</div>
              <div className="tl-title">Explorás</div>
              <div className="tl-desc">Elegís una materia y empezás una aventura espacial llena de mundos por descubrir.</div>
            </div>
            <div className="tl-dot">📚</div>
            <div className="tl-side" />
          </motion.div>
          <motion.div
            className="tl-item reverse"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition(1)}
          >
            <div className="tl-side" />
            <div className="tl-dot">🎮</div>
            <div className="tl-side">
              <div className="tl-n">Paso 02</div>
              <div className="tl-title">Jugás</div>
              <div className="tl-desc">Aprendés con minijuegos, quizzes y misiones que te enganchan de verdad.</div>
            </div>
          </motion.div>
          <motion.div
            className="tl-item"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition(2)}
          >
            <div className="tl-side">
              <div className="tl-n">Paso 03</div>
              <div className="tl-title">Ganás XP</div>
              <div className="tl-desc">Cada respuesta correcta te da puntos y desbloquea recompensas especiales.</div>
            </div>
            <div className="tl-dot">⚡</div>
            <div className="tl-side" />
          </motion.div>
          <motion.div
            className="tl-item reverse"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition(3)}
          >
            <div className="tl-side" />
            <div className="tl-dot">🏆</div>
            <div className="tl-side">
              <div className="tl-n">Paso 04</div>
              <div className="tl-title">Subís nivel</div>
              <div className="tl-desc">Nuevos mundos, personajes y logros especiales te esperan en cada nivel alcanzado.</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="preview">
        <div className="prev-blob pb1" /><div className="prev-blob pb2" />
        <div className="preview-layout">
          <motion.div
            className="prev-left"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition(0)}
          >
            <div className="prev-eyebrow">Vista real</div>
            <h2 className="prev-title">Así se ve una<br />aventura <em>en Novi</em></h2>
            <p className="prev-desc">Tu progreso, tus logros, todo visible en tiempo real.</p>
            <div className="prev-metrics">
              <div className="metric-row"><span className="metric-icon">📚</span><div className="metric-info"><div className="metric-label">Lecciones completadas</div><div className="metric-bar"><div className="metric-fill" style={{ background: "linear-gradient(90deg,#6C63FF,#b8b0ff)", "--w": "72%" } as CSSProperties} /></div></div><span className="metric-val">24</span></div>
              <div className="metric-row"><span className="metric-icon">🔥</span><div className="metric-info"><div className="metric-label">Días seguidos</div><div className="metric-bar"><div className="metric-fill" style={{ background: "linear-gradient(90deg,#FFD700,#FF9500)", "--w": "58%" } as CSSProperties} /></div></div><span className="metric-val">7</span></div>
              <div className="metric-row"><span className="metric-icon">🏅</span><div className="metric-info"><div className="metric-label">Logros desbloqueados</div><div className="metric-bar"><div className="metric-fill" style={{ background: "linear-gradient(90deg,#FF6B9D,#e11d48)", "--w": "48%" } as CSSProperties} /></div></div><span className="metric-val">12</span></div>
            </div>
          </motion.div>
          <motion.div
            className="prev-right"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition(1)}
          >
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
          </motion.div>
        </div>
      </section>

      <section id="testi">
        <motion.div
          className="testi-title"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(0)}
        >
          Familias que ya <em>vuelan</em>
        </motion.div>
        <div className="testi-scatter">
          <motion.div
            className="testi"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition(0)}
          >
            <div className="testi-stars">★★★★★</div>
            <p className="testi-q">&quot;Mi hijo pide hacer tarea por primera vez en su vida. Novi lo enganchó completamente con las misiones espaciales.&quot;</p>
            <div className="testi-who">
              <div className="testi-av">M</div>
              <div>
                <div className="testi-nm">María González</div>
                <div className="testi-rl">Mamá de Mateo, 8 años</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="testi"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition(1)}
          >
            <div className="testi-stars">★★★★★</div>
            <p className="testi-q">&quot;Como docente, ver el progreso en tiempo real cambió mis clases por completo. Mis alumnos están más motivados que nunca.&quot;</p>
            <div className="testi-who">
              <div className="testi-av">L</div>
              <div>
                <div className="testi-nm">Laura Pérez</div>
                <div className="testi-rl">Maestra de 3° grado</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="testi"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition(2)}
          >
            <div className="testi-stars">★★★★★</div>
            <p className="testi-q">&quot;Subí 3 niveles en una semana. Las misiones son buenísimas y quiero desbloquear todos los astronautas.&quot;</p>
            <div className="testi-who">
              <div className="testi-av">S</div>
              <div>
                <div className="testi-nm">Sofía Ramírez</div>
                <div className="testi-rl">Alumna, 10 años</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="cta">
        <div className="cta-blob1" /><div className="cta-blob2" />
        <motion.div
          className="cta-inner"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={revealTransition(0)}
        >
          <div className="cta-pre">¿Listo para despegar?</div>
          <h2 className="cta-h">Tu aventura<span>empieza hoy.</span></h2>
          <p className="cta-sub">Completamente gratis para estudiantes. Más de 50.000 chicos ya aprendiendo jugando cada día.</p>
          <div className="cta-row">
            <Link href="/login" className="btn-main" style={{ borderRadius: "16px" }}>Empezar gratis <span className="arr">GO</span></Link>
            <Link href="/register.html?role=teacher" className="btn-ghost" style={{ borderRadius: "16px" }}>Soy docente →</Link>
          </div>
        </motion.div>
      </section>

      <footer>
        <div className="fl">Novi</div>
        <ul className="fl-links"><li><a href="#">Privacidad</a></li><li><a href="#">Términos</a></li><li><a href="#">Contacto</a></li></ul>
        <span className="fl-copy">© 2026 Novi</span>
      </footer>

      
    </div>
  );
}



