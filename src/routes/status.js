import { getJobStatus } from '../services/queue.js';


export function statusRoute(req, res) {
    try {
        const { jobId } = req.query;

        if (!jobId) {
            return res.status(400).json({ error: 'ID de tâche manquant' });
        }

        const status = getJobStatus(jobId);
        if (!status) {
            return res.status(404).json({ error: 'Tâche non trouvée' });
        }

        res.json(status);
    } catch (error) {
        console.error('Erreur dans statusRoute:', error);
        res.status(500).json({ error: error.message });
    }
} 