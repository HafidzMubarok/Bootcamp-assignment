const fs = require('fs');
const readline = require('node:readline');
const validator = require('validator');

const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

const getDataContacts = (callback) => {
    const file = './data/contacts.json';

    fs.access(file, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`${file} does not exist. Creating...`);
            fs.writeFileSync(file, '[]');
            callback([]);
        } else {
            try {
                const data = fs.readFileSync(file, 'utf-8');
                if (data) {
                    const jsonData = JSON.parse(data);
                    callback(jsonData);
                } else {
                    console.log('File is empty or content is not valid JSON.');
                    callback([]);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error.message);
                callback([]);
            }
        }
    });
};

const pushDataContacts = (newContact) => {
    getDataContacts((contacts) => {
        contacts.push(newContact);
        fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts, null, 2));
    });
};

const identityQuestion = () => {
    rl.question('Your name: ', (name) => {
        rl.question('Your email: ', (email) => {
            if (validator.isEmail(email)) {
                rl.question('Phone number: ', (phone) => {
                    if (validator.isMobilePhone(phone, 'id-ID')) {
                        const newContact = { name, email, phone_number: phone };
                        pushDataContacts(newContact);
                        console.log('Contact saved successfully.');
                        rl.close();
                    } else {
                        console.log('Your phone number is not valid! Please input a valid phone number.');
                        identityQuestion();
                    }
                });
            } else {
                console.log('Your email is not valid! Please input a valid email.');
                identityQuestion();
            }
        });
    });
};

identityQuestion();
