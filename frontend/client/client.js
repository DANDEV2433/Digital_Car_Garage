document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('accessToken'); // récupère le token
    fetchVehicles(accessToken);
});

function fetchVehicles(token) {
    fetch('http://localhost:3000/api/v1/vehicles/mine', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
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
        card.classList.add('vehicle-card'); // classe à styliser en CSS

        let imgHtml = '';
        if (vehicle.photo) {
            imgHtml = `<img src="data:image/jpeg;base64,${vehicle.photo}" alt="Photo véhicule">`;
        }

        card.innerHTML = `
            ${imgHtml}
            <h3>${vehicle.brand} ${vehicle.model}</h3>
            <p><strong>Plaque:</strong> ${vehicle.plate_number}</p>
            <p><strong>Année:</strong> ${vehicle.year}</p>
            <p><strong>Kilométrage:</strong> ${vehicle.mileage} km</p>
            <button onclick="location.href='vehicule.html?id=${vehicle.id}'">Détails véhicule</button>
        `;
        container.appendChild(card);
    });
}

// --- Déconnexion ---
document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login/login.html";
});
