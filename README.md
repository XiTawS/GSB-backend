# 🧾 GSB Backend - API de Gestion des Notes de Frais

Bienvenue dans la documentation du projet **GSB Backend**. Cette API REST Node.js gère les notes de frais pour le laboratoire Galaxy Swiss Bourdin.

---

## 📚 Contenu de la Documentation
La documentation est divisée en sections pour une meilleure lisibilité :

### 🔐 Authentification
Détails techniques sur la connexion et la gestion des tokens JWT.
[Documentation Authentification](Documentation/Authentication.md)

### 🗄️ Accès aux Données
Détails sur les contrôleurs qui gèrent la logique métier (Utilisateurs, Factures).
[Contrôleur Utilisateurs](Documentation/Users.md) | [Contrôleur Factures](Documentation/Invoices.md)

### 📄 Modèles de Données
Définitions des entités principales (User, Invoice) et leurs schémas Mongoose.
[Documentation des Modèles](Documentation/Models.md)

### ☁️ Stockage Fichiers
Configuration de l'upload (Multer) et du stockage cloud (AWS S3).
[Documentation Stockage](Documentation/Storage.md)

### 📖 Référence API
Toutes les routes, paramètres, body et codes de retour.
[Référence API](Documentation/API-Reference.md)

---

## 🚀 Démarrage Rapide

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/XiTawS/GSB-backend.git
   cd GSB-backend
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   ```bash
   cp .env.example .env
   ```
   > Remplissez les valeurs (voir section ci-dessous).

4. **Lancer en développement** :
   ```bash
   npm run dev
   ```

5. **Lancer en production** :
   ```bash
   npm start
   ```

---

## 🛠️ Stack Technique

| Technologie | Rôle |
| :--- | :--- |
| **Node.js** (≥18) | Runtime JavaScript |
| **Express** | Framework HTTP |
| **MongoDB** / Mongoose | Base de données NoSQL |
| **JWT** | Authentification stateless |
| **AWS S3** | Stockage des fichiers |
| **Multer** | Gestion des uploads |
| **SHA-256** | Hachage des mots de passe |

---

## ⚙️ Variables d'Environnement

| Variable | Description | Exemple |
| :--- | :--- | :--- |
| `PORT` | Port d'écoute du serveur | `3001` |
| `MONGODB_URL` | URI de connexion MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/gsb` |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | `votre-secret-jwt` |
| `SALT` | Salt pour le hachage SHA-256 | `votre-salt` |
| `FRONTEND_URL` | URL du frontend (CORS) | `https://gsb-frontend-six.vercel.app` |
| `AWS_ACCESS_KEY_ID` | Clé d'accès AWS | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Clé secrète AWS | `...` |
| `AWS_BUCKET_NAME` | Nom du bucket S3 | `gsb-uploads` |

> [!IMPORTANT]
> Assurez-vous que toutes les variables sont correctement renseignées avant de lancer le serveur. Sans `MONGODB_URL`, le serveur refusera de démarrer.

---

## 🏗️ Architecture

```
src/
├── index.js                          # Point d'entrée Express
├── controllers/
│   ├── authentication_controller.js  # Login, vérification JWT
│   ├── invoice_controller.js         # CRUD factures
│   └── user_controller.js            # CRUD utilisateurs
├── models/
│   ├── invoice_model.js              # Schéma Mongoose (facture)
│   └── user_model.js                 # Schéma Mongoose (utilisateur)
├── routes/
│   ├── authentication_route.js       # POST /auth/login
│   ├── invoice_route.js              # CRUD /invoices
│   └── user_route.js                 # CRUD /users
├── middlewares/
│   └── upload.js                     # Configuration Multer
└── utils/
    └── s3.js                         # Client AWS S3
```

---

## 🌐 Déploiement

| Service | Plateforme | URL |
| :--- | :--- | :--- |
| **Backend** | Render | `https://gsb-backend-946k.onrender.com` |
| **Frontend** | Vercel | `https://gsb-frontend-six.vercel.app` |

---

## 👤 Comptes de Test

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@gsb.fr` | `admin123` |
| **Utilisateur** | `user@gsb.fr` | `user123` |
