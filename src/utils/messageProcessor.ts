import { TODAS_LAS_PREGUNTAS } from "../data/chatData";

export const procesarRespuesta = (pregunta: string, setUserName: (name: string) => void): string => {
  const preguntaLower = pregunta.toLowerCase().trim();
  
  // Detectar chistes
  if (preguntaLower.includes('chiste') || preguntaLower === 'chiste') {
    const chistes = TODAS_LAS_PREGUNTAS["chiste"];
    return Array.isArray(chistes) ? chistes[Math.floor(Math.random() * chistes.length)] : chistes;
  }

  // Detectar saludos informales
  if (preguntaLower.includes('que onda') || preguntaLower.includes('que pex') || 
      preguntaLower.includes('que rollo') || preguntaLower.includes('que tal')) {
    return TODAS_LAS_PREGUNTAS[Object.keys(TODAS_LAS_PREGUNTAS).find(key => 
      key.toLowerCase().includes(preguntaLower)) || "¿Qué onda?"];
  }
  
  // Detectar presentaciones y nombres
  if (preguntaLower.includes('me llamo') || preguntaLower.includes('mi nombre es')) {
    const nombreMatch = pregunta.match(/(?:me llamo|mi nombre es)\s+(\w+)/i);
    if (nombreMatch && nombreMatch[1]) {
      setUserName(nombreMatch[1]);
      return `¡Qué gusto conocerte, ${nombreMatch[1]}! ¿En qué te puedo ayudar? 😊`;
    }
  }

  // Procesar otras preguntas
  for (const [key, value] of Object.entries(TODAS_LAS_PREGUNTAS)) {
    if (preguntaLower.includes(key.toLowerCase())) {
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    }
  }

  // Respuesta por defecto más amigable
  return "¡Ups! No capto bien esa pregunta 😅 ¿Podrías reformularla? O pregúntame sobre trámites, ubicaciones, eventos o hasta échame un '¿qué onda?' 😊";
};