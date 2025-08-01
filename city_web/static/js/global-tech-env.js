/**
 * ========================================
 * FILE: global-tech-env.js
 * PURPOSE: 全球創新樞紐分析頁面專用 JavaScript
 * FEATURES: 數據表格、圖表初始化、數據處理
 * AUTHOR: Voyage Compass Team
 * LAST UPDATED: 2024-12-19
 * DEPENDENCIES: Chart.js
 * ========================================
 */

// 城市數據
const cityData = [
    { city: "舊金山", gser: 1, blink: 1, vc: 607, unicorns: 268, startups: 15030, vc_adj: 607 },
    { city: "紐約市", gser: 2, blink: 2, vc: 400, unicorns: 150, startups: 8750, vc_adj: 400 },
    { city: "倫敦", gser: 3, blink: 3, vc: 108, unicorns: 103, startups: 7567, vc_adj: 108 },
    { city: "首爾", gser: 8, blink: 20, vc: 16.5, unicorns: 32, startups: 9567, vc_adj: 16.5 },
    { city: "新加坡", gser: 9, blink: 12, vc: 86, unicorns: 34, startups: 4600, vc_adj: 86 },
    { city: "東京", gser: 11, blink: 13, vc: 130, unicorns: 12, startups: 3000, vc_adj: 130 },
    { city: "雪梨", gser: 25, blink: 21, vc: 50, unicorns: 7, startups: 2500, vc_adj: 50 },
    { city: "香港", gser: 27, blink: 37, vc: 7, unicorns: 12, startups: 856, vc_adj: 7 },
    { city: "溫哥華", gser: 36, blink: 39, vc: 22, unicorns: 1, startups: 1500, vc_adj: 22 },
    { city: "臺北", gser: 100, blink: 54, vc: 63, unicorns: 2, startups: 4694, vc_adj: 63 },
    { city: "曼谷", gser: 100, blink: 81, vc: 330, unicorns: 5, startups: 1200, vc_adj: 25 },
];

// 顏色配置
const colors = {
    blue: '#4A90E2',
    teal: '#50E3C2',
    orange: '#F5A623',
    red: '#D0021B',
    purple: '#BD10E0'
};

const colorPalette = [colors.blue, colors.teal, colors.orange, colors.red, colors.purple];

// 通用插件配置
const universalPlugins = {
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold', family: 'Noto Sans TC' },
        bodyFont: { size: 12, family: 'Noto Sans TC' },
        padding: 10,
        cornerRadius: 4,
        callbacks: { 
            title: (tooltipItems) => {
                const item = tooltipItems[0];
                let label = item.chart.data.labels[item.dataIndex];
                return Array.isArray(label) ? label.join(' ') : label;
            }
        }
    }
};

/**
 * 初始化數據表格
 * @function initializeDataTable
 */
function initializeDataTable() {
    const tableBody = document.getElementById('data-table-body');
    if (!tableBody) return;
    
    cityData.forEach(c => {
        let row = tableBody.insertRow();
        row.innerHTML = `
            <td class="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">${c.city}</td>
            <td class="py-3 px-4">${c.gser}</td>
            <td class="py-3 px-4">${c.blink}</td>
            <td class="py-3 px-4">${c.vc.toLocaleString()}</td>
            <td class="py-3 px-4">${c.unicorns}</td>
            <td class="py-3 px-4">${c.startups.toLocaleString()}</td>
        `;
    });
}

/**
 * 初始化頂級梯隊氣泡圖
 * @function initializeTopTierBubbleChart
 */
function initializeTopTierBubbleChart() {
    const ctx = document.getElementById('topTierBubbleChart');
    if (!ctx) return;
    
    const topTierCities = cityData.filter(c => ['舊金山', '紐約市', '倫敦'].includes(c.city));
    
    new Chart(ctx.getContext('2d'), {
        type: 'bubble',
        data: {
            datasets: topTierCities.map((c, i) => ({
                label: c.city,
                data: [{
                    x: c.vc_adj,
                    y: c.unicorns,
                    r: c.startups / 500 // Scale radius for visibility
                }],
                backgroundColor: colorPalette[i] + 'BF', // Add alpha
                borderColor: colorPalette[i],
                borderWidth: 2,
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                ...universalPlugins,
                legend: { display: true, position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const d = context.dataset.data[0];
                            const label = context.dataset.label || '';
                            const startups = d.r * 500;
                            return `${label}: (VC: ${d.x}億, 獨角獸: ${d.y}, 新創: ${startups})`;
                        }
                    }
                }
            },
            scales: {
                x: { title: { display: true, text: 'VC總額 (億美元)' } },
                y: { title: { display: true, text: '獨角獸數量' } }
            }
        }
    });
}

/**
 * 初始化均衡領導者長條圖
 * @function initializeBalancedLeadersBarChart
 */
function initializeBalancedLeadersBarChart() {
    const ctx = document.getElementById('balancedLeadersBarChart');
    if (!ctx) return;
    
    const balancedLeadersData = {
        labels: ['全球綜合排名', '資本規模', '獨角獸產出', '新創公司規模'],
        datasets: [
            {
                label: '舊金山',
                data: [10, 10, 10, 10], // Normalized scores out of 10
                backgroundColor: colors.blue,
            },
            {
                label: '倫敦',
                data: [9, 7, 8, 8], // Normalized scores out of 10
                backgroundColor: colors.teal,
            }
        ]
    };
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: balancedLeadersData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { ...universalPlugins, legend: { display: true, position: 'top' } },
            scales: {
                y: {
                    suggestedMax: 10,
                    title: { display: true, text: '標準化分數 (滿分10分)' }
                }
            }
        }
    });
}

/**
 * 初始化企業潛力圓餅圖
 * @function initializeCorporatePotentialChart
 */
function initializeCorporatePotentialChart() {
    const ctx = document.getElementById('corporatePotentialChart');
    if (!ctx) return;
    
    const seoul = cityData.find(c => c.city === '首爾');
    const tokyo = cityData.find(c => c.city === '東京');
    
    new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['首爾 - 新創數量', '東京 - 新創數量'],
            datasets: [{
                label: '新創數量',
                data: [seoul.startups, tokyo.startups],
                backgroundColor: [colors.blue, colors.teal],
                borderColor: '#FFFFFF',
                borderWidth: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { ...universalPlugins, legend: { display: true, position: 'bottom' } },
            cutout: '60%'
        }
    });
}

/**
 * 初始化資本效率圖表
 * @function initializeEfficiencyChart
 */
function initializeEfficiencyChart() {
    const ctx = document.getElementById('efficiencyChart');
    if (!ctx) return;
    
    const efficiencyData = cityData.map(c => ({
        city: c.city,
        value: c.unicorns > 0 ? (c.vc_adj / c.unicorns) : null
    })).filter(c => c.value !== null).sort((a, b) => a.value - b.value);
    
    // 為每個城市分配不同的顏色 - 使用更高對比度的顏色
    const cityColors = {
        '舊金山': '#FF4444',      // 鮮紅色
        '紐約市': '#00CC88',      // 翠綠色
        '倫敦': '#0066FF',        // 深藍色
        '首爾': '#FF8800',        // 橙色
        '新加坡': '#AA00FF',      // 紫色
        '東京': '#00AAAA',        // 青色
        '雪梨': '#FF0088',        // 粉紅色
        '香港': '#8800FF',        // 深紫色
        '溫哥華': '#FFAA00',      // 金黃色
        '臺北': '#00FF88',        // 亮綠色
        '曼谷': '#0088FF'         // 天藍色
    };
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: efficiencyData.map(c => c.city),
            datasets: [{
                label: '億美元 / 獨角獸',
                data: efficiencyData.map(c => c.value.toFixed(2)),
                backgroundColor: efficiencyData.map(c => cityColors[c.city] + 'CC'), // 添加透明度
                borderColor: efficiencyData.map(c => cityColors[c.city]),
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                ...universalPlugins, 
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        generateLabels: function(chart) {
                            const labels = [];
                            
                            efficiencyData.forEach((city, index) => {
                                labels.push({
                                    text: city.city,
                                    fillStyle: cityColors[city.city],
                                    strokeStyle: cityColors[city.city],
                                    lineWidth: 2,
                                    pointStyle: 'rect',
                                    hidden: false,
                                    index: index
                                });
                            });
                            
                            return labels;
                        }
                    }
                }
            },
            scales: { x: { title: { display: true, text: '億美元 (越低越好)' } } }
        }
    });
}

/**
 * 初始化漏斗散點圖
 * @function initializeFunnelScatterChart
 */
function initializeFunnelScatterChart() {
    const ctx = document.getElementById('funnelScatterChart');
    if (!ctx) return;
    
    const funnelData = cityData.filter(c => c.unicorns > 0);
    
    // 為每個城市分配不同的顏色 - 使用更高對比度的顏色
    const cityColors = {
        '舊金山': '#FF4444',      // 鮮紅色
        '紐約市': '#00CC88',      // 翠綠色
        '倫敦': '#0066FF',        // 深藍色
        '首爾': '#FF8800',        // 橙色
        '新加坡': '#AA00FF',      // 紫色
        '東京': '#00AAAA',        // 青色
        '雪梨': '#FF0088',        // 粉紅色
        '香港': '#8800FF',        // 深紫色
        '溫哥華': '#FFAA00',      // 金黃色
        '臺北': '#00FF88',        // 亮綠色
        '曼谷': '#0088FF'         // 天藍色
    };
    
    // 計算基於 VC 總額的點大小 (8-20 範圍)
    const maxVC = Math.max(...funnelData.map(c => c.vc_adj));
    const minVC = Math.min(...funnelData.map(c => c.vc_adj));
    
    new Chart(ctx.getContext('2d'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: '創新生態系統',
                data: funnelData.map(c => ({ 
                    x: c.startups, 
                    y: c.unicorns, 
                    label: c.city,
                    vc: c.vc_adj
                })),
                backgroundColor: funnelData.map(c => cityColors[c.city] + 'CC'), // 添加透明度
                borderColor: funnelData.map(c => cityColors[c.city]),
                borderWidth: 2,
                pointRadius: funnelData.map(c => {
                    // 基於 VC 總額計算點大小
                    const normalizedVC = (c.vc_adj - minVC) / (maxVC - minVC);
                    return 8 + (normalizedVC * 12); // 8-20 範圍
                }),
                pointHoverRadius: funnelData.map(c => {
                    const normalizedVC = (c.vc_adj - minVC) / (maxVC - minVC);
                    return 10 + (normalizedVC * 15); // 10-25 範圍
                })
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                ...universalPlugins,
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        generateLabels: function(chart) {
                            const datasets = chart.data.datasets;
                            const labels = [];
                            
                            funnelData.forEach((city, index) => {
                                labels.push({
                                    text: city.city,
                                    fillStyle: cityColors[city.city],
                                    strokeStyle: cityColors[city.city],
                                    lineWidth: 2,
                                    pointStyle: 'circle',
                                    hidden: false,
                                    index: index
                                });
                            });
                            
                            return labels;
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const item = tooltipItems[0];
                            return item.raw.label;
                        },
                        label: function(context) {
                            const d = context.raw;
                            return [
                                `新創公司: ${d.x.toLocaleString()}`,
                                `獨角獸: ${d.y}`,
                                `VC總額: ${d.vc}億美元`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'logarithmic',
                    title: { display: true, text: '新創公司總數 (對數刻度)' }
                },
                y: {
                    type: 'logarithmic',
                    title: { display: true, text: '獨角獸數量 (對數刻度)' }
                }
            }
        }
    });
}

/**
 * 初始化所有圖表
 * @function initializeAllCharts
 */
function initializeAllCharts() {
    initializeDataTable();
    initializeTopTierBubbleChart();
    initializeBalancedLeadersBarChart();
    initializeCorporatePotentialChart();
    initializeEfficiencyChart();
    initializeFunnelScatterChart();
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('全球創新樞紐分析頁面初始化開始');
    initializeAllCharts();
    console.log('全球創新樞紐分析頁面初始化完成');
}); 