/**
 * ========================================
 * FILE: career-velocity-index.js
 * PURPOSE: 職涯速度指數分析頁面專用 JavaScript
 * FEATURES: 數據處理、圖表初始化、分數計算
 * AUTHOR: Voyage Compass Team
 * LAST UPDATED: 2024-12-19
 * DEPENDENCIES: Chart.js
 * ========================================
 */

// 城市數據
const DATA = [
    { city: 'San Francisco', density: 330, vcGrowth: 15.5, tenure: 1.8 },
    { city: 'London', density: 95, vcGrowth: 16.0, tenure: 2.1 },
    { city: 'Taipei', density: 45, vcGrowth: 25.0, tenure: 2.7 },
    { city: 'Singapore', density: 80, vcGrowth: 19.0, tenure: 2.4 },
    { city: 'New York City', density: 75, vcGrowth: 14.0, tenure: 2.2 },
    { city: 'Vancouver', density: 55, vcGrowth: 17.5, tenure: 2.5 },
    { city: 'Bangkok', density: 25, vcGrowth: 23.0, tenure: 2.9 },
    { city: 'Seoul', density: 35, vcGrowth: 21.0, tenure: 3.1 },
    { city: 'Sydney', density: 60, vcGrowth: 11.0, tenure: 3.0 },
    { city: 'Hong Kong', density: 40, vcGrowth: 6.0, tenure: 3.4 },
    { city: 'Tokyo', density: 15, vcGrowth: 8.5, tenure: 3.8 },
];

// 城市名稱中英文對照
const CITY_NAMES_TC = {
    'San Francisco': '舊金山',
    'London': '倫敦',
    'Taipei': '台北',
    'Singapore': '新加坡',
    'New York City': '紐約市',
    'Vancouver': '溫哥華',
    'Bangkok': '曼谷',
    'Seoul': '首爾',
    'Sydney': '雪梨',
    'Hong Kong': '香港',
    'Tokyo': '東京',
};

// 顏色配置
const PALETTE = {
    red: '#FF6B6B',
    yellow: '#FFD166',
    green: '#06D6A0',
    blue: '#118AB2',
    navy: '#073B4C',
    lightGray: '#F8F9FA'
};

// 字體配置
const FONT_FAMILY = "'Noto Sans TC', 'Inter', sans-serif";

// 圖表工具提示配置
const CHART_TOOLTIP_CONFIG = {
    plugins: {
        tooltip: {
            callbacks: {
                title: function(tooltipItems) {
                    const item = tooltipItems[0];
                    let label = item.chart.data.labels[item.dataIndex];
                    if (Array.isArray(label)) {
                        return label.join(' ');
                    }
                    return label;
                }
            },
            bodyFont: { family: FONT_FAMILY },
            titleFont: { family: FONT_FAMILY }
        },
        legend: {
            labels: {
                font: {
                    family: FONT_FAMILY,
                    size: 12
                }
            }
        }
    },
    scales: {
        y: {
            ticks: { font: { family: FONT_FAMILY } },
            grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
            ticks: { font: { family: FONT_FAMILY } },
            grid: { color: 'rgba(0,0,0,0.05)' }
        }
    },
    maintainAspectRatio: false,
};

/**
 * 計算職涯速度分數
 * @function calculateScores
 * @returns {Array} 計算後的分數陣列
 */
function calculateScores() {
    const maxDensity = Math.max(...DATA.map(d => d.density));
    const maxVcGrowth = Math.max(...DATA.map(d => d.vcGrowth));
    const minTenure = Math.min(...DATA.map(d => d.tenure));
    const maxTenure = Math.max(...DATA.map(d => d.tenure));

    return DATA.map(d => {
        const densityScore = (d.density / maxDensity) * 100;
        const vcGrowthScore = (d.vcGrowth / maxVcGrowth) * 100;
        const fluidityScore = (1 - (d.tenure - minTenure) / (maxTenure - minTenure)) * 100;

        const finalScore = (densityScore * 0.40) + (vcGrowthScore * 0.35) + (fluidityScore * 0.25);

        return {
            ...d,
            densityScore,
            vcGrowthScore,
            fluidityScore,
            finalScore,
        };
    }).sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * 文字換行處理函數
 * @function wrapLabel
 * @param {string} label - 要處理的文字
 * @returns {string|Array} 處理後的文字
 */
function wrapLabel(label) {
    const maxLen = 16;
    if (typeof label !== 'string' || label.length <= maxLen) {
        return label;
    }
    const words = label.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length > maxLen) {
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine = (currentLine + ' ' + word).trim();
        }
    }
    if (currentLine) {
        lines.push(currentLine.trim());
    }
    return lines;
}

/**
 * 初始化排名圖表
 * @function initializeRankingsChart
 * @param {Array} scores - 計算後的分數陣列
 */
function initializeRankingsChart(scores) {
    const ctx = document.getElementById('rankingsChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: scores.map(s => wrapLabel(CITY_NAMES_TC[s.city] || s.city)),
            datasets: [{
                label: '職涯速度分數',
                data: scores.map(s => s.finalScore.toFixed(1)),
                backgroundColor: scores.map(s => s.city === 'San Francisco' ? PALETTE.red : PALETTE.blue),
                borderColor: PALETTE.navy,
                borderWidth: 1
            }]
        },
        options: {
            ...CHART_TOOLTIP_CONFIG,
            indexAxis: 'y',
            scales: {
               x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: FONT_FAMILY } } },
               y: { grid: { display: false }, ticks: { font: { family: FONT_FAMILY } } }
            },
            plugins: {
                ...CHART_TOOLTIP_CONFIG.plugins,
                legend: { display: false }
            }
        }
    });
}

/**
 * 初始化密度圖表
 * @function initializeDensityChart
 * @param {Array} scores - 計算後的分數陣列
 */
function initializeDensityChart(scores) {
    const ctx = document.getElementById('densityChart');
    if (!ctx) return;

    const sortedByDensity = [...scores].sort((a,b) => b.density - a.density);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedByDensity.map(s => wrapLabel(CITY_NAMES_TC[s.city] || s.city)),
            datasets: [{
                label: '每十萬居民新創數',
                data: sortedByDensity.map(s => s.density),
                backgroundColor: PALETTE.red,
            }]
        },
        options: { ...CHART_TOOLTIP_CONFIG, plugins: { ...CHART_TOOLTIP_CONFIG.plugins, legend: { display: false } } }
    });
}

/**
 * 初始化創投增長圖表
 * @function initializeVCChart
 * @param {Array} scores - 計算後的分數陣列
 */
function initializeVCChart(scores) {
    const ctx = document.getElementById('vcChart');
    if (!ctx) return;

    const sortedByVC = [...scores].sort((a,b) => b.vcGrowth - a.vcGrowth);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedByVC.map(s => wrapLabel(CITY_NAMES_TC[s.city] || s.city)),
            datasets: [{
                label: '創投年增長率 (%)',
                data: sortedByVC.map(s => s.vcGrowth),
                backgroundColor: PALETTE.yellow,
            }]
        },
        options: { ...CHART_TOOLTIP_CONFIG, plugins: { ...CHART_TOOLTIP_CONFIG.plugins, legend: { display: false } } }
    });
}

/**
 * 初始化任期圖表
 * @function initializeTenureChart
 * @param {Array} scores - 計算後的分數陣列
 */
function initializeTenureChart(scores) {
    const ctx = document.getElementById('tenureChart');
    if (!ctx) return;

    const sortedByTenure = [...scores].sort((a,b) => a.tenure - b.tenure);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedByTenure.map(s => wrapLabel(CITY_NAMES_TC[s.city] || s.city)),
            datasets: [{
                label: '平均任期 (年)',
                data: sortedByTenure.map(s => s.tenure),
                backgroundColor: PALETTE.green,
            }]
        },
        options: { ...CHART_TOOLTIP_CONFIG, plugins: { ...CHART_TOOLTIP_CONFIG.plugins, legend: { display: false } } }
    });
}

/**
 * 初始化雷達圖
 * @function initializeRadarChart
 * @param {Array} scores - 計算後的分數陣列
 */
function initializeRadarChart(scores) {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    const radarCities = ['San Francisco', 'London', 'Taipei', 'Seoul'];
    const radarData = scores.filter(s => radarCities.includes(s.city));
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['新創密度', '創投基金增長', '人才流動性'],
            datasets: radarData.map((cityData, index) => {
                const colors = [PALETTE.red, PALETTE.blue, PALETTE.yellow, PALETTE.green];
                const cityColor = colors[index % colors.length];
                
                let rgbaColor;
                if (cityColor.startsWith('#')) {
                    const r = parseInt(cityColor.slice(1, 3), 16);
                    const g = parseInt(cityColor.slice(3, 5), 16);
                    const b = parseInt(cityColor.slice(5, 7), 16);
                    rgbaColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
                } else {
                   rgbaColor = 'rgba(0, 0, 0, 0.1)'; 
                }

                return {
                    label: CITY_NAMES_TC[cityData.city] || cityData.city,
                    data: [cityData.densityScore, cityData.vcGrowthScore, cityData.fluidityScore],
                    fill: true,
                    backgroundColor: rgbaColor,
                    borderColor: cityColor,
                    pointBackgroundColor: cityColor,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                };
            })
        },
        options: {
            ...CHART_TOOLTIP_CONFIG,
            scales: {
                r: {
                    angleLines: { color: 'rgba(0,0,0,0.1)' },
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    pointLabels: { font: { size: 12, family: FONT_FAMILY } },
                    ticks: {
                        backdropColor: PALETTE.lightGray,
                        color: PALETTE.navy
                    }
                }
            }
        }
    });
}

/**
 * 初始化數據表格
 * @function initializeDataTable
 * @param {Array} scores - 計算後的分數陣列
 */
function initializeDataTable(scores) {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    scores.forEach((s, index) => {
        const rowClass = index % 2 === 0 ? 'table-row-even' : 'table-row-odd';
        const row = `
            <tr class="${rowClass}">
                <td class="p-3 font-semibold">${CITY_NAMES_TC[s.city] || s.city}</td>
                <td class="p-3 text-center">${s.density.toFixed(1)}</td>
                <td class="p-3 text-center">${s.vcGrowth.toFixed(1)}%</td>
                <td class="p-3 text-center">${s.tenure.toFixed(1)}</td>
                <td class="p-3 text-center">${(s.densityScore * 0.4).toFixed(1)}</td>
                <td class="p-3 text-center">${(s.vcGrowthScore * 0.35).toFixed(1)}</td>
                <td class="p-3 text-center">${(s.fluidityScore * 0.25).toFixed(1)}</td>
                <td class="p-3 text-center font-bold text-lg text-[#118AB2]">${s.finalScore.toFixed(1)}</td>
            </tr>`;
        tableBody.innerHTML += row;
    });
}

/**
 * 初始化所有圖表
 * @function initializeAllCharts
 */
function initializeAllCharts() {
    const scores = calculateScores();
    
    initializeRankingsChart(scores);
    initializeDensityChart(scores);
    initializeVCChart(scores);
    initializeTenureChart(scores);
    initializeRadarChart(scores);
    initializeDataTable(scores);
}

// 頁面載入完成後初始化
window.onload = function() {
    console.log('職涯速度指數分析頁面初始化開始');
    initializeAllCharts();
    console.log('職涯速度指數分析頁面初始化完成');
}; 