import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, ListChecks, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/chat/Sidebar";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";
import {
  fetchDocuments,
  downloadDocument,
  type DocumentCategory,
} from "../api/documents";

export default function DocumentPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDocuments();
        setCategories(data);
        if (data.length > 0) setActiveCategoryId(data[0].id);
      } catch (err) {
        console.error(err);
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) || null,
    [categories, activeCategoryId]
  );

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  const handleDownload = async (
    docId: number,
    title: string,
    placeholderUrl?: string | null
  ) => {
    if (placeholderUrl && placeholderUrl.length > 0) {
      window.open(placeholderUrl, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      const blob = await downloadDocument(docId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = title || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to download document");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebar} />

      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-lg bg-indigo-100/50 hover:bg-indigo-200/60 transition-all duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-indigo-900" />
          </button>
          <div>
            <p className="text-indigo-950 font-medium">Guided Documents</p>
            <p className="text-sm text-indigo-700/80">
              Choose a scenario to see the right forms, prerequisites, and required docs.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {error && (
            <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-indigo-800">Loading documents...</p>
          ) : categories.length === 0 ? (
            <p className="text-indigo-800">No documents available yet.</p>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                      activeCategoryId === cat.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white/80 text-indigo-900 border-indigo-200 hover:border-indigo-400"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {activeCategory && (
                <div className="space-y-4">
                  <h2 className="text-indigo-950 text-xl font-semibold">{activeCategory.name}</h2>
                  {activeCategory.description && (
                    <p className="text-indigo-800/80">{activeCategory.description}</p>
                  )}

                  <div className="grid gap-4">
                    {activeCategory.documents.length === 0 && (
                      <div className="bg-white/80 border border-indigo-100 rounded-xl p-4 text-indigo-800">
                        No documents in this category yet.
                      </div>
                    )}

                    {activeCategory.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white/80 border border-indigo-100 rounded-2xl p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-800">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-indigo-950 font-semibold">{doc.title}</h3>
                              {doc.short_description && (
                                <p className="text-sm text-indigo-700/80 mt-1">
                                  {doc.short_description}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDownload(doc.id, doc.title, doc.placeholder_url)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <InfoList title="Prerequisites" items={toList(doc.prerequisites)} />
                          <InfoList title="Required Documents" items={toList(doc.required_docs)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <LegalDisclaimer />
      </div>
    </div>
  );
}

type InfoListProps = {
  title: string;
  items: string[];
};

function InfoList({ title, items }: InfoListProps) {
  return (
    <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2 text-indigo-900">
        <ListChecks className="w-4 h-4" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-indigo-700/70">None listed</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-indigo-900 flex gap-2">
              <span className="mt-0.5 text-indigo-700">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function toList(value?: string | null) {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean);
}
