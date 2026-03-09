# Contrôleur Factures

**Fichiers concernés :**
- `src/controllers/invoice_controller.js`
- `src/routes/invoice_route.js`

## Routes

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| `POST` | `/invoices` | ✅ | Créer une facture (multipart) |
| `GET` | `/invoices` | ✅ | Lister les factures |
| `GET` | `/invoices/:id` | ❌ | Détail d'une facture |
| `PUT` | `/invoices/:id` | ❌ | Modifier une facture |
| `DELETE` | `/invoices/:id` | ❌ | Supprimer une facture |

## Fonctionnement détaillé

### `createInvoice(req, res)`

Crée une facture avec un justificatif obligatoire.

**Format de la requête : `multipart/form-data`**

| Champ | Type | Description |
|-------|------|-------------|
| `proof` | File | Justificatif (image ou PDF, max 5MB) |
| `metadata` | String (JSON) | Données de la facture |

**Structure du champ `metadata` :**
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

**Processus :**
1. Le champ `metadata` est parsé depuis `req.body.metadata` (JSON stringifié)
2. Le `userId` est extrait de `req.user` (injecté par `verifyToken`)
3. Le fichier `proof` est uploadé sur S3 → retourne une URL publique
4. La facture est créée en base avec l'URL du justificatif
5. Si aucun fichier n'est fourni → erreur 400

**Pourquoi `metadata` est une string JSON ?**
En `multipart/form-data`, on ne peut pas envoyer un objet JSON directement. Le frontend stringifie les données dans un champ texte et le backend les parse.

### `getInvoices(req, res)`

Récupère les factures en fonction du rôle de l'utilisateur.

```js
if (role === 'admin') {
  invoices = await Invoice.find();           // Admin : toutes les factures
} else {
  invoices = await Invoice.find({ user: userId }); // User : ses factures uniquement
}
```

C'est la seule route qui filtre par rôle. Le `userId` et le `role` proviennent du token JWT décodé.

### `getInvoiceById(req, res)`

Récupère une facture par son ID MongoDB (`req.params.id`). Pas de vérification d'appartenance — n'importe qui avec l'ID peut accéder à la facture.

### `updateInvoice(req, res)`

Met à jour une facture via `findByIdAndUpdate`. Accepte un body JSON classique (pas de multipart).

**Exemple — changer le statut :**
```json
{ "status": "Approved" }
```

**Exemple — modifier les champs :**
```json
{
  "title": "Nouveau titre",
  "amount": 55.00,
  "description": "Description mise à jour"
}
```

### `deleteInvoice(req, res)`

Supprime une facture via `findByIdAndDelete`.

> **⚠️ Limitation :** Le justificatif stocké sur S3 n'est **pas** supprimé automatiquement. Il reste sur le bucket même après suppression de la facture.

## Chaîne de middlewares

```js
// Création : auth + upload fichier
router.post('/', verifyToken, upload.single('proof'), createInvoice);

// Lecture : auth (pour filtrer par rôle)
router.get('/', verifyToken, getInvoices);

// Les autres routes n'ont pas de middleware d'auth
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
```
