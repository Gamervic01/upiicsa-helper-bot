import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { shuffle } from "lodash";

const TODAS_LAS_PREGUNTAS = {
  // Información Académica (mantener las preguntas existentes)
  "¿Cuál es el horario de servicios escolares?": 
    "El horario de atención de servicios escolares es de lunes a viernes de 9:00 a 20:00 horas.",
  "¿Cómo inicio mi trámite de titulación?":
    "Para iniciar tu trámite de titulación necesitas: 1) Certificado de servicio social liberado, 2) Kardex al 100%, 3) Constancia de no adeudo, 4) Acreditación del idioma inglés. Acude a la oficina de titulación o visita: www.upiicsa.ipn.mx/estudiantes/titulacion.html",
  "¿Dónde encuentro mi horario de clases?":
    "Puedes consultar tu horario en el SAES (saes.upiicsa.ipn.mx) con tu usuario y contraseña en la sección 'Horario'.",
  "¿Cómo contacto a mi coordinador?":
    "Los coordinadores se encuentran en el edificio de gobierno. Cada programa tiene su oficina específica: ISC (planta baja), IM (1er piso), IC (2do piso), IIA (3er piso), LA (4to piso). Horario de atención: 8:00 a 20:00 hrs.",
  "¿Cuál es el proceso de reinscripción?":
    "La reinscripción se realiza en SAES según el calendario oficial. Pasos: 1) Verifica tu fecha, 2) Realiza el pago, 3) Selecciona materias, 4) Imprime tu comprobante. Fechas en: www.upiicsa.ipn.mx/estudiantes/calendario.html",
  "¿Dónde encuentro mi boleta?":
    "Las boletas están disponibles en SAES (saes.upiicsa.ipn.mx) en 'Calificaciones'. Se publican aproximadamente una semana después del fin de semestre.",
  
  // Chistes
  "Cuéntame un chiste": [
    "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter 😄",
    "¿Qué le dice un jaguar a otro jaguar? Jaguar you 😄",
    "¿Qué le dice un techo a otro techo? ¡Techo de menos! 😄",
    "¿Por qué el libro de matemáticas está triste? Porque tiene muchos problemas 😄",
    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba! 😄"
  ],

  // Adivinanzas
  "Dime una adivinanza": [
    "Oro parece, plata no es, el que no lo adivine bien tonto es. (El plátano)",
    "Blanco por dentro, verde por fuera, si quieres que te lo diga, espera. (La pera)",
    "En el cielo brinco y vuelo. Me encanta subir y bajar. Y entre las estrellas voy cantando por el aire sin parar. (El astronauta)",
    "Soy redonda como el queso, nadie puede darme un beso. (La luna)",
    "Todo el mundo lo lleva, todo el mundo lo tiene, porque a todos les dan uno en cuanto al mundo vienen. (El nombre)"
  ],

  // Saludos y presentaciones
  "Hola": "¡Hola! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  "Buenos días": "¡Buenos días! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  "Buenas tardes": "¡Buenas tardes! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  "Buenas noches": "¡Buenas noches! ¿Cómo estás? Soy el asistente virtual de UPIICSA. ¿Cuál es tu nombre?",
  
  // Preguntas motivacionales
  "Dame una frase motivacional": [
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día. ¡Tú puedes!",
    "El mejor momento para empezar fue ayer, el siguiente mejor momento es ahora.",
    "La educación es el arma más poderosa que puedes usar para cambiar el mundo. - Nelson Mandela",
    "El fracaso es una oportunidad para empezar de nuevo con más inteligencia. - Henry Ford",
    "La constancia vence lo que la dicha no alcanza."
  ],

  // Información sobre UPIICSA
  "¿Qué significa UPIICSA?": 
    "UPIICSA significa 'Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas'. Es una unidad académica del Instituto Politécnico Nacional (IPN) fundada en 1972.",
  "¿Cuál es el lema de UPIICSA?": 
    "El lema de UPIICSA es 'La Técnica al Servicio de la Patria', que también es el lema general del Instituto Politécnico Nacional.",
  "¿Cuál es la historia de UPIICSA?":
    "UPIICSA fue fundada el 6 de noviembre de 1972. Surgió como respuesta a la necesidad de formar profesionales que combinaran conocimientos de ingeniería con habilidades administrativas. Fue una unidad pionera en su concepto interdisciplinario.",
  
  // Eventos y fechas importantes
  "¿Cuándo es la siguiente semana académica?":
    "La Semana Académica UPIICSA se celebra generalmente en marzo. Las fechas exactas se anuncian al inicio de cada año en www.upiicsa.ipn.mx",
  "¿Cuándo son las inscripciones?":
    "Las inscripciones se realizan según el calendario oficial del IPN. Normalmente son en enero para el semestre A y en agosto para el semestre B. Consulta las fechas exactas en el SAES.",

  // Instalaciones y ubicaciones específicas
  "¿Dónde está la cafetería?":
    "La cafetería principal se encuentra en el edificio cultural, planta baja. Hay también una cafetería más pequeña cerca de los laboratorios pesados.",
  "¿Dónde están las canchas deportivas?":
    "Las instalaciones deportivas incluyen: canchas de básquetbol y voleibol junto al edificio de graduados, campo de fútbol en la parte trasera, y gimnasio en el edificio cultural.",
  
  // Clubs y actividades
  "¿Qué clubs hay en UPIICSA?": 
    "UPIICSA cuenta con diversos clubs: Programación, Robótica, Emprendimiento, Idiomas, Ajedrez, Teatro, Danza, Música, entre otros. Visita el departamento de actividades culturales para más información.",
  "¿Cómo me uno a un club?":
    "Para unirte a un club: 1) Visita el departamento de actividades culturales, 2) Revisa los horarios disponibles, 3) Regístrate con tu credencial vigente, 4) ¡Comienza a participar!",
};

interface Message {
  text: string;
  isBot: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "¡Hola! Soy el asistente virtual de UPIICSA. ¿En qué puedo ayudarte hoy?",
      isBot: true,
    },
  ]);
  const [userName, setUserName] = useState<string>("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  useEffect(() => {
    actualizarPreguntasSugeridas();
  }, []);

  const actualizarPreguntasSugeridas = () => {
    const todasLasPreguntas = Object.keys(TODAS_LAS_PREGUNTAS);
    const preguntasAleatorias = shuffle(todasLasPreguntas).slice(0, 6);
    setSuggestedQuestions(preguntasAleatorias);
  };

  const procesarRespuesta = (pregunta: string): string => {
    // Detectar si es un saludo o presentación
    const saludos = ["hola", "buenos días", "buenas tardes", "buenas noches"];
    const preguntaLower = pregunta.toLowerCase();
    
    // Si el usuario está diciendo su nombre
    if (preguntaLower.includes("me llamo") || preguntaLower.includes("mi nombre es")) {
      const nombreMatch = pregunta.match(/(?:me llamo|mi nombre es)\s+(\w+)/i);
      if (nombreMatch && nombreMatch[1]) {
        setUserName(nombreMatch[1]);
        return `¡Encantado de conocerte, ${nombreMatch[1]}! ¿En qué puedo ayudarte hoy?`;
      }
    }

    // Si ya tenemos el nombre del usuario, personalizar respuestas
    const respuesta = TODAS_LAS_PREGUNTAS[pregunta as keyof typeof TODAS_LAS_PREGUNTAS];
    
    if (Array.isArray(respuesta)) {
      // Si la respuesta es un array (chistes, adivinanzas, frases), elegir una al azar
      return respuesta[Math.floor(Math.random() * respuesta.length)];
    } else if (respuesta) {
      return userName ? respuesta.replace("¿Cuál es tu nombre?", `${userName}`) : respuesta;
    }

    // Respuesta por defecto
    return userName 
      ? `Lo siento ${userName}, no tengo información específica sobre esa consulta. ¿Puedo ayudarte con algo más?`
      : "Lo siento, no tengo información específica sobre esa consulta. ¿Puedo ayudarte con algo más?";
  };

  const handleSendMessage = (text: string) => {
    setMessages((prev) => [...prev, { text, isBot: false }]);
    
    setTimeout(() => {
      const respuesta = procesarRespuesta(text);
      setMessages((prev) => [...prev, { text: respuesta, isBot: true }]);
      actualizarPreguntasSugeridas();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-ipn-primary to-ipn-light p-4">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Asistente Virtual UPIICSA
          {userName && <span className="text-sm ml-2">| Hablando con {userName}</span>}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.text} isBot={msg.isBot} />
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {suggestedQuestions.map((question) => (
            <SuggestedQuestions
              key={question}
              question={question}
              onClick={handleSendMessage}
            />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
