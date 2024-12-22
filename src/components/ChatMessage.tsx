import { cn } from "@/lib/utils";
import { Snake } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in opacity-0",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-ipn-primary/10 flex items-center justify-center mr-2 transition-colors duration-300">
          <Snake className="h-5 w-5 text-ipn-primary transition-colors duration-300" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] p-4 rounded-2xl shadow-sm transition-all duration-300",
          isBot
            ? "bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-tl-none"
            : "bg-gradient-to-r from-ipn-primary to-ipn-light text-white rounded-tr-none"
        )}
      >
        <p 
          className="text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </div>
  );
};