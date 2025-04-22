const express = require('express');
const router = express.Router();
const { createInvoice } = require('../controllers/invoice_controller');

router.post('/', createInvoice);


module.exports = router;