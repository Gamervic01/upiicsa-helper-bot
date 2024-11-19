import { TODAS_LAS_PREGUNTAS } from "../data/chatData";
import stringSimilarity from 'string-similarity';

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
    .replace(/[^a-z0-9\s]/g, "") // Solo deja letras, números y espacios
    .trim();
};

const findBestMatch = (userInput: string, possibleMatches: string[]): string | null => {
  const normalizedInput = normalizeText(userInput);
  const normalizedMatches = possibleMatches.map(normalizeText);
  
  const matches = stringSimilarity.findBestMatch(normalizedInput, normalizedMatches);
  
  // Si la similitud es mayor a 0.6 (60%), consideramos que es una coincidencia válida
  if (matches.bestMatch.rating > 0.6) {
    return possibleMatches[matches.bestMatchIndex];
  }
  return null;
};

export const procesarRespuesta = (pregunta: string, setUserName: (name: string) => void): string => {
  const preguntaLower = pregunta.toLowerCase().trim();
  
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

  // Respuesta por defecto más amigable
  return "¡Ups! No capto bien esa pregunta 😅 ¿Podrías reformularla? O pregúntame sobre trámites, ubicaciones, eventos o hasta échame un '¿qué onda?' 😊";
};