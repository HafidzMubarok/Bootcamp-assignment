const fs = require('fs');
const readline = require('node:readline');
const validator = require('validator');

const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

/**
 * Fungsi untuk mengambil data kontak dari file JSON.
 * @param {Function} callback - Fungsi callback yang akan dipanggil dengan data kontak.
 */
const getDataContacts = (callback) => {
    const file = './data/contacts.json';

    // Memeriksa apakah file kontak ada
    fs.access(file, fs.constants.F_OK, (err) => {
        if (err) {
            // Jika file tidak ada, buat file baru dengan array kosong
            console.log(`${file} does not exist. Creating...`);
            fs.writeFileSync(file, '[]');
            callback([]);
        } else {
            try {
                // Membaca data dari file kontak
                const data = fs.readFileSync(file, 'utf-8');
                if (data) {
                    // Mengonversi data dari string ke JSON
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

/**
 * Fungsi untuk memvalidasi apakah sebuah email valid.
 * @param {string} email - Email yang akan divalidasi.
 * @returns {boolean} - True jika email valid, false jika tidak.
 */
const isValidEmail = (email) => {
    return validator.isEmail(email);
};

/**
 * Fungsi untuk memvalidasi apakah sebuah nomor telepon valid.
 * @param {string} mobile - Nomor telepon yang akan divalidasi.
 * @returns {boolean} - True jika nomor telepon valid, false jika tidak.
 */
const isValidMobile = (mobile) => {
    return validator.isMobilePhone(mobile, 'id-ID');
};

/**
 * Fungsi untuk menyimpan kontak baru ke dalam file JSON.
 * @param {Object} newContact - Objek kontak baru yang akan disimpan.
 * @returns {Promise<void>} - Promise yang menyelesaikan saat kontak disimpan.
 */
const saveContact = (newContact) => {
    return new Promise((resolve) => {
        // Mengambil data kontak yang ada dan menambah kontak baru
        getDataContacts((contacts) => {
            contacts.push(newContact);
            // Menyimpan kembali data kontak yang sudah diperbarui
            resolve(fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts, null, 2)));
        });
    });
};

/**
 * Fungsi untuk menanyakan input dari pengguna dengan opsi validasi.
 * @param {string} stringQuestion - Pertanyaan yang akan ditanyakan ke pengguna.
 * @param {Function|null} validate - Fungsi untuk memvalidasi jawaban pengguna. Default: null.
 * @returns {Promise<string>} - Promise yang menyelesaikan dengan jawaban pengguna.
 */
const questions = (stringQuestion, validate = null) => {
    return new Promise((resolve) => {
        const ask = () => {
            rl.question(stringQuestion, (answer) => {
                // Jika ada fungsi validasi dan input tidak valid, tanyakan kembali
                if (validate && !validate(answer)) {
                    console.log('Invalid input. Please try again!');
                    ask();
                } else {
                    resolve(answer);
                }
            });
        };
        ask();
    });
};

// Mengekspor fungsi-fungsi yang didefinisikan di atas
module.exports = { questions, saveContact, isValidEmail, isValidMobile };
