// Configuration pour la page département Accident
initDepartmentPage({
    categoryColor: 'var(--accident)',
    totalLabel: 'Total Accidents',
    getCategoryData: (data) => data.AccidentDeCirculation,
    getTotal: (accident) => accident.Total || 0,
    getCategories: (accident) => [
        { label: 'Routiers', value: accident.Routiers || 0 },
        { label: 'Ferroviaires', value: accident.Ferroviaires || 0 },
        { label: 'Aériens', value: accident.Aériens || 0 },
        { label: 'Navigation', value: accident.Navigation || 0 },
        { label: 'Téléportage', value: accident.Téléportage || 0 }
    ],
    createChart: true,
    chartTitle: 'Comparaison avec la moyenne nationale',
    chartLabels: ['Total', 'Routiers', 'Ferroviaires', 'Aériens', 'Navigation', 'Téléportage'],
    getChartData: (accident) => [
        accident.Total || 0,
        accident.Routiers || 0,
        accident.Ferroviaires || 0,
        accident.Aériens || 0,
        accident.Navigation || 0,
        accident.Téléportage || 0
    ],
    calculateAverage: (data) => {
        const totals = { Total: 0, Routiers: 0, Ferroviaires: 0, Aériens: 0, Navigation: 0, Téléportage: 0 };
        let count = 0;
        data.forEach(e => {
            if (e.AccidentDeCirculation) {
                const a = e.AccidentDeCirculation;
                totals.Total += a.Total || 0;
                totals.Routiers += a.Routiers || 0;
                totals.Ferroviaires += a.Ferroviaires || 0;
                totals.Aériens += a.Aériens || 0;
                totals.Navigation += a.Navigation || 0;
                totals.Téléportage += a.Téléportage || 0;
                count++;
            }
        });
        return {
            Total: Math.round(totals.Total / count),
            Routiers: Math.round(totals.Routiers / count),
            Ferroviaires: Math.round(totals.Ferroviaires / count),
            Aériens: Math.round(totals.Aériens / count),
            Navigation: Math.round(totals.Navigation / count),
            Téléportage: Math.round(totals.Téléportage / count)
        };
    },
    getAverageData: (averages) => [
        averages.Total,
        averages.Routiers,
        averages.Ferroviaires,
        averages.Aériens,
        averages.Navigation,
        averages.Téléportage
    ],
    chartColor: '#eca533',
    onDataLoaded: (accident, averages, info) => {
        // Calcul du ratio entre le total du département et la moyenne nationale
        const totalDepartement = accident.Total || 0;
        const moyenneNationale = averages.Total || 1; // Éviter division par zéro
        
        // Calcul du ratio proportionnel
        const ratio = moyenneNationale > 0 ? totalDepartement / moyenneNationale : 1;
        
        // Durée de base de l'animation (2 secondes)
        const dureeBase = 2;
        
        // Calcul de la nouvelle durée : plus le ratio est élevé, plus l'animation est rapide
        // Si ratio = 1 (égal à la moyenne), durée = 2s
        // Si ratio = 2 (2x la moyenne), durée = 2/2 = 1s (plus rapide)
        // Si ratio = 0.5 (0.5x la moyenne), durée = 2/0.5 = 4s (plus lent)
        const nouvelleDuree = dureeBase / ratio;
        
        // Limiter la durée entre 0.5s et 4s pour éviter les extrêmes
        const dureeLimitee = Math.max(0.5, Math.min(4, nouvelleDuree));
        
        // Application de la nouvelle durée à toutes les animations de voitures
        const voitures = document.querySelectorAll('.background img');
        voitures.forEach(voiture => {
            voiture.style.animationDuration = `${dureeLimitee}s`;
        });
        
        // Calcul du nombre de voitures à afficher (entre 1 et 8 voitures)
        // Plus le ratio est élevé, plus il y a de voitures
        const nombreVoituresBase = 4; // Nombre de base dans le HTML
        const nombreVoitures = Math.max(1, Math.min(8, Math.round(nombreVoituresBase * ratio)));
        
        // Récupération du conteneur background
        const backgroundContainer = document.querySelector('.background');
        if (backgroundContainer) {
            // Supprimer toutes les voitures existantes
            backgroundContainer.innerHTML = '';
            
            // Créer le nombre de voitures approprié
            for (let i = 0; i < nombreVoitures; i++) {
                const voiture = document.createElement('img');
                voiture.src = '/img/svg/graphStyle/car.svg';
                
                // Répartir les délais de manière équilibrée
                const delay = (i / nombreVoitures) * dureeLimitee;
                voiture.style.setProperty('--delay', `${delay}s`);
                voiture.style.animationDuration = `${dureeLimitee}s`;
                backgroundContainer.appendChild(voiture);
            }
        }
    }
});
