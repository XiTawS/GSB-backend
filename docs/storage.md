# Upload & Stockage S3

**Fichiers concernés :**
- `src/middlewares/upload.js` — Configuration Multer
- `src/utils/s3.js` — Client AWS S3

---

## Multer — `upload.js`

[Multer](https://github.com/expressjs/multer) est un middleware Express pour gérer les uploads de fichiers en `multipart/form-data`.

### Configuration

```js
const storage = multer.memoryStorage();
```

**`memoryStorage()`** : Les fichiers sont stockés en mémoire (buffer) et non sur le disque. Le buffer est ensuite envoyé directement à S3.

### Filtrage des fichiers

```js
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/pdf')) {
    cb(null, true);   // Accepté
  } else {
    cb(new Error('Invalid file type'), false);  // Rejeté
  }
};
```

Seuls les **images** (JPEG, PNG, etc.) et les **PDF** sont acceptés. Tout autre type est rejeté.

### Limite de taille

```js
limits: {
  fileSize: 1024 * 1024 * 5  // 5 MB
}
```

Les fichiers de plus de 5 MB sont rejetés automatiquement par Multer.

### Utilisation dans les routes

```js
// Upload d'un seul fichier nommé "proof"
router.post('/', verifyToken, upload.single('proof'), createInvoice);

// Upload d'un seul fichier nommé "avatar"
router.put('/', verifyToken, upload.single('avatar'), updateUser);
```

`upload.single('nomDuChamp')` extrait le fichier du champ spécifié et le rend disponible via `req.file`.

---

## AWS S3 — `s3.js`

### Initialisation du client

```js
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
```

Le client S3 est initialisé avec les credentials AWS depuis les variables d'environnement. Le bucket est spécifié dans chaque opération.

### `uploadToS3(file)`

Envoie un fichier (depuis le buffer Multer) vers le bucket S3.

**Paramètre :** L'objet `file` de Multer contenant :
- `file.buffer` — Le contenu du fichier en mémoire
- `file.originalname` — Le nom original du fichier (pour extraire l'extension)

**Processus :**

1. **Génère un nom unique** avec UUID v4 + extension originale :
   ```js
   const key = `${uuidv4()}.${fileExtension}`;
   // Exemple : "a3f8c2b1-4d5e-6f7a-8b9c-0d1e2f3a4b5c.pdf"
   ```
   Cela évite les collisions de noms et les problèmes de caractères spéciaux.

2. **Upload vers S3** :
   ```js
   const params = {
     Bucket: process.env.AWS_BUCKET_NAME,
     Key: key,
     Body: file.buffer
   };
   const uploadData = await s3.upload(params).promise();
   ```

3. **Retourne l'URL publique** : `uploadData.Location`
   - Format : `https://<bucket>.s3.amazonaws.com/<key>`
   - Cette URL est stockée dans le champ `proof` (facture) ou `avatar` (utilisateur)

### Flux complet d'un upload

```
Client (FormData)
  │
  ▼
Multer (parse multipart, stocke en mémoire)
  │
  ▼
req.file = { buffer, originalname, mimetype, size }
  │
  ▼
Controller appelle uploadToS3(req.file)
  │
  ▼
S3 stocke le fichier, retourne l'URL
  │
  ▼
L'URL est sauvegardée en base (MongoDB)
```

### Limitations

- **Pas de suppression** : Quand une facture ou un avatar est supprimé/remplacé, l'ancien fichier reste sur S3
- **Pas de pré-signature** : Les fichiers sont publics par défaut (dépend de la policy du bucket)
- **Pas de compression** : Les images sont uploadées telles quelles
