# 📖 Référence API

Référence complète de toutes les routes de l'API GSB.

**Base URL :** `https://gsb-backend-946k.onrender.com`

**Header d'authentification :**
```
Authorization: Bearer <token JWT>
```

🔒 = Route nécessitant le header `Authorization`

---

## 🔐 Authentification

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

**Réponse `401` :**
```json
{ "message": "Invalid credentials" }
```

---

## 👥 Utilisateurs

### `POST /users` — Créer un utilisateur

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

**Réponse `201` :** Objet utilisateur complet.

---

### `GET /users` 🔒 — Lister les utilisateurs

**Query params (optionnel) :** `?email=jean@gsb.fr`

**Réponse `200` :**
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

### `PUT /users?email=xxx` 🔒 — Modifier un utilisateur

**Body (tous les champs optionnels) :**
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

**Réponse `200` :** Utilisateur mis à jour.

---

### `DELETE /users?email=xxx` 🔒 — Supprimer un utilisateur

**Réponse `200` :**
```json
{ "message": "User deleted" }
```

---

## 🧾 Factures

### `POST /invoices` 🔒 — Créer une facture

**Format : `multipart/form-data`**

| Champ | Type | Requis | Description |
| :--- | :--- | :--- | :--- |
| `proof` | File | ✅ | Image ou PDF (max 5MB). |
| `metadata` | String | ✅ | JSON stringifié (voir ci-dessous). |

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

### `GET /invoices` 🔒 — Lister les factures

- **Admin** : retourne toutes les factures.
- **User** : retourne uniquement ses propres factures.

**Réponse `200` :** Tableau de factures.

---

### `GET /invoices/:id` — Détail d'une facture

**Réponse `200` :** Objet facture.

---

### `PUT /invoices/:id` — Modifier une facture

**Body (tous les champs optionnels) :**
```json
{ "status": "Approved" }
```

**Réponse `200` :** Facture mise à jour.

---

### `DELETE /invoices/:id` — Supprimer une facture

**Réponse `200` :**
```json
{ "message": "Invoice deleted" }
```

---

## ❌ Codes d'Erreur

| Code | Signification |
| :--- | :--- |
| `200` | Succès. |
| `201` | Ressource créée. |
| `400` | Données invalides ou manquantes. |
| `401` | Non authentifié / token invalide ou expiré. |
| `404` | Ressource non trouvée. |
| `500` | Erreur serveur interne. |
