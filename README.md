# API Gemini

API Node.js pour l'intégration de Gemini 2.0 Flash via la bibliothèque @googleapis/js-genai.

## Prérequis

- Node.js 18+
- Clé API Gemini (obtenue sur https://aistudio.google.com/apikey)

## Installation

1. Cloner le dépôt
2. Installer les dépendances :
```bash
npm install
```
3. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
```
GEMINI_API_KEY=votre_clé_api_ici
JWT_SECRET=votre_secret_jwt_ici
PORT=3000
```

## Utilisation

### Démarrage du serveur

```bash
npm run dev
```

### Endpoints

#### POST /api/generate
Génère une réponse directement via Gemini.

Body :
```json
{
    "prompt": "Votre prompt ici",
    "token": "Votre JWT token"
}
```

#### POST /api/enqueue
Ajoute une tâche à la file d'attente.

Body :
```json
{
    "prompt": "Votre prompt ici",
    "token": "Votre JWT token"
}
```

#### GET /api/status
Vérifie le statut d'une tâche.

Query params :
- jobId: ID de la tâche

## Sécurité

- Authentification via JWT
- Rate limiting : 1 requête par 10 secondes par IP
- Validation des entrées
- Gestion des erreurs

## Structure du projet

```
src/
  ├── index.js          # Point d'entrée de l'application
  ├── routes/           # Routes de l'API
  │   ├── generate.js   # Route de génération directe
  │   ├── enqueue.js    # Route d'ajout à la file d'attente
  │   └── status.js     # Route de vérification du statut
  └── services/         # Services métier
      ├── gemini.js     # Service d'intégration Gemini
      └── queue.js      # Service de file d'attente
``` 