import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowLeft, Plus, Star, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchFeedback, submitFeedback, type FeedbackEntry } from "../api/feedback";
import { Sidebar } from "../components/chat/Sidebar";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [items, setItems] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchFeedback();
        setItems(data);
      } catch (err) {
        setError("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message is required");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      await submitFeedback({ message: message.trim(), rating, screenshot });
      const refreshed = await fetchFeedback();
      setItems(refreshed);
      setMessage("");
      setRating(0);
      setHoveredRating(0);
      setScreenshot(null);
    } catch (err) {
      setError("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebar} />

      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-lg bg-indigo-100/50 hover:bg-indigo-200/60 transition-all duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-indigo-900" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMessage("");
                setRating(0);
                setHoveredRating(0);
                setScreenshot(null);
              }}
              className="p-3 rounded-lg bg-indigo-100/50 hover:bg-indigo-200/60 transition-all duration-200"
              aria-label="Add new"
            >
              <Plus className="w-6 h-6 text-indigo-900" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-start gap-6 px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}

              <div className="flex justify-center">
                <div className="px-10 py-3 bg-indigo-100/70 rounded-xl">
                  <span className="text-indigo-950">Feedback</span>
                </div>
              </div>

              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="comment..."
                  rows={12}
                  className="w-full px-6 py-5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-950 placeholder:text-indigo-300 focus:outline-none focus:border-indigo-300 focus:bg-indigo-50 transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-3 px-10 py-4 bg-indigo-100/70 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform duration-200 hover:scale-110"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className="w-7 h-7"
                        fill={star <= (hoveredRating || rating) ? "#312e81" : "none"}
                        stroke="#312e81"
                      />
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-3 px-4 py-3 bg-indigo-100/70 rounded-xl cursor-pointer hover:bg-indigo-200/70 transition-colors">
                  <ImageIcon className="w-5 h-5 text-indigo-900" />
                  <span className="text-indigo-900 text-sm">
                    {screenshot ? screenshot.name : "Attach screenshot (optional)"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>

            <PastFeedback items={items} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

type PastFeedbackProps = {
  items: FeedbackEntry[];
  loading: boolean;
};

function PastFeedback({ items, loading }: PastFeedbackProps) {
  return (
    <div className="mt-10">
      <h3 className="text-indigo-900 font-medium mb-4">Your past feedback</h3>
      {loading ? (
        <p className="text-sm text-indigo-700">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-indigo-700">No feedback yet. Share your thoughts!</p>
      ) : (
        <div className="space-y-4">
          {items.map((fb) => (
            <div key={fb.id} className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-900">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={fb.rating && i <= fb.rating ? "#312e81" : "none"}
                      stroke="#312e81"
                    />
                  ))}
                </div>
                <span className="text-xs text-indigo-700">
                  {new Date(fb.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-indigo-900 whitespace-pre-wrap">{fb.message}</p>
              {fb.screenshot_url && (
                <a
                  href={fb.screenshot_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-900 text-sm mt-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  View screenshot
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
