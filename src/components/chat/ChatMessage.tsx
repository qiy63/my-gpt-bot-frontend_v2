import { Bot, User } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
          <Bot className="size-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-3xl ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-2xl px-5 py-4 ${
            isUser
              ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-white border border-indigo-100 text-slate-800 shadow-sm'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>

      {isUser && (
        <div className="size-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-500/20">
          <User className="size-5 text-white" />
        </div>
      )}
    </div>
  );
}
