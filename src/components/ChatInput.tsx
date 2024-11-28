import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu pregunta aquí..."
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-ipn-primary/20 
                   transition-all duration-300"
      />
      <button
        type="submit"
        className="p-3 rounded-xl bg-ipn-primary text-white hover:bg-ipn-secondary 
                   transition-all duration-300 disabled:opacity-50"
        disabled={!message.trim()}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};