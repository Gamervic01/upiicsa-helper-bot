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

  // Si el usuario dice "sí", "no", o variaciones después de una pregunta del bot
  if (normalizeText(pregunta).match(/^(si|no|simon|nel|claro|nop|nope|sep|seep|sip)$/)) {
    if (lastBotMessage?.includes("?")) {
      return pregunta.toLowerCase().includes("s") ? 
        "¡Genial! ¿Hay algo más en lo que pueda ayudarte? 😊" :
        "Entiendo. ¿Hay algo más en lo que pueda ayudarte? 😊";
    }
  }

  // Si el usuario repite la misma pregunta
  if (lastUserMessage && normalizeText(pregunta) === normalizeText(lastUserMessage)) {
    return "Parece que estás repitiendo tu pregunta. ¿Podrías reformularla de otra manera? Así podré entenderte mejor 😊";
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
      return `¡Qué gusto conocerte, ${nombreMatch[1]}! ¿En qué te puedo ayudar? 😊`;
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

  // Detectar saludos informales con tolerancia a errores
  const saludosInformales = ['que onda', 'que tal', 'que pex', 'que rollo', 'k onda', 'q onda', 'ke onda', 'k tal', 'q tal'];
  if (saludosInformales.some(saludo => normalizeText(preguntaLower).includes(normalizeText(saludo)))) {
    return "¡Qué onda! Aquí andamos al 100, ¿qué se te ofrece? 😎";
  }

  // Respuesta por defecto más amigable y conversacional
  const respuestasDefault = [
    "¡Ups! No capto bien esa pregunta 😅 ¿Podrías reformularla?",
    "No estoy seguro de entender. ¿Podrías decirlo de otra manera?",
    "Mmm... ¿podrías ser más específico? Quiero asegurarme de ayudarte bien 🤔",
    "Disculpa, pero no entendí bien. ¿Me lo explicas de otra forma? 😊"
  ];
  
  return respuestasDefault[Math.floor(Math.random() * respuestasDefault.length)];
};