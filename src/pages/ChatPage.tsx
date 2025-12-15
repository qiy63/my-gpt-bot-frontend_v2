import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/chat/Sidebar";
import { ChatArea } from "../components/chat/ChatArea";
import { useChat, type Message } from "../hooks/useChat";
import { useAuth } from "../hooks/useAuth";

const ChatPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { messages, sendMessage, loading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { userId } = useAuth(); // get logged-in user info
  const [user, setUser] = useState<{ name?: string; profilePicture?: string } | undefined>(undefined);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch user info if needed
  useEffect(() => {
    if (userId) {
      // Example: fetch user info from API
      fetch(`http://localhost:4000/users/${userId}`)
        .then((res) => res.json())
        .then((data) => setUser({ name: data.name, profilePicture: data.profilePicture }))
        .catch(() => setUser(undefined));
    }
  }, [userId]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  return (
    <div className="flex h-screen bg-indigo-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        user={user} // pass user object here
      />

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-72"
        }`}
      >
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
