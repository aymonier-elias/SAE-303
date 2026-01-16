// Récupérationd des éléments du DOM
const divSvg = document.querySelector(".departement");

// Récupération des info de l'URL
const params = new URLSearchParams(window.location.search);
const dep = params.get("dep");

// Affichage du département en fonction de l'url
if (params.has('dep')) {
        divSvg.innerHTML = `<img src="/img/svg/departements/${dep}.svg" alt="Département n°${dep}"></img>`;
} else {
    divSvg.innerHTML = `Le département ${dep} n'existe pas ou n'es pas valide`;
}