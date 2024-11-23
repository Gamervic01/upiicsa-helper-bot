export type CustomPipeline = {
  (options: { question: string; context: string }): Promise<{ answer: string }>;
};

export const loadModel = async (): Promise<CustomPipeline> => {
  const customPipeline: CustomPipeline = async ({ question, context }) => {
    try {
      // Implementación simple basada en coincidencia de patrones
      const sentences = context.split(/[.!?]+/).filter(Boolean);
      let bestMatch = '';
      let bestScore = 0;

      const questionWords = question.toLowerCase().split(' ');

      sentences.forEach(sentence => {
        const sentenceWords = sentence.toLowerCase().split(' ');
        let score = 0;

        questionWords.forEach(word => {
          if (sentenceWords.includes(word)) {
            score += 1;
          }
        });

        if (score > bestScore) {
          bestScore = score;
          bestMatch = sentence.trim();
        }
      });

      return {
        answer: bestScore > 0 
          ? bestMatch 
          : "No encontré una respuesta específica a tu pregunta en el contenido disponible."
      };
    } catch (error) {
      console.error('Error processing question:', error);
      return {
        answer: "Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo."
      };
    }
  };

  return customPipeline;
};