# Point d'entrée — `src/index.js`

## Rôle

Fichier principal qui initialise et démarre le serveur Express.

## Détail du code

### 1. Imports et initialisation

```js
const app = express();
```

Crée l'instance Express qui servira toutes les routes.

### 2. Configuration CORS

```js
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
```

- `origin` : Restreint les requêtes cross-origin au frontend défini dans la variable d'environnement. En dev, accepte tout (`*`).
- `allowedHeaders` : Autorise `Authorization` pour le passage du token JWT.

### 3. Middleware JSON

```js
app.use(express.json());
```

Parse automatiquement le body des requêtes `Content-Type: application/json`.

### 4. Connexion MongoDB

```js
mongoose.connect(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

- `serverSelectionTimeoutMS` : Timeout de 5 secondes si MongoDB est injoignable (évite de rester bloqué).
- `socketTimeoutMS` : Timeout de 45 secondes sur les opérations longues.
- Si la connexion échoue, `process.exit(1)` arrête immédiatement le serveur (fail-fast).

### 5. Montage des routes

```js
app.use('/users', userRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/auth', authenticationRoutes);
```

Chaque préfixe d'URL est lié à un fichier de routes dédié.

### 6. Route de santé

```js
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API GSB" });
});
```

Utilisée par Render comme `healthCheckPath` pour vérifier que le serveur est up.

### 7. Démarrage

```js
app.listen(PORT, '0.0.0.0', () => { ... });
```

- Écoute sur `0.0.0.0` pour être accessible depuis l'extérieur (nécessaire en conteneur/cloud).
- Le port est défini par la variable d'environnement `PORT`.
