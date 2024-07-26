const contacts = require('./contacts');
const yargs = require('yargs');
// const yargs = require('yargs/yargs');
// const { hideBin } = require('yargs/helpers');

// const argv = yargs(hideBin(process.argv)).argv;

/* Yargs */
const testYargs = () => {
    
    /* Add new contact */
    yargs.command({
        command: 'add',
        describe: 'add new contact',
        builder: {
            name: {
                describe: 'Contact Name',
                demandOption: true,
                type: 'string',
            },
            email: {
                describe: 'contact email',
                demandOption: false,
                type: 'string',
            },
            mobile: {
                describe: 'contact mobile',
                demandOption: false,
                type: 'string',
            },
        },
        handler(argv) {
            const contact = {
                name: argv.name,
                email: argv.email,
                mobile: argv.mobile,
            };
            contacts.saveContact(contact);
            console.log(contact);
        },
    });

    /* Update existing contact */
    yargs.command({
        command: 'update',
        describe: 'update data contact',
        builder: {
            name: {
                describe: 'Contact Name',
                demandOption: true,
                type: 'string',
            },
            email: {
                describe: 'contact email',
                demandOption: false,
                type: 'string',
            },
            mobile: {
                describe: 'contact mobile',
                demandOption: false,
                type: 'string',
            },
        },
        handler(argv) {
            const contact = {
                name: argv.name,
                email: argv.email,
                mobile: argv.mobile,
            };
            contacts.updateContact(contact.name, contact);
            console.log(contact);
        },
    });

    /* Get contact list by name */
    yargs.command({
        command: 'list',
        describe: 'get contact list',
        handler() {
            contacts.getContactList((contact) => {
                // Callback ini akan dijalankan setelah contactList terisi
                console.log('Daftar nama kontak:', contact);
            });
        },
    });

    /* Get contact detail by name */
    yargs.command({
        command: 'detail',
        describe: 'get detail contact',
        handler(argv) {
            // contacts.getContactDetail(argv.name);
            contacts.getContactDetail(argv.name, (error, contact) => {
                if (error) {
                    console.error(error.message);
                } else {
                    console.log('Contact details:', contact);
                }
            });
        },
    });
    
    /* Delete existing contact */
    yargs.command({
        command: 'delete',
        describe: 'delete a contact',
        handler(argv) {
            const contact = {
                name: argv.name,
            };
            contacts.deleteContact(contact.name);
        },
    });

    yargs.parse();
}

testYargs();

// const main = async () => {
//     const name = await contacts.questions('What is your name? ');
//     const email = await contacts.questions('Your email address? ', contacts.isValidEmail);
//     const mobile = await contacts.questions('Your mobile number? ', contacts.isValidMobile);

//     const newContact = { name, email, mobile };

//     contacts.saveContact(newContact);
// }

// main();
