const submitButtons = document.querySelectorAll(".submit-btn");

// Iterate over each submit button
submitButtons.forEach(btn => {
  // Add click event listener to each button
  btn.addEventListener("click", () => {
    // Find the closest form element to the clicked button
    const form = btn.closest("form");

    // Check if the form is valid
    if (form && form.checkValidity()) {
      btn.classList.add("button-loading");
      // Simulate a click event on the form's submit button
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.click();
      }
    } else if (form) {
      // If the form is not valid, focus on the first invalid field
      form.reportValidity();
    }
  });
});
