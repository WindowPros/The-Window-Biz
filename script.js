// === script.js ===

// Get form and message elements
const form = document.getElementById('quote-form');
const message = document.getElementById('form-message');

// Your secret key (must match Apps Script)
const SECRET_KEY = "API_Key";

// Your Google Apps Script Web App URL (make sure it's the latest deployment URL)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzAXMGlZ0QdaTYv8CCN6eASPnGSX3kOwN3CiB295JbmcICWCL9voGVVK0JIVp1MtxpejA/exec";

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 🛡️ Honeypot check for bots
  if (form['bot-field'].value !== "") {
    console.log("Bot detected — ignoring submission.");
    return;
  }

  // Collect form data
  const formData = {
    key: SECRET_KEY,
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    address: form.address.value.trim()
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    // Check response status
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const result = await response.json();

    // Handle unauthorized key
    if (result.result === 'unauthorized') {
      message.textContent = 'Unauthorized submission — please check your key.';
      message.style.color = 'red';
      return;
    }

    if (result.result === 'success') {
      message.textContent = 'Thanks! Your request has been received.';
      message.style.color = 'green';
      form.reset();
    } else {
      throw new Error('Unexpected response from server');
    }

  } catch (error) {
    console.error('Form submission error:', error);
    message.textContent = 'Something went wrong. Please try again.';
    message.style.color = 'red';
  }
});
