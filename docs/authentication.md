# Authentification

**Fichiers concernés :**
- `src/controllers/authentication_controller.js`
- `src/routes/authentication_route.js`

## Vue d'ensemble

L'authentification repose sur **JWT** (JSON Web Token). Aucune session n'est stockée côté serveur : le client envoie son token dans le header `Authorization` à chaque requête.

## Route

| Méthode | URL | Description |
|---------|-----|-------------|
| `POST` | `/auth/login` | Connexion |

## Fonctionnement détaillé

### `login(req, res)`

Authentifie un utilisateur et retourne un token JWT.

**Étapes :**

1. **Récupération des identifiants** depuis `req.body` (`email`, `password`)
2. **Recherche de l'utilisateur** en base par son email via `User.findOne({ email })`
3. **Vérification du mot de passe** :
   - Le mot de passe fourni est hashé avec SHA-256 + salt : `sha256(password + process.env.SALT)`
   - Comparé au hash stocké en base
4. **Génération du token JWT** avec les claims suivants :
   ```json
   {
     "userId": "...",   // ID MongoDB de l'utilisateur
     "role": "user",    // Rôle (user ou admin)
     "email": "..."     // Email
   }
   ```
   - Expiration : **24 heures**
   - Signé avec `process.env.JWT_SECRET`
5. **Réponse** : `{ "token": "eyJhbG..." }`

**Codes de retour :**
- `200` : Connexion réussie
- `401` : Email introuvable ou mot de passe incorrect

### `verifyToken(req, res, next)`

Middleware qui protège les routes nécessitant une authentification.

**Étapes :**

1. **Extraction du token** depuis le header `Authorization: Bearer <token>`
2. **Vérification** avec `jwt.verify()` et la clé secrète
3. **Injection dans `req.user`** : Les claims du token (userId, role, email) sont disponibles pour les controllers suivants
4. Si le token est invalide ou expiré → `401`

**Utilisation dans les routes :**
```js
router.get('/', authenticationController.verifyToken, UserController.getUsers);
//                ↑ middleware d'auth          ↑ controller exécuté si auth OK
```

## Sécurité

| Mesure | Détail |
|--------|--------|
| Hash des mots de passe | SHA-256 avec salt (jamais stocké en clair) |
| Token JWT signé | Secret côté serveur, impossible à falsifier |
| Expiration | 24h, forçant une reconnexion régulière |
| Stateless | Pas de session = pas de vol de session |

## Limites connues

- SHA-256 est rapide à bruteforcer — **bcrypt** serait plus adapté pour un usage production
- Le salt est partagé entre tous les utilisateurs (pas de salt unique par user)
- Pas de route de refresh token : l'utilisateur doit se reconnecter après 24h
- Le middleware `isAdmin` est déclaré mais non implémenté
