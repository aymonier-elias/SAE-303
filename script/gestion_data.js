// Fonction asynchrone pour charger le JSON
async function loadData() {
    try {
        const response = await fetch("/data.json");

        data = await response.json();

        const exceptions = ["Zone", "Numéro", "Région", "Département", "Catégorie A"];

        function removeSpace(string) {
            return string
                .split(' ')
                .join('')
        }

        data.forEach(e => {
            for (let cle in e) {
                if (!exceptions.includes(cle)) {
                    removeSpace(e[cle]);
                    e[cle] = parseInt(e[cle]);
                }
            }
        });


        console.log(data)
        // Restructuration des donné pour plus de facilité ensuite
        // Je transforme tout en nombre
        data.forEach(e => {



            // Ajout objet information
            let information = {};
            information.Numéro = e.Numéro;
            information.Nom = e.Département;
            information.Région = e.Région;

            delete e.Numéro
            delete e.Département
            delete e.Région

            e.Information = information;

            // Ajout objet Incendie
            let incendie = {};
            let ERP = {};
            incendie.Habitations = parseInt(e["Feux d'habitations-bureaux"]) + e["dont feux de cheminées"];
            ERP.Avec = e["Feux d'ERP avec local à sommeil"];
            ERP.Sans = e["Feux d'ERP sans local à sommeil"];
            incendie.ERP = ERP;
            incendie.Industriel = e["Feux de locaux industriels"];
            incendie.Arstisanaux = e["Feux de locaux artisanaux"];
            incendie.Agricoles = e["Feux de locaux agricoles"];
            incendie.VoiePublique = e["Feux sur voie publique"];
            incendie.Véhicules = e["Feux de véhicules"];
            incendie.Végétal = e["Feux de végétations"];
            incendie.Autre = e["Autres feux"];
            incendie.Total = e["Incendies"];

            delete e["Feux d'habitations-bureaux"]
            delete e["dont feux de cheminées"];
            delete e["Feux d'ERP avec local à sommeil"];
            delete e["Feux d'ERP sans local à sommeil"];
            delete e["Feux de locaux industriels"];
            delete e["Feux de locaux artisanaux"];
            delete e["Feux de locaux agricoles"];
            delete e["Feux sur voie publique"];
            delete e["Feux de véhicules"];
            delete e["Feux de végétations"];
            delete e["Autres feux"];
            delete e["Incendies"];

            e.Incendie = incendie;

            // Ajout objet secours a personnes
            let secoursAPersonnes = {};
            let secoursAVictimes = {};
            secoursAVictimes.Travail = e["Accidents sur lieux de travail"];
            secoursAVictimes.Domicile = e["Accidents à domicile"];
            secoursAVictimes.Sport = e["Accidents de sport"];
            secoursAVictimes.VoiePublique = e["Accidents sur voie publique"];
            secoursAVictimes.Montagne = e["Secours en montagne"];
            let malaise = {};
            malaise.Travail = e["Malaises sur lieux de travail"];
            let domicile = {};
            domicile.Vital = e["Malaises à domicile : urgence vitale"];
            domicile.Carence = e["Malaises à domicile : carence"];
            malaise.Domicile = domicile;

            malaise.Sport = e["Malaises en sport"];
            malaise.VoiePublique = e["Malaises sur voie publique"];
            secoursAVictimes.malaise = malaise;

            secoursAVictimes.Autolyses = e["Autolyses"];
            secoursAVictimes.Piscines = e["Secours en piscines ou eaux intérieures"];
            secoursAVictimes.Intoxications = e["Intoxications"];
            secoursAVictimes.Autre = e["Autres SAV"];
            secoursAVictimes.Total = e["Secours à victime"];
            secoursAPersonnes.secoursAVictimes = secoursAVictimes;

            let aideAPersonnes = {};
            aideAPersonnes.Relevage = e["Relevage de personnes"];
            aideAPersonnes.Recherche = e["Recherche de personnes"];
            aideAPersonnes.Total = e["Aides à personne"];
            secoursAPersonnes.AideAPersonnes = aideAPersonnes
            secoursAPersonnes.Total = e["Secours à personne"];

            delete e["Secours à personne"]
            delete e["Accidents sur lieux de travail"];
            delete e["Accidents à domicile"];
            delete e["Accidents de sport"];
            delete e["Accidents sur voie publique"];
            delete e["Secours en montagne"];
            delete e["Malaises sur lieux de travail"];
            delete e["Malaises à domicile : urgence vitale"];
            delete e["Malaises à domicile : carence"];
            delete e["Malaises en sport"];
            delete e["Malaises sur voie publique"];
            delete e["Autolyses"];
            delete e["Secours en piscines ou eaux intérieures"];
            delete e["Intoxications"];
            delete e["Autres SAV"];
            delete e["Secours à victime"];
            delete e["Relevage de personnes"];
            delete e["Recherche de personnes"];
            delete e["Aides à personne"];
            delete e["Secours à personne"];

            e.SecoursAPersonnes = secoursAPersonnes;

            // Ajout objet Accident de circulation
            let accidentDeCirculation = {};
            accidentDeCirculation.Routiers = e["Accidents routiers"];
            accidentDeCirculation.Ferroviaires = e["Accidents ferroviaires"];
            accidentDeCirculation.Aériens = e["Accidents aériens"];
            accidentDeCirculation.Navigation = e["Accidents de navigation"];
            accidentDeCirculation.Téléportage = e["Accidents de téléportage"];
            accidentDeCirculation.Total = e["Accidents de circulation"];

            delete e["Accidents routiers"];
            delete e["Accidents ferroviaires"];
            delete e["Accidents aériens"];
            delete e["Accidents de navigation"];
            delete e["Accidents de téléportage"];
            delete e["Accidents de circulation"];

            e.AccidentDeCirculation = accidentDeCirculation

            // Ajout objet Risque téchnologique
            let risqueTechnologiques = {};
            let odeurs = {};
            odeurs.Gaz = e["Odeurs - fuites de gaz"];
            odeurs.Autre = e["Odeurs (autres que gaz)"];
            risqueTechnologiques.Odeurs = odeurs;

            risqueTechnologiques.FaitElectricite = e["Fait dus à l'électricité"];
            risqueTechnologiques.Pollutions = e["Pollutions - contaminations"];
            risqueTechnologiques.Autre = e["Autres risques technologiques"];
            risqueTechnologiques.Total = e["Risques technologiques"];

            delete e["Odeurs - fuites de gaz"];
            delete e["Odeurs (autres que gaz)"];
            delete e["Fait dus à l'électricité"];
            delete e["Pollutions - contaminations"];
            delete e["Autres risques technologiques"];
            delete e["Risques technologiques"];

            e.RisqueTechnologiques = risqueTechnologiques;

            // Ajout objet Opérations diverse
            let opérationsDiverse = {};
            let protectionDesBiens = {};
            protectionDesBiens.Fuites = e["Fuites d'eau"];
            protectionDesBiens.Innondations = e["Inondations"];
            protectionDesBiens.Ouvertures = e["Ouvertures de portes"];
            protectionDesBiens.Recherche = e["Recherches d'objets"];
            protectionDesBiens.Bruits = e["Bruits suspects"];
            protectionDesBiens.Total = e["Protection des biens"];
            opérationsDiverse.ProtectionDesBiens = protectionDesBiens

            let divers = {};
            divers.Animaux = e["Faits d'animaux (hors hyménoptères)"];
            divers.Insectes = e["Hyménoptères"];
            divers.DégagementVoiePublique = e["Dégagements de voies publiques"];
            divers.NettoyageVoiePublique = e["Nettoyages de voies publiques"];
            divers.Éboulements = e["Éboulements"];
            divers.DéposesObjets = e["Déposes d'objets"];
            divers.Piquets = e["Piquets de sécurité - surveillances"];
            divers.Explosifs = e["Engins explosifs"];
            divers.Autre = e["Autres opérations diverses"];
            divers.Total = e["Divers"];
            opérationsDiverse.Divers = divers;

            opérationsDiverse.Total = e["Opérations diverses"];

            delete e["Fuites d'eau"];
            delete e["Inondations"];
            delete e["Ouvertures de portes"];
            delete e["Recherches d'objets"];
            delete e["Bruits suspects"];
            delete e["Protection des biens"];
            delete e["Faits d'animaux (hors hyménoptères)"];
            delete e["Hyménoptères"];
            delete e["Dégagements de voies publiques"];
            delete e["Nettoyages de voies publiques"];
            delete e["Éboulements"];
            delete e["Déposes d'objets"];
            delete e["Piquets de sécurité - surveillances"];
            delete e["Engins explosifs"];
            delete e["Autres opérations diverses"];
            delete e["Divers"];
            delete e["Opérations diverses"];

            e.OpérationsDiverse = opérationsDiverse;

            // Delete des inutiles
            delete e["Secours en mer (FDSM)"];
            delete e["dont intoxications au CO"];
            delete e["dont fausses alertes DAAF"];
            delete e["Zone"];
            delete e["Année"];
            delete e["__id"];
            delete e["Catégorie A"];

        });
        return data;

    } catch (error) {
        console.error("Erreur lors du chargement du JSON :", error);
    }
}