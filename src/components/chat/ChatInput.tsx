import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="border-t border-indigo-100 bg-white/80 backdrop-blur-sm px-6 py-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-center gap-3">
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about property law..."
              className="w-full px-6 py-4 rounded-2xl border border-indigo-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all bg-white/90"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:shadow-none"
            aria-label="Send message"
          >
            <Send className="size-5" />
          </button>
        </div>
        
        <p className="text-xs text-indigo-600/50 text-center mt-3">
          This AI provides general legal information. Always consult with a qualified attorney for specific legal advice.
        </p>
      </form>
    </div>
  );
}
