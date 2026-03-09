# Architecture générale

## Stack

| Couche | Technologie | Version |
|--------|-------------|---------|
| Runtime | Node.js | ≥18 |
| Framework HTTP | Express | 4.18 |
| Base de données | MongoDB | Atlas (cloud) |
| ODM | Mongoose | 8.1 |
| Authentification | JWT (jsonwebtoken) | 9.x |
| Hash | SHA-256 (js-sha256) | — |
| Upload fichiers | Multer | 1.4 |
| Stockage fichiers | AWS S3 (aws-sdk) | 2.x |

## Structure des dossiers

```
src/
├── index.js                          # Point d'entrée
├── controllers/                      # Logique métier
│   ├── authentication_controller.js
│   ├── invoice_controller.js
│   └── user_controller.js
├── models/                           # Schémas Mongoose
│   ├── invoice_model.js
│   └── user_model.js
├── routes/                           # Définition des routes Express
│   ├── authentication_route.js
│   ├── invoice_route.js
│   └── user_route.js
├── middlewares/
│   └── upload.js                     # Config Multer
└── utils/
    └── s3.js                         # Client AWS S3
```

## Flux d'une requête

```
Client HTTP
  │
  ▼
Express (CORS, JSON parser)
  │
  ▼
Route (/auth, /users, /invoices)
  │
  ├─ Middleware verifyToken (si route protégée)
  ├─ Middleware Multer (si upload fichier)
  │
  ▼
Controller (logique métier)
  │
  ├─ Mongoose → MongoDB (lecture/écriture)
  ├─ AWS S3 (upload fichier si nécessaire)
  │
  ▼
Réponse JSON au client
```

## Principes

- **Architecture MVC** : Routes → Controllers → Models
- **Stateless** : Pas de session côté serveur, tout passe par le token JWT
- **Séparation des responsabilités** : Chaque fichier a un rôle unique
- **Pas de logique métier dans les routes** : Les routes se contentent de brancher middleware + controller
