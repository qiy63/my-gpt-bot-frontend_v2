import { useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Lock, User } from "lucide-react";
import { loginApi, registerApi } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type AuthResponse = {
  token: string;
  userId?: number;
  name?: string;
  profilePicture?: string;
  role?: string;
  user?: {
    id: number;
    name?: string;
    profilePicture?: string;
    role?: string;
  };
};

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      if (activeTab === "login") {
        const data = (await loginApi(email.trim(), password)) as AuthResponse;
        const resolvedUserId = data.userId ?? data.user?.id;

        if (!resolvedUserId) {
          throw new Error("Missing user id in login response");
        }

        const resolvedName = data.user?.name ?? data.name;
        const resolvedProfile = data.user?.profilePicture ?? data.profilePicture;
        const resolvedRole = (data.role ?? data.user?.role ?? "user").toLowerCase();

        login(data.token, resolvedUserId, resolvedName, resolvedProfile, resolvedRole);
        navigate(resolvedRole === "admin" ? "/admin" : "/chat");
      } else {
        await registerApi(name.trim(), email.trim(), password);
        setFeedback("Registration successful! Please sign in.");
        setActiveTab("login");
        setName("");
      }
    } catch (err: any) {
      const apiError =
        err.response?.data?.error || err.message || "Authentication failed";
      setFeedback(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-indigo-950 text-2xl font-semibold">
                {activeTab === "login" ? "Welcome back" : "Create your account"}
              </p>
              <p className="text-indigo-700/80 text-sm">
                {activeTab === "login"
                  ? "Sign in to continue your property legal journey."
                  : "Join Property Legal AI to get tailored guidance."}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <TabButton
              isActive={activeTab === "login"}
              label="Login"
              onClick={() => {
                setFeedback(null);
                setActiveTab("login");
              }}
            />
            <TabButton
              isActive={activeTab === "register"}
              label="Register"
              onClick={() => {
                setFeedback(null);
                setActiveTab("register");
              }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {feedback && (
              <p
                className={`text-center text-sm ${
                  feedback.includes("success")
                    ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
                    : "text-rose-700 bg-rose-50 border border-rose-100"
                } rounded-lg px-4 py-2`}
              >
                {feedback}
              </p>
            )}

            {activeTab === "register" && (
              <FloatingInput
                icon={User}
                label="Name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <FloatingInput
              icon={Mail}
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FloatingInput
              icon={Lock}
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {activeTab === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-indigo-700 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-indigo-300 bg-white text-indigo-600 focus:ring-2 focus:ring-indigo-200"
                  />
                  <span className="group-hover:text-indigo-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-indigo-700 hover:text-indigo-900 transition-colors"
                  onClick={() => setFeedback("Password recovery is coming soon.")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60"
            >
              {loading ? "Please wait..." : activeTab === "login" ? "Login" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-indigo-700/70 text-sm">
              {activeTab === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setFeedback(null);
                  setActiveTab(activeTab === "login" ? "register" : "login");
                }}
                className="text-indigo-900 font-medium hover:underline transition-all"
              >
                {activeTab === "login" ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-lg">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full bg-white/20" />
              <h1 className="text-3xl font-semibold">Property Legal AI</h1>
            </div>
            <p className="text-white/80">
              Your trusted advisor for property law. Ask questions, get guided
              documents, and manage your legal profile in one place.
            </p>
            <div className="mt-6 text-xs text-white/70 bg-white/10 rounded-xl p-3">
              This platform provides general legal information and is not a replacement for a qualified lawyer.
            </div>
          </div>

          <div className="space-y-4 text-sm text-white/80">
            <div className="bg-white/10 rounded-2xl p-4">
              “Clear, fast answers to tenancy and property transfer questions.”
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              “Guided documents save hours of admin work.”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FloatingInputProps = {
  icon: typeof Mail;
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function FloatingInput({
  icon: Icon,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required,
}: FloatingInputProps) {
  return (
    <div className="group">
      <label className="block text-indigo-900/80 mb-2 text-sm">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-12 pr-4 py-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-950 placeholder:text-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-indigo-50 transition-all duration-200"
        />
      </div>
    </div>
  );
}

type TabButtonProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

function TabButton({ isActive, label, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-indigo-600 text-white shadow-md"
          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
      }`}
    >
      {label}
    </button>
  );
}
