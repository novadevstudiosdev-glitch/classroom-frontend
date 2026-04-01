"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  da: number;
  speed: number;
};

type Orb = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
};

const ORB_COLORS = [
  "rgba(56, 189, 248, 0.28)",
  "rgba(91, 110, 245, 0.28)",
  "rgba(155, 92, 246, 0.25)",
  "rgba(244, 114, 182, 0.2)",
  "rgba(252, 211, 77, 0.15)",
  "rgba(74, 222, 128, 0.15)",
];

export function AuthBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let stars: Star[] = [];
    let orbs: Orb[] = [];

    const makeStars = () => {
      const count = Math.max(140, Math.floor((width * height) / 11000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.7 + 0.35,
        a: Math.random(),
        da: (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? -1 : 1),
        speed: Math.random() * 0.17 + 0.05,
      }));
    };

    const makeOrbs = () => {
      const count = Math.max(8, Math.floor(width / 220));
      orbs = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 130 + 80,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.26,
        color: ORB_COLORS[index % ORB_COLORS.length],
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      makeStars();
      makeOrbs();
    };

    const draw = (time: number) => {
      const phase = time * 0.00008;

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#090f2a");
      bg.addColorStop(0.5, "#121a3f");
      bg.addColorStop(1, "#210f3d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.r) orb.x = width + orb.r;
        if (orb.x > width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = height + orb.r;
        if (orb.y > height + orb.r) orb.y = -orb.r;

        const radial = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        radial.addColorStop(0, orb.color);
        radial.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const star of stars) {
        star.a += star.da;
        if (star.a > 1 || star.a < 0) {
          star.da *= -1;
        }

        star.y += star.speed;
        star.x += Math.sin(phase + star.y * 0.01) * 0.03;

        if (star.y > height + star.r) {
          star.y = -star.r;
          star.x = Math.random() * width;
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, star.a));
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    frameId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

