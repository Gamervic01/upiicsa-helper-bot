import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] p-4 rounded-2xl shadow-sm",
          isBot
            ? "bg-white text-gray-800 rounded-tl-none"
            : "bg-ipn-primary text-white rounded-tr-none"
        )}
      >
        <p className="text-sm md:text-base">{message}</p>
      </div>
    </div>
  );
};