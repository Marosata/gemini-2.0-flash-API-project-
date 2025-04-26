import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialisation du client Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Génère une réponse à partir d'un prompt en utilisant Gemini
 * @param {string} prompt - Le prompt à envoyer à Gemini
 * @returns {Promise<{text: string, id: string}>} - La réponse et l'ID de la génération
 */
export async function generateResponse(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return {
            text,
            id: Date.now().toString() // ID simple basé sur le timestamp
        };
    } catch (error) {
        console.error('Erreur lors de la génération avec Gemini:', error);
        throw new Error('Erreur lors de la génération de la réponse');
    }
} 