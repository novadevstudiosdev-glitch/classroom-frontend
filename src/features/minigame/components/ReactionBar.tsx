'use client';

const REACTIONS = ['😂', '❤️', '🔥', '👍', '🎉', '😮', '👏', '💀'] as const;

interface Props {
  onReact: (emoji: string) => void;
}

export function ReactionBar({ onReact }: Props) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {REACTIONS.map((e) => (
        <button
          key={e}
          onClick={() => onReact(e)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-lg hover:bg-white/10 transition-colors transition-transform active:scale-90 transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          aria-label={`Reaccionar con ${e}`}
          title={e}
          type="button"
        >
          {e}
        </button>
      ))}
    </div>
  );
}
