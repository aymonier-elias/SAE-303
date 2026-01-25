// Récupération des mes elements
const carte = document.querySelector(".carte");


// Le but ici est envoyer le user sur la page du départementt sur lequel il a cliquer \\

// Event qui renvoie l'id de la partie du svg voulue
carte.addEventListener("click", e => {
    // Récupération des parties du svg qui m'interesse
    const path = e.target.closest("path");
    const g = e.target.closest("g");

    if (path && path.id) {
        window.location.href = `departement.html?dep=${path.id}`;
    } else if (g && g.id) {
        window.location.href = `departement.html?dep=${g.id}`;
    }
});
