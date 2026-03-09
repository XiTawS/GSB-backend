# API Reference

Référence complète de toutes les routes de l'API.

**Base URL :** `https://gsb-backend-946k.onrender.com`

**Header d'authentification :**
```
Authorization: Bearer <token JWT>
```

---

## Authentification

### `POST /auth/login`

Connexion d'un utilisateur.

**Body :**
```json
{
  "email": "admin@gsb.fr",
  "password": "admin123"
}
```

**Réponse `200` :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Erreur `401` :**
```json
{ "message": "Invalid credentials" }
```

---

## Utilisateurs

### `POST /users`

Créer un utilisateur. Pas d'authentification requise.

**Body :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@gsb.fr",
  "password": "motdepasse",
  "role": "user"
}
```

**Réponse `201` :** Objet utilisateur complet (avec `_id`, `createdAt`).

---

### `GET /users` 🔒

Lister tous les utilisateurs.

**Query params (optionnel) :**
- `?email=jean@gsb.fr` → filtre par email

**Réponse `200` :** Tableau d'utilisateurs.

```json
[
  {
    "_id": "...",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@gsb.fr",
    "role": "user",
    "avatar": "https://...",
    "createdAt": "2026-01-15T..."
  }
]
```

---

### `PUT /users?email=xxx` 🔒

Modifier un utilisateur. Supporte le multipart (pour l'avatar) ou le JSON.

**Body JSON :**
```json
{
  "firstName": "Jean",
  "lastName": "Nouveau",
  "newEmail": "jean.new@gsb.fr",
  "password": "nouveaumotdepasse",
  "role": "admin",
  "avatar": "https://..."
}
```

Tous les champs sont optionnels — seuls ceux présents sont mis à jour.

**Réponse `200` :** Utilisateur mis à jour.

---

### `DELETE /users?email=xxx` 🔒

Supprimer un utilisateur.

**Réponse `200` :**
```json
{ "message": "User deleted" }
```

---

## Factures

### `POST /invoices` 🔒

Créer une facture. Requiert un fichier justificatif.

**Format :** `multipart/form-data`

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `proof` | File | ✅ | Image ou PDF (max 5MB) |
| `metadata` | String | ✅ | JSON stringifié (voir ci-dessous) |

**Structure de `metadata` :**
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

**Réponse `201` :** Objet facture complet.

---

### `GET /invoices` 🔒

Lister les factures.
- **Admin** : voit toutes les factures
- **User** : voit uniquement ses propres factures

**Réponse `200` :** Tableau de factures.

---

### `GET /invoices/:id`

Récupérer une facture par son ID MongoDB.

**Réponse `200` :** Objet facture.

---

### `PUT /invoices/:id`

Modifier une facture.

**Body JSON :**
```json
{
  "status": "Approved"
}
```

Tous les champs sont optionnels.

**Réponse `200` :** Facture mise à jour.

---

### `DELETE /invoices/:id`

Supprimer une facture.

**Réponse `200` :**
```json
{ "message": "Invoice deleted" }
```

---

## Codes d'erreur communs

| Code | Signification |
|------|---------------|
| `200` | Succès |
| `201` | Ressource créée |
| `400` | Données invalides |
| `401` | Non authentifié / token invalide |
| `404` | Ressource non trouvée |
| `500` | Erreur serveur interne |

🔒 = Route nécessitant le header `Authorization: Bearer <token>`
