import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { shuffle } from "lodash";

const TODAS_LAS_PREGUNTAS = {
  // Información Académica
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

  // Modismos y expresiones coloquiales
  "¿Qué onda?": "¡Qué onda! ¿Cómo te va? Soy el asistente virtual de UPIICSA, ¡échame un grito si necesitas algo!",
  "¿Qué tal?": "¡Qué tal! Aquí andamos al 100, ¿en qué te puedo ayudar?",
  "¿Qué pex?": "¡Qué pex! Soy el asistente de UPIICSA, ¿qué se te ofrece carnalx?",
  "¿Qué rollo?": "¡Qué rollo! Aquí echándole ganas, ¿qué necesitas?",
  
  // Expresiones de ayuda coloquiales
  "Ayuda": "¡No te preocupes! Estoy aquí para echarte la mano. ¿Qué necesitas?",
  "Estoy perdido": "¡Tranquilx! Yo te oriento. Dime qué andas buscando y te echo la mano.",
  "No entiendo nada": "Va, va, vamos paso a paso. ¿Qué es lo que te está causando problemas?",
  
  // Información detallada sobre trámites
  "¿Cómo saco mi credencial?": 
    "Para sacar tu credencial necesitas:\n1. INE o identificación oficial\n2. Comprobante de inscripción\n3. Foto tamaño infantil\n4. Acudir a servicios escolares en horario de 9:00 a 20:00\n5. El trámite tarda aproximadamente 1 hora",
  
  // Ubicaciones específicas con detalles
  "¿Dónde está la biblioteca?": 
    "La biblioteca está en el edificio cultural, segundo piso. Horarios:\n- Lunes a Viernes: 7:00 a 21:00\n- Sábados: 8:00 a 14:00\nTip: Los mejores lugares para estudiar están junto a las ventanas 😉",
  
  // Consejos de estudiantes
  "Dame un consejo": [
    "Arma tu horario con gaps entre clases para hacer tareas o estudiar en la biblio",
    "Los tacos de la entrada son god, pero llega temprano porque se acaban",
    "Siempre ten una USB de respaldo, nunca sabes cuándo la vas a necesitar",
    "Hazte amigo de los profes, te puede ayudar mucho en el futuro",
    "No dejes todo para el último, los finales pueden ser muy pesados"
  ],

  // Información sobre clubs y actividades con más detalles
  "¿Qué actividades hay?": 
    "¡Hay muchísimas! 🎨 Culturales: teatro, danza, música\n🏃‍♂️ Deportivas: fut, basket, volley\n🤓 Académicas: programación, robótica, emprendimiento\n\nPuedes unirte cuando quieras, ¡solo necesitas tu credencial vigente!",
  
  // Expresiones de ánimo
  "Estoy estresado": [
    "¡Échale ganas! Recuerda que todo esfuerzo vale la pena 💪",
    "Un pasito a la vez, tú puedes con esto y más 🌟",
    "Tómate un break, date una vuelta por el jardín botánico para despejarte 🌿",
    "¡Ánimo! Todos hemos pasado por ahí, pero al final vale la pena 🎓"
  ],

  // Información sobre eventos
  "¿Qué eventos hay?": 
    "¡Siempre hay algo chido! 🎉\n- Semana UPIICSA (marzo)\n- Torneos deportivos (todo el semestre)\n- Congresos por carrera\n- Hackathones\n- Ferias de empleo\n\nCheca las fechas en www.upiicsa.ipn.mx/eventos",
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
    const preguntaLower = pregunta.toLowerCase().trim();
    
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
          <img src="/lovable-uploads/f5d0b981-f909-4467-b448-4489a5c728e2.png" alt="UPIICSA Logo" className="h-6 w-6" />
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
