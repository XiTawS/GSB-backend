const User = require('../models/user_model');
const sha256 = require('js-sha256');
const {uploadToS3} = require('../utils/s3')

// Créer un nouvel utilisateur
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const user = new User({ firstName, lastName, email, password, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if(error.message === 'User already exists'){
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Récupérer un utilisateur par son email
const getUsers = async (req, res) => {
  try {
    // Si l'email est présent dans la requête, on filtre les utilisateurs par email
    const email = req.query.email ? {email: req.query.email} : {};
    const users = await User.find(email);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const {email} = req.query;
    const {firstName, lastName, newEmail, password, role, avatar} = req.body; // Ajout avatar
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (newEmail) updateFields.email = newEmail;
    if (role) updateFields.role = role;
    if (password) {
      updateFields.password = sha256(password + process.env.SALT);
    }
    // Ajout : si avatar en base64 ou url dans le body
    if (avatar) {
      updateFields.avatar = avatar;
    }
    // Si tu veux garder l'upload S3 pour les fichiers envoyés en multipart :
    if (req.file) {
      updateFields.avatar = await uploadToS3(req.file);
    }
    const user = await User.findOneAndUpdate({email}, updateFields, {new: true});
    if(!user){
      throw new Error('User not found', { cause: 404 })
    }else {
      res.status(200).json(user);
    }
  } catch (error) {
    if (error.cause === 404) {
      res.status(error.cause).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const {email} = req.query;
    const user = await User.findOneAndDelete({email});
    if(!user){
      throw new Error('User not found', { cause: 404 })
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    if (error.cause === 404) {
      res.status(error.cause).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error deleting user" });
    }
  }
};

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser
}; 