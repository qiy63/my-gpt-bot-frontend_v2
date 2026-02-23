import { useNavigate } from "react-router-dom";
import { ShieldCheck, Scale, FileText, Sparkles } from "lucide-react";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full bg-white/70" />
          <div>
            <p className="text-indigo-950 font-semibold text-lg">Property Legal AI</p>
            <p className="text-indigo-700/70 text-xs">Property guidance, simplified</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-indigo-700 hover:text-indigo-900"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
              <Sparkles className="w-4 h-4" />
              AI-powered property guidance
            </div>
            <h1 className="text-4xl md:text-5xl text-indigo-950 font-semibold leading-tight">
              Resolve property questions with clarity, speed, and confidence.
            </h1>
            <p className="text-indigo-700/80 text-lg">
              Ask property law questions, access guided documents, and keep your legal profile
              organized in one secure workspace.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20"
              >
                Start chatting
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-white border border-indigo-200 text-indigo-700 rounded-xl hover:border-indigo-400"
              >
                Create account
              </button>
            </div>
          </div>

          <div className="bg-white/80 border border-indigo-100 rounded-3xl p-6 shadow-sm space-y-5">
            <Feature icon={<Scale className="w-5 h-5 text-indigo-600" />} title="Legal guidance">
              Get structured answers and next steps for common property issues.
            </Feature>
            <Feature icon={<FileText className="w-5 h-5 text-indigo-600" />} title="Guided documents">
              Find the right forms and requirements based on your scenario.
            </Feature>
            <Feature icon={<ShieldCheck className="w-5 h-5 text-indigo-600" />} title="Secure profile">
              Keep key details in one place to speed up your legal workflows.
            </Feature>
          </div>
        </div>
      </main>

      <footer>
        <LegalDisclaimer />
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-indigo-100 rounded-xl">{icon}</div>
      <div>
        <p className="text-indigo-950 font-medium">{title}</p>
        <p className="text-sm text-indigo-700/80">{children}</p>
      </div>
    </div>
  );
}
