const fs = require('fs');
const readline = require('node:readline');
var validator = require('validator');

const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });
var isIdentityValid = false;

const identityQuestion = () => {
    rl.question('Your name: ', (name) => {
        rl.question('Your email: ', (email) => {
            if (validator.isEmail(email)) {
                rl.question('Phone number: ', (phone) => {
                    if (validator.isMobilePhone(phone, 'id-ID')) {
                        isIdentityValid = true;
                        const text = `Oh, your name is ${name}. Your email is ${email}. Your phone number is ${phone}. Thanks!`; 
                        console.log(`\n ${text}`);
                        fs.writeFileSync('output.txt', text);
                        rl.close()
                    } else {
                        console.log(`Your phone number is not valid! Please input valid phone number \n`);
                        identityQuestion();
                    }
                })
            } else {
                console.log(`Your email is not valid! Please input valid email \n`);
                identityQuestion();
            }
        })
    })
}

identityQuestion();
