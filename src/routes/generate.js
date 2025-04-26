import { generateResponse } from '../services/gemini.js';
import jwt from 'jsonwebtoken';


export async function generateRoute(req, res) {
    try {
        const { prompt } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const clientIP = req.headers['x-forwarded-for'] || 
                        req.headers['x-real-ip'] || 
                        req.ip || 
                        req.connection.remoteAddress;

        // Vérification du token JWT
        if (!token) {
            return res.status(401).json({ error: 'Token manquant dans les headers' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Vérification de l'adresse IP
            if (decoded.ip !== clientIP) {
                console.log('IP mismatch:', {
                    expected: decoded.ip,
                    received: clientIP,
                    headers: req.headers
                });
                return res.status(401).json({ 
                    error: 'Adresse IP non autorisée',
                    expected: decoded.ip,
                    received: clientIP
                });
            }
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