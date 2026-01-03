import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
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
  Clock
} from 'lucide-react';
import { fetchFeedback, type FeedbackEntry } from "../../api/feedback";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, name, profilePicture } = useAuth();
  const isFeedbackPage = location.pathname.includes("feedback");
  const isDocumentPage = location.pathname.includes("library");

  const [isDocumentExpanded, setIsDocumentExpanded] = useState(false);
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackEntry[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const chatHistory = [
    { id: 1, title: 'Property Transfer Query', time: '2h ago' },
    { id: 2, title: 'Lease Agreement Review', time: '5h ago' },
    { id: 3, title: 'Zoning Regulations', time: '1d ago' },
  ];

  useEffect(() => {
    if (!isFeedbackPage) return;
    const loadFeedback = async () => {
      try {
        setFeedbackLoading(true);
        const data = await fetchFeedback();
        setFeedbackItems(data);
      } catch {
        setFeedbackItems([]);
      } finally {
        setFeedbackLoading(false);
      }
    };
    loadFeedback();
  }, [isFeedbackPage]);

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
        <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30">
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
              <div
                onClick={() => navigate("/admin/legal-info")}
                className="pl-8 py-2 text-sm text-indigo-200 hover:text-white cursor-pointer"
              >
                Upload / Manage (admin)
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
              <div
                onClick={() => navigate("/feedback")}
                className="pl-8 py-2 text-sm text-indigo-200 hover:text-white cursor-pointer"
              >
                Report Issue
              </div>
            </div>
          )}
        </div>

        {/* Chat History or Feedback History */}
        {!isCollapsed && (
          <div className="pt-4">
            <div className="flex items-center gap-2 px-3 pb-2 opacity-60">
              <Clock className="size-4" />
              <span className="text-sm">
                {isFeedbackPage ? "Past Feedback" : "Recent Chats"}
              </span>
            </div>
            <div className="space-y-1">
              {isFeedbackPage ? (
                feedbackLoading ? (
                  <div className="px-3 py-2 text-sm text-indigo-200">Loading...</div>
                ) : feedbackItems.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-indigo-200">No feedback yet.</div>
                ) : (
                  feedbackItems.map((fb) => (
                    <div
                      key={fb.id}
                      className="w-full text-left px-3 py-2.5 rounded-lg bg-indigo-800/30 hover:bg-indigo-800/50 transition-colors"
                    >
                      <div className="truncate text-sm text-indigo-50">
                        {fb.message}
                      </div>
                      <div className="text-xs text-indigo-300 opacity-70">
                        {new Date(fb.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )
              ) : (
                chatHistory.map(chat => (
                  <button key={chat.id} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-indigo-800/50 transition-colors group">
                    <div className="truncate text-sm">{chat.title}</div>
                    <div className="text-xs text-indigo-300 opacity-60 group-hover:opacity-100 transition-opacity">{chat.time}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
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
              Settings
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
