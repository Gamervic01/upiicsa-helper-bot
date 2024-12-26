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
  
  // Aumentamos el umbral de similitud para mejores coincidencias
  if (matches.bestMatch.rating > 0.7) {
    return possibleMatches[matches.bestMatchIndex];
  }
  return null;
};

const analizarIntencion = (pregunta: string): string => {
  const intenciones = {
    saludo: /(hola|buenos días|buenas tardes|buenas noches|qué tal|hey)/i,
    despedida: /(adiós|hasta luego|chao|bye|nos vemos)/i,
    agradecimiento: /(gracias|te agradezco|thanks)/i,
    afirmacion: /^(si|sí|claro|por supuesto|efectivamente|exacto)/i,
    negacion: /^(no|nel|nop|para nada|negativo)/i,
    duda: /(no entiendo|no comprendo|podrías explicar|puedes aclarar|qué significa)/i,
    frustracion: /(no puedo|es difícil|me cuesta|estoy atorado|ayuda)/i,
    urgencia: /(urgente|rápido|pronto|necesito.*ahora|inmediato)/i
  };

  for (const [intencion, patron] of Object.entries(intenciones)) {
    if (patron.test(pregunta)) return intencion;
  }
  return "consulta";
};

const getContextualResponse = (pregunta: string, messages: Message[]): string | null => {
  const lastBotMessage = [...messages].reverse().find(m => m.isBot)?.text;
  const normalizedPregunta = normalizeText(pregunta);
  const intencion = analizarIntencion(pregunta);

  // Manejo de intenciones específicas
  switch (intencion) {
    case "saludo":
      return "¡Hola! ¿En qué puedo ayudarte hoy? 😊";
    case "despedida":
      return "¡Hasta luego! Si necesitas algo más, no dudes en volver. 👋";
    case "agradecimiento":
      return "¡De nada! Estoy aquí para ayudarte. 😊";
  }

  // Manejar preguntas de seguimiento sobre carreras
  if (lastBotMessage?.includes("¿Te gustaría saber más detalles sobre alguna carrera")) {
    const carreras = {
      isc: "¿Qué significa ISC?",
      im: "¿Qué significa IM?",
      ic: "¿Qué significa IC?",
      iia: "¿Qué significa IIA?",
      la: "¿Qué significa LA?"
    };

    for (const [abrev, preguntaCompleta] of Object.entries(carreras)) {
      if (normalizedPregunta.includes(abrev.toLowerCase())) {
        return TODAS_LAS_PREGUNTAS[preguntaCompleta];
      }
    }
  }

  // Manejar pedidos de clarificación con más contexto
  const clarificationPatterns = [
    /(?:puedes|podrías|puedas) explicar(?:me|lo)?/i,
    /no (entiendo|entendí)/i,
    /más detalles/i,
    /qué significa/i,
    /podrías decirlo de otra forma/i
  ];

  if (clarificationPatterns.some(pattern => pattern.test(pregunta))) {
    const lastResponse = messages
      .filter(m => m.isBot)
      .find(m => !m.text.includes("¿Podrías") && !m.text.includes("No estoy seguro"));

    if (lastResponse) {
      return `Claro, te lo explico de otra forma:\n\n${lastResponse.text}\n\n¿Hay algo específico que te gustaría que te aclare?`;
    }
  }

  // Detectar patrones emocionales con respuestas más empáticas
  const patronesEmocionales = {
    tristeza: /(triste|mal|deprimid|llorar|solo)/i,
    preocupacion: /(preocupad|nervios|ansios|estres)/i,
    frustracion: /(frustrad|molest|enoj|hartx)/i,
    confusion: /(confundid|perdid|no sé qué hacer)/i
  };

  for (const [emocion, patron] of Object.entries(patronesEmocionales)) {
    if (patron.test(pregunta)) {
      const respuestasEmocionales = {
        tristeza: "Entiendo que te sientas así. ¿Quieres hablar sobre lo que te preocupa? Estoy aquí para escucharte y ayudarte a encontrar soluciones. 🫂",
        preocupacion: "Es normal sentirse así, especialmente en la universidad. ¿Te gustaría que hablemos sobre lo que te preocupa? Podemos explorar opciones juntos. 🤗",
        frustracion: "Comprendo tu frustración. A veces los desafíos pueden parecer abrumadores. ¿Hay algo específico que te esté molestando? Podemos buscar una solución paso a paso. 💪",
        confusion: "Es normal sentirse confundido/a. Vamos a resolver esto juntos, paso a paso. ¿Por dónde te gustaría empezar? 🤝"
      };
      return respuestasEmocionales[emocion as keyof typeof respuestasEmocionales];
    }
  }

  // Si el usuario repite la misma pregunta, ofrecer más ayuda
  const lastUserMessage = [...messages].reverse().find(m => !m.isBot)?.text;
  if (lastUserMessage && normalizeText(pregunta) === normalizeText(lastUserMessage)) {
    return "Parece que estás repitiendo tu mensaje. ¿Hay algo específico que no haya quedado claro? Me gustaría ayudarte mejor. 😊";
  }

  return null;
};

export const procesarRespuesta = (pregunta: string, setUserName: (name: string) => void, messages: Message[]): string => {
  const preguntaLower = pregunta.toLowerCase().trim();
  
  // Primero intentamos obtener una respuesta contextual
  const contextualResponse = getContextualResponse(pregunta, messages);
  if (contextualResponse) return contextualResponse;

  // Detectar presentaciones y nombres con más variantes
  const presentacionPatterns = [
    /me llamo\s+(\w+)/i,
    /mi nombre es\s+(\w+)/i,
    /soy\s+(\w+)/i,
    /(\w+)\s+para servirte/i,
    /dime\s+(\w+)/i
  ];

  for (const pattern of presentacionPatterns) {
    const match = pregunta.match(pattern);
    if (match && match[1]) {
      setUserName(match[1]);
      return `¡Qué gusto conocerte, ${match[1]}! ¿Cómo puedo ayudarte hoy? 😊`;
    }
  }

  // Buscar la mejor coincidencia en las preguntas predefinidas
  const todasLasPreguntas = Object.keys(TODAS_LAS_PREGUNTAS);
  const bestMatch = findBestMatch(pregunta, todasLasPreguntas);
  
  if (bestMatch) {
    const respuesta = TODAS_LAS_PREGUNTAS[bestMatch];
    if (Array.isArray(respuesta)) {
      return respuesta[Math.floor(Math.random() * respuesta.length)];
    }
    return respuesta;
  }

  // Si no encontramos una coincidencia, dar una respuesta más elaborada
  const respuestasDefault = [
    "No estoy seguro de entender completamente. ¿Podrías reformular tu pregunta o dar más detalles? 🤔",
    "Me gustaría ayudarte mejor. ¿Podrías explicar un poco más lo que necesitas saber? 😊",
    "Para brindarte la mejor ayuda posible, ¿podrías ser más específico con tu pregunta? 💭",
    "¿Podrías darme más contexto sobre tu consulta? Así podré darte una respuesta más precisa y útil. 🤝",
    "Parece una pregunta interesante. ¿Podrías elaborar un poco más para asegurarme de entender correctamente? 📚"
  ];
  
  return respuestasDefault[Math.floor(Math.random() * respuestasDefault.length)];
};