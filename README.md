# GSB — Gestion des Notes de Frais

**GSB** (Galaxy Swiss Bourdin) est une application web de gestion de notes de frais destinée aux entreprises pharmaceutiques. Elle permet aux employés de soumettre leurs frais professionnels et aux administrateurs de les valider ou rejeter.

## Présentation

L'application se compose de deux parties :
- **Frontend** → [GSB-frontend](https://github.com/XiTawS/GSB-frontend) (React / Vite / Tailwind)
- **Backend** → Ce repository (Node.js / Express / MongoDB)

### Fonctionnalités principales

🧾 **Gestion des factures**
- Soumission de notes de frais avec justificatif (image/PDF)
- Suivi du statut : en attente, validée, rejetée
- Les employés voient uniquement leurs factures, les admins voient tout

👥 **Gestion des utilisateurs**
- Création de comptes (admin)
- Rôles : utilisateur standard et administrateur
- Modification du profil et avatar

🔐 **Authentification**
- Connexion par email/mot de passe
- Token JWT (24h)
- Mots de passe hashés (SHA-256 + salt)

☁️ **Stockage cloud**
- Justificatifs et avatars stockés sur AWS S3

## Démarrage rapide

```bash
git clone https://github.com/XiTawS/GSB-backend.git
cd GSB-backend
npm install
cp .env.example .env   # Configurer les variables
npm run dev             # Développement
npm start               # Production
```

### Variables d'environnement requises

| Variable | Description |
|----------|-------------|
| `PORT` | Port d'écoute du serveur |
| `MONGODB_URL` | URI de connexion MongoDB |
| `JWT_SECRET` | Clé secrète pour les tokens JWT |
| `SALT` | Salt pour le hash des mots de passe |
| `FRONTEND_URL` | URL du frontend (CORS) |
| `AWS_ACCESS_KEY_ID` | Clé d'accès AWS |
| `AWS_SECRET_ACCESS_KEY` | Clé secrète AWS |
| `AWS_BUCKET_NAME` | Nom du bucket S3 |

## Déploiement

- **Backend** : [Render](https://render.com) — `https://gsb-backend-946k.onrender.com`
- **Frontend** : [Vercel](https://vercel.com) — `https://gsb-frontend-six.vercel.app`

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@gsb.fr` | `admin123` |
| Utilisateur | `user@gsb.fr` | `user123` |

## Documentation technique

📖 Voir le dossier [`docs/`](./docs/) pour la documentation technique détaillée de chaque module.
