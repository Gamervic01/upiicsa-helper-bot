import { Pipeline, pipeline } from '@xenova/transformers';
import { toast } from 'sonner';

export type CustomPipeline = Pipeline & {
  processor?: any;
};

export const loadModel = async (): Promise<CustomPipeline> => {
  try {
    return await pipeline(
      'question-answering',
      'Xenova/distilbert-base-multilingual-cased',
      {
        progress_callback: (progress: any) => {
          const percentage = Math.round(progress.progress * 100);
          console.log(`Loading model: ${percentage}%`);
          if (progress.progress < 1) {
            toast.loading(`Cargando modelo de IA: ${percentage}%`);
          } else {
            toast.dismiss();
          }
        },
        quantized: false,
        revision: 'main'
      }
    ) as CustomPipeline;
  } catch (error) {
    console.error('Error loading model:', error);
    toast.error('Error al cargar el modelo de IA');
    throw error;
  }
};