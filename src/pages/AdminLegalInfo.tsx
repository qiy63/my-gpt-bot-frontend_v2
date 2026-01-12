import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Download, Edit3, Plus, Trash2, Upload, X } from "lucide-react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import {
  fetchLegalInfo,
  createLegalInfo,
  updateLegalInfo,
  deleteLegalInfo,
  downloadLegalInfo,
  reindexLegalInfo,
  type LegalInfoItem,
} from "../api/legalInfo";

type FormState = {
  id?: number;
  title: string;
  category: string;
  short_description: string;
  tags: string;
  status: "active" | "archived";
  file?: File | null;
};

const emptyForm: FormState = {
  title: "",
  category: "",
  short_description: "",
  tags: "",
  status: "active",
  file: null,
};

export default function AdminLegalInfoPage() {
  const [items, setItems] = useState<LegalInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  const [reindexing, setReindexing] = useState(false);
  const [reindexMessage, setReindexMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLegalInfo();
        setItems(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load legal info");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => (i.status || "active") === filter);
  }, [items, filter]);

  const openNew = () => {
    setFormState(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (item: LegalInfoItem) => {
    setFormState({
      id: item.id,
      title: item.title || "",
      category: item.category || "",
      short_description: item.short_description || "",
      tags: item.tags || "",
      status: (item.status as "active" | "archived") || "active",
      file: null,
    });
    setFormOpen(true);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormState((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.category.trim()) {
      setError("Title and category are required");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      if (formState.id) {
        await updateLegalInfo(formState.id, {
          title: formState.title,
          category: formState.category,
          short_description: formState.short_description,
          tags: formState.tags,
          status: formState.status,
          file: formState.file ?? undefined,
        });
      } else {
        if (!formState.file) throw new Error("File is required");
        await createLegalInfo({
          title: formState.title,
          category: formState.category,
          short_description: formState.short_description,
          tags: formState.tags,
          status: formState.status,
          file: formState.file,
        });
      }

      const refreshed = await fetchLegalInfo();
      setItems(refreshed);
      setFormOpen(false);
      setFormState(emptyForm);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await deleteLegalInfo(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  const handleDownload = async (id: number, title: string) => {
    try {
      const blob = await downloadLegalInfo(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = title || "legal_info";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Download failed");
    }
  };

  const handleReindex = async () => {
    setReindexing(true);
    setReindexMessage(null);
    try {
      const result = await reindexLegalInfo();
      const failed = result.filter((r) => r.status !== "ok");
      if (failed.length) {
        setReindexMessage(`Completed with ${failed.length} errors. First: ${failed[0].message || "Unknown error"}`);
      } else {
        setReindexMessage("Embeddings rebuilt successfully.");
      }
    } catch (err: any) {
      console.error(err);
      setReindexMessage(err.response?.data?.error || err.message || "Reindex failed");
    } finally {
      setReindexing(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-indigo-100 bg-white/80 backdrop-blur-sm">
          <div>
            <h2 className="text-indigo-950 text-xl font-semibold">Legal Info Library</h2>
            <p className="text-sm text-indigo-700/80">
              Manage AI reference documents with metadata
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReindex}
              disabled={reindexing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 text-indigo-900 bg-white hover:bg-indigo-50 transition-colors disabled:opacity-60"
            >
              {reindexing ? "Rebuilding..." : "Rebuild Embeddings"}
            </button>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {reindexMessage && (
            <div className="mb-4 text-sm text-indigo-900 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2">
              {reindexMessage}
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-indigo-900">Status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-indigo-200 bg-white text-indigo-900"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {loading ? (
            <p className="text-indigo-800">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-indigo-800">No entries.</p>
          ) : (
            <div className="grid gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-indigo-950 font-semibold">{item.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {item.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            (item.status || "active") === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-slate-50 text-slate-700 border-slate-100"
                          }`}
                        >
                          {item.status || "active"}
                        </span>
                      </div>
                      {item.short_description && (
                        <p className="text-sm text-indigo-700/80 mt-1">{item.short_description}</p>
                      )}
                      {item.tags && (
                        <p className="text-xs text-indigo-600/70 mt-1">Tags: {item.tags}</p>
                      )}
                      <p className="text-xs text-indigo-500 mt-1">
                        Updated: {item.updated_at ? new Date(item.updated_at).toLocaleString() : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(item.id, item.title)}
                        className="p-2 rounded-lg bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors"
                        aria-label="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 rounded-lg bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors"
                        aria-label="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 w-full max-w-2xl relative">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-3 right-3 p-2 text-indigo-700 hover:text-indigo-900"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-indigo-950 text-lg font-semibold mb-2">
                {formState.id ? "Edit Legal Info" : "New Legal Info"}
              </h3>
              <p className="text-sm text-indigo-700/80 mb-4">
                Upload AI reference documents with metadata.
              </p>

              {error && (
                <div className="mb-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-indigo-900 mb-1">Title</label>
                    <input
                      name="title"
                      value={formState.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-indigo-900 mb-1">Category</label>
                    <input
                      name="category"
                      value={formState.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-indigo-900 mb-1">Short Description</label>
                  <textarea
                    name="short_description"
                    value={formState.short_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-indigo-900 mb-1">Tags</label>
                    <input
                      name="tags"
                      value={formState.tags}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                      placeholder="e.g., tenancy, strata"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-indigo-900 mb-1">Status</label>
                    <select
                      name="status"
                      value={formState.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="block text-sm text-indigo-900">File (PDF/DOC/DOCX/TXT, max 15MB)</label>
                  <label className="flex items-center gap-2 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors">
                    <Upload className="w-4 h-4 text-indigo-800" />
                    <span className="text-sm text-indigo-900">
                      {formState.file
                        ? formState.file.name
                        : formState.id
                        ? "Replace file (optional)"
                        : "Choose file"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={handleFileChange}
                      required={!formState.id}
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-900 hover:bg-indigo-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : formState.id ? "Save Changes" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
