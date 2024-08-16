// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contacts');
const { body } = require('express-validator');
const { validateContact } = require('../validators/contactValidator');

// Rute API
router.get('/contacts', ContactController.getContacts);
router.get('/contact/:name', ContactController.getContactByName);
router.post('/contact', validateContact, ContactController.createContact);
router.put('/contact/:name', validateContact, ContactController.updateContact);
router.delete('/contact/:name', ContactController.deleteContactByName);

module.exports = router;