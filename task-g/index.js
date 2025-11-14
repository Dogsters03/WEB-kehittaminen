// Author: Mona Määttänen
// Date: 2025-11-03

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const tbody = document.querySelector("#dataTable tbody");
  const timestampInput = document.getElementById("timestamp");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Update hidden timestamp
    timestampInput.value = new Date().toLocaleString();

    clearErrors();
    const isValid = validateForm();

    if (!isValid) return;

    // Collect values
    const row = document.createElement("tr");
    [
      timestampInput.value,
      form.fullName.value.trim(),
      form.email.value.trim(),
      form.phone.value.trim(),
      form.birthdate.value,
      form.terms.checked ? "Yes" : "No"
    ].forEach(text => {
      const td = document.createElement("td");
      td.textContent = text;
      row.appendChild(td);
    });

    tbody.appendChild(row);
    form.reset();
  });

  function validateForm() {
    let valid = true;

    const name = form.fullName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const birth = form.birthdate.value;
    const terms = document.getElementById("terms").checked;

    // Name: at least 2 words, each ≥2 chars
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}\s+[A-Za-zÀ-ÖØ-öø-ÿ]{2,}/.test(name)) {
      showError("nameError", "Please enter your full name (first and last).");
      valid = false;
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("emailError", "Enter a valid email address.");
      valid = false;
    }

    // Phone (Finnish +358 or 0)
    if (!/^(\+358|0)\s?\d{5,10}$/.test(phone)) {
      showError("phoneError", "Enter a valid Finnish phone number (+358 or 0...).");
      valid = false;
    }

    // Birth date: not in the future, min age 13
    if (birth) {
      const birthDate = new Date(birth);
      const now = new Date();
      const age = (now - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
      if (birthDate > now) {
        showError("birthError", "Birth date cannot be in the future.");
        valid = false;
      } else if (age < 13) {
        showError("birthError", "You must be at least 13 years old.");
        valid = false;
      }
    } else {
      showError("birthError", "Please select your birth date.");
      valid = false;
    }

    // Terms
    if (!terms) {
      showError("termsError", "You must accept the terms to continue.");
      valid = false;
    }

    return valid;
  }

  function showError(id, message) {
    document.getElementById(id).textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
  }
});
