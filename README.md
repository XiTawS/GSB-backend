# GSB Backend

API REST pour la gestion des notes de frais — Galaxy Swiss Bourdin.

## Stack technique

| Technologie | Rôle |
|-------------|------|
| **Node.js** (≥18) | Runtime |
| **Express** | Framework HTTP |
| **MongoDB** / Mongoose | Base de données |
| **JWT** | Authentification |
| **AWS S3** | Stockage fichiers (justificatifs, avatars) |
| **Multer** | Upload multipart |
| **SHA-256** | Hash des mots de passe |

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/XiTawS/GSB-backend.git
cd GSB-backend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# → Remplir les valeurs (voir section ci-dessous)

# 4. Lancer en développement
npm run dev

# 5. Lancer en production
npm start
```

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port d'écoute | `3001` |
| `MONGODB_URL` | URI MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/gsb` |
| `JWT_SECRET` | Clé secrète JWT | `votre-secret-jwt` |
| `SALT` | Salt pour le hash SHA-256 | `votre-salt` |
| `FRONTEND_URL` | URL du frontend (CORS) | `https://gsb-frontend-six.vercel.app` |
| `AWS_ACCESS_KEY_ID` | Clé AWS S3 | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Secret AWS S3 | `...` |
| `AWS_BUCKET_NAME` | Nom du bucket S3 | `gsb-uploads` |

## Architecture

```
src/
├── index.js                    # Point d'entrée, config Express + MongoDB
├── controllers/
│   ├── authentication_controller.js  # Login, vérification JWT
│   ├── invoice_controller.js         # CRUD factures
│   └── user_controller.js            # CRUD utilisateurs
├── models/
│   ├── invoice_model.js        # Schéma Mongoose (facture)
│   └── user_model.js           # Schéma Mongoose (utilisateur)
├── routes/
│   ├── authentication_route.js # POST /auth/login
│   ├── invoice_route.js        # CRUD /invoices
│   └── user_route.js           # CRUD /users
├── middlewares/
│   └── upload.js               # Multer (upload fichiers, max 5MB)
└── utils/
    └── s3.js                   # Upload vers AWS S3
```

## API Reference

### Authentification

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| `POST` | `/auth/login` | Connexion | ❌ |

**Body :**
```json
{ "email": "user@gsb.fr", "password": "user123" }
```

**Réponse :** `{ "token": "eyJhbG..." }`

---

### Utilisateurs

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| `POST` | `/users` | Créer un utilisateur | ❌ |
| `GET` | `/users` | Lister tous les utilisateurs | ✅ |
| `GET` | `/users?email=xxx` | Récupérer un utilisateur par email | ✅ |
| `PUT` | `/users?email=xxx` | Modifier un utilisateur | ✅ |
| `DELETE` | `/users?email=xxx` | Supprimer un utilisateur | ✅ |

**Créer un utilisateur :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@gsb.fr",
  "password": "motdepasse",
  "role": "user"
}
```

**Modifier un utilisateur :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "newEmail": "jean.dupont@gsb.fr",
  "password": "nouveaumotdepasse",
  "role": "admin",
  "avatar": "https://..." 
}
```

---

### Factures

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| `POST` | `/invoices` | Créer une facture (multipart) | ✅ |
| `GET` | `/invoices` | Lister les factures | ✅ |
| `GET` | `/invoices/:id` | Détail d'une facture | ❌ |
| `PUT` | `/invoices/:id` | Modifier une facture | ❌ |
| `DELETE` | `/invoices/:id` | Supprimer une facture | ❌ |

> **Note :** Les admins voient toutes les factures, les utilisateurs ne voient que les leurs.

**Créer une facture (multipart/form-data) :**
- `proof` : fichier image ou PDF (max 5MB)
- `metadata` : JSON stringifié contenant :
```json
{
  "title": "Restaurant client",
  "date": "2026-03-07T12:00:00.000Z",
  "amount": 45.50,
  "type": "Repas",
  "description": "Déjeuner avec le client X",
  "status": "Pending"
}
```

**Statuts possibles :** `Pending`, `Approved`, `Rejected`

---

### Modèles de données

**User**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `firstName` | String | ✅ | Prénom |
| `lastName` | String | ✅ | Nom |
| `email` | String | ✅ | Email (unique) |
| `password` | String | ✅ | Hash SHA-256 |
| `role` | String | ✅ | `user` ou `admin` |
| `avatar` | String | ❌ | URL avatar |
| `createdAt` | Date | auto | Date de création |

**Invoice**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `title` | String | ✅ | Titre de la facture |
| `date` | String | ✅ | Date de la dépense |
| `amount` | Number | ✅ | Montant en euros |
| `proof` | String | ❌ | URL du justificatif (S3) |
| `description` | String | ✅ | Description |
| `user` | ObjectId | ❌ | Ref vers User |
| `status` | String | ✅ | `Pending` / `Approved` / `Rejected` |
| `type` | String | ✅ | Type de dépense |
| `createdAt` | Date | auto | Date de création |

## Déploiement

Le backend est déployé sur **Render** (plan free) :
- Auto-deploy depuis `main`
- URL : `https://gsb-backend-946k.onrender.com`

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@gsb.fr` | `admin123` |
| User | `user@gsb.fr` | `user123` |
