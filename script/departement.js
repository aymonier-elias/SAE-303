// Récupérationd des éléments du DOM
const divSvg = document.querySelector(".departement");

// Récupération des info de l'URL
const params = new URLSearchParams(window.location.search);
const dep = params.get("dep");

// Affichage du département en fonction de l'url
if (params.has('dep')) {
    divSvg.innerHTML = `<img src="/img/svg/departements/${dep}.svg" alt="Département n°${dep}"></img>`;
    
    // Utilisations du JSON
    let data;
    loadData().then(myData => {
        data = myData;
        
        data.forEach(e => {
            if (e.Numéro == dep) {
                console.log(e.Numéro + " -> " + e.Département);
                divSvg.innerHTML += `<h2>${e.Département}</h2>`;
            }
        });
    });
} else {
    divSvg.innerHTML = `Le département ${dep} n'existe pas ou n'es pas valide`;
}
