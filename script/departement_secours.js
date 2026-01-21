// Récupérationd des éléments du DOM
const divSvg = document.querySelector(".departement");

// Récupération des info de l'URL
const params = new URLSearchParams(window.location.search);
let dep = params.get("dep");
const spe = params.get("spe");

// Fonction pour formater les nombres
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
}

// Affichage du département en fonction de l'url
// Gestion spéciale pour la Corse (20 -> 2A ou 2B)
if (dep == "20") {
    divSvg.innerHTML = `
        <div class="error-message">
            <p>La Corse comprend deux départements :</p>
            <div style="margin-top: 20px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="departement.html?dep=2A" style="color: #ff3c3c; padding: 10px 20px; border: 2px solid #ff3c3c; border-radius: 8px;">Corse-du-Sud (2A)</a>
                <a href="departement.html?dep=2B" style="color: #ff3c3c; padding: 10px 20px; border: 2px solid #ff3c3c; border-radius: 8px;">Haute-Corse (2B)</a>
            </div>
        </div>
    `;
} else if (params.has('dep') && (dep > 0 && dep < 99 || dep == "2b" || dep == "2B" || dep == "2a" || dep == "2A")) {
    let depNum = dep;
    // Normalisation pour la Corse
    if (dep == "2a" || dep == "2A") {
        dep = "2A";
    } else if (dep == "2b" || dep == "2B") {
        dep = "2B";
    }
    
    if (dep == 94 || dep == 93 || dep == 92 || dep == 75) {
        divSvg.innerHTML = `<img src="/img/svg/departements/Paris.svg" alt="Département n°${dep}" class="dep-img"></img>`;
        dep = "BSPP";
    } else {
        divSvg.innerHTML = `<img src="/img/svg/departements/${dep}.svg" alt="Département n°${dep}" class="dep-img"></img>`;
    }

    // Utilisations du JSON
    let data;
    loadData().then(myData => {
        data = myData;

        data.forEach(e => {
            // Comparaison flexible pour la Corse
            const numero = String(e.Information.Numéro).toUpperCase();
            const depUpper = String(dep).toUpperCase();
            
            if (numero == depUpper || numero == dep) {
                const info = e.Information;
                const secours = e.SecoursAPersonnes;
                
                if (!secours) {
                    divSvg.innerHTML += `<div class="error-message">Aucune donnée disponible pour cette catégorie</div>`;
                    return;
                }
                
                // En-tête
                divSvg.innerHTML += `
                    <div class="dep-header">
                        <h2>${info.Nom} ${info.Numéro}</h2>
                    </div>
                `;
                
                // Container principal
                const treeContainer = document.createElement('div');
                treeContainer.className = 'tree-container';
                
                // Total en haut
                treeContainer.innerHTML = `
                    <div class="total-section">
                        <div class="total-content">
                            <span class="total-label">Total Secours à Personnes</span>
                            <span class="total-value">${formatNumber(secours.Total || 0)}</span>
                        </div>
                    </div>
                `;
                
                // Catégories principales sur une ligne
                const secoursVictimes = secours.secoursAVictimes || {};
                const aidePersonnes = secours.AideAPersonnes || {};
                const malaiseTotal = (secoursVictimes.malaise?.Domicile?.Vital || 0) + 
                                    (secoursVictimes.malaise?.Domicile?.Carence || 0) +
                                    (secoursVictimes.malaise?.Travail || 0) +
                                    (secoursVictimes.malaise?.Sport || 0) +
                                    (secoursVictimes.malaise?.VoiePublique || 0);
                
                const categories = [
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
                
                const categoriesRow = document.createElement('div');
                categoriesRow.className = 'categories-row';
                
                categories.forEach((cat, index) => {
                    const categoryItem = document.createElement('div');
                    categoryItem.className = 'category-item';
                    if (cat.expandable && cat.children) {
                        categoryItem.setAttribute('data-expandable', 'true');
                        categoryItem.innerHTML = `
                            <div class="category-content">
                                <span class="category-label">${cat.label}</span>
                                <span class="category-value">${formatNumber(cat.value)}</span>
                                <span class="expand-icon">▼</span>
                            </div>
                            <div class="category-children" style="display: none;">
                                ${cat.children.map(child => {
                                    if (child.expandable && child.children) {
                                        return `
                                            <div class="child-item" data-expandable="true">
                                                <div class="child-content">
                                                    <span class="child-label">${child.label}</span>
                                                    <span class="child-value">${formatNumber(child.value)}</span>
                                                    <span class="expand-icon">▼</span>
                                                </div>
                                                <div class="child-children" style="display: none;">
                                                    ${child.children.map(grandChild => `
                                                        <div class="grandchild-item">
                                                            <span class="grandchild-label">${grandChild.label}</span>
                                                            <span class="grandchild-value">${formatNumber(grandChild.value)}</span>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        `;
                                    }
                                    return `
                                        <div class="child-item">
                                            <span class="child-label">${child.label}</span>
                                            <span class="child-value">${formatNumber(child.value)}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        `;
                    } else {
                        categoryItem.innerHTML = `
                            <div class="category-content">
                                <span class="category-label">${cat.label}</span>
                                <span class="category-value">${formatNumber(cat.value)}</span>
                            </div>
                        `;
                    }
                    categoryItem.style.animationDelay = `${index * 0.05}s`;
                    categoryItem.classList.add('fade-in');
                    categoriesRow.appendChild(categoryItem);
                });
                
                treeContainer.appendChild(categoriesRow);
                divSvg.appendChild(treeContainer);
                
                // Animation d'apparition
                const totalSection = treeContainer.querySelector('.total-section');
                totalSection.classList.add('fade-in');
                
                // Gestion du dépliage
                treeContainer.querySelectorAll('[data-expandable="true"]').forEach(expandable => {
                    expandable.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const children = this.querySelector('.category-children, .child-children');
                        const icon = this.querySelector('.expand-icon');
                        
                        if (!children) return;
                        
                        if (children.style.display === 'none' || children.style.display === '') {
                            children.style.display = 'flex';
                            if (icon) icon.textContent = '▲';
                            this.classList.add('expanded');
                            
                            // Animation des enfants
                            const childItems = children.querySelectorAll('.child-item, .grandchild-item');
                            childItems.forEach((child, idx) => {
                                child.style.animationDelay = `${idx * 0.1}s`;
                                child.classList.add('fade-in');
                            });
                        } else {
                            children.style.display = 'none';
                            if (icon) icon.textContent = '▼';
                            this.classList.remove('expanded');
                        }
                    });
                });
                
                // Calcul de la moyenne nationale
                const calculateNationalAverage = (data) => {
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
                            Total: Math.round(totals.SecoursAVictimes.Total / count),
                            Travail: Math.round(totals.SecoursAVictimes.Travail / count),
                            Domicile: Math.round(totals.SecoursAVictimes.Domicile / count),
                            Sport: Math.round(totals.SecoursAVictimes.Sport / count),
                            VoiePublique: Math.round(totals.SecoursAVictimes.VoiePublique / count),
                            Montagne: Math.round(totals.SecoursAVictimes.Montagne / count),
                            Autolyses: Math.round(totals.SecoursAVictimes.Autolyses / count),
                            Piscines: Math.round(totals.SecoursAVictimes.Piscines / count),
                            Intoxications: Math.round(totals.SecoursAVictimes.Intoxications / count),
                            Autre: Math.round(totals.SecoursAVictimes.Autre / count)
                        },
                        Malaise: {
                            Travail: Math.round(totals.Malaise.Travail / count),
                            DomicileVital: Math.round(totals.Malaise.DomicileVital / count),
                            DomicileCarence: Math.round(totals.Malaise.DomicileCarence / count),
                            Sport: Math.round(totals.Malaise.Sport / count),
                            VoiePublique: Math.round(totals.Malaise.VoiePublique / count)
                        },
                        AideAPersonnes: {
                            Total: Math.round(totals.AideAPersonnes.Total / count),
                            Relevage: Math.round(totals.AideAPersonnes.Relevage / count),
                            Recherche: Math.round(totals.AideAPersonnes.Recherche / count)
                        }
                    };
                };
                
                // Création du graphique comparatif
                const averages = calculateNationalAverage(data);
                const chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container';
                chartContainer.innerHTML = `
                    <h3 class="chart-title">Comparaison avec la moyenne nationale</h3>
                    <canvas id="comparisonChart"></canvas>
                `;
                divSvg.appendChild(chartContainer);
                
                // Animation du graphique
                setTimeout(() => {
                    chartContainer.classList.add('fade-in');
                    
                    const ctx = document.getElementById('comparisonChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: [
                                'Total',
                                'Secours à victimes',
                                'Aide à personnes'
                            ],
                            datasets: [
                                {
                                    label: info.Nom,
                                    data: [
                                        secours.Total || 0,
                                        secoursVictimes.Total || 0,
                                        aidePersonnes.Total || 0
                                    ],
                                    backgroundColor: 'rgba(255, 60, 60, 0.7)',
                                    borderColor: '#ff3c3c',
                                    borderWidth: 2
                                },
                                {
                                    label: 'Moyenne nationale',
                                    data: [
                                        averages.Total,
                                        averages.SecoursAVictimes.Total,
                                        averages.AideAPersonnes.Total
                                    ],
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    borderWidth: 2
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#fff',
                                        font: {
                                            family: 'Roboto',
                                            size: 12
                                        }
                                    }
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleColor: '#fff',
                                    bodyColor: '#fff',
                                    borderColor: '#ff3c3c',
                                    borderWidth: 1
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        color: '#fff',
                                        font: {
                                            family: 'Roboto',
                                            size: 10
                                        },
                                        maxRotation: 45,
                                        minRotation: 45
                                    },
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    }
                                },
                                y: {
                                    ticks: {
                                        color: '#fff',
                                        font: {
                                            family: 'Roboto',
                                            size: 11
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeOutQuart'
                            }
                        }
                    });
                }, 500);
            }
        });
    });
} else {
    divSvg.innerHTML = `<div class="error-message">Le département ${dep} n'existe pas ou n'est pas valide</div>`;
}
