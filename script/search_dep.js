const form = document.getElementById("search")

form.addEventListener('submit', function (event) {
    event.preventDefault(); // Empêche l'envoi classique

    const valeur = document.getElementById('search_dep').value;

    // Vérifie que c'est bien un nombre
    const nombre = Number(valeur);

    if (!isNaN(nombre)) {
        // Redirection vers la page correspondant au nombre
        window.location.href = `departement.html?dep=${nombre}`;
        // ou si tes routes sont comme /number/42 -> window.location.href = `/number/${nombre}`
    } else {
        alert('Veuillez entrer un nombre valide.');
    }
});