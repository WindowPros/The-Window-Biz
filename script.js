const form = document.getElementById('quote-form');
const message = document.getElementById('form-message');

// Secret key (must match Apps Script)
const SECRET_KEY = "API_Key";

// Web App URL from Apps Script deployment
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzAXMGlZ0QdaTYv8CCN6eASPnGSX3kOwN3CiB295JbmcICWCL9voGVVK0JIVp1MtxpejA/exec";

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Honeypot check
  if (form['bot-field'].value !== "") {
    console.log("Bot detected. Ignoring submission.");
    return;
  }

  const formData = {
    key: SECRET_KEY,
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    address: form.address.value.trim()
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    message.textContent = 'Thanks! Your request has been received.';
    message.style.color = 'green';
    form.reset();
  } catch (error) {
    console.error(error);
    message.textContent = 'Something went wrong. Please try again.';
    message.style.color = 'red';
  }
});
