import { enqueue } from '../services/queue.js';
import jwt from 'jsonwebtoken';

/**
 * Route pour ajouter une tâche à la file d'attente
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 */
export async function enqueueRoute(req, res) {
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

        const jobId = enqueue(prompt);
        res.json({ jobId });
    } catch (error) {
        console.error('Erreur dans enqueueRoute:', error);
        res.status(500).json({ error: error.message });
    }
} 