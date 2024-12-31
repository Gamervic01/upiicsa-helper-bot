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

const analizarIntencion = (pregunta: string): string => {
  const intenciones = {
    saludo: /(hola|buenos días|buenas tardes|buenas noches|qué tal|hey|como estas|que tal|hi|hello|onda|pex)/i,
    despedida: /(adiós|hasta luego|chao|bye|nos vemos|hasta pronto|cuidate)/i,
    agradecimiento: /(gracias|te agradezco|thanks|thx|ty)/i,
    afirmacion: /^(si|sí|claro|por supuesto|efectivamente|exacto|simon|sep)/i,
    negacion: /^(no|nel|nop|para nada|negativo|nah)/i,
    duda: /(no entiendo|no comprendo|podrías explicar|puedes aclarar|qué significa|como)/i,
    frustracion: /(no puedo|es difícil|me cuesta|estoy atorado|ayuda|help)/i,
    urgencia: /(urgente|rápido|pronto|necesito.*ahora|inmediato|urgent)/i,
    estadoAnimo: /(como estas|que tal estas|como te encuentras|como te va|como andas|que onda|que pex)/i,
    presentacion: /(me llamo|soy|mi nombre|me dicen)/i,
    consejo: /(dame un consejo|necesito un consejo|aconséjame|que me aconsejas|que hago)/i,
    apoyo: /(me siento mal|estoy triste|necesito ayuda|no puedo más|ayúdame)/i
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

  // Respuestas para saludos con pregunta sobre estado de ánimo
  if (intencion === "estadoAnimo") {
    const respuestas = [
      "¡Muy bien, gracias por preguntar! ¿En qué puedo ayudarte hoy? 😊",
      "¡Excelente! Listo para ayudarte en lo que necesites. ¿Qué te gustaría saber? 🌟",
      "¡Genial! Me alegra que preguntes. ¿Hay algo específico en lo que pueda ayudarte? 💫",
      "¡Muy bien! Siempre feliz de poder ayudar. ¿Qué necesitas? 😄",
      "¡Todo chido! ¿En qué te puedo ayudar? 🚀",
      "¡Qué onda! Aquí andamos al 100, ¿qué necesitas? 😎"
    ];
    return respuestas[Math.floor(Math.random() * respuestas.length)];
  }

  // Manejo de intenciones específicas
  switch (intencion) {
    case "saludo":
      const saludos = [
        "¡Hola! ¿En qué puedo ayudarte hoy? 😊",
        "¡Qué gusto saludarte! ¿Cómo puedo ayudarte? 👋",
        "¡Hola! Estoy aquí para resolver tus dudas. ¿Qué necesitas? 🌟",
        "¡Bienvenido! ¿En qué puedo asistirte hoy? 💫",
        "¡Qué onda! ¿Cómo te puedo ayudar? 🤙",
        "¡Qué tal! ¿En qué te puedo echar la mano? 😄",
        "¡Hey! ¿Qué necesitas saber sobre UPIICSA? 🎓"
      ];
      return saludos[Math.floor(Math.random() * saludos.length)];
    case "despedida":
      const despedidas = [
        "¡Hasta luego! Si necesitas algo más, no dudes en volver. 👋",
        "¡Nos vemos! Aquí estaré cuando me necesites. 😊",
        "¡Cuídate mucho! Regresa cuando quieras. 🌟",
        "¡Bye! Recuerda que estoy aquí para ayudarte 24/7. 💫"
      ];
      return despedidas[Math.floor(Math.random() * despedidas.length)];
    case "agradecimiento":
      const agradecimientos = [
        "¡De nada! Estoy aquí para ayudarte. 😊",
        "¡Es un placer! ¿Hay algo más en lo que pueda ayudarte? 🌟",
        "¡No hay de qué! Para eso estamos. 💫",
        "¡Con gusto! Si necesitas algo más, no dudes en preguntar. 👍"
      ];
      return agradecimientos[Math.floor(Math.random() * agradecimientos.length)];
    case "consejo":
      const consejos = [
        "Recuerda que cada desafío es una oportunidad para crecer. ¡Tú puedes! 💪",
        "A veces el primer paso es el más difícil, pero vale la pena darlo. 🌟",
        "No te compares con otros, cada quien tiene su propio camino. 🌱",
        "Es normal sentirse abrumado a veces. Toma un respiro y sigue adelante. 🌈",
        "El éxito es la suma de pequeños esfuerzos repetidos día tras día. ✨",
        "Confía en ti mismo, has llegado más lejos de lo que crees. 🚀",
        "No tengas miedo de pedir ayuda, es una señal de fortaleza, no de debilidad. 🤝",
        "Cada día es una nueva oportunidad para ser mejor. ¡Aprovéchala! 🌅"
      ];
      return consejos[Math.floor(Math.random() * consejos.length)];
    case "apoyo":
      const mensajesApoyo = [
        "Entiendo que estés pasando por un momento difícil. No estás solo/a en esto. 💙\n\n" +
        "Aquí tienes algunos números de ayuda:\n" +
        "📞 Línea de la Vida (24/7): 800 911 2000\n" +
        "📞 SAPTEL: 55 5259 8121\n" +
        "📞 UNAM Línea de Emergencia: 55 5025 0855",
        
        "Me preocupa que te sientas así. Hay personas preparadas para escucharte y ayudarte:\n\n" +
        "📞 Línea de la Vida (24/7): 800 911 2000\n" +
        "Recuerda que buscar ayuda es un acto de valentía. 💙",
        
        "Lamento que estés pasando por esto. No dudes en buscar ayuda profesional:\n\n" +
        "📞 SAPTEL: 55 5259 8121\n" +
        "📞 Línea de la Vida: 800 911 2000\n\n" +
        "Tu bienestar es importante. 🫂"
      ];
      return mensajesApoyo[Math.floor(Math.random() * mensajesApoyo.length)];
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

  // Manejar pedidos de clarificación
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

  // Detectar patrones emocionales
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

  return null;
};

export const procesarRespuesta = (pregunta: string, setUserName: (name: string) => void, messages: Message[]): string => {
  const preguntaLower = pregunta.toLowerCase().trim();
  
  // Primero intentamos obtener una respuesta contextual
  const contextualResponse = getContextualResponse(pregunta, messages);
  if (contextualResponse) return contextualResponse;

  // Detectar presentaciones y nombres
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