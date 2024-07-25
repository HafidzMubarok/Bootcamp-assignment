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

const isValidEmail = (email) => {
    return validator.isEmail(email);
}

const isValidMobile = (mobile) => {
    return validator.isMobilePhone(mobile, 'id-ID')
}

const saveContact = (newContact) => {
    return new Promise((resolve) => {
        getDataContacts((contacts) => {
            contacts.push(newContact);
            resolve(fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts, null, 2)));
        });
    });
};

const questions = (stringQuestion, validate = null) => {
    return new Promise((resolve) => {
        const ask = () => {
            rl.question(stringQuestion, (answer) => {
                if (validate && !validate(answer)) {
                    console.log('Invalid input. Please try again!');
                    ask();
                } else {
                    resolve(answer);
                }
            });
        }
        ask();
    });
};

module.exports = { questions, saveContact, isValidEmail, isValidMobile };
