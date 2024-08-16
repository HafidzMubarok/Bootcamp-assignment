// controllers/contactController.js
const ContactModel = require('../models/contactModel');

const ContactController = {
    getContacts: (req, res) => {
        ContactModel.getAllContacts((err, contacts) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(contacts);
        });
    },

    getContactByName: (req, res) => {
        const name = req.params.name;
        ContactModel.getContactByName(name, (err, contact) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(contact);
        });
    },

    createContact: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const contactData = req.body;
        ContactModel.createContact(contactData, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(200).json(result);
        });
    },

    updateContact: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const contactData = req.body;
        const originalName = req.body.originalName;
        ContactModel.updateContact(contactData, originalName, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            if (result.rowCount === 0) {
                return res.status(400).json({ message: 'No contact found with the provided original name' });
            }
            res.status(200).send('Contact edited');
        });
    },

    deleteContactByName: (req, res) => {
        const name = req.params.name;
        ContactModel.deleteContactByName(name, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            res.send(`Contact ${name} deleted successfully!`);
        });
    }
};

module.exports = ContactController;
