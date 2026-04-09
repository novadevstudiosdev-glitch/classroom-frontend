'use client';
import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types/game.types';

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  placeholder?: string;
  /** Fixed max-height for the messages area in px. Ignored when `grow` is true. */
  maxHeight?: number;
  /** When true, messages area uses flex-1 to fill the parent container instead of a fixed maxHeight. */
  grow?: boolean;
}

export function ChatPanel({ messages, onSend, placeholder = 'Escribir...', maxHeight = 220, grow = false }: Props) {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };

  const messagesStyle = grow
    ? { flex: 1, minHeight: 0, overflowY: 'auto' as const }
    : { maxHeight, overflowY: 'auto' as const };

  return (
    <div className={grow ? 'flex flex-col h-full gap-1.5' : 'flex flex-col gap-1.5'}>
      {/* Messages */}
      <div
        className="rounded-xl bg-black/20 p-2.5 flex flex-col gap-1 scrollbar-thin"
        style={messagesStyle}
      >
        {messages.length === 0 && (
          <p className="text-xs text-white/25 px-1">Sin mensajes aún.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`text-sm leading-snug ${m.system ? 'text-white/40 italic' : 'text-white/80'}`}>
            {!m.system && (
              <span className="text-indigo-400 font-bold">{m.alias}: </span>
            )}
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-1.5 flex-shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={placeholder}
          maxLength={100}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
        />
        <button
          onClick={submit}
          className="px-4 py-2 rounded-xl bg-indigo-500/30 border border-indigo-500/40 text-white font-bold text-sm hover:bg-indigo-500/40 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
