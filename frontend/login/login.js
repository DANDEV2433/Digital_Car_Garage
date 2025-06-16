document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Récupération des valeurs saisies
  const email = document.getElementById('email').value.trim();
  if (!email) {
    alert("Veuillez entrer votre email.");
    return;
  }

  const password = document.getElementById('password').value.trim();
  if (!password) {
    alert("Veuillez entrer votre mot de passe.");
    return;
  }

  // Vérifie si le mot de passe est fort
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
if (!strongPasswordPattern.test(password)) {
  alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
  return;
}

  const messageBox = document.getElementById("loginMessage");

  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // cookies sécurisés (HttpOnly)
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Redirection en fonction du rôle
      if (data.role_id === '7cbe8a66-4566-11f0-99ef-00155dba5cee') {
        window.location.href = '../client/client.html';
      } else if (data.role_id === '7cbe99be-4566-11f0-99ef-00155dba5cee') {
        window.location.href = '../garage/garage.html';
      } else {
        messageBox.textContent = "Rôle utilisateur inconnu.";
      }

    } else {
      messageBox.textContent = data.message || "Email ou mot de passe incorrect.";
    }
  } catch (error) {
    console.error("Erreur de connexion :", error);
    messageBox.textContent = "Erreur serveur. Réessayez plus tard.";
  }
});
