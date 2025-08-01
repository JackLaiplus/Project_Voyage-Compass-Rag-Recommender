/**
 * ========================================
 * FILE: rent-comparison.js
 * PURPOSE: 全球租賃市場比較頁面專用 JavaScript
 * FEATURES: 數據處理、圖表渲染、互動高亮
 * AUTHOR: Voyage Compass Team
 * LAST UPDATED: 2024-12-19
 * DEPENDENCIES: Chart.js, Boxplot Plugin
 * ========================================
 */

// 全域變數
let chartInstances = {};
let cityDataStore = {};
let sortedDataCache = {};
let initialChartConfigs = {};

// 城市名稱映射
const cityFullNames = {
    nyc: '紐約', sfo: '舊金山', lon: '倫敦', sgp: '新加坡',
    hkg: '香港', syd: '雪梨', yvr: '溫哥華', sel: '首爾',
    tyo: '東京', bkk: '曼谷', tpe: '台北'
};

// 顏色配置
const colors = ['#3b82f6', '#f97316', '#ef4444', '#14b8a6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#78716c', '#f472b6', '#64748b'];

/**
 * 生成模擬數據
 * @function generateMockData
 * @returns {string} CSV 格式的數據字符串
 */
function generateMockData() {
    const csvData = `city_id,property_id,year,month,date,monthly_rent,price_per_sqm,currency,rate,monthly_rent_usd,price_per_sqm_usd
${[...Array(21010)].map((_, i) => {
    const cities = ['nyc', 'sfo', 'lon', 'sgp', 'hkg', 'syd', 'yvr', 'sel', 'tyo', 'bkk', 'tpe'];
    const city = cities[i % cities.length];
    let rent, sqm, rate, currency;
    
    switch(city) {
        case 'nyc': rent = 2000 + Math.random() * 4000; sqm = 40 + Math.random() * 60; rate = 1; currency = 'USD'; break;
        case 'sfo': rent = 2500 + Math.random() * 4500; sqm = 45 + Math.random() * 65; rate = 1; currency = 'USD'; break;
        case 'lon': rent = 1800 + Math.random() * 3500; sqm = 50 + Math.random() * 70; rate = 1.27; currency = 'GBP'; break;
        case 'sgp': rent = 2500 + Math.random() * 5000; sqm = 20 + Math.random() * 40; rate = 0.74; currency = 'SGD'; break;
        case 'hkg': rent = 15000 + Math.random() * 30000; sqm = 100 + Math.random() * 200; rate = 0.13; currency = 'HKD'; break;
        case 'syd': rent = 2000 + Math.random() * 3000; sqm = 15 + Math.random() * 35; rate = 0.67; currency = 'AUD'; break;
        case 'yvr': rent = 1800 + Math.random() * 2800; sqm = 20 + Math.random() * 40; rate = 0.73; currency = 'CAD'; break;
        case 'sel': rent = 800000 + Math.random() * 2000000; sqm = 20000 + Math.random() * 40000; rate = 0.00072; currency = 'KRW'; break;
        case 'tyo': rent = 100000 + Math.random() * 300000; sqm = 2000 + Math.random() * 5000; rate = 0.0063; currency = 'JPY'; break;
        case 'bkk': rent = 15000 + Math.random() * 40000; sqm = 400 + Math.random() * 800; rate = 0.027; currency = 'THB'; break;
        case 'tpe': rent = 20000 + Math.random() * 50000; sqm = 600 + Math.random() * 1200; rate = 0.031; currency = 'TWD'; break;
    }
    
    const rent_usd = rent * rate;
    const sqm_usd = sqm * rate;
    return `${city},prop_${i},2025,7,1,${rent.toFixed(2)},${sqm.toFixed(2)},${currency},${rate},${rent_usd.toFixed(2)},${sqm_usd.toFixed(2)}`;
}).join('\n')}`;

    return csvData;
}

/**
 * 解析 CSV 數據
 * @function parseCSVData
 * @param {string} csvData - CSV 格式的數據字符串
 * @returns {Array} 解析後的數據陣列
 */
function parseCSVData(csvData) {
    const rows = csvData.trim().split('\n');
    const headers = rows.shift().split(',');
    
    return rows.map(row => {
        if (!row || row.trim() === '') return null;
        const values = row.split(',');
        if (values.length !== headers.length) return null;
        
        return headers.reduce((obj, header, index) => {
            const val = values[index];
            obj[header.trim()] = !isNaN(parseFloat(val)) && isFinite(val) ? parseFloat(val) : val;
            return obj;
        }, {});
    }).filter(Boolean);
}

/**
 * 計算統計數據
 * @function calculateStats
 * @param {Array} arr - 數值陣列
 * @returns {Object} 統計結果物件
 */
function calculateStats(arr) {
    if (arr.length === 0) return { mean: 0, median: 0, q1: 0, q3: 0, iqr: 0, min: 0, max: 0 };
    
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor(sorted.length * 3 / 4)];
    
    return {
        mean: arr.reduce((a, b) => a + b, 0) / arr.length,
        median: sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
        q1: q1,
        q3: q3,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        iqr: q3 - q1
    };
}

/**
 * 處理數據並渲染所有圖表
 * @function processAndRender
 */
function processAndRender() {
    const csvData = generateMockData();
    const data = parseCSVData(csvData);

    // 聚合數據
    const groupedByCity = data.reduce((acc, item) => {
        if (!item.city_id || !cityFullNames[item.city_id]) return acc;
        if (!acc[item.city_id]) acc[item.city_id] = { rents: [], sqmPrices: [] };
        
        if (item.monthly_rent_usd !== undefined && !isNaN(item.monthly_rent_usd)) {
            acc[item.city_id].rents.push(item.monthly_rent_usd);
        }
        if (item.price_per_sqm_usd !== undefined && !isNaN(item.price_per_sqm_usd)) {
            acc[item.city_id].sqmPrices.push(item.price_per_sqm_usd);
        }
        return acc;
    }, {});

    // 計算城市統計數據
    cityDataStore.cityStats = Object.keys(groupedByCity).reduce((acc, city) => {
        acc[city] = {
            rentStats: calculateStats(groupedByCity[city].rents),
            sqmPriceStats: calculateStats(groupedByCity[city].sqmPrices),
            allRents: groupedByCity[city].rents,
            id: city,
            fullName: cityFullNames[city] || city
        };
        return acc;
    }, {});
    
    cityDataStore.totalProperties = data.length;
    
    // 渲染所有圖表
    renderAllCharts();
}

/**
 * 從標籤獲取城市 ID
 * @function getCityIdFromLabel
 * @param {string} label - 城市標籤
 * @returns {string|null} 城市 ID
 */
function getCityIdFromLabel(label) {
    for (const id in cityFullNames) {
        if (cityFullNames[id] === label) {
            return id;
        }
    }
    return null;
}

/**
 * 處理圖表高亮
 * @function handleHighlight
 * @param {string} cityId - 城市 ID
 */
function handleHighlight(cityId) {
    if (!cityId) {
        resetHighlight();
        return;
    }

    Object.values(chartInstances).forEach(chart => {
        const chartId = chart.canvas.id;
        const initialConfig = initialChartConfigs[chartId];
        
        if (chartId === 'scatterPlot') {
            chart.data.datasets.forEach((dataset, i) => {
                const currentCityId = Object.keys(cityDataStore.cityStats).find(key => 
                    cityDataStore.cityStats[key].fullName === dataset.label
                );
                dataset.backgroundColor = currentCityId === cityId ? initialConfig.colors[i] : `${initialConfig.colors[i]}33`;
                dataset.pointRadius = currentCityId === cityId ? 15 : 10;
            });
        } else {
            const cityLabels = chart.data.labels;
            const highlightColors = cityLabels.map(label => {
                const currentCityId = getCityIdFromLabel(label);
                return currentCityId === cityId ? initialConfig.bgColors[cityLabels.indexOf(label)] : `${initialConfig.bgColors[cityLabels.indexOf(label)]}33`;
            });
            const highlightBorders = cityLabels.map(label => {
                const currentCityId = getCityIdFromLabel(label);
                return currentCityId === cityId ? initialConfig.borderColors[cityLabels.indexOf(label)] : `${initialConfig.borderColors[cityLabels.indexOf(label)]}33`;
            });

            chart.data.datasets[0].backgroundColor = highlightColors;
            chart.data.datasets[0].borderColor = highlightBorders;
        }
        chart.update('none');
    });
}

/**
 * 重置高亮效果
 * @function resetHighlight
 */
function resetHighlight() {
    Object.values(chartInstances).forEach(chart => {
        const chartId = chart.canvas.id;
        const initialConfig = initialChartConfigs[chartId];
        
        if (chartId === 'scatterPlot') {
            chart.data.datasets.forEach((dataset, i) => {
                dataset.backgroundColor = initialConfig.colors[i];
                dataset.pointRadius = 10;
            });
        } else {
            chart.data.datasets[0].backgroundColor = initialConfig.bgColors;
            chart.data.datasets[0].borderColor = initialConfig.borderColors;
        }
        chart.update('none');
    });
}

/**
 * 創建長條圖
 * @function createBarChart
 * @param {string} canvasId - Canvas 元素 ID
 * @param {Object} data - 數據物件
 * @param {string} label - 圖表標籤
 * @param {string} valueKey - 數值鍵名
 * @param {string} sortOrder - 排序順序
 */
function createBarChart(canvasId, data, label, valueKey, sortOrder = 'desc') {
    const sortedData = Object.values(data)
        .sort((a, b) => (sortOrder === 'desc' ? b[valueKey].mean - a[valueKey].mean : a[valueKey].mean - b[valueKey].mean));
    sortedDataCache[canvasId] = sortedData;
    
    const cityIds = Object.keys(data);
    const cityColors = cityIds.reduce((acc, id, i) => ({...acc, [id]: colors[i % colors.length]}), {});
    
    const config = {
        type: 'bar',
        data: {
            labels: sortedData.map(d => d.fullName),
            datasets: [{
                label: label,
                data: sortedData.map(d => d[valueKey].mean),
                backgroundColor: sortedData.map(d => cityColors[d.id]),
                borderColor: sortedData.map(d => cityColors[d.id]),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
                x: { title: { display: true, text: label }, beginAtZero: true },
                y: { grid: { display: false } }
            },
            onHover: (event, chartElement) => {
                if (chartElement.length > 0) {
                    const cityId = sortedDataCache[canvasId][chartElement[0].index].id;
                    handleHighlight(cityId);
                }
            }
        }
    };
    
    const ctx = document.getElementById(canvasId);
    chartInstances[canvasId] = new Chart(ctx, config);
    ctx.onmouseleave = resetHighlight;
    initialChartConfigs[canvasId] = {
        bgColors: [...config.data.datasets[0].backgroundColor],
        borderColors: [...config.data.datasets[0].borderColor]
    };
}

/**
 * 渲染所有圖表
 * @function renderAllCharts
 */
function renderAllCharts() {
    const { cityStats, totalProperties } = cityDataStore;
    if (!cityStats || Object.keys(cityStats).length === 0) {
        console.log("沒有數據可供渲染。");
        return;
    }
    
    const cityIds = Object.keys(cityStats);
    const cityColors = cityIds.reduce((acc, id, i) => ({...acc, [id]: colors[i % colors.length]}), {});

    updateDashboard(cityStats, totalProperties);
    
    // 創建長條圖
    createBarChart('monthlyRentChart', cityStats, '平均月租金 (USD)', 'rentStats');
    createBarChart('pricePerSqmChart', cityStats, '每平方米平均租金 (USD)', 'sqmPriceStats');

    // 創建箱形圖
    const boxplotData = {
        labels: cityIds.map(id => cityStats[id].fullName),
        datasets: [{
            label: '月租金分佈 (USD)',
            data: cityIds.map(id => cityStats[id].allRents),
            backgroundColor: cityIds.map(id => `${cityColors[id]}33`),
            borderColor: cityIds.map(id => cityColors[id]),
            borderWidth: 2,
            itemRadius: 0
        }]
    };
    
    const boxCtx = document.getElementById('distributionChart');
    chartInstances['distributionChart'] = new Chart(boxCtx, {
        type: 'boxplot',
        data: boxplotData,
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
                y: { 
                    title: { display: true, text: '月租金 (USD) - 對數標尺' }, 
                    type: 'logarithmic' 
                } 
            },
            onHover: (event, chartElement) => {
                if (chartElement.length > 0) {
                    const cityId = cityIds[chartElement[0].index];
                    handleHighlight(cityId);
                }
            }
        }
    });
    
    boxCtx.onmouseleave = resetHighlight;
    initialChartConfigs['distributionChart'] = {
        bgColors: [...boxplotData.datasets[0].backgroundColor],
        borderColors: [...boxplotData.datasets[0].borderColor]
    };

    // 創建散點圖
    const scatterDatasets = cityIds.map(id => ({
        label: cityStats[id].fullName,
        data: [{ x: cityStats[id].rentStats.mean, y: cityStats[id].sqmPriceStats.mean }],
        backgroundColor: cityColors[id],
        pointRadius: 10,
        pointHoverRadius: 15,
        cityId: id
    }));
    
    const totalAvgRent = cityIds.reduce((sum, id) => sum + cityStats[id].rentStats.mean, 0) / cityIds.length;
    const totalAvgSqmPrice = cityIds.reduce((sum, id) => sum + cityStats[id].sqmPriceStats.mean, 0) / cityIds.length;
    
    const scatterCtx = document.getElementById('scatterPlot');
    chartInstances['scatterPlot'] = new Chart(scatterCtx, {
        type: 'scatter',
        data: { datasets: scatterDatasets },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true } },
                tooltip: { 
                    callbacks: { 
                        label: ctx => `${ctx.dataset.label}: (月租: $${ctx.parsed.x.toFixed(0)}, 每平米: $${ctx.parsed.y.toFixed(2)})`
                    }
                }
            },
            scales: { 
                x: { title: { display: true, text: '平均月租金 (USD)' } }, 
                y: { title: { display: true, text: '每平方米平均租金 (USD)' } } 
            },
            onHover: (event, chartElement) => {
                if (chartElement.length > 0) {
                    const cityId = chartInstances.scatterPlot.data.datasets[chartElement[0].datasetIndex].cityId;
                    handleHighlight(cityId);
                }
            }
        },
        plugins: [{
            id: 'quadrantLines',
            afterDraw: chart => {
                const ctx = chart.ctx;
                const xAxis = chart.scales.x;
                const yAxis = chart.scales.y;
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.moveTo(xAxis.getPixelForValue(totalAvgRent), yAxis.top);
                ctx.lineTo(xAxis.getPixelForValue(totalAvgRent), yAxis.bottom);
                ctx.moveTo(xAxis.left, yAxis.getPixelForValue(totalAvgSqmPrice));
                ctx.lineTo(xAxis.right, yAxis.getPixelForValue(totalAvgSqmPrice));
                ctx.stroke();
                ctx.restore();
            }
        }]
    });
    
    scatterCtx.onmouseleave = resetHighlight;
    initialChartConfigs['scatterPlot'] = {
        colors: scatterDatasets.map(ds => ds.backgroundColor)
    };
}

/**
 * 更新儀表板數據
 * @function updateDashboard
 * @param {Object} cityStats - 城市統計數據
 * @param {number} totalProperties - 總房源數量
 */
function updateDashboard(cityStats, totalProperties) {
    const cityIds = Object.keys(cityStats);
    document.getElementById('total-properties').textContent = totalProperties.toLocaleString();
    document.getElementById('city-count').textContent = cityIds.length;
    
    const formatCurrency = value => value.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD', 
        maximumFractionDigits: 0 
    });
    
    const mostExpensiveId = cityIds.reduce((a, b) => 
        cityStats[a].rentStats.mean > cityStats[b].rentStats.mean ? a : b
    );
    document.getElementById('most-expensive-city').textContent = cityFullNames[mostExpensiveId];
    document.getElementById('most-expensive-city').title = `平均月租: ${formatCurrency(cityStats[mostExpensiveId].rentStats.mean)}`;

    const bestValueId = cityIds.reduce((a, b) => 
        cityStats[a].sqmPriceStats.mean < cityStats[b].sqmPriceStats.mean ? a : b
    );
    document.getElementById('best-value-city').textContent = cityFullNames[bestValueId];
    document.getElementById('best-value-city').title = `平均每平米租金: ${formatCurrency(cityStats[bestValueId].sqmPriceStats.mean)}`;
    
    const mostVolatileId = cityIds.reduce((a, b) => 
        cityStats[a].rentStats.iqr > cityStats[b].rentStats.iqr ? a : b
    );
    document.getElementById('most-volatile-city').textContent = cityFullNames[mostVolatileId];
    document.getElementById('most-volatile-city').title = `租金四分位距 (IQR): ${formatCurrency(cityStats[mostVolatileId].rentStats.iqr)}`;
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('全球租賃市場比較頁面初始化開始');
    processAndRender();
    console.log('全球租賃市場比較頁面初始化完成');
}); 