const mysql = require('mysql2');
const config = require('config');

// Access DB configuration
const dbConfig = config.get('db');
// Create MySQL connection pool
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.name,
  port: dbConfig.port || 3306,
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

const db = pool.promise();
module.exports = db;
