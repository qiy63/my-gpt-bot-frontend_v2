import { Scale } from "lucide-react";

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

export function EmptyState({ onPromptClick }: EmptyStateProps) {
  const prompts = [
    "What are my rights as a tenant?",
    "How do I transfer property ownership?",
    "What should I know about lease agreements?",
    "Can you explain property tax implications?",
  ];

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="size-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <Scale className="size-8 text-indigo-600" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl text-slate-900">Let's chat! What's on your mind?</h1>
          <p className="text-slate-600">
            Choose from the prompts below or start asking queries. I'm here to help with
            whatever you need.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-500">Try these prompts:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onPromptClick(prompt)}
                className="px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all hover:shadow-sm"
              >
                <span className="text-sm text-slate-700">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
