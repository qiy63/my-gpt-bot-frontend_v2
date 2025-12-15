import React from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { type Message } from "../../hooks/useChat";

interface ChatAreaProps {
  isSidebarCollapsed: boolean;
  messages: Message[];
  onSendMessage: (content: string) => void;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  loading,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 px-6 py-4">
        <h2 className="text-indigo-950">Property Legal Assistant</h2>
        <p className="text-sm text-indigo-600/70">
          Ask me anything about property law and legal procedures
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
        {loading && (
          <div className="text-indigo-500 text-sm">Assistant is typing...</div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};