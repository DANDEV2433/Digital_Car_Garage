// --- Soumission du formulaire ---
const form = document.getElementById("addvehicleForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch("/api/v1/vehicles", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Véhicule ajouté avec succès !");
      form.reset();
      // Recharger la liste des véhicules
      document.getElementById("vehicleCards").innerHTML = "";
      chargerVehicules();
    } else {
      alert(data.message || "Erreur lors de l'ajout du véhicule");
    }
  } catch (error) {
    console.error("Erreur fetch :", error);
    alert("Erreur réseau ou serveur");
  }
});

// --- Affichage d’une carte véhicule ---
function afficherVehicule(v) {
  const card = document.createElement("div");
  card.classList.add("vehicle-card");

  // Convertir la photo en base64 si elle existe
  let imgHtml = '';
  if (v.photo) {
    imgHtml = `<img src="data:image/jpeg;base64,${v.photo}" alt="Photo véhicule">`;
  }

  card.innerHTML = `
    ${imgHtml}
    <h3>${v.client_prenom} ${v.client_nom}</h3>
    <p>📄 ${v.plate_number}</p>
    <p>🚗 ${v.brand} ${v.model} (${v.year})</p>
    <p>🛣️ ${v.mileage} km</p>
    <button onclick="location.href='vehicule.html?id=${v.id}'">Détails véhicule</button>
  `;

  document.getElementById("vehicleCards").appendChild(card);
}

// --- Chargement initial des véhicules ---
function chargerVehicules() {
  fetch("http://localhost:3000/api/v1/vehicles", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach(afficherVehicule);
    })
    .catch((err) => {
      console.error("Erreur chargement véhicules :", err);
    });
}

// --- Filtrage véhicules ---
document.getElementById("searchVehicle").addEventListener("input", (e) => {
  const filter = e.target.value.toLowerCase();
  document.querySelectorAll(".vehicle-card").forEach((card) => {
    card.style.display = card.innerText.toLowerCase().includes(filter) ? "block" : "none";
  });
});

// --- Déconnexion ---
document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login/login.html";
});

// --- Lancer le chargement au démarrage de la page ---
window.addEventListener("DOMContentLoaded", () => {
  chargerVehicules();
});
