# 🧾 Documentation Contrôleur Factures

Cette section détaille les opérations CRUD liées à l'entité `Invoice`.

**Fichiers concernés :**
- `src/controllers/invoice_controller.js`
- `src/routes/invoice_route.js`

---

## 🔗 Routes

| Méthode | URL | Auth | Middleware | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/invoices` | ✅ | `verifyToken`, `upload.single('proof')` | Créer une facture (multipart). |
| `GET` | `/invoices` | ✅ | `verifyToken` | Lister les factures (filtrées par rôle). |
| `GET` | `/invoices/:id` | ❌ | — | Récupérer une facture par ID. |
| `PUT` | `/invoices/:id` | ❌ | — | Modifier une facture. |
| `DELETE` | `/invoices/:id` | ❌ | — | Supprimer une facture. |

---

## 📋 Méthodes

### `createInvoice(req, res)`

Crée une facture avec un justificatif obligatoire.

**Format de la requête : `multipart/form-data`**

| Champ | Type | Requis | Description |
| :--- | :--- | :--- | :--- |
| `proof` | File | ✅ | Justificatif (image ou PDF, max 5MB). |
| `metadata` | String (JSON) | ✅ | Données de la facture (JSON stringifié). |

**Structure du champ `metadata` :**

| Propriété | Type | Description |
| :--- | :--- | :--- |
| `title` | string | Titre de la facture. |
| `date` | string | Date de la dépense (ISO string). |
| `amount` | number | Montant en euros. |
| `type` | string | Catégorie (ex: "Repas", "Transport"). |
| `description` | string | Description de la dépense. |
| `status` | string | Statut initial (`Pending`). |

> [!IMPORTANT]
> En `multipart/form-data`, on ne peut pas envoyer un objet JSON directement. Le frontend stringifie les données dans un champ texte nommé `metadata` et le backend les parse avec `JSON.parse(req.body.metadata)`.

**Codes de retour :**

| Code | Signification |
| :--- | :--- |
| `201` | Facture créée (retourne l'objet complet). |
| `400` | Justificatif manquant (`Proof is required`). |
| `500` | Erreur serveur. |

---

### `getInvoices(req, res)`

Récupère les factures en fonction du **rôle** de l'utilisateur connecté.

| Rôle | Comportement |
| :--- | :--- |
| `admin` | Retourne **toutes** les factures. |
| `user` | Retourne uniquement les factures de l'utilisateur connecté. |

Le `userId` et le `role` proviennent du token JWT décodé par `verifyToken`.

---

### `getInvoiceById(req, res)`

Récupère une facture par son ID MongoDB (`req.params.id`).

---

### `updateInvoice(req, res)`

Met à jour une facture via `findByIdAndUpdate`. Accepte un body JSON classique.

**Exemples de body :**

Changer le statut :
```json
{ "status": "Approved" }
```

Modifier les champs :
```json
{
  "title": "Nouveau titre",
  "amount": 55.00,
  "description": "Description mise à jour"
}
```

---

### `deleteInvoice(req, res)`

Supprime une facture via `findByIdAndDelete`.

> [!WARNING]
> Le justificatif stocké sur AWS S3 n'est **pas** supprimé automatiquement. Le fichier reste sur le bucket même après suppression de la facture.

**Codes de retour :**

| Code | Signification |
| :--- | :--- |
| `200` | `{ "message": "Invoice deleted" }` |
| `404` | Facture non trouvée. |
| `500` | Erreur serveur. |

---

## 📊 Statuts Possibles

| Valeur | Signification |
| :--- | :--- |
| `Pending` | En attente de validation. |
| `Approved` | Validée par l'administrateur. |
| `Rejected` | Rejetée par l'administrateur. |
