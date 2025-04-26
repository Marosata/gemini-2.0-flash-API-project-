import jwt from 'jsonwebtoken';


export function generateTokenRoute(req, res) {
    try {
        // Récupération de toutes les IPs possibles
        const forwardedFor = req.headers['x-forwarded-for'];
        const realIP = req.headers['x-real-ip'];
        const directIP = req.ip;
        const connectionIP = req.connection.remoteAddress;

        // Création d'un tableau d'IPs uniques
        const allIPs = [
            ...(forwardedFor ? forwardedFor.split(',') : []),
            realIP,
            directIP,
            connectionIP
        ].filter(ip => ip && ip !== '::1' && ip !== '127.0.0.1');

        const uniqueIPs = [...new Set(allIPs)].join(',');

        // Génération du token
        const token = jwt.sign(
            { 
                ip: uniqueIPs,
                timestamp: Date.now()
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            ip: uniqueIPs,
            expiresIn: '1h'
        });
    } catch (error) {
        console.error('Erreur dans generateTokenRoute:', error);
        res.status(500).json({ error: error.message });
    }
} 