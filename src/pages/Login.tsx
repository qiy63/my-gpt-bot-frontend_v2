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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-black">
      <BackgroundBlobs />

      <div className="relative w-full max-w-6xl">
        <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">

          <div className="grid md:grid-cols-2 gap-0">
            <DecorativePanel />

            <div className="p-8 md:p-12">
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

              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8" />

              <form onSubmit={handleSubmit} className="space-y-6">
                {feedback && (
                  <p
                    className={`text-center text-sm ${
                      feedback.includes("success")
                        ? "text-emerald-200"
                        : "text-rose-200"
                    }`}
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
                    <label className="flex items-center gap-2 text-white/70 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-2 focus:ring-white/50"
                      />
                      <span className="group-hover:text-white transition-colors">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-white/70 hover:text-white transition-colors"
                      onClick={() => setFeedback("Password recovery is coming soon.")}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/50 border border-white/20 disabled:opacity-60"
                >
                  {loading ? "Please wait..." : "Continue"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                  {activeTab === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setActiveTab(activeTab === "login" ? "register" : "login");
                    }}
                    className="text-white hover:underline transition-all"
                  >
                    {activeTab === "login" ? "Register" : "Login"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
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
      <label className="block text-white/80 mb-2 text-sm">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/70 transition-colors" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
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
          ? "bg-white/20 text-white border border-white/30 shadow-lg"
          : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}

function DecorativePanel() {
  return (
    <div className="hidden md:flex items-center justify-center p-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl relative">
      <CrossPattern />
      <div className="relative z-10 text-center">
        <h1 className="text-4xl text-white mb-4">Property Legal AI</h1>
        <p className="text-white/80 text-lg">
          Your trusted advisor for property law
        </p>
      </div>
    </div>
  );
}

function CrossPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-70">
        <svg
          viewBox="0 0 400 400"
          className="w-80 h-80 text-white/40"
          stroke="currentColor"
        >
          <line
            x1="200"
            y1="0"
            x2="200"
            y2="400"
            strokeWidth="0.7"
            transform="rotate(62 200 200)"
          />
          <line
            x1="200"
            y1="0"
            x2="200"
            y2="400"
            strokeWidth="0.7"
            transform="rotate(-62 200 200)"
          />
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-80 h-80">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full blur-sm" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full blur-sm" />
          <span className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-sm" />
          <span className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-sm" />
        </div>
        </div>
    </div>
  );
}
