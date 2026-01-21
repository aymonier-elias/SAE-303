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

// Fonction pour créer un nœud de l'arbre
function createNode(label, value, level = 0, isExpandable = false, children = null) {
    const nodeId = `node-${Math.random().toString(36).substr(2, 9)}`;
    const total = children ? children.reduce((sum, child) => sum + child.value, 0) : value;
    
    let html = `
        <div class="tree-node level-${level}" data-node-id="${nodeId}" data-level="${level}">
            <div class="node-content" ${isExpandable ? 'data-expandable="true"' : ''}>
                <span class="node-label">${label}</span>
                <span class="node-value">${formatNumber(value)}</span>
                ${isExpandable ? `<span class="expand-icon">▼</span>` : ''}
            </div>
            ${children ? `
                <div class="node-children" style="display: none;">
                    ${children.map(child => createNode(child.label, child.value, level + 1, false)).join('')}
                </div>
            ` : ''}
        </div>
    `;
    return html;
}

// Affichage du département en fonction de l'url
// Gestion spéciale pour la Corse (20 -> 2A ou 2B)
if (dep == "20") {
    divSvg.innerHTML = `
        <div class="error-message">
            <p>La Corse comprend deux départements :</p>
            <div style="margin-top: 20px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="departement.html?dep=2A" style="color: #ff3c3c;  padding: 10px 20px; border: 2px solid #ff3c3c; border-radius: 8px;">Corse-du-Sud (2A)</a>
                <a href="departement.html?dep=2B" style="color: #ff3c3c;  padding: 10px 20px; border: 2px solid #ff3c3c; border-radius: 8px;">Haute-Corse (2B)</a>
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
                const incendie = e.Incendie;
                
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
                            <span class="total-label">Total Incendies</span>
                            <span class="total-value">${formatNumber(incendie.Total)}</span>
                        </div>
                    </div>
                `;
                
                // Catégories principales sur une ligne
                const erpTotal = (incendie.ERP?.Avec || 0) + (incendie.ERP?.Sans || 0);
                const categories = [
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
                
                const categoriesRow = document.createElement('div');
                categoriesRow.className = 'categories-row';
                
                categories.forEach((cat, index) => {
                    const categoryItem = document.createElement('div');
                    categoryItem.className = 'category-item';
                    if (cat.expandable) {
                        categoryItem.setAttribute('data-expandable', 'true');
                        categoryItem.innerHTML = `
                            <div class="category-content">
                                <span class="category-label">${cat.label}</span>
                                <span class="category-value">${formatNumber(cat.value)}</span>
                                <span class="expand-icon">▼</span>
                            </div>
                            <div class="category-children" style="display: none;">
                                ${cat.children.map(child => `
                                    <div class="child-item">
                                        <span class="child-label">${child.label}</span>
                                        <span class="child-value">${formatNumber(child.value)}</span>
                                    </div>
                                `).join('')}
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
                
                // Gestion du dépliage ERP
                treeContainer.querySelectorAll('[data-expandable="true"]').forEach(expandable => {
                    expandable.addEventListener('click', function() {
                        const children = this.querySelector('.category-children');
                        const icon = this.querySelector('.expand-icon');
                        
                        if (children.style.display === 'none') {
                            children.style.display = 'flex';
                            icon.textContent = '▲';
                            this.classList.add('expanded');
                            
                            // Animation des enfants
                            const childItems = children.querySelectorAll('.child-item');
                            childItems.forEach((child, idx) => {
                                child.style.animationDelay = `${idx * 0.1}s`;
                                child.classList.add('fade-in');
                            });
                        } else {
                            children.style.display = 'none';
                            icon.textContent = '▼';
                            this.classList.remove('expanded');
                        }
                    });
                });
                
                // Calcul de la moyenne nationale
                const calculateNationalAverage = (data) => {
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
                            datasets: [
                                {
                                    label: info.Nom,
                                    data: [
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
                                    ],
                                    backgroundColor: 'rgba(255, 60, 60, 0.7)',
                                    borderColor: '#ff3c3c',
                                    borderWidth: 2
                                },
                                {
                                    label: 'Moyenne nationale',
                                    data: [
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