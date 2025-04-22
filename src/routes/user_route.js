const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserByEmail, updateUserbyEmail, deleteUserbyEmail } = require('../controllers/user_controller');

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:email', getUserByEmail);
router.put('/:email', updateUserbyEmail);
router.delete('/:email', deleteUserbyEmail);

module.exports = router;