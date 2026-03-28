"use client";

import { useEffect, useRef } from "react";

type AuthRocketOverlayProps = {
  anchorId: string;
};

type Point = {
  x: number;
  y: number;
};

type RectLike = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const catmullRom = (p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point => {
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x:
      0.5 *
      ((2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      ((2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
};

const catmullRomDerivative = (
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point => {
  const t2 = t * t;

  return {
    x:
      0.5 *
      ((-p0.x + p2.x) +
        2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t +
        3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2),
    y:
      0.5 *
      ((-p0.y + p2.y) +
        2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t +
        3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2),
  };
};

const getFallbackFormRect = (width: number, height: number): RectLike => ({
  left: width * 0.56,
  right: width * 0.9,
  top: height * 0.2,
  bottom: height * 0.78,
  width: width * 0.34,
  height: height * 0.58,
});

const normalizeRect = (rect: RectLike): RectLike => {
  const width = Number.isFinite(rect.width) ? rect.width : 0;
  const height = Number.isFinite(rect.height) ? rect.height : 0;
  const left = Number.isFinite(rect.left) ? rect.left : 0;
  const top = Number.isFinite(rect.top) ? rect.top : 0;
  const right = Number.isFinite(rect.right) ? rect.right : left + width;
  const bottom = Number.isFinite(rect.bottom) ? rect.bottom : top + height;

  return { left, right, top, bottom, width, height };
};

export function AuthRocketOverlay({ anchorId }: AuthRocketOverlayProps) {
  const backLayerRef = useRef<HTMLDivElement | null>(null);
  const frontLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const backLayer = backLayerRef.current;
    const frontLayer = frontLayerRef.current;
    if (!backLayer || !frontLayer) return;

    const anchor = document.getElementById(anchorId);
    if (!anchor) return;

    let rafId = 0;
    const timeouts = new Set<number>();
    let lastTime = performance.now();
    let trailElapsed = 0;
    let progress = 0;
    let boost = 0;
    let boostTarget = 0;
    let boostUntil = 0;
    let lastX = 0;
    let lastY = 0;
    let lastAngle = 0;
    let rocketIsFront = true;

    const baseSpeed = 0.35;

    const rocket = document.createElement("div");
    rocket.style.cssText = `
      position:absolute;
      left:0;
      top:0;
      transform:translate(-50%,-50%) rotate(0deg) scale(1);
      opacity:0.92;
      will-change:transform,left,top,opacity;
      pointer-events:none;
      z-index:2;
    `;

    const rocketBody = document.createElement("span");
    rocketBody.textContent = String.fromCodePoint(0x1f680);
    rocketBody.style.cssText = `
      display:block;
      font-size:32px;
      line-height:1;
      filter:drop-shadow(0 0 10px #fcd34d) drop-shadow(0 0 22px #fb923c);
    `;

    const flame = document.createElement("span");
    flame.textContent = String.fromCodePoint(0x1f525);
    flame.style.cssText = `
      position:absolute;
      left:50%;
      top:78%;
      transform:translate(-50%,0) scale(0.8);
      transform-origin:50% 0;
      font-size:15px;
      opacity:0.72;
      filter:drop-shadow(0 0 8px #fb923c);
      pointer-events:none;
    `;

    rocket.appendChild(rocketBody);
    rocket.appendChild(flame);
    frontLayer.appendChild(rocket);

    const getFormRect = (): RectLike => {
      const formElement = document.getElementById("auth-form-card");
      if (formElement) {
        return normalizeRect(formElement.getBoundingClientRect());
      }
      return normalizeRect(getFallbackFormRect(window.innerWidth, window.innerHeight));
    };

    const spawnTrail = (x: number, y: number, angle: number, front: boolean) => {
      const particle = document.createElement("div");
      const size = 4 + Math.random() * 6;
      const palette = ["#fcd34d", "#fb923c", "#f472b6", "#ffffff", "#38bdf8"];
      const color = palette[Math.floor(Math.random() * palette.length)];
      const layer = front ? frontLayer : backLayer;

      particle.style.cssText = `
        position:absolute;
        left:${x}px;
        top:${y}px;
        width:${size}px;
        height:${size}px;
        border-radius:9999px;
        background:${color};
        opacity:${front ? 0.8 : 0.48};
        transform:translate(-50%,-50%);
        pointer-events:none;
        transition:opacity .54s ease, transform .54s ease;
      `;
      layer.appendChild(particle);

      requestAnimationFrame(() => {
        const spread = (Math.random() - 0.5) * 42;
        const distance = 12 + Math.random() * 24;
        const px = Math.cos(angle + Math.PI + spread * 0.04) * distance;
        const py = Math.sin(angle + Math.PI + spread * 0.04) * distance;
        particle.style.opacity = "0";
        particle.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(0.22)`;
      });

      const timeoutId = window.setTimeout(() => {
        particle.remove();
        timeouts.delete(timeoutId);
      }, 560);
      timeouts.add(timeoutId);
    };

    const buildRoute = (phase: number): Point[] => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pad = Math.max(42, Math.min(width, height) * 0.055);

      const anchorRect = anchor.getBoundingClientRect();
      const formRect = getFormRect();

      const logoX = anchorRect.left + anchorRect.width * 0.54;
      const logoTop = anchorRect.top;
      const variance = (seed: number, amplitude: number) =>
        Math.sin(phase * 0.85 + seed * 1.31) * amplitude;

      const aboveLogo: Point = {
        x: clamp(logoX + variance(1, 16), pad, width - pad),
        y: clamp(logoTop - 52 + variance(2, 12), pad, height - pad),
      };

      const topLeft: Point = { x: pad, y: pad };
      const topRight: Point = { x: width - pad, y: pad };

      const rightUpperNearForm: Point = {
        x: width - pad,
        y: clamp(formRect.top - 64 + variance(3, 14), pad, height - pad),
      };

      const belowFormRight: Point = {
        x: clamp(formRect.right + Math.max(42, width * 0.045) + variance(4, 16), pad, width - pad),
        y: clamp(formRect.bottom + Math.max(54, height * 0.06) + variance(5, 12), pad, height - pad),
      };

      const belowFormCenter: Point = {
        x: clamp(formRect.left + formRect.width * 0.5 + variance(6, 20), pad, width - pad),
        y: clamp(formRect.bottom + Math.max(62, height * 0.068) + variance(7, 12), pad, height - pad),
      };

      const bottomRight: Point = { x: width - pad, y: height - pad };
      const bottomLeft: Point = { x: pad, y: height - pad };

      const leftMid: Point = {
        x: clamp(formRect.left - Math.max(46, width * 0.05) + variance(8, 18), pad, width - pad),
        y: clamp(formRect.top + formRect.height * 0.58 + variance(9, 16), pad, height - pad),
      };

      const upperLeftNearLogo: Point = {
        x: clamp(logoX - 116 + variance(10, 18), pad, width - pad),
        y: clamp(logoTop + 18 + variance(11, 14), pad, height - pad),
      };

      return [
        aboveLogo,
        topLeft,
        topRight,
        rightUpperNearForm,
        belowFormRight,
        belowFormCenter,
        bottomRight,
        bottomLeft,
        leftMid,
        upperLeftNearLogo,
      ];
    };

    const triggerBoost = (durationMs: number, amount: number) => {
      boostTarget = Math.max(boostTarget, amount);
      boostUntil = Math.max(boostUntil, performance.now() + durationMs);
    };

    const scheduleAmbientBoost = () => {
      const timeoutId = window.setTimeout(() => {
        triggerBoost(900, 0.45);
        scheduleAmbientBoost();
        timeouts.delete(timeoutId);
      }, 7500 + Math.random() * 7000);
      timeouts.add(timeoutId);
    };

    const animate = (now: number) => {
      const dt = Math.min(40, now - lastTime);
      lastTime = now;

      if (now > boostUntil) {
        boostTarget = 0;
      }
      boost += (boostTarget - boost) * 0.08;

      const phase = now * 0.00045;
      const route = buildRoute(phase);
      const safeRoute = route.filter(
        (point): point is Point =>
          Boolean(point) && Number.isFinite(point.x) && Number.isFinite(point.y)
      );
      const count = safeRoute.length;
      if (count < 4) {
        rafId = window.requestAnimationFrame(animate);
        return;
      }

      const speedVariance = 0.95 + 0.1 * Math.sin(now * 0.00034);
      const speed = baseSpeed * speedVariance * (1 + boost * 0.9);
      if (!Number.isFinite(progress)) {
        progress = 0;
      }
      progress = (progress + (dt / 1000) * speed) % count;

      const index = Math.floor(progress);
      const t = progress - index;
      const p0 = safeRoute[(index - 1 + count) % count];
      const p1 = safeRoute[index % count];
      const p2 = safeRoute[(index + 1) % count];
      const p3 = safeRoute[(index + 2) % count];
      if (!p0 || !p1 || !p2 || !p3) {
        rafId = window.requestAnimationFrame(animate);
        return;
      }

      const pos = catmullRom(p0, p1, p2, p3, t);
      const tangent = catmullRomDerivative(p0, p1, p2, p3, t);
      const angle = Math.atan2(tangent.y, tangent.x);
      const angleDeg = (angle * 180) / Math.PI + 90;

      const formRect = getFormRect();
      const nearForm =
        pos.x >= formRect.left - 70 &&
        pos.x <= formRect.right + 70 &&
        pos.y >= formRect.top - 40 &&
        pos.y <= formRect.bottom + 92;
      const shouldBeFront = !nearForm || pos.y < formRect.top - 12;

      if (shouldBeFront !== rocketIsFront) {
        rocketIsFront = shouldBeFront;
        (rocketIsFront ? frontLayer : backLayer).appendChild(rocket);
      }

      const pulse = (Math.sin(progress * 2.4) + 1) * 0.5;
      const scale = 0.9 + pulse * 0.14 + boost * 0.06;
      const opacity = (rocketIsFront ? 0.9 : 0.7) + pulse * 0.07;
      rocket.style.left = `${pos.x}px`;
      rocket.style.top = `${pos.y}px`;
      rocket.style.opacity = `${opacity}`;
      rocket.style.transform = `translate(-50%,-50%) rotate(${angleDeg}deg) scale(${scale})`;

      const flamePulse = (Math.sin(now * 0.03) + 1) * 0.5;
      const flameX = 0.72 + flamePulse * 0.34 + boost * 0.18;
      const flameY = 0.66 + flamePulse * 0.52 + boost * 0.22;
      flame.style.transform = `translate(-50%,0) scale(${flameX}, ${flameY})`;
      flame.style.opacity = `${0.52 + flamePulse * 0.28 + boost * 0.12}`;

      lastX = pos.x;
      lastY = pos.y;
      lastAngle = angle;

      trailElapsed += dt;
      const dynamicTrailInterval = 94 / (1 + boost * 0.65);
      if (trailElapsed >= dynamicTrailInterval) {
        trailElapsed = 0;
        spawnTrail(pos.x, pos.y, angle, rocketIsFront);
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const onAnchorClick = () => {
      triggerBoost(1600, 1);
      for (let i = 0; i < 8; i += 1) {
        spawnTrail(lastX, lastY, lastAngle + (i / 8) * Math.PI * 2, true);
      }
    };

    scheduleAmbientBoost();
    anchor.addEventListener("click", onAnchorClick);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      anchor.removeEventListener("click", onAnchorClick);
      for (const timeoutId of timeouts) {
        window.clearTimeout(timeoutId);
      }
      timeouts.clear();
      rocket.remove();
    };
  }, [anchorId]);

  return (
    <>
      <div ref={backLayerRef} className="absolute inset-0 z-[6] pointer-events-none overflow-hidden" />
      <div ref={frontLayerRef} className="absolute inset-0 z-[16] pointer-events-none overflow-hidden" />
    </>
  );
}
