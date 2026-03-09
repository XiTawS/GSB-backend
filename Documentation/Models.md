# 📄 Documentation des Modèles

Cette section détaille les modèles de données (schémas Mongoose) utilisés dans l'application.

**Fichiers concernés :**
- `src/models/user_model.js`
- `src/models/invoice_model.js`

---

## 🧑 User (Utilisateur)

Représente un utilisateur de l'application (employé ou administrateur).

### Propriétés

| Propriété | Type | Requis | Unique | Défaut | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `firstName` | String | ✅ | | | Prénom de l'utilisateur. |
| `lastName` | String | ✅ | | | Nom de famille. |
| `email` | String | ✅ | ✅ | | Adresse email (utilisée pour la connexion). |
| `password` | String | ✅ | | | Mot de passe haché (SHA-256). |
| `role` | String | ✅ | | | `"user"` ou `"admin"`. |
| `avatar` | String | | | Gravatar par défaut | URL de l'image de profil. |
| `createdAt` | Date | | | `Date.now` | Date de création automatique. |

### Hook `pre('save')`

Ce hook s'exécute automatiquement **avant chaque création** d'utilisateur (`save()`).

| Étape | Détail |
| :--- | :--- |
| 1. Unicité | Vérifie qu'aucun utilisateur avec le même email n'existe déjà. |
| 2. Hachage | Hash le mot de passe avec `sha256(password + SALT)`. |

> [!IMPORTANT]
> Ce hook ne s'exécute **pas** sur `findOneAndUpdate`. C'est pourquoi le contrôleur `updateUser` hash manuellement le mot de passe lorsqu'il est modifié.

---

## 🧾 Invoice (Facture)

Représente une note de frais soumise par un employé.

### Propriétés

| Propriété | Type | Requis | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | ✅ | Titre de la facture. |
| `date` | String | ✅ | Date de la dépense (ISO string). |
| `amount` | Number | ✅ | Montant en euros. |
| `proof` | String | | URL du justificatif sur AWS S3. |
| `description` | String | ✅ | Description de la dépense. |
| `user` | ObjectId | | Référence vers le modèle `User` (créateur). |
| `status` | String | ✅ | `"Pending"`, `"Approved"` ou `"Rejected"`. |
| `type` | String | ✅ | Catégorie de dépense (ex: Repas, Transport). |
| `createdAt` | Date | | Date de création automatique. |

### Référence `user`

```js
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
```

Le champ `user` stocke l'`_id` de l'utilisateur qui a créé la facture. Cela permet de :
- Filtrer les factures par utilisateur (`Invoice.find({ user: userId })`)
- Utiliser `.populate('user')` pour joindre les données utilisateur (non utilisé actuellement)
