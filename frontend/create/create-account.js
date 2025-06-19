document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const roleSelect = document.getElementById("role");
  const garageFields = document.getElementById("garageFields");
  const messageBox = document.getElementById("message");

  // Affiche ou cache "Raison sociale" selon le rôle
  roleSelect.addEventListener("change", () => {
    if (roleSelect.value === "garage") {
      garageFields.style.display = "block";
      garageFields.querySelector("#raisonSociale").setAttribute("required", true);
    } else {
      garageFields.style.display = "none";
      garageFields.querySelector("#raisonSociale").removeAttribute("required");
    }
  });

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const confirmEmail = form.confirmEmail.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (email !== confirmEmail) {
      showMessage("Les emails ne correspondent pas.", false);
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Les mots de passe ne correspondent pas.", false);
      return;
    }

    const data = {
      role: form.role.value,
      nom: form.nom.value,
      prenom: form.prenom.value,
      email,
      password,
    };

    if (data.role === "garage") {
      data.raisonSociale = form.raisonSociale.value || null;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        showMessage("Compte créé avec succès !", true);
        form.reset();
        garageFields.style.display = "none";
      } else {
        showMessage(result.message || "Une erreur est survenue.", false);
      }
    } catch (error) {
      showMessage("Erreur serveur. Veuillez réessayer plus tard.", false);
    }
  });

  function showMessage(msg, success = true) {
    messageBox.textContent = msg;
    messageBox.className = success ? "success" : "error-message";
  }
});
