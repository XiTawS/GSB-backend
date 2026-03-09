# 👥 Documentation Contrôleur Utilisateurs

Cette section détaille les opérations CRUD liées à l'entité `User`.

**Fichiers concernés :**
- `src/controllers/user_controller.js`
- `src/routes/user_route.js`

---

## 🔗 Routes

| Méthode | URL | Auth | Middleware | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/users` | ❌ | — | Créer un utilisateur. |
| `GET` | `/users` | ✅ | `verifyToken` | Lister tous les utilisateurs. |
| `GET` | `/users?email=xxx` | ✅ | `verifyToken` | Récupérer un utilisateur par email. |
| `PUT` | `/users?email=xxx` | ✅ | `verifyToken`, `upload.single('avatar')` | Modifier un utilisateur. |
| `DELETE` | `/users?email=xxx` | ✅ | `verifyToken` | Supprimer un utilisateur. |

> [!IMPORTANT]
> L'identifiant utilisé pour les opérations est l'**email** passé en query parameter (`?email=xxx`), pas l'ID MongoDB.

---

## 📋 Méthodes

### `createUser(req, res)`

Crée un nouvel utilisateur en base de données.

**Body attendu :**

| Champ | Type | Requis | Description |
| :--- | :--- | :--- | :--- |
| `firstName` | string | ✅ | Prénom. |
| `lastName` | string | ✅ | Nom de famille. |
| `email` | string | ✅ | Adresse email (doit être unique). |
| `password` | string | ✅ | Mot de passe (sera hashé automatiquement par le hook `pre('save')`). |
| `role` | string | ✅ | `"user"` ou `"admin"`. |

**Codes de retour :**

| Code | Signification |
| :--- | :--- |
| `201` | Utilisateur créé (retourne l'objet complet). |
| `400` | Email déjà utilisé (`User already exists`). |
| `500` | Erreur serveur. |

---

### `getUsers(req, res)`

Récupère les utilisateurs. Supporte le filtrage par email.

| Paramètre | Comportement |
| :--- | :--- |
| Sans `?email` | Retourne **tous** les utilisateurs. |
| Avec `?email=xxx` | Retourne un tableau contenant **un seul** utilisateur. |

---

### `updateUser(req, res)`

Met à jour un utilisateur identifié par son email en query parameter.

**Body attendu (tous les champs sont optionnels) :**

| Champ | Type | Description |
| :--- | :--- | :--- |
| `firstName` | string | Nouveau prénom. |
| `lastName` | string | Nouveau nom. |
| `newEmail` | string | Nouvelle adresse email. |
| `password` | string | Nouveau mot de passe (sera hashé manuellement avec SHA-256). |
| `role` | string | Nouveau rôle. |
| `avatar` | string | URL ou base64 de l'image de profil. |

> [!IMPORTANT]
> Si un **fichier** est uploadé via Multer (`req.file`), il est envoyé sur **AWS S3** et l'URL retournée est stockée dans le champ `avatar`. Le champ `avatar` du body JSON est ignoré dans ce cas.

**Codes de retour :**

| Code | Signification |
| :--- | :--- |
| `200` | Utilisateur mis à jour (retourne l'objet complet). |
| `404` | Utilisateur non trouvé. |
| `500` | Erreur serveur. |

---

### `deleteUser(req, res)`

Supprime un utilisateur identifié par son email via `findOneAndDelete`.

**Codes de retour :**

| Code | Signification |
| :--- | :--- |
| `200` | `{ "message": "User deleted" }` |
| `404` | Utilisateur non trouvé. |
| `500` | Erreur serveur. |
