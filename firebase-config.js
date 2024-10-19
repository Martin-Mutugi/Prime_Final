const admin = require('firebase-admin');
const serviceAccount = require('./serviceKeyAccounts.json');  // Ensure this file exists and contains valid credentials

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://netdokproject-default-rtdb.firebaseio.com"  // Make sure this URL is correct
});

// Get the Firebase Realtime Database instance
const db = admin.database();

// Export the database instance for use in other files
module.exports = db;
