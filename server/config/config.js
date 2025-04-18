// config.js
const config = require('config');  // Use the config module to load configuration values

// Centralized config object
const centralizedConfig = {
  port: config.get('port') || 5000,  // Get the port from config or fallback to 5000
  jwtSecret: config.get('jwtSecret'),  // Fetch JWT Secret from config
  db: {
    host: config.get('db.host'),  // Get DB host from config
    user: config.get('db.user'),  // Get DB user from config
    password: config.get('db.password'),  // Get DB password from config
    database: config.get('db.name'),  // Get DB name from config
    port: config.get('db.port') || 3306,  // Get DB port from config or default to 3306
  },
  // You can add other configurations as needed
};

module.exports = centralizedConfig;
