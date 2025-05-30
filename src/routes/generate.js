import { generateResponse } from '../services/gemini.js';
import jwt from 'jsonwebtoken';


export async function generateRoute(req, res) {
    try {
        const { prompt } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        // Récupération de l'IP d'origine en tenant compte des proxies
        const forwardedFor = req.headers['x-forwarded-for'];
        const clientIP = forwardedFor ? forwardedFor.split(',')[0] : 
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
            
            // Vérification de l'adresse IP avec une tolérance pour les proxies
            const expectedIPs = decoded.ip.split(',');
            if (!expectedIPs.includes(clientIP)) {
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