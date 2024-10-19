const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');  // Import Firebase Admin SDK
const patientRoutes = require('./routes/patients');  // Import the patient routes
require('dotenv').config();  // Load environment variables from .env

const app = express();

// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Proper handling for multi-line private key
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files like CSS, JS, and images
app.use(express.static('public'));

// Parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route to render the home page and fetch patient data in real-time
app.get('/', (req, res) => {
    const db = admin.database().ref('patients');
    db.on('value', (snapshot) => {
        const patientsData = snapshot.val() || {};  // Retrieve patient data or use an empty object if none
        const patients = Object.keys(patientsData).map(key => ({ id: key, ...patientsData[key] }));  // Convert to an array with the id as a field

        // Assuming you want to pass the first patient's ID for the form as an example
        const patientId = patients.length > 0 ? patients[0].id : null;  // Get the first patient ID, or null if no patients

        // Render the main dashboard or home page
        res.render('index', { patients, patientId });
    }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
        res.status(500).send('Error fetching patients');
    });
});

// Render the patient registration form view
app.get('/register-patient', (req, res) => {
    res.render('register-patient');  // Render the registration form view
});

// Render other forms based on the specific patient ID
const formRoutes = [
    { path: '/add-healthcare-facility/:patientId', view: 'healthcare-facility' },
    { path: '/add-medical-history/:patientId', view: 'medical-history' },
    { path: '/add-current-pregnancy/:patientId', view: 'current-pregnancy' },
    { path: '/add-social-living-conditions/:patientId', view: 'social-living-conditions' },
    { path: '/add-health-examination/:patientId', view: 'health-examination' },
    { path: '/add-lifestyle-habits/:patientId', view: 'lifestyle-habits' },
    { path: '/add-mental-health-support/:patientId', view: 'mental-health-support' },
    { path: '/add-previous-pregnancies/:patientId', view: 'previous-pregnancies' },
    { path: '/add-medications-supplements/:patientId', view: 'medications-supplements' },
    { path: '/add-laboratory-results/:patientId', view: 'laboratory-results' },
    { path: '/add-care-plan/:patientId', view: 'care-plan' },
    { path: '/add-midwife-notes/:patientId', view: 'midwife-notes' },
    { path: '/add-labor-delivery/:patientId', view: 'labor-delivery' },
    { path: '/add-partograph/:patientId', view: 'partograph' },
    { path: '/partograph-success/:patientId', view: 'partograph-success' }
];

// Register routes for rendering forms dynamically
formRoutes.forEach(route => {
    app.get(route.path, (req, res) => {
        const { patientId } = req.params;
        res.render(route.view, { patientId });
    });
});

// Use the patientRoutes for handling CRUD operations (add, edit, delete, etc.)
app.use('/', patientRoutes);

// Start the server on port 3001
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
