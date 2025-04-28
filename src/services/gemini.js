import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { addToGeminiQueue } from './geminiLimiter.js';

dotenv.config();

// Initialisation du client Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export async function generateResponse(prompt) {
    try {
        // Ajout de la requête à la file d'attente Gemini
        const result = await addToGeminiQueue(async () => {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            return {
                text,
                id: Date.now().toString()
            };
        });

        return result;
    } catch (error) {
        console.error('Erreur lors de la génération avec Gemini:', error);
        throw new Error('Erreur lors de la génération de la réponse');
    }
} 