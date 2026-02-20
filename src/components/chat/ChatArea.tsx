import React from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ChatTabs } from "./ChatTabs";
import { EmptyState } from "./EmptyState";
import { type Message } from "../../hooks/useChat";

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  chatTabs: { id: number; title?: string | null }[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
  onNewChat: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  loading,
  messagesEndRef,
  chatTabs,
  activeChatId,
  onSelectChat,
  onNewChat,
}) => {
  return (
    <div className="flex-1 flex flex-col h-screen">
      <ChatTabs
        tabs={chatTabs}
        activeId={activeChatId}
        onSelect={onSelectChat}
        onNew={onNewChat}
      />

      {messages.length === 0 ? (
        <EmptyState onPromptClick={onSendMessage} />
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
          {loading && (
            <div className="text-indigo-500 text-sm">Assistant is typing...</div>
          )}
        </div>
      )}

      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};
