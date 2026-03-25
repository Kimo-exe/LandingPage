document.addEventListener("DOMContentLoaded", () => {

  const functionRole = document.getElementById("functionRole");
  const selectFan = document.getElementById("selectFan");
  const selectArtist = document.getElementById("selectArtist");
  const continueBtn = document.getElementById("continueBtn");
  const modalEl = document.getElementById("functionModal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  // ✅ Missing code — you MUST set the hidden input on click
  selectFan.addEventListener("click", () => {
    functionRole.value = "Fan";
    console.log("Selected Fan");
  });

  selectArtist.addEventListener("click", () => {
    functionRole.value = "Artiest";
    console.log("Selected Artiest");
  });

  continueBtn.addEventListener("click", () => {
    console.log("Continue clicked");

    // Validate function selected
    if (!functionRole.value) {
      alert("Selecteer eerst een functie.");
      return;
    }

    // Collect all form inputs
    const data = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      birthYear: document.getElementById("birthYear").value,
      gender: document.getElementById("gender").value,
      occupation: document.getElementById("occupation").value,
      location: document.getElementById("location").value.trim(),
      function: functionRole.value
    };

    // Basic validation
    for (const key in data) {
      if (!data[key]) {
        alert("Gelieve alle velden in te vullen.");
        return;
      }
    }

    // Save to localStorage
    localStorage.setItem("formData", JSON.stringify(data));
    console.log("✅ Saved to localStorage:", data);

    // Hide modal + navigate
    modal.hide();
    window.location.href = "/html/questions.html";
  });
});