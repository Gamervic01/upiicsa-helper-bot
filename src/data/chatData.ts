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
    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba! 😄",
    "¿Qué le dice un semáforo a otro? ¡No me mires que me pongo rojo! 😄",
    "¿Qué le dice una iguana a su hermana gemela? Somos iguanitas 😄",
    "¿Qué hace un perro con un taladro? Taladrando 😄",
    "¿Por qué los peces no usan Facebook? Porque ya tienen insta-grams 😄",
    "¿Qué le dice un gato a otro gato? ¡Miau-nifíco! 😄"
  ],

  // Adivinanzas
  "Dime una adivinanza": [
    "Oro parece, plata no es, el que no lo adivine bien tonto es. (El plátano) 🍌",
    "Blanco por dentro, verde por fuera, si no lo adivinas, piensa y espera. (La pera) 🍐",
    "En el cielo brinco y vuelo. Me encanta subir y bajar. Y entre las estrellas voy. Sin parar de trabajar. (El astronauta) 👨‍🚀",
    "Soy redonda como un queso, pero nadie puede darme un beso. (La luna) 🌕",
    "Tengo agujas y no sé coser, tengo números y no sé leer. (El reloj) ⌚",
    "¿Qué cosa es, que cuanto más le quitas más grande es? (El hoyo) 🕳️",
    "Alto alto como un pino, pesa menos que un comino. (El humo) 💨",
    "Todos me pisan a mí, pero yo no piso a nadie; todos preguntan por mí, yo no pregunto por nadie. (El camino) 🛣️"
  ],

  // Frases motivacionales
  "Dame una frase motivacional": [
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día. ¡Tú puedes! 💪",
    "El mejor momento para empezar fue ayer, el siguiente mejor momento es ahora. ⭐",
    "La educación es el arma más poderosa que puedes usar para cambiar el mundo. - Nelson Mandela 📚",
    "El fracaso es una oportunidad para empezar de nuevo con más inteligencia. - Henry Ford 🌟",
    "La constancia vence lo que la dicha no alcanza. 🎯",
    "No te preocupes por los fracasos, preocúpate por las oportunidades que pierdes cuando ni siquiera lo intentas. 🚀",
    "El único modo de hacer un gran trabajo es amar lo que haces. - Steve Jobs ❤️",
    "La diferencia entre lo imposible y lo posible reside en la determinación. 🎯",
    "Cada día es una nueva oportunidad para cambiar tu vida. ✨",
    "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje para continuar. - Winston Churchill 💫"
  ],

  // Apoyo emocional y recursos de ayuda
  "Me siento mal": [
    "Lamento mucho que te sientas así. Recuerda que no estás solo/a. Aquí tienes algunos números de ayuda:\n\n" +
    "📞 Línea de la Vida (24/7): 800 911 2000\n" +
    "📞 SAPTEL (Sistema Nacional de Apoyo en Crisis): 55 5259 8121\n" +
    "📞 UNAM Línea de Emergencia Psicológica: 55 5025 0855\n\n" +
    "También puedes acudir al Departamento de Orientación Juvenil de UPIICSA o visitar:\n" +
    "https://www.upiicsa.ipn.mx/estudiantes/atencion-salud.html",
    "Entiendo que estés pasando por un momento difícil. ¿Te gustaría hablar sobre lo que te preocupa? También puedes contactar a profesionales que están para ayudarte:\n\n" +
    "📞 Línea de la Vida (24/7): 800 911 2000\n" +
    "Recuerda que buscar ayuda es un acto de valentía. 💙"
  ],

  "Necesito ayuda psicológica": [
    "Tu bienestar emocional es importante. Aquí hay recursos que pueden ayudarte:\n\n" +
    "📞 Línea de la Vida (24/7): 800 911 2000\n" +
    "📞 SAPTEL: 55 5259 8121\n" +
    "📞 UNAM Línea de Emergencia: 55 5025 0855\n\n" +
    "En UPIICSA puedes acudir al Departamento de Orientación Juvenil o visitar:\n" +
    "https://www.upiicsa.ipn.mx/estudiantes/atencion-salud.html\n\n" +
    "No estás solo/a en esto. 💙"
  ],

  "Estoy deprimido": [
    "Lamento que estés pasando por esto. La depresión es algo serio y hay personas preparadas para ayudarte:\n\n" +
    "📞 Línea de la Vida (24/7): 800 911 2000\n" +
    "📞 SAPTEL: 55 5259 8121\n\n" +
    "Por favor, no dudes en buscar ayuda profesional. Tu vida es valiosa. 💙"
  ],

  // Saludos y presentaciones
  "Hola": "¡Hola! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  "Buenos días": "¡Buenos días! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  "Buenas tardes": "¡Buenas tardes! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  "Buenas noches": "¡Buenas noches! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  
  // Información general UPIICSA
  "¿Qué significa UPIICSA?": 
    "UPIICSA significa 'Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas'. Es una unidad académica del Instituto Politécnico Nacional (IPN) fundada en 1972.",
  
  "¿Cuál es el lema de UPIICSA?": 
    "El lema de UPIICSA es 'La Técnica al Servicio de la Patria', que también es el lema general del Instituto Politécnico Nacional.",

  // Expresiones de ayuda
  "Ayuda": "¡No te preocupes! Estoy aquí para echarte la mano. ¿Qué necesitas?",
  "Estoy perdido": "¡Tranquilx! Yo te oriento. Dime qué andas buscando y te echo la mano.",
  "No entiendo nada": "Va, va, vamos paso a paso. ¿Qué es lo que te está causando problemas?",
};
