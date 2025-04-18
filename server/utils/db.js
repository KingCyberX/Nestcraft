const mysql = require('mysql2');
const config = require('../config/config'); // Import the centralized config

// Access DB configuration from the centralized config
const dbConfig = config.db;

// Create MySQL connection pool using the config object
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port, // Use the configured port or default to 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  multipleStatements: true,
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err);
  if (['PROTOCOL_CONNECTION_LOST', 'ECONNRESET'].includes(err.code)) {
    console.log('🔁 Reconnecting to MySQL...');
  }
});

// Use promises for async/await usage
const db = pool.promise();
module.exports = db;
