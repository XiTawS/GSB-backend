const Invoice = require('../models/invoice_model');
const {uploadToS3} = require('../utils/s3')

// Créer une nouvelle facture
const createInvoice = async (req, res) => {
    try {
        const {title, date, amount, description, status, type} = JSON.parse(req.body.metadata)
        const {userId} = req.user

        let proofUrl;
        if(req.file){
            proofUrl = await uploadToS3(req.file);
        }else{
            throw new Error('Proof is required', { cause: 400 });
        }

        const invoice = new Invoice({
            title,
            date,
            amount,
            proof: proofUrl,
            description,
            user: userId,
            status,
            type
        });
        await invoice.save();
        res.status(201).json(invoice);
    } catch (error) {
        if(error['cause'] === 400){
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Error creating invoice" });
        }
    }
};

// Récupérer toutes les factures
const getInvoices = async (req, res) => {
    try {
        const {userId, role} = req.user
        let invoices
        if(role === 'admin'){
            invoices = await Invoice.find()
        } else {
            invoices = await Invoice.find({user: userId})
        }
        res.status(200).json(invoices)
    } catch (error) {
        res.status(500).json({ message: "Error getting invoices" });
    }
};

// Récupérer une facture par son id
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Error getting invoice" });
    }
};

// Mettre à jour une facture par son id
const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Error updating invoice" });
    }
};

// Supprimer une facture par son id
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json({ message: "Invoice deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting invoice" });
    }
};

module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
};
