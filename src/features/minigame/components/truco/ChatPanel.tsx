"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../../types/game.types";

interface Props {
  playerName: string;
  playerScore: number;
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

export default function ChatPanel({ playerName, playerScore, messages, onSend }: Props) {
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const initials = playerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    onSend(txt);
    setInput("");
  };

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="panel-right">
      <div className="chat-hdr">
        <span className="chat-title">Chat de Mesa</span>
      </div>

      <div className="player-chip">
        <div className="avatar">{initials}</div>
        <div>
          <div className="pname">{playerName}</div>
          <div className="ppts">Jugadora 1</div>
        </div>
        <div className="sbadge">{playerScore}</div>
      </div>

      <div className="chat-msgs" ref={listRef}>
        {messages.length === 0 ? (
          <p className="msg-empty">Sin mensajes todavia</p>
        ) : (
          messages.map((m, i) => (
            <div key={`${m.alias}-${i}`} className={`msg-item ${m.system ? "msg-system" : ""}`}>
              <span className="msg-who">{m.alias}:</span>
              <span className="msg-txt">{m.text}</span>
            </div>
          ))
        )}
      </div>

      <div className="chat-in-row">
        <input
          className="chat-in"
          placeholder="Mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="chat-send" onClick={send}>
          Enviar
        </button>
      </div>
    </div>
  );
}
