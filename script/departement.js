// Récupérationd des éléments du DOM
const divSvg = document.querySelector(".departement");

// Récupération des info de l'URL
const params = new URLSearchParams(window.location.search);
let dep = params.get("dep");
const spe = params.get("spe");

// Affichage du département en fonction de l'url
if (params.has('dep') && dep > 0 && dep < 99) {
    if (dep == 94 || dep == 93 || dep == 92 || dep == 75) {
        divSvg.innerHTML = `<img src="/img/svg/departements/Paris.svg" alt="Département n°${dep}"></img>`;
        dep = "BSPP";
    } else {
        divSvg.innerHTML = `<img src="/img/svg/departements/${dep}.svg" alt="Département n°${dep}"></img>`;
    }
    // Utilisations du JSON
    let data;
    loadData().then(myData => {

        data = myData;

        data.forEach(e => {
            if (e.Information.Numéro == dep) {
                console.log(e.Numéro + " -> " + e.Département);
                divSvg.innerHTML += `<h2>${e.Information.Nom} ${e.Information.Numéro}</h2>`;
                divSvg.innerHTML += `<h3>${e.Incendie.Total} Incendie en 2023</h3>`;
            }
        });
    });
} else {
    divSvg.innerHTML = `Le département ${dep} n'existe pas ou n'es pas valide`;
}