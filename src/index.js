import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { generateRoute } from './routes/generate.js';
import { enqueueRoute } from './routes/enqueue.js';
import { statusRoute } from './routes/status.js';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configuration du rate limiter
const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 secondes
    max: 1, // limite à 1 requête par fenêtre
    message: { error: 'Trop de requêtes, veuillez patienter 10 secondes' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.post('/api/generate', generateRoute);
app.post('/api/enqueue', enqueueRoute);
app.get('/api/status', statusRoute);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur est survenue sur le serveur' });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
}); 