// Script générique pour afficher les données d'un département
// Utilisation: loadDepartementData(categoryName, dataProperty, categoriesConfig)

// Fonction pour formater les nombres
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
}

// Fonction générique pour charger et afficher les données d'un département
function loadDepartementData(categoryName, dataProperty, categoriesConfig, chartLabels) {
    const divSvg = document.querySelector(".departement");
    const params = new URLSearchParams(window.location.search);
    let dep = params.get("dep");

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
        return;
    }

    if (params.has('dep') && (dep > 0 && dep < 99 || dep == "2b" || dep == "2B" || dep == "2a" || dep == "2A")) {
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
                    const categoryData = e[dataProperty];
                    
                    if (!categoryData) {
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
                                <span class="total-label">Total ${categoryName}</span>
                                <span class="total-value">${formatNumber(categoryData.Total || 0)}</span>
                            </div>
                        </div>
                    `;
                    
                    // Catégories principales sur une ligne
                    const categories = categoriesConfig.map(config => {
                        if (typeof config === 'function') {
                            return config(categoryData);
                        }
                        return config;
                    });
                    
                    const categoriesRow = document.createElement('div');
                    categoriesRow.className = 'categories-row';
                    
                    categories.forEach((cat, index) => {
                        if (!cat) return;
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
                    
                    // Animation d'apparition
                    const totalSection = treeContainer.querySelector('.total-section');
                    totalSection.classList.add('fade-in');
                    
                    // Gestion du dépliage
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
                    const calculateNationalAverage = (data, dataProperty) => {
                        const totals = {};
                        let count = 0;
                        
                        data.forEach(e => {
                            const catData = e[dataProperty];
                            if (catData) {
                                // Initialiser les totaux si nécessaire
                                if (count === 0) {
                                    Object.keys(catData).forEach(key => {
                                        if (typeof catData[key] === 'object' && catData[key] !== null) {
                                            totals[key] = {};
                                            Object.keys(catData[key]).forEach(subKey => {
                                                totals[key][subKey] = 0;
                                            });
                                        } else if (typeof catData[key] === 'number') {
                                            totals[key] = 0;
                                        }
                                    });
                                }
                                
                                // Additionner les valeurs
                                Object.keys(catData).forEach(key => {
                                    if (typeof catData[key] === 'object' && catData[key] !== null) {
                                        Object.keys(catData[key]).forEach(subKey => {
                                            totals[key][subKey] += catData[key][subKey] || 0;
                                        });
                                    } else if (typeof catData[key] === 'number') {
                                        totals[key] += catData[key] || 0;
                                    }
                                });
                                count++;
                            }
                        });
                        
                        // Calculer les moyennes
                        const averages = {};
                        Object.keys(totals).forEach(key => {
                            if (typeof totals[key] === 'object') {
                                averages[key] = {};
                                Object.keys(totals[key]).forEach(subKey => {
                                    averages[key][subKey] = Math.round(totals[key][subKey] / count);
                                });
                            } else {
                                averages[key] = Math.round(totals[key] / count);
                            }
                        });
                        
                        return averages;
                    };
                    
                    // Création du graphique comparatif
                    const averages = calculateNationalAverage(data, dataProperty);
                    const chartContainer = document.createElement('div');
                    chartContainer.className = 'chart-container';
                    chartContainer.innerHTML = `
                        <h3 class="chart-title">Comparaison avec la moyenne nationale</h3>
                        <canvas id="comparisonChart"></canvas>
                    `;
                    divSvg.appendChild(chartContainer);
                    
                    // Préparer les données pour le graphique
                    const chartData = categories.map(cat => {
                        if (cat.expandable && cat.children) {
                            return cat.value;
                        }
                        return cat.value;
                    });
                    
                    const chartAverages = categories.map(cat => {
                        // Trouver la valeur moyenne correspondante
                        const avgKey = Object.keys(averages).find(key => 
                            key.toLowerCase().includes(cat.label.toLowerCase().substring(0, 5))
                        );
                        if (avgKey && typeof averages[avgKey] === 'number') {
                            return averages[avgKey];
                        }
                        // Si c'est une catégorie dépliable, calculer la somme des sous-catégories
                        if (cat.expandable && cat.children) {
                            const childKeys = cat.children.map(c => 
                                Object.keys(averages).find(k => 
                                    k.toLowerCase().includes(c.label.toLowerCase().substring(0, 5))
                                )
                            );
                            return childKeys.reduce((sum, key) => sum + (averages[key] || 0), 0);
                        }
                        return 0;
                    });
                    
                    // Animation du graphique
                    setTimeout(() => {
                        chartContainer.classList.add('fade-in');
                        
                        const ctx = document.getElementById('comparisonChart').getContext('2d');
                        new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: chartLabels || categories.map(c => c.label),
                                datasets: [
                                    {
                                        label: info.Nom,
                                        data: chartData,
                                        backgroundColor: 'rgba(255, 60, 60, 0.7)',
                                        borderColor: '#ff3c3c',
                                        borderWidth: 2
                                    },
                                    {
                                        label: 'Moyenne nationale',
                                        data: chartAverages,
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
}
