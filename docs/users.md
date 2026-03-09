# Contrôleur Utilisateurs

**Fichiers concernés :**
- `src/controllers/user_controller.js`
- `src/routes/user_route.js`

## Routes

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| `POST` | `/users` | ❌ | Créer un utilisateur |
| `GET` | `/users` | ✅ | Lister tous les utilisateurs |
| `GET` | `/users?email=xxx` | ✅ | Récupérer un utilisateur par email |
| `PUT` | `/users?email=xxx` | ✅ | Modifier un utilisateur |
| `DELETE` | `/users?email=xxx` | ✅ | Supprimer un utilisateur |

> **Note :** L'identifiant utilisé pour les opérations est l'**email** passé en query parameter, pas l'ID MongoDB.

## Fonctionnement détaillé

### `createUser(req, res)`

Crée un nouvel utilisateur en base de données.

**Body attendu :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@gsb.fr",
  "password": "motdepasse",
  "role": "user"
}
```

**Processus :**
1. Les champs sont extraits du body
2. Un objet `User` est instancié avec Mongoose
3. Avant la sauvegarde, le **hook `pre('save')`** du modèle :
   - Vérifie qu'un utilisateur avec le même email n'existe pas déjà
   - Hash le mot de passe avec `sha256(password + SALT)`
4. L'utilisateur est sauvegardé en base

**Codes de retour :**
- `201` : Utilisateur créé (retourne l'objet complet)
- `400` : Email déjà utilisé
- `500` : Erreur serveur

### `getUsers(req, res)`

Récupère les utilisateurs. Si `?email=xxx` est fourni, filtre par email.

**Logique :**
```js
const email = req.query.email ? { email: req.query.email } : {};
const users = await User.find(email);
```

- Sans query param → retourne **tous** les utilisateurs
- Avec `?email=xxx` → retourne un tableau contenant **un seul** utilisateur

### `updateUser(req, res)`

Met à jour un utilisateur identifié par son email.

**Body attendu :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "newEmail": "jean.new@gsb.fr",
  "password": "nouveaumdp",
  "role": "admin",
  "avatar": "https://... ou base64"
}
```

**Processus :**
1. Seuls les champs présents dans le body sont mis à jour (update partiel)
2. Si `password` est fourni → hashé avec SHA-256 avant sauvegarde
3. Si `avatar` est fourni dans le body → stocké directement (URL ou base64)
4. Si un **fichier** est uploadé via Multer (`req.file`) → envoyé sur S3, l'URL retournée est stockée
5. `findOneAndUpdate` avec `{ new: true }` retourne l'utilisateur mis à jour

### `deleteUser(req, res)`

Supprime un utilisateur par son email via `findOneAndDelete`.

**Codes de retour :**
- `200` : `{ "message": "User deleted" }`
- `404` : Utilisateur non trouvé
- `500` : Erreur serveur

## Middleware de la route

```js
router.put('/', verifyToken, upload.single('avatar'), UserController.updateUser);
```

La route PUT chaîne :
1. `verifyToken` → vérifie que l'utilisateur est authentifié
2. `upload.single('avatar')` → parse un éventuel fichier uploadé
3. `updateUser` → exécute la logique métier
