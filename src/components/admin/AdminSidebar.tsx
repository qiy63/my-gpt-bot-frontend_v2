import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  ChevronDown,
  ChevronRight,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, name } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState<"documents" | "feedback" | null>(null);

  const go = (path: string) => navigate(path);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const toggleSection = (section: "documents" | "feedback") => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div
      className={`bg-gradient-to-b from-indigo-950 to-indigo-900 text-white transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed ? "w-16" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-indigo-800/50">
        {!isCollapsed && <h1 className="tracking-tight">Admin</h1>}
        <button
          onClick={() => setIsCollapsed((p) => !p)}
          className="p-2 hover:bg-indigo-800/50 rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        <NavItem
          label="Dashboard"
          icon={<LayoutDashboard className="size-5" />}
          active={isActive("/admin")}
          onClick={() => go("/admin")}
          collapsed={isCollapsed}
        />

        <Section
          label="Documents"
          icon={<FileText className="size-5 text-indigo-300" />}
          open={openSection === "documents"}
          onToggle={() => toggleSection("documents")}
          collapsed={isCollapsed}
          items={[
            { label: "Guided Library", onClick: () => go("/documents") },
            { label: "Upload / Manage", onClick: () => go("/documents") },
          ]}
        />

        <Section
          label="Feedback"
          icon={<MessageSquare className="size-5 text-indigo-300" />}
          open={openSection === "feedback"}
          onToggle={() => toggleSection("feedback")}
          collapsed={isCollapsed}
          items={[
            { label: "User Feedback", onClick: () => go("/feedback") },
            { label: "Admin Review", onClick: () => go("/admin/feedback") },
          ]}
        />

        <NavItem
          label="Users"
          icon={<Users className="size-5" />}
          active={isActive("/admin/users")}
          onClick={() => go("/admin/users")}
          collapsed={isCollapsed}
        />
      </div>

      <div className="border-t border-indigo-800/50 p-4 text-sm text-indigo-100 flex items-center justify-between">
        {!isCollapsed && <span>{name || "Admin"}</span>}
        <button
          onClick={logout}
          className="text-indigo-200 hover:text-white text-xs underline-offset-2 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

type NavItemProps = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  collapsed: boolean;
};

function NavItem({ label, icon, active, onClick, collapsed }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
        active ? "bg-indigo-700 text-white" : "hover:bg-indigo-800/50 text-indigo-100"
      }`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

type SectionProps = {
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  collapsed: boolean;
  items: { label: string; onClick: () => void }[];
};

function Section({ label, icon, open, onToggle, collapsed, items }: SectionProps) {
  return (
    <div className="rounded-lg overflow-hidden bg-indigo-800/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-indigo-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          {!collapsed && <span>{label}</span>}
        </div>
        {!collapsed && (open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />)}
      </button>
      {open && !collapsed && (
        <div className="px-3 pb-2 space-y-1">
          {items.map((item) => (
            <div
              key={item.label}
              onClick={item.onClick}
              className="pl-8 py-2 text-sm text-indigo-200 hover:text-white cursor-pointer"
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
