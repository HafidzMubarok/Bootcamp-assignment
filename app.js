const express = require('express');
var expressLayouts = require('express-ejs-layouts');
var morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;
const path = require('path');
const contacts = require('./controllers/contactsController');
const db = require('./config/db');

// Using EJS
app.set('view engine', 'ejs')

// Initialize express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout/main');

// Morgan
app.use(morgan('dev'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk memparsing data form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.currentPage = req.path;
    next();
});

//Route
app.get('/', (req, res) => {
    res.render('index', { name: 'Tatang', title: 'Home', currentPage: '/' })
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About', currentPage: '/about' })
})


app.get('/contact', (req, res) => {
    contacts.getDataContacts((contacts) => {
        res.render('contact', { contacts, title: 'Contacts', currentPage: '/contact' });
    })
})

app.get('/contact/:name', (req, res) => {
    const name = req.params.name;
    contacts.getContactDetail(name, (contact) => {
        res.render('contact-detail', { contact, title: 'Contact Detail' })
    })
})

app.route('/create-contact')
    .get((req, res) => {
        res.render('contact-create', { title: 'Create New Contact', errors: {}, formData: {} })
    })
    .post(
        // Input validation
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .custom(async (name, { req }) => {
                return new Promise((resolve, reject) => {
                    // contacts.isNameTaken(name, (isTaken) => {
                    //     if (isTaken) {
                    //         reject(new Error('Name already exists'));
                    //     } else {
                    //         resolve(true);
                    //     }
                    // });
                    const checkSql = 'SELECT COUNT(*) AS count FROM contacts WHERE name = $1';
                    db.query(checkSql, [name], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        
                        if (result.rows[0].count > 0) {// Is name already exist in database
                            reject(new Error('Name already exists'));
                        } else {
                            resolve(true);
                        }
                        
                    })
                });
            }),
        body('email')
            .trim()
            .isEmail().withMessage('Invalid email address')
            .normalizeEmail(),
        body('mobile')
            .trim()
            .isMobilePhone().withMessage('Invalid phone number')
            .escape(), (req, res) => {
            
        const errors = validationResult(req);
        const errorMessages = errors.array().reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
        }, {});
        // console.error(errorMessages);
        
        if (!errors.isEmpty()) {
            return res.render('contact-create', {
                title: 'Create New Contact',
                errors: errorMessages,
                formData: req.body
            });
        }

        const { name, email, mobile } = req.body;
        const sql = 'INSERT INTO contacts(name, email, mobile) VALUES($1, $2, $3)';
        
        try {
            // contacts.saveContact(contact);
            db.query(sql, [name, email, mobile], (err, result) => {
                if (err) {
                    throw err;
                }
                // console.log(`Contact data has been saved!`);
                console.log('Contact inserted:', result);
                res.redirect('/contact');
            });
            // res.redirect('/contact');
        } catch (err) {
            console.error(err);
        }
    })

app.route('/contact-edit/:name')
    .get((req, res) => {
        const name = req.params.name;
        contacts.getContactDetail(name, (contact) => {
            res.render('contact-edit', { contact, name, title: 'Edit Contact', errors: {} });
        });
    })
    .post(
        // Input validation
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .custom(async (name, { req }) => {
                return new Promise((resolve, reject) => {
                    const originalName = req.body.originalName; // Asumsikan originalName dikirim dari form
                    if (name === originalName) {
                        resolve(true); // Nama tidak diubah, lanjutkan
                    } else {
                        const checkSql = 'SELECT COUNT(*) AS count FROM contacts WHERE name = $1';
                        db.query(checkSql, [name], (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            
                            if (result.rows[0].count > 0) {// Is name already exist in database
                                reject(new Error('Name already exists'));
                            } else {
                                resolve(true);
                            }
                            
                        })
                    }
                });
            }),
        body('email')
            .isEmail().withMessage('Invalid email address')
            .normalizeEmail(),
        body('mobile')
            .isMobilePhone().withMessage('Invalid phone number')
            .trim()
            .escape(), (req, res) => {
            
        const errors = validationResult(req);
        const errorMessages = errors.array().reduce((acc, error) => {
            acc[error.path] = error.msg;
            return acc;
        }, {});
            
        if (!errors.isEmpty()) {
            const name = req.body.originalName;
            const sql = 'SELECT * FROM contacts WHERE name = $1';

            db.query(sql, [name], (err, result) => {
                if (err) {
                    return res.status(500).send('Server error');
                }

                res.render('contact-edit', {
                    contact: req.body,
                    name: req.params.name,
                    title: 'Edit Contact',
                    errors: errorMessages,
                });
            });
            return;
        }
            
        const { name, email, mobile } = req.body;
        const updateSql = 'UPDATE contacts SET name = $1, email = $2, mobile = $3 WHERE name = $4';
        
        try {
            // contacts.saveContact(contact);
            db.query(updateSql, [name, email, mobile, req.body.originalName], (err, result) => {
                if (err) {
                    return res.status(500).send('Server error');
                }
                res.redirect('/contact');
            });

        } catch (err) {
            console.error(err);
        }
    })
    
app.delete('/contact/:name', (req, res) => {

    const { name } = req.params;

    // Query untuk menghapus contact dari database berdasarkan nama
    const deleteSql = 'DELETE FROM contacts WHERE name = $1';

    db.query(deleteSql, [name], (err, result) => {
        if (err) {
            // Jika terjadi error, kirimkan status 500 dan pesan error
            return res.status(500).send('Server error');
        }
        res.send(`Contact ${name} deleted successfully!`);
    });

})

app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    const category = req.query.category;

    res.send(`Product id: ${id}. <br> <br> Category: ${category}`, { title: 'Product by id' });
})
        
app.use('/', (req, res) => {
    res.status(404)
    res.send('PAGE NOT FOUND: 404')
})

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}/`);
})