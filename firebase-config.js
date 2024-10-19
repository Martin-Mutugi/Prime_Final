const admin = require('firebase-admin');
const serviceAccount = require('./serviceKeyAccounts.json');  // Make sure this file exists and contains valid credentials

// Check if Firebase Admin has already been initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://netdokproject-default-rtdb.firebaseio.com"
  });
}

// Get the Firebase Realtime Database instance
const db = admin.database();

// Export the database instance for use in other files
module.exports = db;
