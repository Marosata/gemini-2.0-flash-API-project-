// File d'attente en mémoire
const queue = new Map();

/**
 * Ajoute une tâche à la file d'attente
 * @param {string} prompt - Le prompt à traiter
 * @returns {string} - L'ID de la tâche
 */
export function enqueue(prompt) {
    const jobId = Date.now().toString();
    queue.set(jobId, {
        status: 'pending',
        prompt,
        result: null,
        createdAt: Date.now()
    });
    return jobId;
}

/**
 * Met à jour le statut d'une tâche
 * @param {string} jobId - L'ID de la tâche
 * @param {string} status - Le nouveau statut
 * @param {Object} result - Le résultat de la tâche
 */
export function updateJobStatus(jobId, status, result = null) {
    const job = queue.get(jobId);
    if (job) {
        job.status = status;
        job.result = result;
        queue.set(jobId, job);
    }
}

/**
 * Récupère le statut d'une tâche
 * @param {string} jobId - L'ID de la tâche
 * @returns {Object} - Le statut et le résultat de la tâche
 */
export function getJobStatus(jobId) {
    const job = queue.get(jobId);
    if (!job) {
        return null;
    }
    return {
        status: job.status,
        result: job.result
    };
}

/**
 * Traite la file d'attente
 * @param {Function} processFunction - La fonction à exécuter pour chaque tâche
 */
export async function processQueue(processFunction) {
    for (const [jobId, job] of queue.entries()) {
        if (job.status === 'pending') {
            try {
                const result = await processFunction(job.prompt);
                updateJobStatus(jobId, 'completed', result);
            } catch (error) {
                updateJobStatus(jobId, 'failed', { error: error.message });
            }
        }
    }
} 