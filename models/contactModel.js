// models/contactModel.js
const db = require('../config/db'); // Mengimpor koneksi database

const ContactModel = {
    getAllContacts: (callback) => {
        const sql = 'SELECT name, mobile FROM contacts';
        db.query(sql, [], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result.rows);
        });
    },

    getContactByName: (name, callback) => {
        const sql = 'SELECT name, mobile, email FROM contacts WHERE name = $1';
        db.query(sql, [name], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result.rows[0]);
        });
    },

    createContact: (contactData, callback) => {
        const { name, email, mobile } = contactData;
        const sql = 'INSERT INTO contacts(name, email, mobile, created_at) VALUES($1, $2, $3, CURRENT_TIMESTAMP)';
        db.query(sql, [name, email, mobile], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    },

    updateContact: (contactData, originalName, callback) => {
        const { name, email, mobile } = contactData;
        const sql = 'UPDATE contacts SET name = $1, email = $2, mobile = $3 WHERE name = $4';
        db.query(sql, [name, email, mobile, originalName], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    },

    deleteContactByName: (name, callback) => {
        const sql = 'DELETE FROM contacts WHERE name = $1';
        db.query(sql, [name], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }
};

module.exports = ContactModel;
