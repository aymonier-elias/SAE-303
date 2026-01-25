// Configuration pour la page département Secours
initDepartmentPage({
    categoryColor: 'var(--secours)',
    totalLabel: 'Total Secours à Personnes',
    getCategoryData: (data) => data.SecoursAPersonnes,
    getTotal: (secours) => secours.Total || 0,
    getCategories: (secours) => {
        const secoursVictimes = secours.secoursAVictimes || {};
        const aidePersonnes = secours.AideAPersonnes || {};
        const malaiseTotal = (secoursVictimes.malaise?.Domicile?.Vital || 0) + 
                            (secoursVictimes.malaise?.Domicile?.Carence || 0) +
                            (secoursVictimes.malaise?.Travail || 0) +
                            (secoursVictimes.malaise?.Sport || 0) +
                            (secoursVictimes.malaise?.VoiePublique || 0);
        
        return [
            { 
                label: 'Secours à victimes', 
                value: secoursVictimes.Total || 0,
                expandable: true,
                children: [
                    { label: 'Accidents travail', value: secoursVictimes.Travail || 0 },
                    { label: 'Accidents domicile', value: secoursVictimes.Domicile || 0 },
                    { label: 'Accidents sport', value: secoursVictimes.Sport || 0 },
                    { label: 'Accidents voie publique', value: secoursVictimes.VoiePublique || 0 },
                    { label: 'Secours montagne', value: secoursVictimes.Montagne || 0 },
                    { 
                        label: 'Malaises', 
                        value: malaiseTotal,
                        expandable: true,
                        children: [
                            { label: 'Malaises travail', value: secoursVictimes.malaise?.Travail || 0 },
                            { label: 'Malaises domicile vital', value: secoursVictimes.malaise?.Domicile?.Vital || 0 },
                            { label: 'Malaises domicile carence', value: secoursVictimes.malaise?.Domicile?.Carence || 0 },
                            { label: 'Malaises sport', value: secoursVictimes.malaise?.Sport || 0 },
                            { label: 'Malaises voie publique', value: secoursVictimes.malaise?.VoiePublique || 0 }
                        ]
                    },
                    { label: 'Autolyses', value: secoursVictimes.Autolyses || 0 },
                    { label: 'Piscines', value: secoursVictimes.Piscines || 0 },
                    { label: 'Intoxications', value: secoursVictimes.Intoxications || 0 },
                    { label: 'Autres SAV', value: secoursVictimes.Autre || 0 }
                ]
            },
            { 
                label: 'Aide à personnes', 
                value: aidePersonnes.Total || 0,
                expandable: true,
                children: [
                    { label: 'Relevage', value: aidePersonnes.Relevage || 0 },
                    { label: 'Recherche', value: aidePersonnes.Recherche || 0 }
                ]
            }
        ];
    },
    createChart: true,
    chartTitle: 'Comparaison avec la moyenne nationale',
    chartLabels: [
        'Total',
        'Secours à victimes',
        'Aide à personnes'
    ],
    getChartData: (secours) => {
        const secoursVictimes = secours.secoursAVictimes || {};
        const aidePersonnes = secours.AideAPersonnes || {};
        return [
            secours.Total || 0,
            secoursVictimes.Total || 0,
            aidePersonnes.Total || 0
        ];
    },
    calculateAverage: (data) => {
        const totals = {
            Total: 0,
            SecoursAVictimes: { Total: 0, Travail: 0, Domicile: 0, Sport: 0, VoiePublique: 0, Montagne: 0, Autolyses: 0, Piscines: 0, Intoxications: 0, Autre: 0 },
            Malaise: { Travail: 0, DomicileVital: 0, DomicileCarence: 0, Sport: 0, VoiePublique: 0 },
            AideAPersonnes: { Total: 0, Relevage: 0, Recherche: 0 }
        };
        
        let count = 0;
        data.forEach(e => {
            if (e.SecoursAPersonnes) {
                const s = e.SecoursAPersonnes;
                totals.Total += s.Total || 0;
                
                if (s.secoursAVictimes) {
                    totals.SecoursAVictimes.Total += s.secoursAVictimes.Total || 0;
                    totals.SecoursAVictimes.Travail += s.secoursAVictimes.Travail || 0;
                    totals.SecoursAVictimes.Domicile += s.secoursAVictimes.Domicile || 0;
                    totals.SecoursAVictimes.Sport += s.secoursAVictimes.Sport || 0;
                    totals.SecoursAVictimes.VoiePublique += s.secoursAVictimes.VoiePublique || 0;
                    totals.SecoursAVictimes.Montagne += s.secoursAVictimes.Montagne || 0;
                    totals.SecoursAVictimes.Autolyses += s.secoursAVictimes.Autolyses || 0;
                    totals.SecoursAVictimes.Piscines += s.secoursAVictimes.Piscines || 0;
                    totals.SecoursAVictimes.Intoxications += s.secoursAVictimes.Intoxications || 0;
                    totals.SecoursAVictimes.Autre += s.secoursAVictimes.Autre || 0;
                    
                    if (s.secoursAVictimes.malaise) {
                        totals.Malaise.Travail += s.secoursAVictimes.malaise.Travail || 0;
                        totals.Malaise.DomicileVital += s.secoursAVictimes.malaise.Domicile?.Vital || 0;
                        totals.Malaise.DomicileCarence += s.secoursAVictimes.malaise.Domicile?.Carence || 0;
                        totals.Malaise.Sport += s.secoursAVictimes.malaise.Sport || 0;
                        totals.Malaise.VoiePublique += s.secoursAVictimes.malaise.VoiePublique || 0;
                    }
                }
                
                if (s.AideAPersonnes) {
                    totals.AideAPersonnes.Total += s.AideAPersonnes.Total || 0;
                    totals.AideAPersonnes.Relevage += s.AideAPersonnes.Relevage || 0;
                    totals.AideAPersonnes.Recherche += s.AideAPersonnes.Recherche || 0;
                }
                count++;
            }
        });
        
        return {
            Total: Math.round(totals.Total / count),
            SecoursAVictimes: {
                Total: Math.round(totals.SecoursAVictimes.Total / count)
            },
            AideAPersonnes: {
                Total: Math.round(totals.AideAPersonnes.Total / count)
            }
        };
    },
    getAverageData: (averages) => [
        averages.Total,
        averages.SecoursAVictimes.Total,
        averages.AideAPersonnes.Total
    ],
    chartColor: 'rgba(22, 175, 22, 0.7)',
    onDataLoaded: (secours, averages, info) => {
        // Calcul du ratio entre le total du département et la moyenne nationale
        const totalDepartement = secours.Total || 0;
        const moyenneNationale = averages.Total || 1; // Éviter division par zéro
        
        // Calcul du ratio proportionnel
        const ratio = moyenneNationale > 0 ? totalDepartement / moyenneNationale : 1;
        
        // Durée de base de l'animation (2 secondes)
        const dureeBase = 2;
        
        // Calcul de la nouvelle durée : plus le ratio est élevé, plus l'animation est rapide
        // Si ratio = 2 (2x la moyenne), durée = 2/2 = 1s (plus rapide)
        // Si ratio = 0.5 (0.5x la moyenne), durée = 2/0.5 = 4s (plus lent)
        const nouvelleDuree = dureeBase / ratio;
        
        // Calcul des BPM : 60 secondes / durée de l'animation
        const bpm = Math.round(60 / nouvelleDuree);
        
        // Application de la nouvelle durée à l'animation ECG
        const backgroundSvg = document.querySelector('.background svg path');
        if (backgroundSvg) {
            backgroundSvg.style.animationDuration = `${nouvelleDuree}s`;
        }
        
        // Ajout du texte BPM
        const backgroundContainer = document.querySelector('.background');
        if (backgroundContainer) {
            // Vérifier si le texte BPM existe déjà
            let bpmText = backgroundContainer.querySelector('.bpm-text');
            if (!bpmText) {
                bpmText = document.createElement('div');
                bpmText.className = 'bpm-text';
                backgroundContainer.appendChild(bpmText);
            }
            bpmText.textContent = `${bpm} BPM`;
        }
    }
});
