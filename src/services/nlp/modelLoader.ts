import { toast } from 'sonner';

export type CustomPipeline = {
  (options: { question: string; context: string }): Promise<{ answer: string }>;
};

export const loadModel = async (): Promise<CustomPipeline> => {
  try {
    // Implementación simple basada en coincidencia de palabras clave
    const pipeline: CustomPipeline = async ({ question, context }) => {
      // Normalizar el texto para búsqueda
      const normalizedQuestion = question.toLowerCase();
      const normalizedContext = context.toLowerCase();
      
      // Encontrar la oración más relevante del contexto
      const sentences = context.split(/[.!?]+/).filter(s => s.trim());
      let bestMatch = '';
      let bestScore = 0;
      
      for (const sentence of sentences) {
        const words = normalizedQuestion.split(/\s+/);
        const score = words.filter(word => 
          normalizedContext.includes(word.toLowerCase())
        ).length;
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = sentence.trim();
        }
      }
      
      return {
        answer: bestMatch || "No encontré una respuesta específica a tu pregunta en el contenido disponible."
      };
    };

    toast.success('Sistema de respuestas inicializado');
    return pipeline;
  } catch (error) {
    console.error('Error loading model:', error);
    toast.error('Error al inicializar el sistema de respuestas');
    throw error;
  }
};