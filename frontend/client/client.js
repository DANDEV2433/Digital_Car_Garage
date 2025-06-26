// charge le contenu de la page une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => {
    fetchVehicles();
});
// --- Fonction pour récupérer les véhicules de l'utilisateur ---
function fetchVehicles() {
    fetch('http://localhost:3000/api/v1/vehicles/mine', {
        method: 'GET',
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            displayVehicles(data);
        })
        .catch(err => console.error("Erreur lors du chargement des véhicules :", err));
}
// --- Fonction pour afficher les véhicules ---
// Cette fonction prend un tableau de véhicules et les affiche sous forme de cartes
function displayVehicles(vehicles) {
    const container = document.getElementById('vehicleCards');
    container.innerHTML = ''; // vide le conteneur avant d’ajouter

    vehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.classList.add('vehicle-card');

        let imgHtml = '';
        if (vehicle.photo) {
            imgHtml = `<img src="data:image/jpeg;base64,${vehicle.photo}" alt="Photo véhicule">`;
        }

        card.innerHTML = `
            ${imgHtml}
            <h3>${vehicle.brand} ${vehicle.model}</h3>
            <p><strong>Plaque: </strong> ${vehicle.plate_number}</p>
            <p><strong>Année: </strong> ${vehicle.year}</p>
            <p><strong>Kilométrage: </strong> ${vehicle.mileage} km</p>
            <button onclick="showRepairDetails('${vehicle.id}')">Détails véhicule</button>
        `;
        container.appendChild(card);
    });
}

// --- Filtrage véhicules ---
document.getElementById("searchVehicle").addEventListener("input", (e) => {
  // récupère la valeur du champ de recherche et la convertit en minuscules
  const filter = e.target.value.toLowerCase();
  // regarde si le texte de chaque carte véhicule contient le filtre
  // et affiche ou masque la carte en conséquence
  document.querySelectorAll(".vehicle-card").forEach((card) => {
    card.style.display = card.innerText.toLowerCase().includes(filter) ? "block" : "none";
  });
});

function maintenanceAlert() {
    alert("Cette fonctionnalité est en cours de développement.");
}

// --- Déconnexion ---
document.getElementById("logoutButton").addEventListener("click", () => {
    // Appelle une route pour détruire le cookie
    fetch('http://localhost:3000/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include'
    }).then(() => {
        window.location.href = "/login/login.html";
    });
});

// --- Affichage des détails de la réparation ---
// Cette fonction est appelée lorsqu'on clique sur le bouton "Détails véhicule"
// Elle récupère les réparations associées à un véhicule et les affiche dans un tableau
function showRepairDetails(vehicleId) {
    fetch(`http://localhost:3000/api/v1/repairs/${vehicleId}`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(repairs => {
            displayRepairs(repairs);
        })
        .catch(err => console.error("Erreur lors du chargement des réparations :", err));
}

// --- Fonction pour afficher les réparations d'un véhicule ---
function displayRepairs(repairs) {
    const effectueBody = document.getElementById('entretienEffectue');
    const prevoirBody = document.getElementById('entretienPrevoir');

    // Vider les tableaux avant affichage
    effectueBody.innerHTML = '';
    prevoirBody.innerHTML = '';
    // Trier les réparations par date
    const today = new Date().toISOString().split('T')[0];
    // Convertir la date d'aujourd'hui en format ISO pour comparaison
    // Filtrer les réparations passées et futures
    repairs.forEach(repair => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(repair.repair_date).toLocaleDateString()}</td>
            <td>${repair.description}</td>
            <td>${repair.mileage} km</td>
            <td>${repair.cost} €</td>
            <td>-</td>
        `;

        if (repair.repair_date > today) {
            prevoirBody.appendChild(tr);
        } else {
            effectueBody.appendChild(tr);
        }
    });
}

