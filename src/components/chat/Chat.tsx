import React, { useState, type FormEvent } from "react";
import { useChat, type Message } from "../../hooks/useChat";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import "./chat.css";

const Chat: React.FC = () => {
  const { messages, sendMessage, loading } = useChat();
  const scrollRef = useAutoScroll(messages);
  const [input, setInput] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.type === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-message bot loading">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        )}
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="chat-send-btn" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
