import { generateResponse } from '../services/gemini.js';
import jwt from 'jsonwebtoken';

/**
 * Route pour la génération directe de réponse
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 */
export async function generateRoute(req, res) {
    try {
        const { prompt, token } = req.body;

        // Vérification du token JWT
        if (!token) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ error: 'Token invalide' });
        }

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt manquant' });
        }

        const result = await generateResponse(prompt);
        res.json(result);
    } catch (error) {
        console.error('Erreur dans generateRoute:', error);
        res.status(500).json({ error: error.message });
    }
} 