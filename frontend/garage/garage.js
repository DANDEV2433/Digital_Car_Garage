const form = document.getElementById("addvehicleForm"); // suppose que ton form a l'id "vehicleForm"

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch("localhost:3000/api/v1/vehicles", {
      method: "POST",
      headers: {
        // Pas de Content-Type ici, car fetch gère automatiquement multipart/form-data avec FormData
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // si tu utilises token stocké en localStorage
      },
      body: formData
    });


    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Véhicule ajouté avec succès !");
      form.reset();
    } else {
      alert(data.message || "Erreur lors de l'ajout du véhicule");
    }
  } catch (error) {
    console.error("Erreur fetch :", error);
    alert("Erreur réseau ou serveur");
  }
});
