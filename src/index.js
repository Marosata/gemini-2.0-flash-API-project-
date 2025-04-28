import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateRoute } from './routes/generate.js';
import { enqueueRoute } from './routes/enqueue.js';
import { statusRoute } from './routes/status.js';
import { generateTokenRoute } from './routes/token.js';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/token', generateTokenRoute);
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