import { TODAS_LAS_PREGUNTAS } from "../data/chatData";
import stringSimilarity from 'string-similarity';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
};

const findBestMatch = (userInput: string, possibleMatches: string[]): string | null => {
  const normalizedInput = normalizeText(userInput);
  const normalizedMatches = possibleMatches.map(normalizeText);
  
  const matches = stringSimilarity.findBestMatch(normalizedInput, normalizedMatches);
  
  if (matches.bestMatch.rating > 0.6) {
    return possibleMatches[matches.bestMatchIndex];
  }
  return null;
};

const getContextualResponse = (pregunta: string, messages: Message[]): string | null => {
  const lastBotMessage = [...messages].reverse().find(m => m.isBot)?.text;
  const lastUserMessage = [...messages].reverse().find(m => !m.isBot)?.text;

  // Detectar patrones emocionales
  const patronesEmocionales = {
    tristeza: /(triste|mal|deprimid|llorar|solo)/i,
    preocupacion: /(preocupad|nervios|ansios|estres)/i,
    frustracion: /(frustrad|molest|enoj|hartx)/i
  };

  // Si detectamos una emoción en la respuesta del usuario
  for (const [emocion, patron] of Object.entries(patronesEmocionales)) {
    if (patron.test(pregunta)) {
      const respuestasEmocionales = {
        tristeza: "Entiendo que te sientas así. ¿Quieres hablar sobre lo que te preocupa? Estoy aquí para escucharte 🫂",
        preocupacion: "Es normal sentirse así a veces. ¿Te gustaría que hablemos sobre lo que te preocupa? 🤗",
        frustracion: "Comprendo tu frustración. ¿Hay algo específico que te esté molestando? Podemos buscar una solución juntos 💪"
      };
      return respuestasEmocionales[emocion as keyof typeof respuestasEmocionales];
    }
  }

  // Si el usuario dice "sí", "no", o variaciones después de una pregunta del bot
  if (normalizeText(pregunta).match(/^(si|no|simon|nel|claro|nop|nope|sep|seep|sip)$/)) {
    if (lastBotMessage?.includes("?")) {
      if (pregunta.toLowerCase().includes("s")) {
        return "Me alegro de que quieras hablar. ¿Qué te gustaría compartir? 😊";
      } else {
        return "Está bien, respeto tu decisión. ¿Hay algo más en lo que pueda ayudarte? 🤗";
      }
    }
  }

  // Si el usuario repite la misma pregunta
  if (lastUserMessage && normalizeText(pregunta) === normalizeText(lastUserMessage)) {
    return "Parece que estás repitiendo tu mensaje. ¿Hay algo específico que no haya quedado claro? Me gustaría ayudarte mejor 😊";
  }

  return null;
};

export const procesarRespuesta = (pregunta: string, setUserName: (name: string) => void, messages: Message[]): string => {
  const preguntaLower = pregunta.toLowerCase().trim();
  
  // Primero intentamos obtener una respuesta contextual
  const contextualResponse = getContextualResponse(pregunta, messages);
  if (contextualResponse) return contextualResponse;

  // Detectar presentaciones y nombres con tolerancia a errores
  if (preguntaLower.includes('me llamo') || preguntaLower.includes('mi nombre es')) {
    const nombreMatch = pregunta.match(/(?:me llamo|mi nombre es)\s+(\w+)/i);
    if (nombreMatch && nombreMatch[1]) {
      setUserName(nombreMatch[1]);
      return `¡Qué gusto conocerte, ${nombreMatch[1]}! ¿Cómo te puedo ayudar hoy? 😊`;
    }
  }

  // Procesar chistes con tolerancia a errores
  const chisteVariations = ['chiste', 'chistesito', 'un chiste', 'echate un chiste', 'cuenta un chiste', 'dime un chiste'];
  if (chisteVariations.some(variant => normalizeText(preguntaLower).includes(normalizeText(variant)))) {
    const chistes = TODAS_LAS_PREGUNTAS["Cuéntame un chiste"];
    return Array.isArray(chistes) ? chistes[Math.floor(Math.random() * chistes.length)] : chistes;
  }

  // Procesar otras preguntas con tolerancia a errores
  const todasLasPreguntas = Object.keys(TODAS_LAS_PREGUNTAS);
  const bestMatch = findBestMatch(pregunta, todasLasPreguntas);
  
  if (bestMatch) {
    const respuesta = TODAS_LAS_PREGUNTAS[bestMatch];
    if (Array.isArray(respuesta)) {
      return respuesta[Math.floor(Math.random() * respuesta.length)];
    }
    return respuesta;
  }

  // Respuesta por defecto más empática y conversacional
  const respuestasDefault = [
    "No estoy seguro de entender completamente. ¿Podrías contarme más sobre eso? 🤔",
    "Me gustaría ayudarte mejor. ¿Podrías explicarme un poco más? 😊",
    "Hmm... quiero asegurarme de entenderte bien. ¿Podrías decirlo de otra forma? 💭",
    "¿Podrías darme más detalles? Así podré ayudarte mejor 🤗"
  ];
  
  return respuestasDefault[Math.floor(Math.random() * respuestasDefault.length)];
};