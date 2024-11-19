import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { shuffle } from "lodash";
import { TODAS_LAS_PREGUNTAS } from "../data/chatData";
import { procesarRespuesta } from "../utils/messageProcessor";

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "¡Hola! Soy el asistente virtual de UPIICSA. ¿En qué puedo ayudarte hoy?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [userName, setUserName] = useState<string>("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    actualizarPreguntasSugeridas();
  }, [messages]); // Actualizar sugerencias basadas en el contexto de la conversación

  const actualizarPreguntasSugeridas = () => {
    const todasLasPreguntas = Object.keys(TODAS_LAS_PREGUNTAS);
    const preguntasAleatorias = shuffle(todasLasPreguntas).slice(0, 6);
    setSuggestedQuestions(preguntasAleatorias);
  };

  const handleSendMessage = (text: string) => {
    const newUserMessage = {
      text,
      isBot: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);
    
    // Simular tiempo de "pensamiento" natural
    const thinkingTime = Math.random() * 1000 + 500; // Entre 500ms y 1500ms
    
    setTimeout(() => {
      const respuesta = procesarRespuesta(text, setUserName, messages);
      const newBotMessage = {
        text: respuesta,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
      actualizarPreguntasSugeridas();
    }, thinkingTime);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-ipn-primary to-ipn-light p-4">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <img src="/lovable-uploads/f5d0b981-f909-4467-b448-4489a5c728e2.png" alt="UPIICSA Logo" className="h-6 w-6" />
          Asistente Virtual UPIICSA
          {userName && <span className="text-sm ml-2">| Hablando con {userName}</span>}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.text} isBot={msg.isBot} />
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {suggestedQuestions.map((question) => (
            <SuggestedQuestions
              key={question}
              question={question}
              onClick={handleSendMessage}
            />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};