const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication_controller');

router.post('/login', authenticationController.login);

module.exports = router;   
