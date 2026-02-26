import { X, Plus } from "lucide-react";

type TabItem = {
  id: number;
  title?: string | null;
};

interface ChatTabsProps {
  tabs: TabItem[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
  onClose?: (id: number) => void;
}

export function ChatTabs({ tabs, activeId, onSelect, onNew, onClose }: ChatTabsProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-indigo-100 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
        <div
          key={tab.id}
          className={`
              flex items-center gap-2 px-5 py-3 lg:px-4 lg:py-2 rounded-t-lg cursor-pointer group
              ${isActive ? "bg-indigo-100 border-t border-x border-indigo-200" : "bg-transparent hover:bg-slate-50"}
            `}
          onClick={() => onSelect(tab.id)}
        >
          <span
            className={`text-base lg:text-sm max-w-[200px] truncate ${
              isActive ? "text-indigo-950" : "text-slate-700"
            }`}
          >
            {tab.title || "New Chat"}
          </span>
            {onClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-indigo-200 rounded p-0.5 transition-all"
                aria-label="Close tab"
              >
                <X className={`size-3 ${isActive ? "text-indigo-600" : "text-slate-500"}`} />
              </button>
            )}
          </div>
        );
      })}

      <button
        onClick={onNew}
        className="p-2 hover:bg-indigo-50 rounded-lg transition-colors ml-1"
        aria-label="New tab"
      >
        <Plus className="size-4 text-indigo-600" />
      </button>
    </div>
  );
}
