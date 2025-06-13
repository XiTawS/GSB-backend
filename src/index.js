const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user_route');
const invoiceRoutes = require('./routes/invoice_route');
const authenticationRoutes = require('./routes/authentication_route');

const app = express();

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.error('Erreur de connexion à MongoDB:', err));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API GSB' });
});

app.use('/users', userRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/auth', authenticationRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});