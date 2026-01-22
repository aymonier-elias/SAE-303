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
    chartColor: 'rgba(0, 255, 0, 0.7)'
});
