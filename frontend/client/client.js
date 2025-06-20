document.addEventListener('DOMContentLoaded', () => {
    fetchVehicles();
});

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
            <button onclick="location.href='vehicule.html?id=${vehicle.id}'">Détails véhicule</button>
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
