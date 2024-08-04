const { Client } = require('pg');

require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOSTNAME,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,   
}

// Create a new PostgreSQL client
const client = new Client(dbConfig);

// Connect to the database
client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');

		// Execute SQL queries here

	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});
	
module.exports = client;