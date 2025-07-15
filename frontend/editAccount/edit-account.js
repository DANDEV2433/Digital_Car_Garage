document.addEventListener("DOMContentLoaded", async () => {
  // UUIDs extraits de ta table Role
  const roleMap = {
    client: "7cbe8a66-4566-11f0-99ef-00155dba5cee",
    garage: "7cbe99be-4566-11f0-99ef-00155dba5cee"
  };

  const form = document.getElementById("editForm");
  const garageFields = document.getElementById("garageFields");
  const messageBox = document.getElementById("message");
  const roleSelect = document.getElementById("role");

  // --- Déconnexion ---
  document.getElementById("logoutButton").addEventListener("click", () => {
    fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include"
    })
      .then(() => {
        window.location.href = "/login/login.html";
      })
      .catch((err) => {
        console.error("Erreur lors de la déconnexion :", err);
      });
  });
  // --- Gestion de l'affichage du champ raison sociale pour le garage ou non ---
  roleSelect.addEventListener("change", () => {
    if (roleSelect.value === "garage") {
      garageFields.style.display = "block";
      garageFields.querySelector("#raisonSociale").setAttribute("required", true);
    } else {
      garageFields.style.display = "none";
      garageFields.querySelector("#raisonSociale").removeAttribute("required");
    }
  });
  // --- Récupération des données utilisateur ---
  try {
    const response = await fetch("http://localhost:3000/api/v1/users/me", {
    credentials: "include"
    });

    if (!response.ok) throw new Error("Utilisateur non connecté");
    // pré-remplit le formulaire avec les données
    const user = await response.json();
    form.role.value = user.role;
    form.nom.value = user.last_name || "";
    form.prenom.value = user.first_name || "";
    form.email.value = user.email || "";
    // Affiche les champs spécifiques au garage si l'utilisateur est un garage
    if (user.role === "garage") {
      garageFields.style.display = "block";
      form.raisonSociale.value = user.raison_sociale || "";
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      // récupère le prénom et le nom saisis par l’utilisateur
      const first_name = form.prenom.value;
      const last_name = form.nom.value;
      // récupère l'email saisi par l’utilisateur
      const email = form.email.value;
      // récupère le nouveau mot de passe saisi par l’utilisateur
      const password = form.password.value;
      // récupère la confirmation du mot de passe saisi par l’utilisateur
      const confirmPassword = form.confirmPassword.value;
      // crée un objet data avec les champs saisis
      const selectedRole = form.role.value;
      const data = {
        last_name_name: form.nom.value,
        first_name: form.prenom.value,
        email: form.email.value,
        role_id: roleMap[selectedRole],
        raisonSociale: selectedRole === "garage" ? form.raisonSociale.value : undefined,
      };
      // vérification du format du nom et prénom
      const namePattern = /^[A-Za-zÀ-ÿ\-\' ]+$/;
      if (!namePattern.test(first_name) || !namePattern.test(last_name)) {
        showMessage("Le prénom et le nom ne doivent contenir que des lettres.", false);
        return;
      }

      // vérification du format de l'email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showMessage("Format d'email invalide", false);
        return;
      }

      // Vérifie si un nouveau mot de passe a été saisi
      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          showMessage("Les mots de passe ne correspondent pas.", false);
          return;
        }
        // Vérifie si le mot de passe est fort
        const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        // Si le mot de passe ne respecte pas les critères, affiche un message d'erreur
        if (!strongPasswordPattern.test(password)) {
          showMessage("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.", false);
          return;
        }

        // Si un mot de passe est fourni, demande l'ancien mot de passe
        const ancien = prompt("Pour changer votre mot de passe, entrez l'ancien mot de passe :");
        if (!ancien) {
          showMessage("Erreur, changement de mot de passe annulé.", false);
          return;
        }
        // Ajoute le mot de passe actuel et le nouveau mot de passe à l'objet data
        data.currentPassword = ancien;
        data.newPassword = password;
      }

      const updateResponse = await fetch("http://localhost:3000/api/v1/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await updateResponse.json();

      if (updateResponse.ok) {
        showMessage("Compte modifié avec succès.", true);
        setTimeout(() => window.location.href = "../login/login.html", 3000);
      } else {
        showMessage(result.message || "Erreur lors de la modification.", false);
      }
    });

  } catch (error) {
    showMessage("Erreur : utilisateur non connecté ou serveur inaccessible.", false);
  }

  function showMessage(msg, success = true) {
    // Affiche un message dans la boîte de message
    messageBox.textContent = msg;
    messageBox.className = success ? "success" : "error-message";
  }
});
