const admin = require('firebase-admin');
const serviceAccount = require('./serviceKeyAccounts.json');  // Ensure this file exists and contains valid credentials

// Check if Firebase Admin has already been initialized to prevent duplicate initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://netdokproject-default-rtdb.firebaseio.com"  // Ensure this URL is correct
  });
}

// Get the Firebase Realtime Database instance
const db = admin.database();

// Export the database instance for use in other files
module.exports = db;
