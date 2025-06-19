document.addEventListener("DOMContentLoaded", async () => {
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

  roleSelect.addEventListener("change", () => {
    if (roleSelect.value === "garage") {
      garageFields.style.display = "block";
      garageFields.querySelector("#raisonSociale").setAttribute("required", true);
    } else {
      garageFields.style.display = "none";
      garageFields.querySelector("#raisonSociale").removeAttribute("required");
    }
  });

  try {
    const response = await fetch("http://localhost:3000/api/v1/users/me", {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Utilisateur non connecté");

    const user = await response.json();
    form.role.value = user.role;
    form.nom.value = user.last_name || "";
    form.prenom.value = user.first_name || "";
    form.email.value = user.email || "";

    if (user.role === "garage") {
      garageFields.style.display = "block";
      form.raisonSociale.value = user.raison_sociale || "";
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const password = form.password.value;
      const confirmPassword = form.confirmPassword.value;

      const data = {
        nom: form.nom.value,
        prenom: form.prenom.value,
        email: form.email.value,
        raisonSociale: user.role === "garage" ? form.raisonSociale.value : undefined,
      };

      // Vérifie et ajoute mot de passe
      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          messageBox.textContent = "Les mots de passe ne correspondent pas.";
          messageBox.className = "error";
          return;
        }

        const ancien = prompt("Pour changer votre mot de passe, entrez l'ancien mot de passe :");
        if (!ancien) {
          messageBox.textContent = "Changement de mot de passe annulé.";
          messageBox.className = "error";
          return;
        }

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
        messageBox.textContent = "Compte modifié avec succès.";
        messageBox.className = "success";
        setTimeout(() => window.location.href = "../login/login.html", 2000);
      } else {
        messageBox.textContent = result.message || "Erreur lors de la modification.";
        messageBox.className = "error";
      }
    });

  } catch (error) {
    messageBox.textContent = "Erreur : utilisateur non connecté ou serveur inaccessible.";
    messageBox.className = "error";
  }
});
