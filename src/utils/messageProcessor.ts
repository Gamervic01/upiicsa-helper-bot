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
  
  if (matches.bestMatch.rating > 0.4) { // Reducido el umbral para mayor flexibilidad
    return possibleMatches[matches.bestMatchIndex];
  }
  return null;
};

const extractCarrera = (texto: string): string | null => {
  const carreras = {
    'informatica': 'IC',
    'sistemas': 'ISC',
    'industrial': 'IIA',
    'mecanica': 'IM',
    'administracion': 'LA'
  };

  const textoNormalizado = normalizeText(texto);
  
  for (const [keyword, carrera] of Object.entries(carreras)) {
    if (textoNormalizado.includes(keyword)) {
      return carrera;
    }
  }
  
  return null;
};

const getContextualResponse = (pregunta: string, messages: Message[]): string | null => {
  const lastBotMessage = [...messages].reverse().find(m => m.isBot)?.text;
  const normalizedPregunta = normalizeText(pregunta);

  // Detectar si es una pregunta sobre electivas
  if (normalizedPregunta.includes('electiva') || normalizedPregunta.includes('optativa')) {
    const carrera = extractCarrera(pregunta);
    if (carrera) {
      return `Para ver tus materias electivas de ${carrera}, sigue estos pasos:\n\n` +
             `1. Ingresa a SAES (https://www.saes.upiicsa.ipn.mx)\n` +
             `2. Ve a la sección "Plan de Estudios"\n` +
             `3. En el menú lateral, selecciona "Optativas/Electivas"\n` +
             `4. Ahí encontrarás todas las materias disponibles para tu carrera\n\n` +
             `También puedes consultar con tu coordinador para más información sobre los horarios y disponibilidad.`;
    }
  }

  // Si el bot pidió una clarificación y el usuario responde
  if (lastBotMessage?.includes("¿Podrías explicarme") || lastBotMessage?.includes("Me gustaría ayudarte mejor")) {
    // Buscar palabras clave en el contexto completo de la conversación
    const conversationContext = messages.map(m => m.text).join(" ");
    const contextNormalized = normalizeText(conversationContext);
    
    // Detectar temas específicos en el contexto
    if (contextNormalized.includes("horario")) {
      return TODAS_LAS_PREGUNTAS["¿Dónde encuentro mi horario de clases?"];
    }
    if (contextNormalized.includes("coordinador")) {
      return TODAS_LAS_PREGUNTAS["¿Cómo contacto a mi coordinador?"];
    }
  }

  // Detectar patrones emocionales y otros casos existentes
  const patronesEmocionales = {
    tristeza: /(triste|mal|deprimid|llorar|solo)/i,
    preocupacion: /(preocupad|nervios|ansios|estres)/i,
    frustracion: /(frustrad|molest|enoj|hartx)/i
  };

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

  return null;
};

export const procesarRespuesta = (pregunta: string, setUserName: (name: string) => void, messages: Message[]): string => {
  const preguntaLower = pregunta.toLowerCase().trim();
  
  // Primero intentamos obtener una respuesta contextual
  const contextualResponse = getContextualResponse(pregunta, messages);
  if (contextualResponse) return contextualResponse;

  // Detectar presentaciones y nombres
  if (preguntaLower.includes('me llamo') || preguntaLower.includes('mi nombre es')) {
    const nombreMatch = pregunta.match(/(?:me llamo|mi nombre es)\s+(\w+)/i);
    if (nombreMatch && nombreMatch[1]) {
      setUserName(nombreMatch[1]);
      return `¡Qué gusto conocerte, ${nombreMatch[1]}! ¿Cómo te puedo ayudar hoy? 😊`;
    }
  }

  // Si la pregunta es muy corta o poco clara, pedir más información
  if (pregunta.split(' ').length < 4) {
    return "Me gustaría ayudarte mejor. ¿Podrías darme más detalles sobre lo que necesitas saber? 😊";
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

  // Si no encontramos una coincidencia, dar una respuesta que invite a clarificar
  return "Para poder ayudarte mejor, ¿podrías explicarme un poco más lo que necesitas? Por ejemplo, si es sobre horarios, trámites, o alguna duda específica de tu carrera 🤔";
};
