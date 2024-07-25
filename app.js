const contacts = require('./contacts');

const main = async () => {
    const name = await contacts.questions('What is your name? ');
    const email = await contacts.questions('Your email address? ', contacts.isValidEmail);
    const mobile = await contacts.questions('Your mobile number? ', contacts.isValidMobile);

    const newContact = { name, email, mobile };

    contacts.saveContact(newContact);
}

main();