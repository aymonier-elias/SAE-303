// Configuration pour la page département Risque
initDepartmentPage({
    categoryColor: 'var(--risque)',
    totalLabel: 'Total Risques',
    getCategoryData: (data) => data.RisqueTechnologiques,
    getTotal: (risque) => risque.Total || 0,
    getCategories: (risque) => {
        const odeursTotal = (risque.Odeurs?.Gaz || 0) + (risque.Odeurs?.Autre || 0);
        return [
            { 
                label: 'Odeurs', 
                value: odeursTotal,
                expandable: true,
                children: [
                    { label: 'Odeurs gaz', value: risque.Odeurs?.Gaz || 0 },
                    { label: 'Odeurs autres', value: risque.Odeurs?.Autre || 0 }
                ]
            },
            { label: 'Fait électricité', value: risque.FaitElectricite || 0 },
            { label: 'Pollutions', value: risque.Pollutions || 0 },
            { label: 'Autres', value: risque.Autre || 0 }
        ];
    },
    createChart: true,
    chartTitle: 'Comparaison avec la moyenne nationale',
    chartLabels: ['Total', 'Odeurs', 'Fait électricité', 'Pollutions', 'Autres'],
    getChartData: (risque) => {
        const odeursTotal = (risque.Odeurs?.Gaz || 0) + (risque.Odeurs?.Autre || 0);
        return [
            risque.Total || 0,
            odeursTotal,
            risque.FaitElectricite || 0,
            risque.Pollutions || 0,
            risque.Autre || 0
        ];
    },
    calculateAverage: (data) => {
        const totals = { Total: 0, OdeursGaz: 0, OdeursAutre: 0, FaitElectricite: 0, Pollutions: 0, Autre: 0 };
        let count = 0;
        data.forEach(e => {
            if (e.RisqueTechnologiques) {
                const r = e.RisqueTechnologiques;
                totals.Total += r.Total || 0;
                totals.OdeursGaz += r.Odeurs?.Gaz || 0;
                totals.OdeursAutre += r.Odeurs?.Autre || 0;
                totals.FaitElectricite += r.FaitElectricite || 0;
                totals.Pollutions += r.Pollutions || 0;
                totals.Autre += r.Autre || 0;
                count++;
            }
        });
        return {
            Total: Math.round(totals.Total / count),
            Odeurs: Math.round((totals.OdeursGaz + totals.OdeursAutre) / count),
            FaitElectricite: Math.round(totals.FaitElectricite / count),
            Pollutions: Math.round(totals.Pollutions / count),
            Autre: Math.round(totals.Autre / count)
        };
    },
    getAverageData: (averages) => [
        averages.Total,
        averages.Odeurs,
        averages.FaitElectricite,
        averages.Pollutions,
        averages.Autre
    ],
    chartColor: 'rgba(0, 255, 0, 0.7)',
    onDataLoaded: (risque, averages, info) => {
        // Calcul du ratio entre le total du département et la moyenne nationale
        const totalDepartement = risque.Total || 0;
        const moyenneNationale = averages.Total || 1; // Éviter division par zéro
        
        // Calcul du ratio proportionnel
        const ratio = moyenneNationale > 0 ? totalDepartement / moyenneNationale : 1;
        
        // Utilisation d'une fonction racine carrée pour réduire l'impact des extrêmes
        // Cela rend la variation plus douce et moins prononcée
        const ratioAdouci = Math.sqrt(ratio);
        
        // Taille de base des gradients (50% de la largeur chacun)
        const tailleBase = 50;
        
        // Calcul de la nouvelle taille avec des limites plus resserrées
        // Si ratio = 1, taille = 50%
        // Si ratio = 2, taille ≈ 57% (au lieu de 80%)
        // Si ratio = 0.5, taille ≈ 42% (au lieu de 30%)
        // On limite entre 42% et 58% pour réduire la nuance
        const nouvelleTaille = Math.max(42, Math.min(58, tailleBase * ratioAdouci));
        
        // Opacité de base du container (0.25)
        const opaciteBase = 0.25;
        
        // Calcul de la nouvelle opacité avec des limites plus resserrées
        // Si ratio = 1, opacité = 0.25
        // Si ratio = 2, opacité ≈ 0.3 (au lieu de 0.6)
        // Si ratio = 0.5, opacité ≈ 0.2 (au lieu de 0.15)
        // On limite entre 0.2 et 0.35 pour réduire la nuance
        const nouvelleOpacite = Math.max(0.2, Math.min(0.35, opaciteBase * ratioAdouci));
        
        // Opacité de base dans le color-mix (40%)
        const opaciteColorMixBase = 40;
        
        // Calcul de la nouvelle opacité dans le color-mix avec des limites plus resserrées
        // Si ratio = 1, opacité = 40%
        // Si ratio = 2, opacité ≈ 48% (au lieu de 70%)
        // Si ratio = 0.5, opacité ≈ 32% (au lieu de 20%)
        // On limite entre 32% et 48% pour réduire la nuance
        const nouvelleOpaciteColorMix = Math.max(32, Math.min(48, opaciteColorMixBase * ratioAdouci));
        
        // Application des modifications au background
        const backgroundContainer = document.querySelector('.background');
        if (backgroundContainer) {
            // Modification de l'opacité du container
            backgroundContainer.style.opacity = nouvelleOpacite.toString();
            
            // Modification de la taille et de l'opacité des gradients via background-image
            backgroundContainer.style.backgroundImage = 
                `radial-gradient(at left center, color-mix(in srgb, var(--risque) ${nouvelleOpaciteColorMix}%, transparent) 0%, transparent 50%), ` +
                `radial-gradient(at right center, color-mix(in srgb, var(--risque) ${nouvelleOpaciteColorMix}%, transparent) 0%, transparent 50%)`;
            
            // Modification de la taille des gradients
            backgroundContainer.style.backgroundSize = `${nouvelleTaille}% 100%, ${nouvelleTaille}% 100%`;
        }
    }
});
