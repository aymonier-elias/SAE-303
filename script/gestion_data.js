// Fonction asynchrone pour charger le JSON
async function loadData() {
  try {
    const response = await fetch("/data.json");

    data = await response.json();

    return data;

  } catch (error) {
    console.error("Erreur lors du chargement du JSON :", error);
  }
}