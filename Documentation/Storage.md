# ☁️ Documentation Upload & Stockage S3

Cette section détaille la gestion des fichiers : upload via Multer et stockage sur AWS S3.

**Fichiers concernés :**
- `src/middlewares/upload.js` — Configuration Multer
- `src/utils/s3.js` — Client AWS S3

---

## 📤 Multer — `upload.js`

[Multer](https://github.com/expressjs/multer) est un middleware Express pour gérer les uploads de fichiers en `multipart/form-data`.

### Configuration

| Paramètre | Valeur | Description |
| :--- | :--- | :--- |
| **Storage** | `memoryStorage()` | Fichiers stockés en mémoire (buffer), pas sur le disque. |
| **Taille max** | 5 MB | Fichiers au-delà de 5 MB rejetés automatiquement. |
| **Types acceptés** | Images + PDF | `image/*` et `application/pdf` uniquement. |

### Utilisation dans les Routes

```js
// Upload d'un justificatif
router.post('/', verifyToken, upload.single('proof'), createInvoice);

// Upload d'un avatar
router.put('/', verifyToken, upload.single('avatar'), updateUser);
```

`upload.single('nomDuChamp')` extrait le fichier du champ spécifié et le rend disponible via `req.file`.

---

## 🗄️ AWS S3 — `s3.js`

### Méthodes

| Méthode | Type de Retour | Description |
| :--- | :--- | :--- |
| `uploadToS3(file)` | `string` (URL) | Envoie un fichier vers S3 et retourne l'URL publique. |

### Fonctionnement de `uploadToS3(file)`

| Étape | Détail |
| :--- | :--- |
| 1. Nom unique | Génère un UUID v4 + extension originale (ex: `a3f8c2b1-...-.pdf`). |
| 2. Upload | Envoie le buffer du fichier vers le bucket S3 configuré. |
| 3. Retour | Retourne l'URL publique (`https://<bucket>.s3.amazonaws.com/<key>`). |

### Flux Complet d'un Upload

```
Client (FormData)
  │
  ▼
Multer (parse multipart → buffer en mémoire)
  │
  ▼
req.file = { buffer, originalname, mimetype, size }
  │
  ▼
Controller → uploadToS3(req.file)
  │
  ▼
AWS S3 stocke le fichier → retourne l'URL
  │
  ▼
URL sauvegardée en base MongoDB
```

> [!WARNING]
> Quand une facture est supprimée ou qu'un avatar est remplacé, l'ancien fichier reste sur S3. Il n'y a pas de suppression automatique des fichiers orphelins.
