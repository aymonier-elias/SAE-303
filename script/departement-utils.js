// Utilitaires communs pour les pages département

// Fonction pour formater les nombres
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
}

// Fonction pour normaliser le département (Corse, Paris)
function normalizeDepartment(dep) {
    if (dep == "2a" || dep == "2A") return "2a";
    if (dep == "2b" || dep == "2B") return "2b";
    return dep;
}

// Fonction pour gérer l'affichage de la Corse
function handleCorsica(divSvg, categoryColor) {
    divSvg.innerHTML = `
        <div class="error-message">
            <p>La Corse comprend deux départements :</p>
            <div style="margin-top: 20px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="departement.html?dep=2A" style="color: ${categoryColor}; padding: 10px 20px; border: 2px solid ${categoryColor}; border-radius: 8px;">Corse-du-Sud (2A)</a>
                <a href="departement.html?dep=2B" style="color: ${categoryColor}; padding: 10px 20px; border: 2px solid ${categoryColor}; border-radius: 8px;">Haute-Corse (2B)</a>
            </div>
        </div>
    `;
}

// Fonction pour afficher l'image du département
function displayDepartmentImage(divSvg, dep) {
    if (dep == 94 || dep == 93 || dep == 92 || dep == 75) {
        divSvg.innerHTML = `<img src="/img/svg/departements/Paris.svg" alt="Département n°${dep}" class="dep-img"></img>`;
        return "BSPP";
    } else {
        divSvg.innerHTML = `<img src="/img/svg/departements/${dep}.svg" alt="Département n°${dep}" class="dep-img"></img>`;
        return dep;
    }
}

// Fonction pour trouver le département dans les données
function findDepartment(data, dep) {
    const depUpper = String(dep).toUpperCase();
    return data.find(e => {
        const numero = String(e.Information.Numéro).toUpperCase();
        return numero == depUpper || numero == dep;
    });
}

// Fonction pour créer l'en-tête du département
function createDepartmentHeader(divSvg, info) {
    divSvg.innerHTML += `
        <div class="dep-header">
            <h2>${info.Nom} ${info.Numéro}</h2>
        </div>
    `;
}

// Fonction pour créer la section total
function createTotalSection(totalLabel, totalValue) {
    return `
        <div class="total-section">
            <div class="total-content">
                <span class="total-label">${totalLabel}</span>
                <span class="total-value">${formatNumber(totalValue)}</span>
            </div>
        </div>
    `;
}

// Fonction pour créer un élément de catégorie
function createCategoryItem(cat, index) {
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
                    // Gestion des sous-catégories expandables (pour secours)
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
    return categoryItem;
}

// Fonction pour créer la ligne de catégories
function createCategoriesRow(categories) {
    const categoriesRow = document.createElement('div');
    categoriesRow.className = 'categories-row';
    
    categories.forEach((cat, index) => {
        const categoryItem = createCategoryItem(cat, index);
        categoriesRow.appendChild(categoryItem);
    });
    
    return categoriesRow;
}

// Fonction pour gérer le dépliage des catégories
function setupExpandableCategories(treeContainer) {
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
}

// Fonction pour créer le graphique Chart.js
function createChart(containerId, config) {
    const ctx = document.getElementById(containerId).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: config.labels,
            datasets: [
                {
                    label: config.departmentName,
                    data: config.departmentData,
                    backgroundColor: config.categoryColor || 'rgba(255, 60, 60, 0.7)',
                    borderColor: config.categoryBorderColor || '#ff3c3c',
                    borderWidth: 2
                },
                {
                    label: 'Moyenne nationale',
                    data: config.averageData,
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
                    borderColor: config.categoryBorderColor || '#ff3c3c',
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
}

// Fonction pour créer le container de graphique
function createChartContainer(title) {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    chartContainer.innerHTML = `
        <h3 class="chart-title">${title}</h3>
        <canvas id="comparisonChart"></canvas>
    `;
    return chartContainer;
}

// Fonction principale pour initialiser une page département
function initDepartmentPage(config) {
    const divSvg = document.querySelector(".departement");
    const params = new URLSearchParams(window.location.search);
    let dep = params.get("dep");
    
    // Gestion de la Corse
    if (dep == "20") {
        handleCorsica(divSvg, config.categoryColor || '#ff3c3c');
        return;
    }
    
    // Validation du département
    if (!params.has('dep') || !(dep > 0 && dep < 99 || dep == "2b" || dep == "2B" || dep == "2a" || dep == "2A")) {
        divSvg.innerHTML = `<div class="error-message">Le département ${dep} n'existe pas ou n'est pas valide</div>`;
        return;
    }
    
    // Normalisation et affichage de l'image
    dep = normalizeDepartment(dep);
    dep = displayDepartmentImage(divSvg, dep);
    
    // Chargement des données
    loadData().then(data => {
        const departmentData = findDepartment(data, dep);
        
        if (!departmentData) {
            divSvg.innerHTML += `<div class="error-message">Département non trouvé</div>`;
            return;
        }
        
        const info = departmentData.Information;
        const categoryData = config.getCategoryData(departmentData);
        
        if (!categoryData) {
            divSvg.innerHTML += `<div class="error-message">${config.noDataMessage || 'Aucune donnée disponible'}</div>`;
            return;
        }
        
        // Création de l'en-tête
        createDepartmentHeader(divSvg, info);
        
        // Création du container principal
        const treeContainer = document.createElement('div');
        treeContainer.className = 'tree-container';
        
        // Section total
        treeContainer.innerHTML = createTotalSection(
            config.totalLabel,
            config.getTotal(categoryData)
        );
        
        // Catégories
        const categories = config.getCategories(categoryData);
        const categoriesRow = createCategoriesRow(categories);
        treeContainer.appendChild(categoriesRow);
        divSvg.appendChild(treeContainer);
        
        // Animation
        treeContainer.querySelector('.total-section').classList.add('fade-in');
        
        // Gestion du dépliage
        setupExpandableCategories(treeContainer);
        
        // Graphique si configuré
        if (config.createChart) {
            const averages = config.calculateAverage(data);
            const chartContainer = createChartContainer(config.chartTitle || 'Comparaison avec la moyenne nationale');
            divSvg.appendChild(chartContainer);
            
            setTimeout(() => {
                chartContainer.classList.add('fade-in');
                createChart('comparisonChart', {
                    labels: config.chartLabels,
                    departmentName: info.Nom,
                    departmentData: config.getChartData(categoryData),
                    averageData: config.getAverageData(averages),
                    categoryColor: config.chartColor || 'rgba(255, 60, 60, 0.7)',
                    categoryBorderColor: config.categoryColor || '#ff3c3c'
                });
            }, 500);
        }
    });
}
