// Wait until the DOM content is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {

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
    
    // Function to show the selected form and keep the service navigation visible
    function showForm(formId) {
        hideAllForms();  // First hide all forms
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'block';  // Show the selected form
        }
    }

    // Notification alert for notification icon
    document.getElementById('notificationIcon').addEventListener('click', function() {
        alert("You have new notifications!");
    });

    // Dynamic content loader for services
    function showService(serviceId) {
        document.getElementById('serviceContent').innerHTML = `<p>Loading content for ${serviceId}...</p>`;
        
        // Simulate loading content dynamically (you can replace this with actual form content)
        setTimeout(function() {
            document.getElementById('serviceContent').innerHTML = `
                <h3>${serviceId}</h3>
                <p>This is where the form for ${serviceId} will appear.</p>`;
        }, 1000);
    }

    // Add click events to each service link
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent default anchor behavior
            
            // Get the ID of the form to show from the link's data-form attribute
            const formId = this.getAttribute('data-form');
            showForm(formId);  // Show the corresponding form
        });
    });
    
    // By default, show the first form or message when the page loads
    if (serviceForms.length > 0) {
        hideAllForms();
        const defaultForm = document.getElementById('defaultService');
        if (defaultForm) {
            defaultForm.style.display = 'block';  // Show the default form or message
        }
    }

    // Navigation functions for navigating between services and saving data
    // Function to navigate to a specific service (previous or next)
    function navigate(service) {
        console.log('Navigating to: ' + service);
        
        // Define all services and their respective section IDs
        const services = {
            'patientRegistration': 'patientRegistration',
            'medicalHistoryRiskFactors': 'medicalHistoryRiskFactors',
            'deliverySummary': 'deliverySummary',
            'partograph': 'partograph',
            'laborProgress': 'laborProgress',
            'labResults': 'labResults',
            'ultrasoundSummary': 'ultrasoundSummary',
            'dischargeDetails': 'dischargeDetails',
            'followUpNotes': 'followUpNotes',
            'prenatalCheckup': 'prenatalCheckup',
            'postpartumHealthCheck': 'postpartumHealthCheck'
        };

        // Navigate to the requested service if it's defined
        if (services[service]) {
            showForm(services[service]);  // Show the corresponding form section
        } else {
            console.log('Unknown service: ' + service);
        }
    }

    // Function to save data and continue to the next service
    function saveAndContinue(nextService) {
        // Placeholder for save functionality (e.g., API call, local storage, etc.)
        console.log('Saving data for the current service...');

        // Simulate data save with a success message
        console.log('Data saved successfully!');

        // After saving, navigate to the next service
        navigate(nextService);
    }

    // Function to go back to the previous service
    function goBack(previousService) {
        console.log('Going back to: ' + previousService);

        // Navigate to the previous service
        navigate(previousService);
    }

    // Attach the navigation functionality to the buttons (example)
    document.getElementById('backButton').addEventListener('click', function() {
        goBack('patientRegistration');  // Navigate back to patient registration
    });

    document.getElementById('saveContinueButton').addEventListener('click', function() {
        saveAndContinue('medicalHistoryRiskFactors');  // Save data and continue to medical history
    });

    // Function to make the top navigation sticky
    window.onscroll = function() {
        stickyNav();
    };

    var navbar = document.querySelector(".services-nav");  // Select the top navigation bar
    var sticky = navbar.offsetTop;  // Get the initial position of the navigation

    // Function to add or remove the sticky class based on scroll position
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
        
        // Ensure form validation checks
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;  // Stop if the form is not valid
        }
        
        // Further logic to save data or process the form
        alert('Form submitted successfully!');
    }
});
