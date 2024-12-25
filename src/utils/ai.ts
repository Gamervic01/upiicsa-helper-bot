import { pipeline } from '@huggingface/transformers';

let model: any = null;

const initializeModel = async () => {
  if (!model) {
    console.log('Inicializando modelo de IA...');
    try {
      model = await pipeline(
        'text-generation',
        'PlanTL-GOB-ES/gpt2-small-bne',  // Using a public Spanish model
        { device: 'cpu' }
      );
      console.log('Modelo de IA inicializado');
    } catch (error) {
      console.error('Error al inicializar el modelo:', error);
      throw error;
    }
  }
  return model;
};

export const getAIResponse = async (message: string) => {
  try {
    const generator = await initializeModel();
    
    const systemPrompt = 'Eres un asistente virtual amigable de UPIICSA (Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas) del IPN. Responde: ';
    
    const result = await generator(systemPrompt + message, {
      max_new_tokens: 100,
      temperature: 0.7,
      repetition_penalty: 1.2,
    });

    return result[0].generated_text.replace(systemPrompt, '');
  } catch (error) {
    console.error('Error al generar respuesta:', error);
    return 'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?';
  }
};