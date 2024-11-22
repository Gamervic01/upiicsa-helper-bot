const KEYWORDS_MAP: { [key: string]: string[] } = {
  'servicio social': ['servicio', 'social', 'ss', 'servicio_social'],
  'practicas profesionales': ['practicas', 'profesionales', 'pp', 'practicas_profesionales'],
  'electivas': ['electivas', 'optativas', 'materias optativas', 'materias_optativas'],
  'malla curricular': ['malla', 'curricular', 'plan de estudios', 'materias', 'plan_de_estudios'],
  'tramites': ['tramite', 'tramites', 'proceso', 'requisitos', 'documentos'],
  'liberacion': ['liberar', 'liberacion', 'libero', 'acreditar', 'terminar'],
  'informatica': ['informatica', 'sistemas', 'computacion', 'software'],
  'industrial': ['industrial', 'industrias', 'manufactura'],
  'transporte': ['transporte', 'transportes', 'logistica'],
  'metalurgia': ['metalurgia', 'metales', 'metalurgica'],
  'energia': ['energia', 'energias', 'energetica']
};

export const normalizeQuestion = (question: string): string => {
  let normalizedQuestion = question.toLowerCase();
  
  Object.entries(KEYWORDS_MAP).forEach(([key, synonyms]) => {
    synonyms.forEach(synonym => {
      const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
      normalizedQuestion = normalizedQuestion.replace(regex, key);
    });
  });

  return normalizedQuestion;
};