import { pipeline } from '@huggingface/transformers';

let model: any = null;

const initializeModel = async () => {
  if (!model) {
    console.log('Inicializando modelo de IA...');
    model = await pipeline(
      'text-generation',
      'PlanTL-GOB-ES/gpt2-large-bne',
      { device: 'cpu' }
    );
    console.log('Modelo de IA inicializado');
  }
  return model;
};

export const getAIResponse = async (message: string) => {
  try {
    const generator = await initializeModel();
    
    const systemPrompt = `Eres un asistente virtual amigable y profesional de UPIICSA (Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas) del IPN. 
    Tu objetivo es ayudar a los estudiantes y proporcionar información precisa.
    Analiza cuidadosamente cada pregunta y proporciona respuestas detalladas y útiles.
    Si no estás seguro de algo, indícalo claramente.
    Respuesta a: `;
    
    const result = await generator(systemPrompt + message, {
      max_new_tokens: 150,
      temperature: 0.7,
      top_k: 50,
      top_p: 0.9,
      repetition_penalty: 1.2,
      do_sample: true,
    });

    return result[0].generated_text.replace(systemPrompt, '');
  } catch (error) {
    console.error('Error al generar respuesta:', error);
    return 'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?';
  }
};