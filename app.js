const express = require('express');
const app = express();
const port = 3000;
const contacts = require('./contacts');
const path = require('path');

// Using EJS
app.set('view engine', 'ejs')

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//Route
app.get('/', (req, res) => {
    // const filePath = path.join(__dirname, 'index.html');
    // res.sendFile(filePath);
    // res.sendFile('index.html', { root: __dirname });
    res.render('index', { name: 'Tatang', title: 'Home' })
})

app.get('/about', (req, res) => {
    // res.sendFile('about.html', { root: __dirname });
    res.render('about', { title: 'About' })
})

app.get('/contact', (req, res) => {
    // Get contact from contacts.json
    // res.sendFile('contact.html', { root: __dirname });
    // contacts.getContactList((contact) => {
    //     res.render('contact', { contacts: contact })
    // });
    const contacts = [
        {
            name: "Fathul",
            email: "fathul@mail.com"
        },
        {
            name: "Hasbi",
            email: "hasbi@mail.com"
        },
        {
            name: "Tatang",
            email: "tatang@mail.com"
        },
    ];
    
    res.render('contact', { contacts, title: 'Contacts' })
})

app.get('/contact/:name', (req, res) => {
    // res.sendFile('contact.html', { root: __dirname });
    const name = req.params.name;
    contacts.getContactDetail(name, (error, contact) => {
        if (error) {
            console.error(error.message);
        } else {
            // console.log('Contact details:', contact);
            res.render('contact-detail', { contact: contact, title: 'Contact Detail' })
        }
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
    console.log(`App listening on port ${port}`);
})