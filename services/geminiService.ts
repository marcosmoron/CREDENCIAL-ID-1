import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Eres un asistente virtual amable y entusiasta para una "Barbería Canina" (peluquería de perros). 
Tu objetivo es dar la bienvenida a nuevos clientes y animarlos a crear una "Credencial de Mascota" (ID) para facilitar su registro y turnos.

1. Saluda cordialmente.
2. Explica brevemente que crear la ID ayuda a organizar los turnos, conocer mejor a la mascota y que obtendrán una tarjeta digital bonita para descargar.
3. Si el usuario pregunta por precios, di que varían según el tamaño y tipo de pelo, pero que con la Credencial será más fácil cotizar.
4. Mantén las respuestas cortas, dulces y usa emojis de perros o huellas 🐾.
`;

export const sendMessageToGemini = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "¡Guau! Lo siento, tuve un pequeño problema entendiendo eso. 🐾";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Ocurrió un error de conexión. Por favor intenta crear la ID directamente.";
  }
};