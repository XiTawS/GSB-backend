/**
 * Seed — jeu de données de test pour la Mission 1 (rôle manager).
 *
 * Monte un cas complet :
 *   - 1 manager
 *   - 2 standards rattachés au manager (son équipe)
 *   - 1 standard NON rattaché (pour tester le refus 403)
 *   - 3 factures en statut "Pending" (à valider)
 *
 * Idempotent : supprime d'abord ses propres comptes de test (par email) avant
 * de les recréer. Ne touche AUCUNE autre donnée (admin existant, etc.).
 *
 * Lancer depuis GSB-backend (avec .env rempli) :  node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user_model');
const Invoice = require('./src/models/invoice_model');

// Comptes gérés par ce script — les seuls supprimés/recréés
const TEST_EMAILS = ['manager@gsb.fr', 'alice@gsb.fr', 'bob@gsb.fr', 'charlie@gsb.fr'];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Connecté à MongoDB');

  // 1. Nettoyage des comptes de test précédents + leurs factures
  const old = await User.find({ email: { $in: TEST_EMAILS } });
  await Invoice.deleteMany({ user: { $in: old.map(u => u._id) } });
  await User.deleteMany({ email: { $in: TEST_EMAILS } });

  // 2. Manager
  const manager = await new User({
    firstName: 'Marc', lastName: 'Manager',
    email: 'manager@gsb.fr', password: 'manager123', role: 'manager',
  }).save();

  // 3. Standards rattachés au manager (son équipe)
  const alice = await new User({
    firstName: 'Alice', lastName: 'Dupont',
    email: 'alice@gsb.fr', password: 'alice123', role: 'user', manager: manager._id,
  }).save();
  const bob = await new User({
    firstName: 'Bob', lastName: 'Martin',
    email: 'bob@gsb.fr', password: 'bob123', role: 'user', manager: manager._id,
  }).save();

  // 4. Standard NON rattaché (hors équipe → le manager ne doit PAS pouvoir valider)
  const charlie = await new User({
    firstName: 'Charlie', lastName: 'Leroy',
    email: 'charlie@gsb.fr', password: 'charlie123', role: 'user',
  }).save();

  // 5. Factures à valider (statut Pending)
  await Invoice.create([
    { title: 'Train Paris-Lyon', date: '2026-06-01', amount: 89.90, description: 'Déplacement client', user: alice._id, status: 'Pending', type: 'Transport' },
    { title: 'Hôtel Lyon', date: '2026-06-02', amount: 120.00, description: 'Nuit sur place', user: bob._id, status: 'Pending', type: 'Hébergement' },
    { title: 'Restaurant', date: '2026-06-03', amount: 45.50, description: 'Repas client', user: charlie._id, status: 'Pending', type: 'Restauration' },
  ]);

  console.log('\nJeu de données créé :');
  console.log(`  Manager      : ${manager.email} / manager123`);
  console.log(`  Équipe       : ${alice.email} / alice123  ·  ${bob.email} / bob123`);
  console.log(`  Hors équipe  : ${charlie.email} / charlie123`);
  console.log('  Factures     : 3 en statut Pending (Alice, Bob, Charlie)');

  await mongoose.disconnect();
  console.log('Terminé.');
}

seed().catch(err => { console.error(err); process.exit(1); });
