# GSB Backend

Backend de l'application GSB. Une application de gestion de notes de frais développé avec Node.js, Express et MongoDB.

## 🏗 Architecture

Le projet suit une architecture MVC (Modèle-Vue-Contrôleur) avec une structure de dossiers claire :

```
src/
├── controllers/     # Logique métier
├── models/         # Schémas MongoDB
├── routes/         # Définition des routes
├── middlewares/    # Middlewares personnalisés
├── utils/          # Utilitaires (S3, etc.)
└── index.js        # Point d'entrée de l'application
```

## 🚀 Fonctionnalités

### Authentification
- Inscription des utilisateurs
- Connexion avec JWT
- Gestion des rôles (admin, utilisateur)

### Gestion des Utilisateurs
- CRUD complet des utilisateurs
- Upload d'avatar (stockage sur AWS S3)
- Avatar par défaut pour les nouveaux utilisateurs

### Gestion des Factures
- Création de factures avec preuve (PDF/image)
- Upload des preuves sur AWS S3
- Suivi du statut des factures
- Filtrage par utilisateur/statut

## 🔧 Technologies Utilisées

- **Node.js** : Runtime JavaScript
- **Express** : Framework web
- **MongoDB** : Base de données
- **Mongoose** : ODM pour MongoDB
- **AWS S3** : Stockage des fichiers
- **JWT** : Authentification
- **Multer** : Gestion des uploads de fichiers

## 🛠 Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```env
MONGODB_URL=votre_url_mongodb
JWT_SECRET=votre_secret_jwt
AWS_ACCESS_KEY_ID=votre_clé_aws
AWS_SECRET_ACCESS_KEY=votre_clé_secrète_aws
AWS_BUCKET_NAME=votre_bucket_s3
SALT=votre_salt
```

4. Lancer le serveur
```bash
# Développement
npm run dev

# Production
npm start
```

## 📝 API Endpoints

### Authentification
- `POST /auth/login` : Connexion utilisateur

### Utilisateurs
- `POST /users` : Création d'un utilisateur
- `GET /users` : Liste des utilisateurs
- `PUT /users` : Modification d'un utilisateur
- `DELETE /users` : Suppression d'un utilisateur

### Factures
- `POST /invoices` : Création d'une facture
- `GET /invoices` : Liste des factures
- `GET /invoices/:id` : Détails d'une facture
- `PUT /invoices/:id` : Modification d'une facture
- `DELETE /invoices/:id` : Suppression d'une facture

## 🔒 Sécurité

- Authentification JWT
- Hachage des mots de passe avec SHA-256
- Validation des types de fichiers (images/PDF)
- Limitation de la taille des fichiers
- CORS configuré pour la production

## 🚀 Déploiement

Le projet est déployé sur Render.com avec les configurations suivantes :
- Build Command : `npm run build`
- Start Command : `npm start`
- Node Version : >= 18.0.0

## 📦 Structure des Données

### Utilisateur
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
  avatar: String,
  createdAt: Date
}
```

### Facture
```javascript
{
  title: String,
  date: String,
  amount: Number,
  proof: String,
  description: String,
  user: ObjectId,
  status: String,
  type: String,
  createdAt: Date
}
```