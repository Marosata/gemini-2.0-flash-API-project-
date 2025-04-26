import jwt from 'jsonwebtoken';
import { networkInterfaces } from 'os';

export function generateTokenRoute(req, res) {
    try {
        // Récupération de l'IP du client
        const clientIP = req.ip || req.connection.remoteAddress;

        // Génération du token
        const token = jwt.sign(
            { 
                ip: clientIP,
                timestamp: Date.now()
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            ip: clientIP,
            expiresIn: '1h'
        });
    } catch (error) {
        console.error('Erreur dans generateTokenRoute:', error);
        res.status(500).json({ error: error.message });
    }
} 