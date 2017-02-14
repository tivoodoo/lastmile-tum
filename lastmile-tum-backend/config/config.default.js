/*
 * Config File for backend.
 */

var Config = {};

// database
Config.db = {};

// In develop environment, should let host be 127.0.0.1
// instead of localhost so that when there is no internet,
// connection to mongodb can still be made
// Config.db.host = 'localhost:27017';
Config.db.host = '127.0.0.1:27017';
Config.db.name = 'LastMile';
Config.db.user = '';
Config.db.pass = '';

// Use environment defined port or 3000
Config.app = {};
Config.app.port = process.env.PORT || 4000;

// User Login Authentication
// Secret string for encryption between client-server
Config.auth = {};
Config.auth.jwtSecret = "who the hell cares?";

module.exports = Config;