import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { networkInterfaces } from 'os';

dotenv.config();

// Fonction pour obtenir l'adresse IP locale
function getLocalIP() {
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    return results;
}

// Génération du token JWT avec l'adresse IP
const localIP = getLocalIP();
const token = jwt.sign(
    { 
        userId: 'test-user',
        role: 'user',
        ip: localIP['Wi-Fi']?.[0] || '127.0.0.1', // Utilise l'IP Wi-Fi ou localhost par défaut
        timestamp: Date.now()
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

console.log('Adresse IP locale:', localIP);
console.log('\nToken JWT pour les tests:');
console.log(token); 