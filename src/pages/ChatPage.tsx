import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/chat/Sidebar";
import { ChatArea } from "../components/chat/ChatArea";
import { useChat, type Message } from "../hooks/useChat";

const ChatPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const {
    messages,
    sendMessage,
    loading,
    conversations,
    activeConversationId,
    setActiveConversationId,
    startNewChat,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  return (
    <div className="flex h-screen bg-indigo-50 overflow-hidden">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        chatHistory={conversations}
        activeChatId={activeConversationId}
        onSelectChat={setActiveConversationId}
        onNewChat={startNewChat}
      />

      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        <ChatArea
          isSidebarCollapsed={isSidebarCollapsed}
          messages={messages as Message[]}
          onSendMessage={handleSendMessage}
          loading={loading}
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  );
};

export default ChatPage;
