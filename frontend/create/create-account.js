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
    const first_name = form.prenom.value;
    const last_name = form.nom.value;
    const email = form.email.value;
    const confirmEmail = form.confirmEmail.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // vérification du format de l'email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showMessage("Format d'email invalide", false);
      return;
    }

    if (email !== confirmEmail) {
      showMessage("Les emails ne correspondent pas.", false);
      return;
    }

    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordPattern.test(password)) {
      alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Les mots de passe ne correspondent pas.", false);
      return;
    }

    const namePattern = /^[A-Za-zÀ-ÿ\-\' ]+$/;
    if (!namePattern.test(first_name) || !namePattern.test(last_name)) {
      showMessage("Le prénom et le nom ne doivent contenir que des lettres.", false);
      return;
    }

    const data = {
      role: form.role.value,
      nom: form.nom.value,
      prenom: form.prenom.value,
      email,
      password,
    };
    // Si le rôle est "garage", ajoute la raison sociale dans les données
    if (data.role === "garage") {
      data.raisonSociale = form.raisonSociale.value || null;
    }


    // requête POST pour créer le compte
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        showMessage("Compte créé avec succès !", true);
        // Réinitialise le formulaire et cache les champs garage
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
    // Affiche un message dans la boîte de message
    messageBox.textContent = msg;
    messageBox.className = success ? "success" : "error-message";
  }
});
