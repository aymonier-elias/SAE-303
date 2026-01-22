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
    chartColor: '#eca533'
});
