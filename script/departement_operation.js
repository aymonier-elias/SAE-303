// Configuration pour la page département Opération
initDepartmentPage({
    categoryColor: 'var(--operation)',
    totalLabel: 'Total Opérations',
    getCategoryData: (data) => data.OpérationsDiverse,
    getTotal: (operation) => operation.Total || 0,
    getCategories: (operation) => {
        const protection = operation.ProtectionDesBiens || {};
        const divers = operation.Divers || {};
        
        return [
            { 
                label: 'Protection des biens', 
                value: protection.Total || 0,
                expandable: true,
                children: [
                    { label: 'Fuites d\'eau', value: protection.Fuites || 0 },
                    { label: 'Inondations', value: protection.Innondations || 0 },
                    { label: 'Ouvertures de portes', value: protection.Ouvertures || 0 },
                    { label: 'Recherches d\'objets', value: protection.Recherche || 0 },
                    { label: 'Bruits suspects', value: protection.Bruits || 0 }
                ]
            },
            { 
                label: 'Divers', 
                value: divers.Total || 0,
                expandable: true,
                children: [
                    { label: 'Animaux', value: divers.Animaux || 0 },
                    { label: 'Insectes', value: divers.Insectes || 0 },
                    { label: 'Dégagement voie publique', value: divers.DégagementVoiePublique || 0 },
                    { label: 'Nettoyage voie publique', value: divers.NettoyageVoiePublique || 0 },
                    { label: 'Éboulements', value: divers.Éboulements || 0 },
                    { label: 'Déposes d\'objets', value: divers.DéposesObjets || 0 },
                    { label: 'Piquets de sécurité', value: divers.Piquets || 0 },
                    { label: 'Explosifs', value: divers.Explosifs || 0 },
                    { label: 'Autres', value: divers.Autre || 0 }
                ]
            }
        ];
    },
    createChart: true,
    chartTitle: 'Comparaison avec la moyenne nationale',
    chartLabels: ['Total', 'Protection des biens', 'Divers'],
    getChartData: (operation) => {
        const protection = operation.ProtectionDesBiens || {};
        const divers = operation.Divers || {};
        return [
            operation.Total || 0,
            protection.Total || 0,
            divers.Total || 0
        ];
    },
    calculateAverage: (data) => {
        const totals = { Total: 0, ProtectionDesBiens: 0, Divers: 0 };
        let count = 0;
        data.forEach(e => {
            if (e.OpérationsDiverse) {
                const o = e.OpérationsDiverse;
                totals.Total += o.Total || 0;
                totals.ProtectionDesBiens += o.ProtectionDesBiens?.Total || 0;
                totals.Divers += o.Divers?.Total || 0;
                count++;
            }
        });
        return {
            Total: Math.round(totals.Total / count),
            ProtectionDesBiens: Math.round(totals.ProtectionDesBiens / count),
            Divers: Math.round(totals.Divers / count)
        };
    },
    getAverageData: (averages) => [
        averages.Total,
        averages.ProtectionDesBiens,
        averages.Divers
    ],
    chartColor: 'rgba(60, 60, 255, 0.7)',
    onDataLoaded: (operation, averages, info) => {
        // Calcul du ratio entre le total du département et la moyenne nationale
        const totalDepartement = operation.Total || 0;
        const moyenneNationale = averages.Total || 1; // Éviter division par zéro
        
        // Calcul du ratio proportionnel
        const ratio = moyenneNationale > 0 ? totalDepartement / moyenneNationale : 1;
        
        // Durée de base de l'animation (1.5 secondes)
        const dureeBase = 1.5;
        
        // Calcul de la nouvelle durée : plus le ratio est élevé, plus l'animation est rapide
        // Si ratio = 1 (égal à la moyenne), durée = 1.5s
        // Si ratio = 2 (2x la moyenne), durée = 1.5/2 = 0.75s (plus rapide)
        // Si ratio = 0.5 (0.5x la moyenne), durée = 1.5/0.5 = 3s (plus lent)
        const nouvelleDuree = dureeBase / ratio;
        
        // Limiter la durée entre 0.5s et 3s pour éviter les extrêmes
        const dureeLimitee = Math.max(0.5, Math.min(3, nouvelleDuree));
        
        // Application de la nouvelle durée à l'animation de la goutte
        const goute = document.querySelector('.background .goute');
        if (goute) {
            goute.style.animationDuration = `${dureeLimitee}s`;
        }
    }
});
