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
});
