import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  FileText,
  MessageSquare,
  User,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNewChat?: () => void;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  onNewChat,
}: SidebarProps) {
  const navigate = useNavigate();
  const { logout, name, profilePicture } = useAuth();

  const [isDocumentExpanded, setIsDocumentExpanded] = useState(false);
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  return (
    <div className={`bg-gradient-to-b from-indigo-950 to-indigo-900 text-white transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'w-16' : 'w-72'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-800/50">
        {!isCollapsed && <h1 className="tracking-tight">MyPropertyAid</h1>}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-indigo-800/50 rounded-lg transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          <Plus className="size-5" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {/* Document Section */}
        <div className="rounded-lg overflow-hidden bg-indigo-800/30">
          <button
            onClick={() => setIsDocumentExpanded(!isDocumentExpanded)}
            className="w-full flex items-center justify-between p-3 hover:bg-indigo-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-indigo-300" />
              {!isCollapsed && <span>Documents</span>}
            </div>
            {!isCollapsed && (isDocumentExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />)}
          </button>
          {isDocumentExpanded && !isCollapsed && (
            <div className="px-3 pb-2 space-y-1">
              <div
                onClick={() => navigate("/library")}
                className="pl-8 py-2 text-sm text-indigo-200 hover:text-white cursor-pointer"
              >
                Guided Documents
              </div>
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div className="rounded-lg overflow-hidden bg-indigo-800/30">
          <button
            onClick={() => setIsFeedbackExpanded(!isFeedbackExpanded)}
            className="w-full flex items-center justify-between p-3 hover:bg-indigo-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="size-5 text-indigo-300" />
              {!isCollapsed && <span>Feedback</span>}
            </div>
            {!isCollapsed && (isFeedbackExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />)}
          </button>
          {isFeedbackExpanded && !isCollapsed && (
            <div className="px-3 pb-2 space-y-1">
              <div
                onClick={() => navigate("/feedback")}
                className="pl-8 py-2 text-sm text-indigo-200 hover:text-white cursor-pointer"
              >
                Send Feedback
              </div>
            </div>
          )}
        </div>

        {/* History section removed per request */}
      </div>

      {/* Profile Section */}
      <div className="border-t border-indigo-800/50">
        <button onClick={() => setIsProfileExpanded(!isProfileExpanded)} className="w-full flex items-center justify-between p-4 hover:bg-indigo-800/50 transition-colors">
          <div className="flex items-center gap-3">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="size-9 rounded-full object-cover" />
            ) : (
              <div className="size-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <User className="size-5 text-white" />
              </div>
            )}
            {!isCollapsed && <span>{name || "Profile"}</span>}
          </div>

          {!isCollapsed && (isProfileExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />)}
        </button>

        {isProfileExpanded && !isCollapsed && (
          <div className="px-3 pb-3 space-y-1 border-t border-indigo-800/30">
            <div onClick={() => navigate("/profile")} className="pl-12 py-2 text-sm text-indigo-200 hover:text-white cursor-pointer">
              Profile
            </div>
            <div onClick={logout} className="pl-12 py-2 text-sm text-indigo-200 hover:text-white cursor-pointer">
              Sign Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
