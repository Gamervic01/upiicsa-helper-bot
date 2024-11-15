import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";

const SUGGESTED_QUESTIONS = [
  "¿Cuál es el horario de servicios escolares?",
  "¿Cómo inicio mi trámite de titulación?",
  "¿Dónde encuentro mi horario de clases?",
  "¿Cómo contacto a mi coordinador?",
];

interface Message {
  text: string;
  isBot: boolean;
}

const RESPUESTAS = {
  "¿Cuál es el horario de servicios escolares?": 
    "El horario de atención de servicios escolares es de lunes a viernes de 9:00 a 20:00 horas.",
  "¿Cómo inicio mi trámite de titulación?":
    "Para iniciar tu trámite de titulación debes acudir a la oficina de titulación con tu certificado de servicio social y kardex.",
  "¿Dónde encuentro mi horario de clases?":
    "Puedes consultar tu horario en el SAES (saes.upiicsa.ipn.mx) con tu usuario y contraseña.",
  "¿Cómo contacto a mi coordinador?":
    "Puedes encontrar los datos de contacto de tu coordinador en la página de tu departamento académico.",
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "¡Hola! Soy el asistente virtual de UPIICSA. ¿En qué puedo ayudarte?",
      isBot: true,
    },
  ]);

  const handleSendMessage = (text: string) => {
    setMessages((prev) => [...prev, { text, isBot: false }]);
    
    // Simular respuesta del bot
    setTimeout(() => {
      const respuesta = RESPUESTAS[text as keyof typeof RESPUESTAS] || 
        "Por el momento no tengo información sobre esa consulta. Te sugiero visitar www.upiicsa.ipn.mx para más detalles.";
      
      setMessages((prev) => [...prev, { text: respuesta, isBot: true }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-gray-50 rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-ipn-primary p-4">
        <h2 className="text-white text-lg font-semibold">Asistente Virtual UPIICSA</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.text} isBot={msg.isBot} />
        ))}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {SUGGESTED_QUESTIONS.map((question) => (
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