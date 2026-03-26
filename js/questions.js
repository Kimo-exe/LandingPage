document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ questions.js loaded");

  // Load data from previous page
  const formData = JSON.parse(localStorage.getItem("formData")) || null;

  if (!formData) {
    alert("Er ging iets mis. Gelieve het formulier opnieuw in te vullen.");
    window.location.href = "formPage.html";
    return;
  }

  const submitBtn = document.getElementById("submitAnswers");

  submitBtn.addEventListener("click", async () => {
    console.log("Submitting answers…");

    // Collect radio answers q1–q6
    const answers = {
      question1: document.querySelector('input[name="q1"]:checked')?.value || "",
      question2: document.querySelector('input[name="q2"]:checked')?.value || "",
      question3: document.querySelector('input[name="q3"]:checked')?.value || "",
      question4: document.querySelector('input[name="q4"]:checked')?.value || "",
      question5: document.querySelector('input[name="q5"]:checked')?.value || "",
      question6: document.querySelector('input[name="q6"]:checked')?.value || "",
      question7: document.getElementById("question7").value.trim()
    };

    // Validate all first 6 questions (textarea allowed empty if you want)
    for (let i = 1; i <= 6; i++) {
      if (!answers[`question${i}`]) {
        alert(`Gelieve vraag ${i} te beantwoorden.`);
        return;
      }
    }

    // Merge both objects
    const finalData = {
      ...formData,
      ...answers
    };

    console.log("✅ Final data ready to send:", finalData);

    try {
      const response = await fetch("https://ericka-blowsier-keagan.ngrok-free.dev/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData)
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Saved to MongoDB:", result.id);

        // Clear localStorage
        localStorage.removeItem("formData");

        // Go to confirm page
        window.location.href = "/html/confirm.html";

      } else {
        alert("Fout bij opslaan: " + result.error);
      }

    } catch (err) {
      console.error(err);
      alert("Er ging iets fout bij het versturen.");
    }
  });
});