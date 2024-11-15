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
  
  // Trámites y Servicios
  "¿Cómo solicito una constancia de estudios?":
    "Acude a servicios escolares con tu credencial vigente. Costo: $50. Tiempo de entrega: 2-3 días hábiles. Horario: L-V 9:00-20:00 hrs.",
  "¿Dónde tramito mi credencial?":
    "La credencial se tramita en el Departamento de Control Escolar (Edif. Gobierno, PB). Requisitos: 1) Comprobante de inscripción, 2) Identificación oficial, 3) Fotografía reciente.",
  "¿Cómo realizo el servicio social?":
    "Debes tener 70% de créditos. Acude a la oficina de servicio social (Edif. Gobierno, 2do piso) para orientación. Proceso detallado en: www.upiicsa.ipn.mx/estudiantes/servicio-social.html",
  
  // Instalaciones y Servicios
  "¿Dónde está la biblioteca?":
    "La biblioteca está en el edificio cultural, planta baja. Horario: L-V 8:00-20:00 hrs. Sábados: 9:00-14:00 hrs. Cuenta con sala de lectura, computadoras y préstamo de libros.",
  "¿Cómo accedo al servicio médico?":
    "La unidad médica está junto al edificio de gobierno. Horario: L-V 7:00-21:00 hrs. Lleva tu credencial vigente y carnet de citas.",
  "¿Dónde están los laboratorios de cómputo?":
    "Los laboratorios están en el edificio de graduados, pisos 1 y 2. Necesitas credencial vigente para acceder. Horario: L-V 7:00-22:00 hrs.",
  
  // Becas y Apoyo
  "¿Qué becas ofrece la escuela?":
    "UPIICSA ofrece: Beca institucional, Beca de transporte, Beca alimenticia. Consulta convocatorias en www.upiicsa.ipn.mx/becas o en el Departamento de Gestión Escolar.",
  "¿Cómo solicito una beca?":
    "Requisitos generales: 1) Ser alumno regular, 2) Promedio mínimo 8.0, 3) No tener otra beca, 4) Estudio socioeconómico. Cada beca tiene requisitos específicos adicionales.",
  
  // Actividades Extracurriculares
  "¿Qué actividades deportivas hay?":
    "UPIICSA ofrece: fútbol, básquetbol, voleibol, atletismo, gimnasio. Inscripciones en el Departamento de Actividades Deportivas (Edificio Cultural, 1er piso).",
  "¿Cómo me uno a un club estudiantil?":
    "Visita la oficina de actividades extracurriculares (Edif. Cultural) para conocer los clubes disponibles: robótica, programación, emprendimiento, idiomas, entre otros.",
  
  // Información General
  "¿Cuál es el calendario escolar?":
    "El calendario actual está en: www.upiicsa.ipn.mx/calendario. Incluye períodos de clases, vacaciones, exámenes y eventos importantes.",
  "¿Cómo llego a UPIICSA?":
    "UPIICSA está en Av. Té 950, Granjas México. Acceso por Metro Puebla o UAM-I. Rutas de RTP y microbuses disponibles. Estacionamiento para alumnos con credencial.",
  "¿Dónde encuentro los planes de estudio?":
    "Los planes de estudio están en www.upiicsa.ipn.mx/oferta-educativa. También puedes consultarlos en tu coordinación académica.",
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

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Seleccionar 6 preguntas aleatorias al inicio
    actualizarPreguntasSugeridas();
  }, []);

  const actualizarPreguntasSugeridas = () => {
    const todasLasPreguntas = Object.keys(TODAS_LAS_PREGUNTAS);
    const preguntasAleatorias = shuffle(todasLasPreguntas).slice(0, 6);
    setSuggestedQuestions(preguntasAleatorias);
  };

  const handleSendMessage = (text: string) => {
    setMessages((prev) => [...prev, { text, isBot: false }]);
    
    setTimeout(() => {
      const respuesta = TODAS_LAS_PREGUNTAS[text as keyof typeof TODAS_LAS_PREGUNTAS] || 
        "Entiendo tu pregunta. Por el momento no tengo información específica sobre esa consulta. Te sugiero: \n1) Visitar www.upiicsa.ipn.mx para más detalles\n2) Contactar directamente a servicios escolares\n3) Consultar con tu coordinador académico";
      
      setMessages((prev) => [...prev, { text: respuesta, isBot: true }]);
      
      // Actualizar preguntas sugeridas después de cada respuesta
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