const User = require('../models/user_model');

// Créer un nouvel utilisateur
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json(user);
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    const users = await User.find();
    if(!users){
      res.status(404).json({ message: "Users not found" });
      return;
    }
    res.json(users);
};

// Récupérer un utilisateur par son email
const getUserByEmail = async (req, res) => {
    const user = await User.find({email: req.params.email});
    if(!user){
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
};

// Mettre à jour un utilisateur
const updateUserbyEmail = async (req, res) => {
    const user = await User.find({email: req.params.email});
    if(!user){
      res.status(404).json({ message: "User not found" });
      return;
    }
    await User.updateOne({email: req.params.email}, req.body);
    res.status(200).json({ message: "User updated" });
};

// Supprimer un utilisateur
const deleteUserbyEmail = async (req, res) => {
    const user = await User.find({email: req.params.email});
    if(!user){
      res.status(404).json({ message: "User not found" });
      return;
    }
    await User.deleteOne({email: req.params.email});
    res.status(200).json({ message: "User deleted" });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail,
    updateUserbyEmail,
    deleteUserbyEmail
}; 