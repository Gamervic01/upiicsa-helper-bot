import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";

const SUGGESTED_QUESTIONS = [
  "¿Cuál es el horario de servicios escolares?",
  "¿Cómo inicio mi trámite de titulación?",
  "¿Dónde encuentro mi horario de clases?",
  "¿Cómo contacto a mi coordinador?",
  "¿Cuál es el proceso de reinscripción?",
  "¿Dónde encuentro mi boleta?",
];

interface Message {
  text: string;
  isBot: boolean;
}

const RESPUESTAS = {
  "¿Cuál es el horario de servicios escolares?": 
    "El horario de atención de servicios escolares es de lunes a viernes de 9:00 a 20:00 horas.",
  "¿Cómo inicio mi trámite de titulación?":
    "Para iniciar tu trámite de titulación debes acudir a la oficina de titulación con tu certificado de servicio social y kardex. El proceso completo lo puedes consultar en: www.upiicsa.ipn.mx/estudiantes/titulacion.html",
  "¿Dónde encuentro mi horario de clases?":
    "Puedes consultar tu horario en el SAES (saes.upiicsa.ipn.mx) con tu usuario y contraseña en la sección 'Horario'.",
  "¿Cómo contacto a mi coordinador?":
    "Puedes encontrar los datos de contacto de tu coordinador en la página de tu departamento académico o acudir directamente a las oficinas de tu coordinación.",
  "¿Cuál es el proceso de reinscripción?":
    "El proceso de reinscripción se realiza a través del SAES. Debes estar al pendiente de las fechas publicadas en el calendario académico.",
  "¿Dónde encuentro mi boleta?":
    "Puedes consultar tu boleta en el SAES (saes.upiicsa.ipn.mx) en la sección 'Calificaciones' con tu usuario y contraseña.",
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "¡Hola! Soy el asistente virtual de UPIICSA. ¿En qué puedo ayudarte hoy?",
      isBot: true,
    },
  ]);

  const handleSendMessage = (text: string) => {
    setMessages((prev) => [...prev, { text, isBot: false }]);
    
    setTimeout(() => {
      const respuesta = RESPUESTAS[text as keyof typeof RESPUESTAS] || 
        "Por el momento no tengo información sobre esa consulta. Te sugiero visitar www.upiicsa.ipn.mx para más detalles o contactar directamente a servicios escolares.";
      
      setMessages((prev) => [...prev, { text: respuesta, isBot: true }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-ipn-primary to-ipn-light p-4">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Asistente Virtual UPIICSA
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.text} isBot={msg.isBot} />
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
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