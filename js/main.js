// Wait until the DOM content is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {

    // Select all the service links and add event listeners to each
    const serviceLinks = document.querySelectorAll('.nav-link');
    
    // Select all the service forms (sections)
    const serviceForms = document.querySelectorAll('.service-section');
    
    // Function to hide all forms and remove the 'active' class from all service links
    function hideAllForms() {
        serviceForms.forEach(form => {
            form.style.display = 'none';  // Hide all forms
        });
    }

    // Add event listener for patient registration form submission with validation
    document.getElementById('patientRegistrationForm').addEventListener('submit', function(e) {
        const form = this;
        if (!form.checkValidity()) {
            e.preventDefault();  // Prevent form submission if invalid
            form.classList.add('was-validated');
        }
    });

    // Add event listener for search functionality within the patient table
    document.getElementById('searchPatient').addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('#registeredPatientsTable tbody tr');
        
        rows.forEach(row => {
            const fullName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const personalNumber = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
    
            if (fullName.includes(searchValue) || personalNumber.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Function to show the selected form and hide others
    function showForm(formId) {
        hideAllForms();  // First hide all forms
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'block';  // Show the selected form
        }
    }

    // Function to save form data and navigate to the next section
    function saveAndContinue(nextService, formId, patientId) {
        const form = document.getElementById(formId);
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;  // Stop if the form is not valid
        }

        // Collect form data and append patientId
        const formData = new FormData(form);
        formData.append('patientId', patientId);  // Ensure patientId is included in the form data

        // Send form data to backend (using fetch)
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Data saved successfully!', data);
                navigate(nextService, patientId);  // Navigate to the next service section
            } else {
                alert('Error saving data: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
        });
    }

    // Function to navigate between services and save data
    function navigate(service, patientId) {
        const services = {
            'patientRegistration': 'patientRegistration',
            'healthcareFacility': 'healthcareFacility', // Added healthcare facility after patient registration
            'medicalHistoryRiskFactors': 'medicalHistoryRiskFactors',
            'currentPregnancyDetails': 'currentPregnancyDetails',
            'socialLivingConditions': 'socialLivingConditions',
            'healthExamination': 'healthExamination',
            'lifestyleHabits': 'lifestyleHabits',
            'mentalHealthSupport': 'mentalHealthSupport',
            'previousPregnancies': 'previousPregnancies',
            'medicationsSupplements': 'medicationsSupplements',
            'laboratoryResults': 'laboratoryResults',
            'carePlan': 'carePlan',
            'midwifeNotes': 'midwifeNotes',
            'laborDelivery': 'laborDelivery',
            'partograph': 'partograph'
        };

        if (services[service]) {
            showForm(services[service]);  // Show the corresponding form section
        } else {
            console.log('Unknown service: ' + service);
        }
    }

    // Go back to the previous service
    function goBack(previousService, patientId) {
        console.log('Going back to: ' + previousService);
        navigate(previousService, patientId);
    }

    // Add event listeners to navigation buttons for all sections

    // Patient Registration to Healthcare Facility
    document.getElementById('savePatientRegistrationButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('healthcareFacility', 'patientRegistrationForm', patientId);  // Navigate to healthcare facility
    });

    // Healthcare Facility to Medical History
    document.getElementById('saveHealthcareFacilityButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('medicalHistoryRiskFactors', 'healthcareFacilityForm', patientId);  // Continue to medical history
    });

    // Medical History to Current Pregnancy Details
    document.getElementById('saveMedicalHistoryButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('currentPregnancyDetails', 'medicalHistoryForm', patientId);
    });

    // Current Pregnancy Details to Social Living Conditions
    document.getElementById('saveCurrentPregnancyButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('socialLivingConditions', 'currentPregnancyForm', patientId);
    });

    // Social Living Conditions to Health Examination
    document.getElementById('saveSocialLivingConditionsButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('healthExamination', 'socialLivingConditionsForm', patientId);
    });

    // Health Examination to Lifestyle Habits
    document.getElementById('saveHealthExaminationButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('lifestyleHabits', 'healthExaminationForm', patientId);
    });

    // Lifestyle Habits to Mental Health Support
    document.getElementById('saveLifestyleHabitsButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('mentalHealthSupport', 'lifestyleHabitsForm', patientId);
    });

    // Mental Health Support to Previous Pregnancies
    document.getElementById('saveMentalHealthSupportButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('previousPregnancies', 'mentalHealthSupportForm', patientId);
    });

    // Previous Pregnancies to Medications and Supplements
    document.getElementById('savePreviousPregnanciesButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('medicationsSupplements', 'previousPregnanciesForm', patientId);
    });

    // Medications and Supplements to Laboratory Results
    document.getElementById('saveMedicationsSupplementsButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('laboratoryResults', 'medicationsSupplementsForm', patientId);
    });

    // Laboratory Results to Care Plan
    document.getElementById('saveLaboratoryResultsButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('carePlan', 'laboratoryResultsForm', patientId);
    });

    // Care Plan to Midwife Notes
    document.getElementById('saveCarePlanButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('midwifeNotes', 'carePlanForm', patientId);
    });

    // Midwife Notes to Labor and Delivery
    document.getElementById('saveMidwifeNotesButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('laborDelivery', 'midwifeNotesForm', patientId);
    });

    // Labor and Delivery to Partograph
    document.getElementById('saveLaborDeliveryButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('partograph', 'laborDeliveryForm', patientId);
    });

    // Final step for Partograph
    document.getElementById('savePartographButton').addEventListener('click', function () {
        const patientId = document.getElementById('patientId').value;
        saveAndContinue('finalReview', 'partographForm', patientId);  // Proceed to final review or completion
    });

    // Make the top navigation sticky when scrolling
    window.onscroll = function () {
        stickyNav();
    };

    var navbar = document.querySelector(".services-nav");  // Select the top navigation bar
    var sticky = navbar.offsetTop;  // Get the initial position of the navigation

    // Add or remove the sticky class based on scroll position
    function stickyNav() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    }

    // Handle checkbox interactions and form validation
    function handleCheckbox(formId, checkboxId) {
        const form = document.getElementById(formId);
        const checkbox = document.getElementById(checkboxId);

        if (checkbox.checked) {
            console.log(`${checkboxId} is checked`);
        } else {
            console.log(`${checkboxId} is unchecked`);
        }

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;  // Stop if the form is not valid
        }

        alert('Form submitted successfully!');
    }
});
