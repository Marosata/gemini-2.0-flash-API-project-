// File d'attente pour Gemini
const geminiQueue = [];
let isProcessing = false;
const GEMINI_COOLDOWN = 10000; // 10 secondes

/**
 * Ajoute une requête à la file d'attente Gemini
 * @param {Function} task - La fonction à exécuter
 * @returns {Promise<any>} - Le résultat de la tâche
 */
export async function addToGeminiQueue(task) {
    return new Promise((resolve, reject) => {
        geminiQueue.push({ task, resolve, reject });
        processQueue();
    });
}

/**
 * Traite la file d'attente Gemini
 */
async function processQueue() {
    if (isProcessing || geminiQueue.length === 0) return;

    isProcessing = true;
    const { task, resolve, reject } = geminiQueue.shift();

    try {
        const result = await task();
        resolve(result);
    } catch (error) {
        reject(error);
    }

    // Attendre 10 secondes avant de traiter la prochaine requête
    setTimeout(() => {
        isProcessing = false;
        processQueue();
    }, GEMINI_COOLDOWN);
} 