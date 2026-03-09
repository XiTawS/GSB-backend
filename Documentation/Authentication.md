# 🔐 Documentation Authentification

Cette section détaille le système d'authentification basé sur **JWT** (JSON Web Token).

**Fichiers concernés :**
- `src/controllers/authentication_controller.js`
- `src/routes/authentication_route.js`

---

## 🔑 Route

| Méthode | URL | Auth Requise | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | ❌ | Authentifie un utilisateur et retourne un token JWT. |

---

## 📋 Méthodes

### `login(req, res)`

Authentifie un utilisateur par email et mot de passe.

| Étape | Détail |
| :--- | :--- |
| 1. Extraction | Récupère `email` et `password` depuis `req.body`. |
| 2. Recherche | Cherche l'utilisateur en base via `User.findOne({ email })`. |
| 3. Vérification | Hash le mot de passe fourni (`sha256(password + SALT)`) et compare avec le hash stocké. |
| 4. Génération | Crée un token JWT signé avec les claims ci-dessous. |
| 5. Réponse | Retourne `{ token }` au client. |

**Claims du token JWT :**

| Claim | Type | Description |
| :--- | :--- | :--- |
| `userId` | string | ID MongoDB de l'utilisateur. |
| `role` | string | Rôle (`user` ou `admin`). |
| `email` | string | Adresse email. |
| `exp` | number | Expiration : **24 heures** après la création. |

**Codes de retour :**

| Code | Signification |
| :--- | :--- |
| `200` | Connexion réussie. |
| `401` | Email introuvable ou mot de passe incorrect. |

---

### `verifyToken(req, res, next)`

Middleware qui protège les routes nécessitant une authentification.

| Étape | Détail |
| :--- | :--- |
| 1. Extraction | Récupère le token depuis le header `Authorization: Bearer <token>`. |
| 2. Vérification | Décode et vérifie le token avec `jwt.verify()` et `JWT_SECRET`. |
| 3. Injection | Injecte les claims dans `req.user` (disponible pour les contrôleurs suivants). |

**Utilisation dans les routes :**
```js
router.get('/', authController.verifyToken, UserController.getUsers);
//                ↑ Vérifie l'auth         ↑ Exécuté si le token est valide
```

> [!WARNING]
> Si le header `Authorization` est absent ou malformé, le middleware retourne une erreur `401`.

---

## 🔒 Sécurité

| Mesure | Détail |
| :--- | :--- |
| **Hachage** | Mots de passe hashés avec SHA-256 + salt (jamais stockés en clair). |
| **Token signé** | Le JWT est signé côté serveur, impossible à falsifier. |
| **Expiration** | Token valide 24h, forçant une reconnexion régulière. |
| **Stateless** | Pas de session serveur = pas de risque de vol de session. |
