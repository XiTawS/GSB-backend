const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice_controller');
const authenticationController = require('../controllers/authentication_controller');
const upload = require('../middlewares/upload');

router.post('/', authenticationController.verifyToken, upload.single('proof'), invoiceController.createInvoice);
router.get('/',  authenticationController.verifyToken, invoiceController.getInvoices);
router.get('/:id',  invoiceController.getInvoiceById);
router.put('/:id',  invoiceController.updateInvoice);
router.delete('/:id',  invoiceController.deleteInvoice);

module.exports = router;