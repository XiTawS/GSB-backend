# Modèles de données

**Fichiers concernés :**
- `src/models/user_model.js`
- `src/models/invoice_model.js`

Les modèles utilisent **Mongoose** pour définir les schémas et interagir avec MongoDB.

---

## User — `user_model.js`

### Schéma

| Champ | Type | Requis | Unique | Défaut | Description |
|-------|------|--------|--------|--------|-------------|
| `firstName` | String | ✅ | | | Prénom |
| `lastName` | String | ✅ | | | Nom de famille |
| `email` | String | ✅ | ✅ | | Adresse email |
| `password` | String | ✅ | | | Hash SHA-256 du mot de passe |
| `role` | String | ✅ | | | `"user"` ou `"admin"` |
| `avatar` | String | | | Gravatar par défaut | URL de l'image de profil |
| `createdAt` | Date | | | `Date.now` | Date de création |

### Hook `pre('save')`

Exécuté automatiquement **avant chaque `save()`** (création uniquement, pas les updates) :

```js
userSchema.pre('save', async function(next) {
  // 1. Vérifie que l'email n'existe pas déjà
  const existingUser = await User.findOne({ email: this.email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // 2. Hash le mot de passe
  this.password = sha256(this.password + process.env.SALT);
  next();
});
```

**Pourquoi un hook et pas dans le controller ?**
- Le hook garantit que le mot de passe est **toujours** hashé à la création, peu importe d'où `save()` est appelé
- La vérification d'unicité par le hook complète la contrainte `unique: true` de MongoDB (qui lève une erreur moins lisible)

**Important :** Ce hook ne s'exécute **pas** sur `findOneAndUpdate`. C'est pourquoi le controller `updateUser` hash manuellement le mot de passe.

---

## Invoice — `invoice_model.js`

### Schéma

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `title` | String | ✅ | Titre de la facture |
| `date` | String | ✅ | Date de la dépense (ISO string) |
| `amount` | Number | ✅ | Montant en euros |
| `proof` | String | | URL du justificatif sur S3 |
| `description` | String | ✅ | Description de la dépense |
| `user` | ObjectId | | Référence vers le modèle `User` |
| `status` | String | ✅ | `"Pending"`, `"Approved"` ou `"Rejected"` |
| `type` | String | ✅ | Catégorie (ex: "Repas", "Transport") |
| `createdAt` | Date | | Date de création (auto) |

### Référence `user`

```js
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
```

Le champ `user` est une **référence** vers la collection `users`. Il stocke l'`_id` de l'utilisateur qui a créé la facture. Cela permet de :
- Filtrer les factures par utilisateur (`Invoice.find({ user: userId })`)
- Potentiellement utiliser `.populate('user')` pour joindre les données utilisateur

### Note sur le champ `date`

Le type est `String` et non `Date`. La date est stockée au format ISO string envoyé par le frontend. Cela simplifie le stockage mais empêche les requêtes MongoDB basées sur des plages de dates.
