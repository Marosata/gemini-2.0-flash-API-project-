import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialisation du client Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


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