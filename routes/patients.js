const express = require('express');
const router = express.Router();
const db = require('../firebase-config');  // Ensure firebase-config is correctly required

// Route to handle patient registration
router.post('/register-patient', async (req, res) => {
    const {
        personalNumber,
        fullName,
        birthDate,
        street,
        postalCode,
        city,
        country,
        mobilePhone,
        emergencyName,
        relationship,
        emergencyMobile,
        ageAtDelivery,  // Optional field
        inscriptionDate,
        mvcNumber,
        doctorNurse,
        insuranceNumber
    } = req.body;

    if (!personalNumber || !fullName || !birthDate || !street || !postalCode || !city || !country ||
        !mobilePhone || !emergencyName || !relationship || !emergencyMobile || !inscriptionDate || !mvcNumber || !doctorNurse || !insuranceNumber) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the patient data to Firebase
        const newPatientRef = await db.ref('patients').push({
            personalNumber,
            fullName,
            birthDate,
            address: {
                street,
                postalCode,
                city,
                country
            },
            mobilePhone,
            emergencyContact: {
                name: emergencyName,
                relationship,
                mobile: emergencyMobile
            },
            ageAtDelivery: ageAtDelivery || null,
            inscriptionDate,
            mvcNumber,
            doctorNurse,
            insuranceNumber,
            createdAt: new Date().toISOString()  // Optional: Add timestamp for patient creation
        });

        // Redirect to the healthcare facility section with the patient's ID
        res.redirect(`/add-healthcare-facility/${newPatientRef.key}`);
    } catch (error) {
        res.status(500).send('Error registering patient: ' + error.message);
    }
});

// Route to handle patient editing
router.post('/edit-patient', async (req, res) => {
    const {
        patientId,
        personalNumber,
        fullName,
        birthDate,
        street,
        postalCode,
        city,
        country,
        mobilePhone,
        emergencyName,
        relationship,
        emergencyMobile,
        ageAtDelivery,
        inscriptionDate,
        mvcNumber,
        doctorNurse,
        insuranceNumber
    } = req.body;

    try {
        // Update the patient data in Firebase
        await db.ref('patients/' + patientId).update({
            personalNumber,
            fullName,
            birthDate,
            address: {
                street,
                postalCode,
                city,
                country
            },
            mobilePhone,
            emergencyContact: {
                name: emergencyName,
                relationship,
                mobile: emergencyMobile
            },
            ageAtDelivery: ageAtDelivery || null,
            inscriptionDate,
            mvcNumber,
            doctorNurse,
            insuranceNumber,
            updatedAt: new Date().toISOString()
        });

        res.redirect(`/patient-details/${patientId}`);
    } catch (error) {
        res.status(500).send('Error updating patient: ' + error.message);
    }
});

// Route to handle patient deletion
router.post('/delete-patient/:id', async (req, res) => {
    const patientId = req.params.id;

    try {
        // Delete patient from Firebase
        await db.ref('patients/' + patientId).remove();
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting patient: ' + error.message);
    }
});

// Route to add healthcare facility details for a patient
router.post('/add-healthcare-facility/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        registrationDate,
        mvcNumber,
        doctorNurse,
        insuranceNumber,
        facilityName,
        facilityBranch,
        facilityStreet,
        facilityPostalCode,
        facilityCity
    } = req.body;

    if (!registrationDate || !mvcNumber || !doctorNurse || !insuranceNumber || !facilityName || !facilityBranch || !facilityStreet || !facilityPostalCode || !facilityCity) {
        return res.status(400).send('All fields are required');
    }

    try {
        await db.ref(`patients/${patientId}/healthcareFacility`).set({
            registrationDate,
            mvcNumber,
            doctorNurse,
            insuranceNumber,
            facilityDetails: {
                facilityName,
                facilityBranch,
                facilityAddress: {
                    street: facilityStreet,
                    postalCode: facilityPostalCode,
                    city: facilityCity
                }
            }
        });

        res.redirect(`/add-medical-history/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving healthcare facility data: ' + error.message);
    }
});

// Route to add medical history and risk factors for a patient
router.post('/add-medical-history/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        heartDisease,
        thrombosis,
        thyroidDisease,
        lupusSle,
        diabetes,
        epilepsy,
        psychiatricDisease,
        urinaryTractInfections,
        kidneyDisease,
        gonorrhea,
        syphilis,
        familyHereditaryDiseases,
        medicationAllergies,
        otherAllergies,
        smoking,
        alcoholUse,
        drugUse
    } = req.body;

    if (!familyHereditaryDiseases || !otherAllergies) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the medical history and risk factors data under the specific patient in Firebase
        await db.ref(`patients/${patientId}/medicalHistory`).set({
            heartDisease: heartDisease === 'true',
            thrombosis: thrombosis === 'true',
            thyroidDisease: thyroidDisease === 'true',
            lupusSle: lupusSle === 'true',
            diabetes: diabetes === 'true',
            epilepsy: epilepsy === 'true',
            psychiatricDisease: psychiatricDisease === 'true',
            urinaryTractInfections: urinaryTractInfections === 'true',
            kidneyDisease: kidneyDisease === 'true',
            gonorrhea: gonorrhea === 'true',
            syphilis: syphilis === 'true',
            familyHereditaryDiseases,
            allergies: {
                medicationAllergies: medicationAllergies === 'true',
                otherAllergies
            },
            riskFactors: {
                smoking: smoking === 'true',
                alcoholUse: alcoholUse === 'true',
                drugUse: drugUse === 'true'
            }
        });

        res.redirect(`/add-current-pregnancy/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving medical history data: ' + error.message);
    }
});

// Route to add current pregnancy details for a patient
router.post('/add-current-pregnancy/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        lastMenstruation,
        positivePregnancyTest,
        stoppedContraceptive,
        iudRemoved,
        dueDateLastMenstrualPeriod,
        ultrasoundDueDate,
        weeksPregnant,
        ultrasoundScheduled
    } = req.body;

    // Validate the form data (You can customize this based on your needs)
    if (!lastMenstruation || !dueDateLastMenstrualPeriod || !ultrasoundDueDate || !weeksPregnant) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the current pregnancy details under the specific patient in Firebase
        await db.ref(`patients/${patientId}/currentPregnancy`).set({
            lastMenstruation,
            positivePregnancyTest: positivePregnancyTest === 'true',
            stoppedContraceptive: stoppedContraceptive === 'true',
            iudRemoved: iudRemoved === 'true',
            estimatedDueDates: {
                dueDateLastMenstrualPeriod,
                ultrasoundDueDate
            },
            weeksPregnant,
            ultrasoundScheduled: ultrasoundScheduled === 'true'
        });

        // Redirect to the next section (e.g., Social Living Conditions)
        res.redirect(`/add-social-living-conditions/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving current pregnancy data: ' + error.message);
    }
});

// Route to add social and living conditions for a patient
router.post('/add-social-living-conditions/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        familySituation,
        profession,
        workingType,
        job,
        educationLevel,
        modeOfTransport,
        smoking,
        snus
    } = req.body;

    // Validate the form data (You can customize this based on your needs)
    if (!familySituation || !profession || !workingType || !job || !educationLevel || !modeOfTransport || !smoking) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the social and living conditions data under the specific patient in Firebase
        await db.ref(`patients/${patientId}/socialLivingConditions`).set({
            familySituation,
            profession,
            workingType,
            job,
            educationLevel,
            modeOfTransport,
            smoking,
            snus: snus === 'true'
        });

        // Redirect to the next section (e.g., Health Examination)
        res.redirect(`/add-health-examination/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving social and living conditions data: ' + error.message);
    }
});

// Route to add health examination details for a patient
router.post('/add-health-examination/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        heightCm,
        weightKg,
        bmi,
        systolic,
        diastolic,
        fundalHeightCm,
        fetalHeartbeat,
        bloodGlucose,
        urineProtein,
        urineGlucose
    } = req.body;

    // Basic validation to check if required fields are provided
    if (!heightCm || !weightKg || !bmi || !systolic || !diastolic || !fundalHeightCm || !fetalHeartbeat || !bloodGlucose || !urineProtein || !urineGlucose) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the health examination data under the specific patient in Firebase
        await db.ref(`patients/${patientId}/healthExamination`).set({
            heightCm,
            weightKg,
            bmi,
            bloodPressure: {
                systolic,
                diastolic
            },
            fundalHeightCm,
            fetalHeartbeat,
            bloodGlucose,
            urineProtein,
            urineGlucose
        });

        // Redirect to the next section (e.g., lifestyle and habits)
        res.redirect(`/add-lifestyle-habits/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving health examination data: ' + error.message);
    }
});

// Route to add lifestyle and habits details for a patient
router.post('/add-lifestyle-habits/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        cigarettesPerDay,
        snusBeforePregnancy,
        quitSmokingDays,
        snusAtRegistration,
        alcoholBeforePregnancy,
        alcoholDuringPregnancy,
        auditScore,
        physicalActivityBeforePregnancy,
        physicalActivityDuringPregnancy
    } = req.body;

    // Basic validation to check if required fields are provided
    if (!cigarettesPerDay || !quitSmokingDays || !alcoholBeforePregnancy || !alcoholDuringPregnancy || !auditScore || !physicalActivityBeforePregnancy || !physicalActivityDuringPregnancy) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the lifestyle and habits data under the specific patient in Firebase
        await db.ref(`patients/${patientId}/lifestyleHabits`).set({
            smoking: {
                cigarettesPerDay,
                snusBeforePregnancy: snusBeforePregnancy === 'true',
                quitSmokingDays,
                snusAtRegistration: snusAtRegistration === 'true'
            },
            alcoholUse: {
                beforePregnancy: alcoholBeforePregnancy,
                duringPregnancy: alcoholDuringPregnancy,
                auditScore
            },
            physicalActivity: {
                beforePregnancy: physicalActivityBeforePregnancy,
                duringPregnancy: physicalActivityDuringPregnancy
            }
        });

        // Redirect to the next section (e.g., mental health and support)
        res.redirect(`/add-mental-health-support/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving lifestyle habits data: ' + error.message);
    }
});

// Route to add mental health and support details for a patient
router.post('/add-mental-health-support/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        previousEpisodes,
        currentEpisodes,
        stressLevelBefore,
        currentStressLevel,
        supportAvailable,
        livingSituationSupport
    } = req.body;

    // Basic validation to check if required fields are provided
    if (!stressLevelBefore || !currentStressLevel || !livingSituationSupport) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the mental health and support data under the specific patient in Firebase
        await db.ref(`patients/${patientId}/mentalHealthSupport`).set({
            mentalHealthScreening: {
                previousEpisodes: previousEpisodes === 'true',
                currentEpisodes: currentEpisodes === 'true'
            },
            stressLevels: {
                beforePregnancy: stressLevelBefore,
                currentStressLevel
            },
            supportFromRelatives: {
                supportAvailable: supportAvailable === 'true',
                livingSituation: livingSituationSupport
            }
        });

        // Redirect to the next section (e.g., previous pregnancies)
        res.redirect(`/add-previous-pregnancies/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving mental health support data: ' + error.message);
    }
});

// Route to add previous pregnancies for a patient
router.post('/add-previous-pregnancies/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        numberOfDeliveries,
        pregnancyYear,
        abortion,
        miscarriage,
        childrenBornAlive,
        deliveryType,
        birthDate,
        gender,
        birthWeight
    } = req.body;

    // Basic validation to check if required fields are provided
    if (!numberOfDeliveries || !pregnancyYear || !birthDate || !gender || !birthWeight) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the previous pregnancies data under the specific patient in Firebase
        await db.ref(`patients/${patientId}/previousPregnancies`).set({
            numberOfDeliveries,
            pregnancyYear,
            abortion: abortion === 'true',
            miscarriage: miscarriage === 'true',
            childrenBornAlive: childrenBornAlive === 'true',
            deliveryType,
            childBirthDetails: {
                birthDate,
                gender,
                birthWeight
            }
        });

        // Redirect to the next section (e.g., medications and supplements)
        res.redirect(`/add-medications-supplements/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving previous pregnancies data: ' + error.message);
    }
});

// Route to add medications and supplements for a patient
router.post('/add-medications-supplements/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        medicationName,
        medicationDosage,
        medicationStartDate,
        indication,
        supplementName,
        supplementDosage,
        supplementStartDate
    } = req.body;

    // Basic validation to check if required fields are provided
    if (!medicationName || !medicationDosage || !medicationStartDate || !indication ||
        !supplementName || !supplementDosage || !supplementStartDate) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the medications and supplements data under the specific patient in Firebase
        await db.ref(`patients/${patientId}/medicationsSupplements`).set({
            medications: {
                name: medicationName,
                dosage: medicationDosage,
                startDate: medicationStartDate,
                indication
            },
            supplements: {
                name: supplementName,
                dosage: supplementDosage,
                startDate: supplementStartDate
            }
        });

        // Redirect to the next section (e.g., laboratory results)
        res.redirect(`/add-laboratory-results/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving medications and supplements data: ' + error.message);
    }
});

// Route to add laboratory results for a patient
router.post('/add-laboratory-results/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        hemoglobin,
        bloodType,
        hivStatus,
        syphilisStatus,
        proteinLevel,
        glucoseLevel
    } = req.body;

    // Basic validation to check if required fields are provided
    if (!hemoglobin || !bloodType || !hivStatus || !syphilisStatus || !proteinLevel || !glucoseLevel) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the laboratory results under the specific patient in Firebase
        await db.ref(`patients/${patientId}/laboratoryResults`).set({
            bloodTests: {
                hemoglobin,
                bloodType,
                hivStatus,
                syphilisStatus
            },
            urinalysis: {
                proteinLevel,
                glucoseLevel
            }
        });

        // Redirect to the next section (e.g., care plan)
        res.redirect(`/add-care-plan/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving laboratory results: ' + error.message);
    }
});

// Route to add care plan for a patient
router.post('/add-care-plan/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        appointmentDate,
        appointmentReason,
        movementsFrequency,
        fetalPosition,
        followUpNotes
    } = req.body;

    // Basic validation to check if required fields are provided
    if (!appointmentDate || !appointmentReason || !movementsFrequency || !fetalPosition || !followUpNotes) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the care plan under the specific patient in Firebase
        await db.ref(`patients/${patientId}/carePlan`).set({
            appointmentDetails: {
                appointmentDate,
                appointmentReason
            },
            fetalActivity: {
                movementsFrequency,
                fetalPosition
            },
            followUpNotes
        });

        // Redirect to the next section (e.g., midwife notes)
        res.redirect(`/add-midwife-notes/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving care plan: ' + error.message);
    }
});
// Route to add midwife notes for a patient
router.post('/add-midwife-notes/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        noteDate,
        noteTime,
        noteType,
        generalWellbeing,
        bloodPressureStatus,
        fetalMovements,
        contractionsStatus,
        medicationsGiven,
        activityStatus,
        nextSteps,
        expectedDeliveryType,
        deliveryLikelihood,
        monitoringPlan
    } = req.body;

    // Basic validation to check if required fields are provided
    if (!noteDate || !noteTime || !noteType || !generalWellbeing || !bloodPressureStatus || !fetalMovements ||
        !contractionsStatus || !medicationsGiven || !activityStatus || !nextSteps || !expectedDeliveryType ||
        !deliveryLikelihood || !monitoringPlan) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save the midwife notes under the specific patient in Firebase
        await db.ref(`patients/${patientId}/midwifeNotes`).set({
            noteDate,
            noteTime,
            noteType,
            summary: {
                generalWellbeing,
                bloodPressureStatus,
                fetalMovements,
                contractionsStatus,
                medicationsGiven,
                activityStatus
            },
            plan: {
                nextSteps,
                expectedDeliveryType,
                deliveryLikelihood,
                monitoringPlan
            }
        });

        // Redirect to the next section (e.g., labor and delivery)
        res.redirect(`/add-labor-delivery/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving midwife notes: ' + error.message);
    }
});

// Route to add labor and delivery details for a patient
router.post('/add-labor-delivery/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        deliveryDate,
        deliveryType,
        babySex,
        gestationalAge,
        birthWeight,
        birthLength,
        headCircumference,
        apgar1min,
        apgar5min,
        apgar10min,
        babyStatus
    } = req.body;

    // Basic validation to check if required fields are provided
    if (!deliveryDate || !deliveryType || !babySex || !gestationalAge || !birthWeight || !birthLength || !headCircumference || !apgar1min || !apgar5min || !apgar10min || !babyStatus) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save labor and delivery details under the specific patient in Firebase
        await db.ref(`patients/${patientId}/laborDelivery`).set({
            deliveryDate,
            deliveryType,
            babySex,
            gestationalAge,
            birthWeight,
            birthLength,
            headCircumference,
            apgarScore: {
                apgar1min,
                apgar5min,
                apgar10min
            },
            postnatalObservation: {
                babyStatus
            }
        });

        // Redirect to the next section (e.g., partograph)
        res.redirect(`/add-partograph/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving labor and delivery details: ' + error.message);
    }
});

// Route to add partograph details for a patient
router.post('/add-partograph/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
    const {
        laborTime,
        cervicalDilation,
        fetalDescent,
        contractionFrequency,
        contractionIntensity,
        heartRateTime,
        heartRateBPM,
        pulseTime,
        pulseBPM
    } = req.body;

    // Validate form inputs
    if (!laborTime || !cervicalDilation || !fetalDescent || !contractionFrequency || !contractionIntensity || !heartRateTime || !heartRateBPM || !pulseTime || !pulseBPM) {
        return res.status(400).send('All required fields must be filled');
    }

    try {
        // Save partograph data under the specific patient in Firebase
        await db.ref(`patients/${patientId}/partograph`).set({
            laborProgression: {
                laborTime,
                cervicalDilation,
                fetalDescent
            },
            contractions: {
                contractionFrequency,
                contractionIntensity
            },
            fetalHeartRate: {
                heartRateTime,
                heartRateBPM
            },
            maternalPulse: {
                pulseTime,
                pulseBPM
            }
        });

        res.redirect(`/partograph-success/${patientId}`);
    } catch (error) {
        res.status(500).send('Error saving partograph details: ' + error.message);
    }
});
// Route to save partograph data and redirect to success page
router.post('/save-partograph/:patientId', (req, res) => {
    const { patientId } = req.params;
    const partographData = req.body; // Capture the form data

    // Save the partograph data to Firebase or your database
    db.ref(`patients/${patientId}/partograph`).set(partographData, (error) => {
        if (error) {
            res.status(500).send('Error saving partograph data.');
        } else {
            // Redirect to success page after data is saved
            res.redirect(`/partograph-success/${patientId}`);
        }
    });
});



module.exports = router;
