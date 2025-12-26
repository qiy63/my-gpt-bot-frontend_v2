import { useEffect, useMemo, useState } from "react";
import {
  Users,
  FileText,
  MessageSquare,
  Activity,
  ChevronRight,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import {
  fetchLoginMetrics,
  fetchAdminFeedback,
  type AdminFeedback,
  type LoginMetricPoint,
} from "../api/admin";
import { fetchDocuments } from "../api/documents";

export default function AdminPage() {
  const [metrics, setMetrics] = useState<{ total: number; daily: LoginMetricPoint[] }>({
    total: 0,
    daily: [],
  });
  const [feedback, setFeedback] = useState<AdminFeedback[]>([]);
  const [documentCount, setDocumentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [m, fb, docs] = await Promise.all([
          fetchLoginMetrics(),
          fetchAdminFeedback(),
          fetchDocuments(),
        ]);
        setMetrics({ total: m.total || 0, daily: m.daily || [] });
        setFeedback(fb);
        const docTotal = docs.reduce((sum, cat) => sum + (cat.documents?.length || 0), 0);
        setDocumentCount(docTotal);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = useMemo(() => {
    if (!metrics.daily.length) return [];
    return metrics.daily.map((d) => ({
      date: new Date(d.day).toLocaleDateString(),
      users: d.count,
      raw: d.day,
    }));
  }, [metrics]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 px-8 py-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {error && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Logins"
                subtitle="Tracked sign-ins"
                value={metrics.total.toString()}
                icon={<Users className="w-6 h-6 text-indigo-600" />}
                pill={<TrendingUp className="w-5 h-5 text-green-500" />}
              />

              <StatCard
                title="Documents"
                subtitle="In guided library"
                value={`${documentCount}`}
                icon={<FileText className="w-6 h-6 text-indigo-600" />}
                pill={<span className="text-xs text-indigo-600/70">All</span>}
              />

              <StatCard
                title="Feedback"
                subtitle="Total submissions"
                value={`${feedback.length}`}
                icon={<MessageSquare className="w-6 h-6 text-indigo-600" />}
                pill={<span className="text-xs text-amber-600">New {Math.max(feedback.length, 0)}</span>}
              />

              <StatCard
                title="Active"
                subtitle="Realtime sessions"
                value="—"
                icon={<Activity className="w-6 h-6 text-indigo-600" />}
                pill={<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
              />
            </div>

            {/* Login Activity (line chart) */}
            <div className="bg-white border border-indigo-100 rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-indigo-950 mb-1">Login Activity</h3>
                  <p className="text-sm text-indigo-600/70">Daily logins over time</p>
                </div>
                <div className="text-right">
                  <h3 className="text-indigo-950">{metrics.total}</h3>
                  <p className="text-sm text-indigo-600/70">Total logins</p>
                </div>
              </div>
              {chartData.length === 0 ? (
                <p className="text-sm text-indigo-700">No login activity yet.</p>
              ) : (
                <div className="w-full" style={{ minHeight: "220px", height: "240px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis dataKey="date" stroke="#6366f1" />
                      <YAxis stroke="#6366f1" allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e0e7ff",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        dot={{ fill: "#4f46e5", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Recent Feedback Table */}
            <div className="bg-white border border-indigo-100 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-indigo-950 mb-1">Recent Feedback</h3>
                  <p className="text-sm text-indigo-600/70">Latest user reviews and ratings</p>
                </div>
                <button className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {feedback.slice(0, 5).map((fb) => (
                  <div
                    key={fb.id}
                    className="flex items-center justify-between p-4 bg-indigo-50/30 hover:bg-indigo-50/50 rounded-xl transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-indigo-950">{fb.user_name || "User"}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                fb.rating && i < fb.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-indigo-600/70 truncate">{fb.message}</p>
                    </div>
                    <span className="text-xs text-indigo-600/50 ml-4">
                      {new Date(fb.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
                {feedback.length === 0 && (
                  <p className="text-sm text-indigo-700">No feedback available.</p>
                )}
              </div>
            </div>

            {/* Management Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
              <ActionCard
                title="User Management"
                subtitle="Manage user accounts and permissions"
                countLabel={`${metrics.total} logins`}
                icon={<Users className="w-8 h-8" />}
              />

              <ActionCard
                title="Document Management"
                subtitle="View and manage uploaded documents"
                countLabel={`${documentCount} docs`}
                icon={<FileText className="w-8 h-8" />}
              />

              <ActionCard
                title="Feedback Management"
                subtitle="Review and respond to user feedback"
                countLabel={`${feedback.length} total`}
                icon={<MessageSquare className="w-8 h-8" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  subtitle: string;
  value: string;
  icon: React.ReactNode;
  pill?: React.ReactNode;
};

function StatCard({ title, subtitle, value, icon, pill }: StatCardProps) {
  return (
    <div className="bg-white border border-indigo-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-indigo-100 rounded-xl">{icon}</div>
        {pill}
      </div>
      <h3 className="text-indigo-950 mb-1">{title}</h3>
      <p className="text-indigo-600/70 text-sm">{subtitle}</p>
      <p className="text-2xl text-indigo-950 mt-2">{value}</p>
    </div>
  );
}

type ActionCardProps = {
  title: string;
  subtitle: string;
  countLabel: string;
  icon: React.ReactNode;
};

function ActionCard({ title, subtitle, countLabel, icon }: ActionCardProps) {
  return (
    <button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl p-8 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 text-left">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-sm bg-white/20 px-3 py-1 rounded-lg">{countLabel}</span>
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-sm text-indigo-100">{subtitle}</p>
      <div className="mt-3 inline-flex items-center gap-1 text-sm text-white/80">
        <span>View</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );
}
