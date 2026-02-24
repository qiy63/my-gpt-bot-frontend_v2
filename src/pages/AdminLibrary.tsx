import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash, Download, FileText, ListChecks, X, Loader2 } from "lucide-react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import {
  fetchDocuments,
  downloadDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  type DocumentCategory,
  type DocumentItem,
} from "../api/documents";

type FormState = {
  title: string;
  category_id: number | "";
  short_description: string;
  prerequisites: string;
  required_docs: string;
  placeholder_url: string;
  file: File | null;
};

export default function AdminLibrary() {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    category_id: "",
    short_description: "",
    prerequisites: "",
    required_docs: "",
    placeholder_url: "",
    file: null,
  });

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) || null,
    [categories, activeCategoryId]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDocuments();
        setCategories(data);
        if (data.length > 0) {
          setActiveCategoryId((prev) => prev ?? data[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load guided documents");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetForm = (defaults?: Partial<FormState>) =>
    setForm({
      title: "",
      category_id: activeCategoryId ?? "",
      short_description: "",
      prerequisites: "",
      required_docs: "",
      placeholder_url: "",
      file: null,
      ...defaults,
    });

  const openNewModal = () => {
    setEditingDoc(null);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (doc: DocumentItem) => {
    setEditingDoc(doc);
    resetForm({
      title: doc.title || "",
      category_id: doc.category_id,
      short_description: doc.short_description || "",
      prerequisites: doc.prerequisites || "",
      required_docs: doc.required_docs || "",
      placeholder_url: doc.placeholder_url || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category_id) {
      setError("Title and category are required");
      return;
    }
    setSaving(true);
    setError(null);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("category_id", String(form.category_id));
    fd.append("short_description", form.short_description);
    fd.append("prerequisites", form.prerequisites);
    fd.append("required_docs", form.required_docs);
    fd.append("placeholder_url", form.placeholder_url);
    if (form.file) fd.append("file", form.file);

    try {
      if (editingDoc) {
        await updateDocument(editingDoc.id, fd);
      } else {
        await createDocument(fd);
      }
      const data = await fetchDocuments();
      setCategories(data);
      setActiveCategoryId((prev) => prev ?? (data[0]?.id ?? null));
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doc: DocumentItem) => {
    const ok = window.confirm(`Delete "${doc.title}"?`);
    if (!ok) return;
    try {
      await deleteDocument(doc.id);
      const data = await fetchDocuments();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to delete document");
    }
  };

  const handleDownload = async (doc: DocumentItem) => {
    if (doc.placeholder_url) {
      window.open(doc.placeholder_url, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      const blob = await downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.title || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to download document");
    }
  };

  const renderDoc = (doc: DocumentItem) => (
    <div
      key={doc.id}
      className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-800">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-indigo-950 font-semibold">{doc.title}</h3>
            {doc.short_description && (
              <p className="text-sm text-indigo-700/80 mt-1">{doc.short_description}</p>
            )}
            <p className="text-xs text-indigo-600/70 mt-1">
              Source: {doc.file_url ? "Cloud file" : "Placeholder link"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleDownload(doc)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-100 text-indigo-900 text-sm hover:bg-indigo-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => openEditModal(doc)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-900 text-sm hover:border-indigo-400 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(doc)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 text-sm hover:bg-rose-100 transition-colors"
          >
            <Trash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <InfoList title="Prerequisites" items={toList(doc.prerequisites)} />
        <InfoList title="Required Documents" items={toList(doc.required_docs)} />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-indigo-950 font-semibold">Guided Document Library</p>
            <p className="text-sm text-indigo-700/80">
              Add, edit, or remove guided documents shown to users in Library.
            </p>
          </div>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {error && (
            <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-indigo-800">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </div>
          ) : categories.length === 0 ? (
            <p className="text-indigo-800">No categories found. Seed document_categories first.</p>
          ) : (
            <div className="space-y-6">
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-indigo-950 text-xl font-semibold">{activeCategory.name}</h2>
                      {activeCategory.description && (
                        <p className="text-indigo-800/80">{activeCategory.description}</p>
                      )}
                    </div>
                    <span className="text-sm text-indigo-700/80">
                      {activeCategory.documents.length} item(s)
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {activeCategory.documents.length === 0 ? (
                      <div className="bg-white/80 border border-indigo-100 rounded-xl p-4 text-indigo-800">
                        No documents in this category yet.
                      </div>
                    ) : (
                      activeCategory.documents.map(renderDoc)
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative">
            <button
              className="absolute top-4 right-4 text-indigo-900 hover:text-indigo-700"
              onClick={() => setModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-950">
                {editingDoc ? "Edit Document" : "Add Document"}
              </h3>
              <p className="text-sm text-indigo-700/80">Upload a file or provide an external placeholder link.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-indigo-900">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:border-indigo-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-indigo-900">Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm((p) => ({ ...p, category_id: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:border-indigo-400"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-indigo-900">Short description</label>
                  <textarea
                    value={form.short_description}
                    onChange={(e) => setForm((p) => ({ ...p, short_description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-indigo-900">Placeholder URL (optional)</label>
                  <input
                    value={form.placeholder_url}
                    onChange={(e) => setForm((p) => ({ ...p, placeholder_url: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:border-indigo-400"
                    placeholder="https://example.com/file.pdf"
                  />
                  <p className="text-xs text-indigo-600/70">
                    If set, download will open this link; upload is optional.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-indigo-900">Prerequisites (one per line)</label>
                  <textarea
                    value={form.prerequisites}
                    onChange={(e) => setForm((p) => ({ ...p, prerequisites: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-indigo-900">Required Documents (one per line)</label>
                  <textarea
                    value={form.required_docs}
                    onChange={(e) => setForm((p) => ({ ...p, required_docs: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-indigo-900">Upload file (PDF/DOC/DOCX, max 15MB)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      file: e.target.files && e.target.files[0] ? e.target.files[0] : null,
                    }))
                  }
                />
                {editingDoc?.file_url && !form.file && (
                  <p className="text-xs text-indigo-600/70">Keeping existing cloud file.</p>
                )}
                {form.file && (
                  <p className="text-xs text-indigo-600/70">
                    Selected: {form.file.name} ({(form.file.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-900 hover:bg-indigo-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingDoc ? "Save changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
