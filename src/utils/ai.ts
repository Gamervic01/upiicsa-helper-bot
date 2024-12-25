export const getAIResponse = async (message: string, apiKey: string) => {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente virtual amigable de UPIICSA (Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas) del IPN (Instituto Politécnico Nacional). Tu objetivo es ayudar a los estudiantes y visitantes con información sobre la escuela, trámites y servicios. Debes ser cordial y profesional, manteniendo un tono amigable. Responde siempre en español.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener respuesta de la IA');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    return 'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?';
  }
};