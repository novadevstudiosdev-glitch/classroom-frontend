"use client";

import { useState } from "react";

interface Message {
  who: string;
  text: string;
}

interface Props {
  playerName: string;
  playerScore: number;
}

export default function ChatPanel({ playerName, playerScore }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const initials = playerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    setMessages((prev) => [...prev, { who: playerName, text: txt }]);
    setInput("");
  };

  return (
    <div className="panel-right">
      <div className="chat-hdr">
        <span className="chat-title">Mesa</span>
      </div>

      <div className="player-chip">
        <div className="avatar">{initials}</div>
        <div>
          <div className="pname">{playerName}</div>
          <div className="ppts">Jugadora 1</div>
        </div>
        <div className="sbadge">{playerScore}</div>
      </div>

      <div className="chat-msgs">
        {messages.length === 0 ? (
          <p className="msg-empty">— Sin mensajes —</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="msg-item">
              <span className="msg-who">{m.who}:</span>
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
          ➤
        </button>
      </div>
    </div>
  );
}
