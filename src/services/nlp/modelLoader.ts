import { toast } from 'sonner';

export type CustomPipeline = {
  (options: { question: string; context: string }): Promise<{ answer: string }>;
};

const HF_TOKEN = "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";
const API_URL = "https://api-inference.huggingface.co/models/mrm8488/bert-spanish-cased-finetuned-sparkles-squad2";

export const loadModel = async (): Promise<CustomPipeline> => {
  try {
    // Implementación usando la API de Hugging Face
    const pipeline: CustomPipeline = async ({ question, context }) => {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: {
              question,
              context
            }
          }),
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta de Hugging Face');
        }

        const result = await response.json();
        
        if (result.error) {
          console.error('Error from Hugging Face:', result.error);
          return {
            answer: "Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo."
          };
        }

        return {
          answer: result.answer || "No encontré una respuesta específica a tu pregunta en el contenido disponible."
        };
      } catch (error) {
        console.error('Error calling Hugging Face API:', error);
        // Fallback a búsqueda por palabras clave si la API falla
        const normalizedQuestion = question.toLowerCase();
        const normalizedContext = context.toLowerCase();
        
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
      }
    };

    toast.success('Sistema de respuestas inicializado');
    return pipeline;
  } catch (error) {
    console.error('Error loading model:', error);
    toast.error('Error al inicializar el sistema de respuestas');
    throw error;
  }
};