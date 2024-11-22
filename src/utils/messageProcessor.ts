import { TextProcessor } from "../services/nlp/textProcessor";

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const prepareTextForSpeech = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const textWithoutUrls = text.replace(urlRegex, 'Te invito a revisar el enlace que te comparto.');
  
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]/gu;
  const textWithoutEmojis = textWithoutUrls.replace(emojiRegex, '');
  
  return textWithoutEmojis;
};

export const procesarRespuesta = async (pregunta: string, setUserName: (name: string) => void, messages: Message[]): Promise<string> => {
  const preguntaLower = pregunta.toLowerCase().trim();
  
  // Detectar presentaciones y nombres
  if (preguntaLower.includes('me llamo') || preguntaLower.includes('mi nombre es')) {
    const nombreMatch = pregunta.match(/(?:me llamo|mi nombre es)\s+(\w+)/i);
    if (nombreMatch && nombreMatch[1]) {
      setUserName(nombreMatch[1]);
      return `¡Qué gusto conocerte, ${nombreMatch[1]}! ¿Cómo te puedo ayudar hoy? 😊`;
    }
  }

  // Detectar saludos simples
  if (/^(hola|hi|hey|buenos dias|buenas tardes|buenas noches)$/i.test(preguntaLower)) {
    return "¡Hola! Soy el asistente virtual de UPIICSA. ¿En qué puedo ayudarte hoy? 😊";
  }

  try {
    const response = await TextProcessor.processQuestion(pregunta);
    return response;
  } catch (error) {
    console.error('Error getting response:', error);
    return "Lo siento, ha ocurrido un error al procesar tu pregunta. ¿Podrías intentarlo de nuevo?";
  }
};

export { prepareTextForSpeech };