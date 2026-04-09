'use client';
import { useEffect, useState, useRef } from 'react';

interface Props {
  durationMs: number;
  onExpire?: () => void;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularTimer({ durationMs, onExpire, size = 64, strokeWidth = 5, color = '#6366f1' }: Props) {
  const [remaining, setRemaining] = useState(durationMs);
  const startRef = useRef(0); // initialized in the effect below
  const rafRef = useRef<number>(0);
  const expiredRef = useRef(false);

  useEffect(() => {
    expiredRef.current = false;
    startRef.current = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(durationMs);

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const left = Math.max(0, durationMs - elapsed);
      setRemaining(left);
      if (left === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
        return;
      }
      if (left > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [durationMs, onExpire]);

  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = remaining / durationMs;
  const dashOffset = circumference * (1 - progress);
  const seconds = Math.ceil(remaining / 1000);
  const pct = progress;
  const timerColor = pct > 0.4 ? color : pct > 0.2 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={timerColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke 0.3s' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.28, fontWeight: 700, color: timerColor,
      }}>
        {seconds}
      </div>
    </div>
  );
}
