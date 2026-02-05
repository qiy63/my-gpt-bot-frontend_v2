import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white px-6 py-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Something"
            className="w-full px-6 py-3 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none bg-slate-50 text-slate-700 placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="size-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
