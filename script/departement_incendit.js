// Configuration pour la page département Incendie
initDepartmentPage({
    categoryColor: 'var(--incendit)',
    totalLabel: 'Total Incendies',
    getCategoryData: (data) => data.Incendie,
    getTotal: (incendie) => incendie.Total || 0,
    getCategories: (incendie) => {
        const erpTotal = (incendie.ERP?.Avec || 0) + (incendie.ERP?.Sans || 0);
        return [
            { label: 'Habitations', value: incendie.Habitations || 0 },
            { 
                label: 'ERP', 
                value: erpTotal,
                expandable: true,
                children: [
                    { label: 'ERP avec local à sommeil', value: incendie.ERP?.Avec || 0 },
                    { label: 'ERP sans local à sommeil', value: incendie.ERP?.Sans || 0 }
                ]
            },
            { label: 'Locaux industriels', value: incendie.Industriel || 0 },
            { label: 'Locaux artisanaux', value: incendie.Arstisanaux || 0 },
            { label: 'Locaux agricoles', value: incendie.Agricoles || 0 },
            { label: 'Voie publique', value: incendie.VoiePublique || 0 },
            { label: 'Véhicules', value: incendie.Véhicules || 0 },
            { label: 'Végétation', value: incendie.Végétal || 0 },
            { label: 'Autres', value: incendie.Autre || 0 }
        ];
    },
    createChart: true,
    chartTitle: 'Comparaison avec la moyenne nationale',
    chartLabels: [
        'Total',
        'Habitations',
        'ERP',
        'Industriel',
        'Artisanal',
        'Agricole',
        'Voie publique',
        'Véhicules',
        'Végétation',
        'Autres'
    ],
    getChartData: (incendie) => {
        const erpTotal = (incendie.ERP?.Avec || 0) + (incendie.ERP?.Sans || 0);
        return [
            incendie.Total || 0,
            incendie.Habitations || 0,
            erpTotal,
            incendie.Industriel || 0,
            incendie.Arstisanaux || 0,
            incendie.Agricoles || 0,
            incendie.VoiePublique || 0,
            incendie.Véhicules || 0,
            incendie.Végétal || 0,
            incendie.Autre || 0
        ];
    },
    calculateAverage: (data) => {
        const totals = {
            Total: 0,
            Habitations: 0,
            ERP: { Avec: 0, Sans: 0 },
            Industriel: 0,
            Arstisanaux: 0,
            Agricoles: 0,
            VoiePublique: 0,
            Véhicules: 0,
            Végétal: 0,
            Autre: 0
        };
        
        let count = 0;
        data.forEach(e => {
            if (e.Incendie) {
                totals.Total += e.Incendie.Total || 0;
                totals.Habitations += e.Incendie.Habitations || 0;
                totals.ERP.Avec += e.Incendie.ERP?.Avec || 0;
                totals.ERP.Sans += e.Incendie.ERP?.Sans || 0;
                totals.Industriel += e.Incendie.Industriel || 0;
                totals.Arstisanaux += e.Incendie.Arstisanaux || 0;
                totals.Agricoles += e.Incendie.Agricoles || 0;
                totals.VoiePublique += e.Incendie.VoiePublique || 0;
                totals.Véhicules += e.Incendie.Véhicules || 0;
                totals.Végétal += e.Incendie.Végétal || 0;
                totals.Autre += e.Incendie.Autre || 0;
                count++;
            }
        });
        
        return {
            Total: Math.round(totals.Total / count),
            Habitations: Math.round(totals.Habitations / count),
            ERP: Math.round((totals.ERP.Avec + totals.ERP.Sans) / count),
            Industriel: Math.round(totals.Industriel / count),
            Arstisanaux: Math.round(totals.Arstisanaux / count),
            Agricoles: Math.round(totals.Agricoles / count),
            VoiePublique: Math.round(totals.VoiePublique / count),
            Véhicules: Math.round(totals.Véhicules / count),
            Végétal: Math.round(totals.Végétal / count),
            Autre: Math.round(totals.Autre / count)
        };
    },
    getAverageData: (averages) => [
        averages.Total,
        averages.Habitations,
        averages.ERP,
        averages.Industriel,
        averages.Arstisanaux,
        averages.Agricoles,
        averages.VoiePublique,
        averages.Véhicules,
        averages.Végétal,
        averages.Autre
    ],
    chartColor: 'rgba(255, 60, 60, 0.7)',
    onDataLoaded: (incendie, averages, info) => {
        // Calcul du ratio entre le total du département et la moyenne nationale
        const totalDepartement = incendie.Total || 0;
        const moyenneNationale = averages.Total || 1; // Éviter division par zéro
        
        // Calcul du ratio proportionnel
        // Si le département est égal à la moyenne, scaleY = 1
        // Si le département est 2x la moyenne, scaleY = 2
        // Si le département est 0.5x la moyenne, scaleY = 0.5
        const ratio = moyenneNationale > 0 ? totalDepartement / moyenneNationale : 1;
        
        // Application du scaleY à la flamme
        const backgroundSvg = document.querySelector('.background img');
        if (backgroundSvg) {
            backgroundSvg.style.transform = `scaleY(${ratio})`;
            // Ajouter une transition pour une animation fluide
            backgroundSvg.style.transition = 'transform 0.5s ease-out';
        }
    }
});
