/*
 * Config File for backend.
 */

var Config = {};

// database
Config.db = {};
Config.db.host = 'localhost:27017';
Config.db.name = '';
Config.db.user = '';
Config.db.pass = '';

// Use environment defined port or 3000
Config.app = {};
Config.app.port = process.env.PORT || 3000;

// User Login Authentication
// Secret string for encryption between client-server
Config.auth = {};
Config.auth.jwtSecret = "who the hell cares?";

module.exports = Config;