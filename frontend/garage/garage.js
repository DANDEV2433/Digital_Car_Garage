// --- Soumission du formulaire d'ajout de véhicule ---
const form = document.getElementById("addvehicleForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form); // récupère tous les champs du formulaire

  try {
    const response = await fetch("http://localhost:3000/api/v1/vehicles", {
      method: "POST",
      credentials: "include",
      body: formData
    });
    // convertit la réponse en JSON
    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Véhicule ajouté avec succès !");
      // Réinitialiser le formulaire
      form.reset();
      // raffraichir la liste des véhicules
      document.getElementById("vehicleCards").innerHTML = "";
      chargerVehicules();// recharge la liste actualisée des véhicules
    } else {
      alert(data.message || "Erreur lors de l'ajout du véhicule");
    }
  } catch (error) {
    console.error("Erreur fetch :", error);
    alert("Erreur serveur");
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
    <p><strong>Plaque: </strong>${v.plate_number}</p>
    <p><strong>Année: </strong>${v.brand} ${v.model} (${v.year})</p>
    <p><strong>Kilométrage: </strong>${v.mileage} km</p>
    <button onclick="showRepairDetails('${v.id}')">Détails véhicule</button>
  `;
  // Ajoute la carte au conteneur des véhicules
  document.getElementById("vehicleCards").appendChild(card);
}

// --- Chargement initial des véhicules ---
function chargerVehicules() {
  fetch("http://localhost:3000/api/v1/vehicles", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    // Pour chaque véhicule dans la réponse (data), on appelle afficherVehicule pour l’afficher
    .then((data) => {
      data.forEach(afficherVehicule);
    })
    .catch((err) => {
      console.error("Erreur chargement véhicules :", err);
    });
}

// --- Filtrage véhicules ---
// Ajoute un écouteur d’événement sur le champ de recherche
// pour filtrer les cartes de véhicules en fonction du texte saisi
document.getElementById("searchVehicle").addEventListener("input", (e) => {
  // récupère la valeur du champ de recherche et la convertit en minuscules
  const filter = e.target.value.toLowerCase();
  // regarde si le texte de chaque carte véhicule contient le filtre
  // et affiche ou masque la carte en conséquence
  document.querySelectorAll(".vehicle-card").forEach((card) => {
    card.style.display = card.innerText.toLowerCase().includes(filter) ? "block" : "none";
  });
});

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

// --- Fonction pour ajouter une réparation ---
function createRepair(vehicleId) {
  // Lecture des valeurs du formulaire (input HTML)
  const repair_date = document.getElementById("repairDate").value;
  const description = document.getElementById("repairDescription").value;
  const mileage = document.getElementById("repairMileage").value;
  const cost = document.getElementById("repairCost").value;

  // Envoi de la requête POST vers ton API (auth basée sur cookie)
  fetch(`http://localhost:3000/api/v1/repairs/${vehicleId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      repair_date,
      description,
      mileage,
      cost
    })
  })
    .then(res => res.json()) // transforme la réponse en JSON
    .then(data => {
      alert("Réparation ajoutée !"); // informe l’utilisateur
      showRepairDetails(vehicleId);   // recharge la liste avec la nouvelle
    })
    .catch(err => console.error("Erreur ajout réparation :", err));
}

// --- Gestionnaire de soumission du formulaire d’ajout ---
document.getElementById("addRepairForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Empêche l’envoi classique du formulaire
  const vehicleId = window.currentVehicleId; // L’ID du véhicule sélectionné
  createRepair(vehicleId); // On appelle la fonction pour l’ajouter
});

// --- Fonction pour modifier une réparation ---
function updateRepair(repairId) {
  // 1. Sélectionne la ligne (<tr>) correspondant à la réparation
  const row = [...document.querySelectorAll("#effectueBody tr")]
    .find(tr => tr.querySelector("button")?.onclick?.toString().includes(repairId));
  if (!row) return; // si introuvable, on sort

  // 2. Récupère les cellules (<td>) de la ligne
  const cells = row.querySelectorAll("td");

  // 3. Lis et stocke les valeurs des inputs (date/desc/km/coût)
  const repair_date = cells[0].querySelector("input").value;
  const description = cells[1].querySelector("input").value;
  const mileage = cells[2].querySelector("input").value;
  const cost = cells[3].querySelector("input").value;

  // 4. Envoi de la requête PUT pour mettre à jour la réparation
  fetch(`http://localhost:3000/api/v1/repairs/update/${repairId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      repair_date,
      description,
      mileage,
      cost
    })
  })
    .then(res => res.json()) // on récupère la réponse
    .then(data => {
      alert("Réparation mise à jour !");
      const vehicleId = window.currentVehicleId; // ID du véhicule courant
      showRepairDetails(vehicleId); // recharge la liste
    })
    .catch(err => console.error("Erreur de modification de la réparation :", err));
}

// --- Fonction pour afficher les détails d'un véhicule ---
function showRepairDetails(vehicleId) {
  // Stocker l'ID du véhicule courant dans une variable globale
  window.currentVehicleId = vehicleId;

  // Afficher la section des réparations
  document.getElementById("repairSection").style.display = "block";

  // Appel API pour récupérer les réparations liées à ce véhicule
  fetch(`http://localhost:3000/api/v1/repairs/${vehicleId}`, {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(repairs => {
      // Vider les tableaux d’entretien
      document.getElementById("effectueBody").innerHTML = "";
      document.getElementById("aprevoirBody").innerHTML = "";

      // Parcourir les réparations et les afficher
      repairs.forEach(repair => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><input type="date" value="${repair.repair_date.split('T')[0]}" /></td>
          <td><input type="text" value="${repair.description}" /></td>
          <td><input type="number" value="${repair.mileage}" /></td>
          <td><input type="number" step="0.01" value="${repair.cost}" /></td>
          <td>
          <button onclick="updateRepair('${repair.id}')">Modifier</button>
          <button onclick="deleteRepair('${repair.id}')">Supprimer</button>
          </td>
        `;
        // on affiche dans "effectué"
        document.getElementById("effectueBody").appendChild(tr);
        // Si la date de réparation est dans le futur, on l'affiche dans "à prévoir"
        if (repair.repair_date > new Date().toISOString().split('T')[0]) {
          document.getElementById("aprevoirBody").appendChild(tr);
        }
      });
    })
    .catch(err => console.error("Erreur récupération réparations :", err));
}

// --- Lancer le chargement au démarrage de la page ---
window.addEventListener("DOMContentLoaded", () => {
  chargerVehicules();
});

// --- Fonction pour supprimer une réparation ---
function deleteRepair(repairId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette réparation ?")) return;

  fetch(`http://localhost:3000/api/v1/repairs/delete/${repairId}`, {
    method: "DELETE",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      alert("Réparation supprimée !");
      const vehicleId = window.currentVehicleId; // ID du véhicule courant
      showRepairDetails(vehicleId); // recharge la liste
    })
    .catch(err => console.error("Erreur suppression réparation :", err));
}
