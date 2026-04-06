'use client';
import { useMinigameStore } from '../store/minigame.store';

export function VolumeControl() {
  const volume = useMinigameStore((s) => s.volume);
  const setVolume = useMinigameStore((s) => s.setVolume);

  const icon = volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊';

  return (
    <div className="flex items-center gap-2">
      <span className="text-base select-none text-white/70" aria-hidden="true">{icon}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 accent-indigo-500 cursor-pointer focus-visible:outline-none"
        aria-label="Volumen"
      />
    </div>
  );
}
