import {
  administracionIndustrialData,
  cienciasInformaticaData,
  ingenieriaInformaticaData,
  ingenieriaTransporteData,
  ingenieriaFerroviariaData,
  ingenieriaIndustrialData,
  carrerasUPIICSA
} from './careers';

import { academicServicesData } from './categories/academicServices';
import { studentServicesData } from './categories/studentServices';
import { careerServicesData } from './categories/careerServices';
import { graduateServicesData } from './categories/graduateServices';

export const TODAS_LAS_PREGUNTAS = {
  // Información de Carreras
  ...carrerasUPIICSA,
  ...administracionIndustrialData,
  ...cienciasInformaticaData,
  ...ingenieriaInformaticaData,
  ...ingenieriaTransporteData,
  ...ingenieriaFerroviariaData,
  ...ingenieriaIndustrialData,

  // Servicios Académicos
  ...academicServicesData,

  // Servicios Estudiantiles
  ...studentServicesData,

  // Servicios de Carrera
  ...careerServicesData,

  // Servicios para Egresados
  ...graduateServicesData,

  // Chistes y entretenimiento
  "Cuéntame un chiste": [
    "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter 😄",
    "¿Qué le dice un jaguar a otro jaguar? Jaguar you 😄",
    "¿Qué le dice un techo a otro techo? ¡Techo de menos! 😄",
    "¿Por qué el libro de matemáticas está triste? Porque tiene muchos problemas 😄",
    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba! 😄"
  ],

  // Saludos y presentaciones
  "Hola": "¡Hola! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  "Buenos días": "¡Buenos días! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  "Buenas tardes": "¡Buenas tardes! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  "Buenas noches": "¡Buenas noches! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  
  // Frases motivacionales
  "Dame una frase motivacional": [
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día. ¡Tú puedes!",
    "El mejor momento para empezar fue ayer, el siguiente mejor momento es ahora.",
    "La educación es el arma más poderosa que puedes usar para cambiar el mundo. - Nelson Mandela",
    "El fracaso es una oportunidad para empezar de nuevo con más inteligencia. - Henry Ford",
    "La constancia vence lo que la dicha no alcanza."
  ],

  // Información general UPIICSA
  "¿Qué significa UPIICSA?": 
    "UPIICSA significa 'Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas'. Es una unidad académica del Instituto Politécnico Nacional (IPN) fundada en 1972.",
  
  "¿Cuál es el lema de UPIICSA?": 
    "El lema de UPIICSA es 'La Técnica al Servicio de la Patria', que también es el lema general del Instituto Politécnico Nacional.",

  // Expresiones de ayuda
  "Ayuda": "¡No te preocupes! Estoy aquí para echarte la mano. ¿Qué necesitas?",
  "Estoy perdido": "¡Tranquilx! Yo te oriento. Dime qué andas buscando y te echo la mano.",
  "No entiendo nada": "Va, va, vamos paso a paso. ¿Qué es lo que te está causando problemas?",

  // Respuestas emocionales
  "Estoy triste": [
    "Lamento escuchar que te sientes así. ¿Quieres hablar sobre lo que te preocupa? Estoy aquí para escucharte 🫂",
    "A veces es normal sentirnos tristes. ¿Te gustaría que te cuente un chiste para animarte un poco? 😊",
    "Entiendo que te sientas así. ¿Has considerado hablar con el departamento de orientación juvenil? Están para apoyarte 💙"
  ],
  "Me siento mal": [
    "¿Quieres contarme qué te está pasando? A veces hablar ayuda a sentirnos mejor 🤗",
    "Lamento que te sientas así. ¿Hay algo específico que te preocupe?",
    "Estoy aquí para escucharte. ¿Te gustaría que te comparta algunos recursos de apoyo disponibles en UPIICSA?"
  ]
};