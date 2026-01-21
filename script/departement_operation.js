// Récupérationd des éléments du DOM
const divSvg = document.querySelector(".departement");

// Récupération des info de l'URL
const params = new URLSearchParams(window.location.search);
let dep = params.get("dep");

// Fonction pour formater les nombres
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
}

// Affichage du département en fonction de l'url
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
    if (dep == "2a" || dep == "2A") dep = "2A";
    else if (dep == "2b" || dep == "2B") dep = "2B";
    
    if (dep == 94 || dep == 93 || dep == 92 || dep == 75) {
        divSvg.innerHTML = `<img src="/img/svg/departements/Paris.svg" alt="Département n°${dep}" class="dep-img"></img>`;
        dep = "BSPP";
    } else {
        divSvg.innerHTML = `<img src="/img/svg/departements/${dep}.svg" alt="Département n°${dep}" class="dep-img"></img>`;
    }

    loadData().then(data => {
        data.forEach(e => {
            const numero = String(e.Information.Numéro).toUpperCase();
            const depUpper = String(dep).toUpperCase();
            
            if (numero == depUpper || numero == dep) {
                const info = e.Information;
                const operation = e.OpérationsDiverse;
                
                if (!operation) {
                    divSvg.innerHTML += `<div class="error-message">Aucune donnée disponible</div>`;
                    return;
                }
                
                divSvg.innerHTML += `<div class="dep-header"><h2>${info.Nom} ${info.Numéro}</h2></div>`;
                
                const treeContainer = document.createElement('div');
                treeContainer.className = 'tree-container';
                treeContainer.innerHTML = `
                    <div class="total-section">
                        <div class="total-content">
                            <span class="total-label">Total Opérations</span>
                            <span class="total-value">${formatNumber(operation.Total || 0)}</span>
                        </div>
                    </div>
                `;
                
                const protection = operation.ProtectionDesBiens || {};
                const divers = operation.Divers || {};
                
                const categories = [
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
                treeContainer.querySelector('.total-section').classList.add('fade-in');
                
                // Gestion du dépliage
                treeContainer.querySelectorAll('[data-expandable="true"]').forEach(expandable => {
                    expandable.addEventListener('click', function() {
                        const children = this.querySelector('.category-children');
                        const icon = this.querySelector('.expand-icon');
                        if (children.style.display === 'none') {
                            children.style.display = 'flex';
                            icon.textContent = '▲';
                            this.classList.add('expanded');
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
                
                // Graphique
                const calculateAverage = (data) => {
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
                };
                
                const averages = calculateAverage(data);
                const chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container';
                chartContainer.innerHTML = `
                    <h3 class="chart-title">Comparaison avec la moyenne nationale</h3>
                    <canvas id="comparisonChart"></canvas>
                `;
                divSvg.appendChild(chartContainer);
                
                setTimeout(() => {
                    chartContainer.classList.add('fade-in');
                    const ctx = document.getElementById('comparisonChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Total', 'Protection des biens', 'Divers'],
                            datasets: [
                                {
                                    label: info.Nom,
                                    data: [
                                        operation.Total || 0,
                                        protection.Total || 0,
                                        divers.Total || 0
                                    ],
                                    backgroundColor: 'rgba(255, 60, 60, 0.7)',
                                    borderColor: '#ff3c3c',
                                    borderWidth: 2
                                },
                                {
                                    label: 'Moyenne nationale',
                                    data: [
                                        averages.Total,
                                        averages.ProtectionDesBiens,
                                        averages.Divers
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
                                legend: { labels: { color: '#fff', font: { family: 'Roboto', size: 12 } } },
                                tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: '#fff', bodyColor: '#fff', borderColor: '#ff3c3c', borderWidth: 1 }
                            },
                            scales: {
                                x: { ticks: { color: '#fff', font: { family: 'Roboto', size: 10 }, maxRotation: 45, minRotation: 45 }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                                y: { ticks: { color: '#fff', font: { family: 'Roboto', size: 11 } }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
                            },
                            animation: { duration: 1000, easing: 'easeOutQuart' }
                        }
                    });
                }, 500);
            }
        });
    });
} else {
    divSvg.innerHTML = `<div class="error-message">Le département ${dep} n'existe pas ou n'est pas valide</div>`;
}
