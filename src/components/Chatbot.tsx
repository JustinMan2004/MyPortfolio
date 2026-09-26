import React, { useState } from 'react';
import { Bot, KeyRound, Send, UserRound } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const Chatbot: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || !apiKey.trim() || isSending) return;

    const nextMessages = [...messages, { role: 'user' as const, text }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, messages: nextMessages }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Er ging iets mis.');
      setMessages([...nextMessages, { role: 'model', text: data.text }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Er ging iets mis.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto space-y-5">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#A92222] text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">Portfolio-chatbot</h1>
            <p className="text-sm text-stone-600">Stel een vraag over mijn portfolio en projecten.</p>
          </div>
        </div>
      </div>

      <div className="bg-[#F7F1E8] border border-[#EADFCB] rounded-3xl p-5 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-stone-700" htmlFor="chatbot-api-key">
          Gemini API-key
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="chatbot-api-key"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Plak hier je API-key"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5CEC5] bg-[#FBF7F0] text-sm text-stone-900 focus:outline-none focus:border-[#A92222]"
            autoComplete="off"
          />
        </div>
        <p className="text-xs text-stone-500">Deze sleutel wordt niet opgeslagen en staat niet in de code.</p>
      </div>

      <div className="min-h-72 bg-[#F7F1E8] border border-[#EADFCB] rounded-3xl p-5 shadow-xs space-y-3">
        {messages.length === 0 && (
          <div className="h-56 flex flex-col items-center justify-center text-center text-stone-500 gap-2">
            <Bot className="w-8 h-8 text-[#A92222]/60" />
            <p className="text-sm">De chatbot wacht op je eerste vraag.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'model' && <Bot className="w-5 h-5 mt-2 text-[#A92222] shrink-0" />}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${message.role === 'user' ? 'bg-[#A92222] text-white' : 'bg-[#FBF7F0] text-stone-800 border border-[#EADFCB]'}`}>
              {message.text}
            </div>
            {message.role === 'user' && <UserRound className="w-5 h-5 mt-2 text-stone-500 shrink-0" />}
          </div>
        ))}
        {isSending && <p className="text-xs text-stone-500">De chatbot denkt na...</p>}
        {error && <p className="text-xs text-red-700">{error}</p>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Typ je vraag..."
          className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-[#D5CEC5] bg-[#FBF7F0] text-sm text-stone-900 focus:outline-none focus:border-[#A92222]"
        />
        <button
          type="submit"
          disabled={!apiKey.trim() || !input.trim() || isSending}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#A92222] text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8B1A1A] transition-colors"
        >
          <Send className="w-4 h-4" />
          Verstuur
        </button>
      </form>
    </section>
  );
};