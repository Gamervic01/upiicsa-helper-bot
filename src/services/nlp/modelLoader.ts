import { pipeline } from '@xenova/transformers';
import { toast } from 'sonner';

export type CustomPipeline = {
  (options: { question: string; context: string }): Promise<{ answer: string }>;
};

export const loadModel = async (): Promise<CustomPipeline> => {
  try {
    // Cargar el modelo de question-answering en español
    const qa = await pipeline('question-answering', 'Xenova/distilbert-base-multilingual-cased-qa');
    
    const customPipeline: CustomPipeline = async ({ question, context }) => {
      try {
        const result = await qa({
          question,
          context,
        });

        return {
          answer: result.answer || "No encontré una respuesta específica a tu pregunta en el contenido disponible."
        };
      } catch (error) {
        console.error('Error processing question:', error);
        return {
          answer: "Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo."
        };
      }
    };

    toast.success('Sistema de respuestas inicializado');
    return customPipeline;
  } catch (error) {
    console.error('Error loading model:', error);
    toast.error('Error al inicializar el sistema de respuestas');
    throw error;
  }
};