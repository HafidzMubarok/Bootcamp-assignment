const express = require('express');
var expressLayouts = require('express-ejs-layouts');
var morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;
const path = require('path');
const contacts = require('./contacts');
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
    // const filePath = path.join(__dirname, 'index.html');
    // res.sendFile(filePath);
    // res.sendFile('index.html', { root: __dirname });
    res.render('index', { name: 'Tatang', title: 'Home', currentPage: '/' })
})

app.get('/about', (req, res) => {
    // res.sendFile('about.html', { root: __dirname });
    res.render('about', { title: 'About', currentPage: '/about' })
})


app.get('/contact', (req, res) => {
    
    // contacts.getContactList((contact) => {
    //     // Callback ini akan dijalankan setelah contactList terisi
    //     res.render('contact', { contacts: contact, title: 'Contacts', currentPage: '/contact' });
    // });

    const sql = 'SELECT name, mobile FROM contacts';

    db.query(sql, [], (err, result) => {
        if (err) {
            throw err;
        }

        const contacts = result.rows;
        res.render('contact', { contacts, title: 'Contacts', currentPage: '/contact' });
    });
})

app.get('/contact/:name', (req, res) => {
    // const name = req.params.name;
    // contacts.getContactDetail(name, (error, contact) => {
    //     if (error) {
    //         console.error(error.message);
    //     } else {
    //         // console.log('Contact details:', contact);
    //         res.render('contact-detail', { contact: contact, title: 'Contact Detail' })
    //     }
    // });

    const name = req.params.name;
    const sql = 'SELECT * FROM contacts WHERE name = $1'

    db.query(sql, [name], (err, result) => {
        if (err) {
            throw err;
        }
        
        const contact = result.rows[0];
        res.render('contact-detail', { contact, title: 'Contact Detail' })
    });
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
        
        // const contact = {
        //     name: req.body.name,
        //     email: req.body.email,
        //     mobile: req.body.mobile,
        // };
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
        contacts.getContactDetail(name, (error, contact) => {
            if (error) {
                console.error(error.message);
            } else {
                res.render('contact-edit', { contact: contact, name: name, title: 'Edit Contact', errors: {} })
            }
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
                        contacts.isNameTaken(name, (isTaken) => {
                            if (isTaken) {
                                reject(new Error('Name already exists'));
                            } else {
                                resolve(true);
                            }
                        });
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
            
        // console.log(errorMessages);
            
        if (!errors.isEmpty()) {
            return contacts.getContactDetail(req.params.name, (error, contact) => {
                if (error) {
                    console.error(error.message);
                } else {  
                    console.log(req.params.name);
                    res.render('contact-edit', {
                        contact: req.body,
                        name: req.params.name,
                        title: 'Edit Contact',
                        errors: errorMessages,
                    })
                }
            });
        }
        
        const contact = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
        };
        
        try {
            contacts.updateContact(req.params.name, contact);
            console.log(`Contact data has been saved!`);
            res.redirect('/contact');
        } catch (err) {
            console.error(err);
        }
    })
    
app.delete('/contact/:name', (req, res) => {
    const name = req.params.name
    console.log(`Contact with name ${name} has been deleted!`);
    contacts.deleteContact(name);

    res.send(`Contact ${name} deleted successfully!`);
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