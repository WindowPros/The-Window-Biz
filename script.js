// Get form and message elements
const form = document.getElementById('quote-form');
const message = document.getElementById('form-message');

// Listen for hidden iframe load to know when submission is complete
const iframe = document.getElementsByName('hidden_iframe')[0];
iframe.onload = function() {
  // Only show message if form has been submitted
  if (form.dataset.submitted === "true") {
    message.textContent = "Thanks! Your request has been received.";
    message.style.color = "green";
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
  message.style.color = "blue";
});
