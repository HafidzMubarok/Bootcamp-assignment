// validators/contactValidator.js
const validator = require('validator');
const { body } = require('express-validator');

const validateContact = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .custom(async (name, { req }) => {
            const originalName = req.body.originalName;
            if (name === originalName) {
                return true;
            } else {
                const checkSql = 'SELECT COUNT(*) AS count FROM contacts WHERE name = $1';
                const result = await db.query(checkSql, [name]);
                if (result.rows[0].count > 0) {
                    throw new Error('Name already exists');
                }
                return true;
            }
        }),
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    body('mobile')
        .trim()
        .isMobilePhone().withMessage('Invalid phone number')
        .custom(({req}) => validator.isMobilePhone(req.body.mobile, 'id-ID'))
        .escape()
];

module.exports = {
    validateContact
};
