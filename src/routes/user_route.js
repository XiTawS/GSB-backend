const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller');
const authenticationController = require('../controllers/authentication_controller');
const upload = require('../middlewares/upload');

router.post('/', UserController.createUser);
router.get('/', authenticationController.verifyToken, UserController.getUsers);
router.put('/', authenticationController.verifyToken, upload.single('avatar'), UserController.updateUser);
router.delete('/', authenticationController.verifyToken, UserController.deleteUser);

module.exports = router;