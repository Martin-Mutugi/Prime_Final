const express = require('express');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');
const patientRoutes = require('./routes/patients');  // Import the patient routes

const app = express();

// Firebase Admin SDK initialization
if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
            type: process.env.FIREBASE_TYPE,
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

// Get Firebase Realtime Database reference
const db = firebaseAdmin.database();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files like CSS, JS, and images
app.use(express.static('public'));

// Parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route to render the home page and fetch patient data in real-time
app.get('/', (req, res) => {
    db.ref('patients').on('value', (snapshot) => {
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

// Other routes for rendering forms
app.get('/register-patient', (req, res) => res.render('register-patient'));
app.get('/add-healthcare-facility/:patientId', (req, res) => res.render('healthcare-facility', { patientId: req.params.patientId }));
app.get('/add-medical-history/:patientId', (req, res) => res.render('medical-history', { patientId: req.params.patientId }));
app.get('/add-current-pregnancy/:patientId', (req, res) => res.render('current-pregnancy', { patientId: req.params.patientId }));
app.get('/add-social-living-conditions/:patientId', (req, res) => res.render('social-living-conditions', { patientId: req.params.patientId }));
app.get('/add-health-examination/:patientId', (req, res) => res.render('health-examination', { patientId: req.params.patientId }));
app.get('/add-lifestyle-habits/:patientId', (req, res) => res.render('lifestyle-habits', { patientId: req.params.patientId }));
app.get('/add-mental-health-support/:patientId', (req, res) => res.render('mental-health-support', { patientId: req.params.patientId }));
app.get('/add-previous-pregnancies/:patientId', (req, res) => res.render('previous-pregnancies', { patientId: req.params.patientId }));
app.get('/add-medications-supplements/:patientId', (req, res) => res.render('medications-supplements', { patientId: req.params.patientId }));
app.get('/add-laboratory-results/:patientId', (req, res) => res.render('laboratory-results', { patientId: req.params.patientId }));
app.get('/add-care-plan/:patientId', (req, res) => res.render('care-plan', { patientId: req.params.patientId }));
app.get('/add-midwife-notes/:patientId', (req, res) => res.render('midwife-notes', { patientId: req.params.patientId }));
app.get('/add-labor-delivery/:patientId', (req, res) => res.render('labor-delivery', { patientId: req.params.patientId }));
app.get('/add-partograph/:patientId', (req, res) => res.render('partograph', { patientId: req.params.patientId }));

// Route to handle successful partograph submission
app.get('/partograph-success/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('partograph-success', { patientId });
});

// Use the patientRoutes for handling CRUD operations (add, edit, delete, etc.)
app.use('/', patientRoutes);

// Start the server on port 3001
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
