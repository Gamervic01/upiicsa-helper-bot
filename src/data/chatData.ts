import {
  administracionIndustrialData,
  cienciasInformaticaData,
  ingenieriaInformaticaData,
  ingenieriaTransporteData,
  ingenieriaFerroviariaData,
  ingenieriaIndustrialData,
  carrerasUPIICSA
} from './careers';

export const TODAS_LAS_PREGUNTAS = {
  // Información de Carreras
  ...carrerasUPIICSA,
  ...administracionIndustrialData,
  ...cienciasInformaticaData,
  ...ingenieriaInformaticaData,
  ...ingenieriaTransporteData,
  ...ingenieriaFerroviariaData,
  ...ingenieriaIndustrialData,

  // Información Académica
  "¿Cuál es el horario de servicios escolares?": 
    "El horario de atención de servicios escolares es:\n\n" +
    "📅 Lunes a Viernes:\n" +
    "- Turno Matutino: 9:00 a 14:00 horas\n" +
    "- Turno Vespertino: 15:00 a 20:00 horas\n\n" +
    "🗓️ Periodos vacacionales y días festivos:\n" +
    "- El horario puede variar, se recomienda consultar los avisos oficiales\n\n" +
    "📍 Ubicación: Edificio de Gobierno, Planta Baja\n\n" +
    "⚠️ Recomendaciones:\n" +
    "- Llegar al menos 30 minutos antes del cierre\n" +
    "- Traer toda la documentación necesaria\n" +
    "- Verificar requisitos específicos en la página web oficial\n\n" +
    "📞 Contacto:\n" +
    "- Teléfono: 55-5624-2000 ext. 70001\n" +
    "- Correo: servicios.escolares@upiicsa.ipn.mx",

  "¿Cómo inicio mi trámite de titulación?":
    "📋 Requisitos Indispensables:\n\n" +
    "1. Certificado de servicio social liberado\n" +
    "   - 480 horas completadas\n" +
    "   - Documentación en regla\n" +
    "   - Carta de término\n\n" +
    "2. Kardex al 100%\n" +
    "   - Todas las materias aprobadas\n" +
    "   - Sin adeudos académicos\n\n" +
    "3. Constancia de no adeudo\n" +
    "   - Biblioteca\n" +
    "   - Laboratorios\n" +
    "   - Servicios escolares\n\n" +
    "4. Acreditación del idioma inglés\n" +
    "   - Nivel B1 mínimo\n" +
    "   - Certificado vigente\n\n" +
    "🎓 Opciones de Titulación Disponibles:\n\n" +
    "- Tesis (Individual o grupal)\n" +
    "- Memoria de experiencia profesional\n" +
    "- Escolaridad (9.0 promedio mínimo)\n" +
    "- Seminario de titulación\n" +
    "- Créditos de posgrado\n" +
    "- ETS o EGEL (según la carrera)\n\n" +
    "📝 Proceso paso a paso:\n\n" +
    "1. Solicitar revisión de estudios\n" +
    "2. Elegir modalidad de titulación\n" +
    "3. Registrar opción en la coordinación\n" +
    "4. Desarrollar trabajo de titulación (si aplica)\n" +
    "5. Solicitar fecha de examen\n" +
    "6. Realizar pago de derechos\n" +
    "7. Presentar examen profesional\n\n" +
    "🔗 Enlaces importantes:\n" +
    "- Proceso detallado: <a href='https://www.upiicsa.ipn.mx/estudiantes/titulacion.html' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:text-blue-700 underline'>www.upiicsa.ipn.mx/estudiantes/titulacion.html</a>\n" +
    "- Formatos: <a href='https://www.upiicsa.ipn.mx/estudiantes/formatos.html' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:text-blue-700 underline'>www.upiicsa.ipn.mx/estudiantes/formatos.html</a>\n\n" +
    "⏰ Tiempos estimados:\n" +
    "- Revisión de estudios: 20 días hábiles\n" +
    "- Registro de opción: 5 días hábiles\n" +
    "- Asignación de fecha: 15 días hábiles\n\n" +
    "💰 Costos aproximados (2024):\n" +
    "- Registro de opción: $1,500 MXN\n" +
    "- Examen profesional: $3,000 MXN\n" +
    "- Título y cédula: $2,500 MXN",

  "¿Dónde encuentro mi horario de clases?":
    "📱 Acceso al SAES:\n\n" +
    "1. Ingresa a <a href='https://saes.upiicsa.ipn.mx' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:text-blue-700 underline'>saes.upiicsa.ipn.mx</a>\n" +
    "2. Usa tus credenciales:\n" +
    "   - Usuario: Número de boleta\n" +
    "   - Contraseña: La que registraste\n\n" +
    "📍 Dentro del SAES:\n" +
    "1. Menú principal → 'Horario'\n" +
    "2. Selecciona el periodo actual\n" +
    "3. Visualiza o descarga tu horario\n\n" +
    "🔍 Información disponible:\n" +
    "- Materias inscritas\n" +
    "- Horarios de clase\n" +
    "- Profesores asignados\n" +
    "- Salones/laboratorios\n\n" +
    "⚠️ Problemas comunes y soluciones:\n" +
    "- Contraseña olvidada: Acudir a Gestión Escolar\n" +
    "- Error de acceso: Limpiar caché del navegador\n" +
    "- Horario no visible: Verificar estado de inscripción\n\n" +
    "📞 Soporte técnico:\n" +
    "- Correo: soporte.saes@ipn.mx\n" +
    "- Extensión: 70025",

  "¿Cómo contacto a mi coordinador?":
    "📍 Ubicación por Carrera:\n\n" +
    "🖥️ ISC (Sistemas Computacionales):\n" +
    "- Edificio de Gobierno, Planta Baja\n" +
    "- Coordinador: M. en C. Juan Carlos Cruz Romero\n" +
    "- Extensión: 70066\n\n" +
    "⚙️ IM (Mecánica):\n" +
    "- Edificio de Gobierno, 1er Piso\n" +
    "- Coordinador: Ing. José Luis Melo Ramírez\n" +
    "- Extensión: 70067\n\n" +
    "💻 IC (Informática):\n" +
    "- Edificio de Gobierno, 2do Piso\n" +
    "- Coordinador: M. en C. Edgar Armando Catalán Salgado\n" +
    "- Extensión: 70068\n\n" +
    "🏭 IIA (Industrial):\n" +
    "- Edificio de Gobierno, 3er Piso\n" +
    "- Coordinador: M. en C. Sergio Fuenlabrada Velázquez\n" +
    "- Extensión: 70069\n" +
    "📊 LA (Administración):\n" +
    "- Edificio de Gobierno, 4to Piso\n" +
    "- Coordinador: M. en C. María Elena Marín Conde\n" +
    "- Extensión: 70070\n\n" +
    "⏰ Horario de Atención General:\n" +
    "- Lunes a Viernes: 8:00 a 20:00 hrs\n" +
    "- Horario de comida: 14:00 a 15:00 hrs\n\n" +
    "📝 Recomendaciones:\n" +
    "1. Agenda una cita por correo\n" +
    "2. Prepara tus documentos\n" +
    "3. Sé puntual\n" +
    "4. Ten clara tu consulta\n\n" +
    "📧 Formato de correo sugerido:\n" +
    "Asunto: [Número de Boleta] - Motivo de consulta\n" +
    "Cuerpo: Nombre completo, semestre, descripción breve",

  "¿Cuál es el proceso de reinscripción?":
    "🎯 Proceso Completo de Reinscripción:\n\n" +
    "1️⃣ Preparación:\n" +
    "- Verifica tu situación académica\n" +
    "- Consulta tu fecha de reinscripción\n" +
    "- Ten lista tu forma de pago\n\n" +
    "2️⃣ Pago de Derechos:\n" +
    "- Descarga la referencia bancaria del SAES\n" +
    "- Realiza el pago (banco o transferencia)\n" +
    "- Guarda tu comprobante\n\n" +
    "3️⃣ Selección de Materias:\n" +
    "- Ingresa al SAES en tu fecha y hora\n" +
    "- Revisa disponibilidad de grupos\n" +
    "- Selecciona tus materias\n" +
    "- Confirma tu horario\n\n" +
    "4️⃣ Documentación:\n" +
    "- Descarga e imprime tu comprobante\n" +
    "- Guarda una copia digital\n\n" +
    "📅 Fechas Importantes:\n" +
    "- Publicación de fechas: 2 semanas antes\n" +
    "- Periodo de pagos: 1 semana antes\n" +
    "- Ajustes de horario: Primera semana\n\n" +
    "💰 Costos de Referencia (2024):\n" +
    "- Reinscripción regular: $800 MXN\n" +
    "- Recursamiento: $1,000 MXN por materia\n" +
    "- Seguro facultativo: $100 MXN\n\n" +
    "⚠️ Consideraciones Importantes:\n" +
    "- Respetar seriación de materias\n" +
    "- Verificar cupos disponibles\n" +
    "- Revisar traslapes de horario\n" +
    "- Considerar tiempos de traslado\n\n" +
    "🔗 Enlaces Útiles:\n" +
    "- Calendario oficial: <a href='https://www.upiicsa.ipn.mx/estudiantes/calendario.html' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:text-blue-700 underline'>www.upiicsa.ipn.mx/estudiantes/calendario.html</a>\n" +
    "- SAES: <a href='https://saes.upiicsa.ipn.mx' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:text-blue-700 underline'>saes.upiicsa.ipn.mx</a>\n\n" +
    "📞 Soporte:\n" +
    "- Gestión Escolar: Ext. 70001\n" +
    "- Soporte SAES: Ext. 70025\n" +
    "- Coordinaciones: Según carrera",

  "¿Dónde encuentro mi boleta?":
    "📊 Acceso a Calificaciones:\n\n" +
    "1️⃣ Ingreso al SAES:\n" +
    "- Visita <a href='https://saes.upiicsa.ipn.mx' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:text-blue-700 underline'>saes.upiicsa.ipn.mx</a>\n" +
    "- Ingresa con tu usuario y contraseña\n\n" +
    "2️⃣ Navegación:\n" +
    "- Menú 'Calificaciones'\n" +
    "- Selecciona periodo\n" +
    "- Visualiza o descarga PDF\n\n" +
    "📅 Fechas Importantes:\n" +
    "- Publicación parciales: Semanas 6, 12, 18\n" +
    "- Calificaciones finales: 1 semana post-semestre\n" +
    "- Periodo de aclaraciones: 2 semanas\n\n" +
    "📝 Información Disponible:\n" +
    "- Calificaciones por unidad\n" +
    "- Promedio final\n" +
    "- Porcentaje de asistencia\n" +
    "- Observaciones del profesor\n\n" +
    "⚠️ Aclaraciones:\n" +
    "1. Hablar primero con el profesor\n" +
    "2. Acudir a la academia\n" +
    "3. Contactar al coordinador\n" +
    "4. Gestión escolar como último recurso\n\n" +
    "📊 Escala de Calificaciones:\n" +
    "- NA: No Acreditado\n" +
    "- 6-10: Calificación aprobatoria\n" +
    "- NP: No Presentó\n\n" +
    "🎓 Impacto Académico:\n" +
    "- Promedio para titulación\n" +
    "- Becas y estímulos\n" +
    "- Movilidad académica\n" +
    "- Prácticas profesionales",

  // Chistes
  "Cuéntame un chiste": [
    "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter 😄",
    "¿Qué le dice un jaguar a otro jaguar? Jaguar you 😄",
    "¿Qué le dice un techo a otro techo? ¡Techo de menos! 😄",
    "¿Por qué el libro de matemáticas está triste? Porque tiene muchos problemas 😄",
    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba! 😄"
  ],
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
    "La Semana Académica UPIICSA se celebra generalmente en marzo. Las fechas exactas se anuncian al inicio de cada año en <a href='https://www.upiicsa.ipn.mx' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:text-blue-700 underline'>www.upiicsa.ipn.mx</a>",
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
    "¡Siempre hay algo chido! 🎉\n- Semana UPIICSA (marzo)\n- Torneos deportivos (todo el semestre)\n- Congresos por carrera\n- Hackathones\n- Ferias de empleo\n\nCheca las fechas en <a href='https://www.upiicsa.ipn.mx/eventos' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:text-blue-700 underline'>www.upiicsa.ipn.mx/eventos</a>",

  // Respuestas emocionales y de apoyo
  "Estoy triste": [
    "Lamento escuchar que te sientes así. ¿Quieres hablar sobre lo que te preocupa? Estoy aquí para escucharte 🫂",
    "A veces es normal sentirnos tristes. ¿Te gustaría que te cuente un chiste para animarte un poco? 😊",
    "Entiendo que te sientas así. ¿Has considerado hablar con el departamento de orientación juvenil? Están para apoyarte 💙"
  ],
  "Me siento mal": [
    "¿Quieres contarme qué te está pasando? A veces hablar ayuda a sentirnos mejor 🤗",
    "Lamento que te sientas así. ¿Hay algo específico que te preocupe?",
    "Estoy aquí para escucharte. ¿Te gustaría que te comparta algunos recursos de apoyo disponibles en UPIICSA?"
  ],
  "Tengo problemas": [
    "Entiendo que estés pasando por un momento difícil. ¿Quieres contarme más sobre ello?",
    "A veces todos necesitamos ayuda. ¿Te gustaría que te conecte con el departamento de orientación?",
    "Estoy aquí para escucharte y ayudarte a encontrar soluciones 🤝"
  ],
  "Me siento solo": [
    "La escuela puede ser desafiante a veces. ¿Has considerado unirte a alguno de nuestros clubs? Es una excelente manera de conocer personas con intereses similares 🤗",
    "Entiendo cómo te sientes. ¿Sabías que tenemos varios grupos de estudio y actividades extracurriculares?",
    "No estás solo/a. UPIICSA tiene una gran comunidad y muchas actividades donde puedes participar 💚"
  ],
  "Necesito ayuda": [
    "Estoy aquí para ayudarte. ¿Podrías contarme más específicamente qué tipo de ayuda necesitas?",
    "Claro, ¿qué tipo de apoyo estás buscando? Hay varios recursos disponibles en UPIICSA",
    "Por supuesto, ¿es algo académico, personal o administrativo? Así podré orientarte mejor 🤝"
  ],
  
  // Información detallada sobre carreras
  "¿Qué significa ISC?": 
    "ISC significa Ingeniería en Sistemas Computacionales. Es una carrera enfocada en el desarrollo de software, sistemas computacionales y tecnologías de la información. Los egresados pueden trabajar en desarrollo de software, administración de sistemas, ciberseguridad y más.",
  
  "¿Qué significa IM?":
    "IM significa Ingeniería Mecánica. Esta carrera se enfoca en el diseño, manufactura y mantenimiento de sistemas mecánicos. Los egresados pueden trabajar en industrias como automotriz, aeroespacial, manufactura y más.",
  
  "¿Qué significa IC?":
    "IC significa Ingeniería en Informática. Esta carrera se centra en la gestión de tecnologías de información, redes y sistemas empresariales. Los egresados pueden trabajar en consultoría IT, administración de proyectos tecnológicos y más.",
  
  "¿Qué significa IIA?":
    "IIA significa Ingeniería Industrial y Administrativa. Esta carrera combina conocimientos de ingeniería industrial con habilidades administrativas. Los egresados pueden trabajar en optimización de procesos, gestión de calidad, logística y más.",
  
  "¿Qué significa LA?":
    "LA significa Licenciatura en Administración. Esta carrera forma profesionales en la gestión y dirección de organizaciones. Los egresados pueden trabajar en áreas como recursos humanos, finanzas, marketing y más.",

  "¿Qué significa cada abreviatura?":
    "En UPIICSA tenemos las siguientes carreras:\n\n" +
    "- ISC: Ingeniería en Sistemas Computacionales\n" +
    "- IM: Ingeniería Mecánica\n" +
    "- IC: Ingeniería en Informática\n" +
    "- IIA: Ingeniería Industrial y Administrativa\n" +
    "- LA: Licenciatura en Administración\n\n" +
    "¿Te gustaría saber más detalles sobre alguna carrera en específico?",
};
