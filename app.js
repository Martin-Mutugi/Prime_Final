const express = require('express');
const bodyParser = require('body-parser');
const db = require('./firebase-config');  // Firebase configuration
const patientRoutes = require('./routes/patients');  // Import the patient routes

const app = express();

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

// Render the patient registration form view
app.get('/register-patient', (req, res) => {
    res.render('register-patient');  // Render the registration form view
});

// Render the healthcare facility form view
app.get('/add-healthcare-facility/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('healthcare-facility', { patientId });  // Render healthcare facility view
});

// Render the medical history form view
app.get('/add-medical-history/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('medical-history', { patientId });  // Render medical history view
});

// Render the current pregnancy form view
app.get('/add-current-pregnancy/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('current-pregnancy', { patientId });
});

// Render the social and living conditions form view
app.get('/add-social-living-conditions/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('social-living-conditions', { patientId });
});

// Render the health examination form view
app.get('/add-health-examination/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('health-examination', { patientId });
});

// Render the lifestyle habits form view
app.get('/add-lifestyle-habits/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('lifestyle-habits', { patientId });
});

// Render the mental health support form view
app.get('/add-mental-health-support/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('mental-health-support', { patientId });
});

// Render the previous pregnancies form view
app.get('/add-previous-pregnancies/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('previous-pregnancies', { patientId });
});

// Render the medications and supplements form view
app.get('/add-medications-supplements/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('medications-supplements', { patientId });
});

// Render the laboratory results form view
app.get('/add-laboratory-results/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('laboratory-results', { patientId });
});

// Render the care plan form view
app.get('/add-care-plan/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('care-plan', { patientId });
});

// Render the midwife notes form view
app.get('/add-midwife-notes/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('midwife-notes', { patientId });
});

// Render the labor and delivery form view
app.get('/add-labor-delivery/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('labor-delivery', { patientId });
});

// Render the partograph form view
app.get('/add-partograph/:patientId', (req, res) => {
    const { patientId } = req.params;
    res.render('partograph', { patientId });
});

// Route to handle successful partograph submission
app.get('/partograph-success/:patientId', (req, res) => {
    const { patientId } = req.params;
    
    // Once the partograph data is successfully saved, render a success page
    res.render('partograph-success', { patientId });
});

// Use the patientRoutes for handling CRUD operations (add, edit, delete, etc.)
app.use('/', patientRoutes);

// Start the server on port 3001
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
