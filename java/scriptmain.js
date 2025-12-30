// Get form and message elements
const form = document.getElementById('quote-form');
const message = document.getElementById('form-message');

// Listen for hidden iframe load to know when submission is complete
const iframe = document.getElementsByName('hidden_iframe')[0];
iframe.onload = function() {
  // Only show message if form has been submitted
  if (form.dataset.submitted === "true") {
    message.textContent = "Thanks! Your request has been received. We'll contact you within 24 hours.";
    message.style.color = "#00b4d8";
    form.reset();
    form.dataset.submitted = "false";
  }
};

// Handle form submission
form.addEventListener('submit', function(e) {
  // Honeypot check
  if (form['bot-field'].value !== "") {
    console.log("Bot detected — ignoring submission.");
    e.preventDefault();
    return;
  }

  // Mark form as submitted for iframe onload handler
  form.dataset.submitted = "true";

  // Optional: show temporary "Submitting..." message
  message.textContent = "Submitting...";
  message.style.color = "#0077b6";
});

// Mobile menu toggle functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    
    // Change hamburger icon to X when open
    if (navLinks.classList.contains('active')) {
      mobileMenuToggle.textContent = '✕';
    } else {
      mobileMenuToggle.textContent = '☰';
    }
  });

  // Close menu when clicking on a link
  const navLinkItems = document.querySelectorAll('.nav-links a');
  navLinkItems.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.classList.remove('active');
      mobileMenuToggle.textContent = '☰';
    });
  });
}