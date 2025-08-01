/**
 * ========================================
 * FILE: coworking-space.js
 * PURPOSE: 共享辦公空間分析頁面專用 JavaScript
 * FEATURES: KPI 顏色強制、圖表初始化、數據處理
 * AUTHOR: Voyage Compass Team
 * LAST UPDATED: 2024-12-19
 * DEPENDENCIES: Chart.js
 * ========================================
 */

/**
 * 強制 KPI 數字顏色
 * @function forceKPIColors
 */
function forceKPIColors() {
    const kpiRed = document.querySelector('.kpi-number-red');
    const kpiGreen = document.querySelector('.kpi-number-green');
    
    if (kpiRed) {
        kpiRed.style.setProperty('color', '#EF476F', 'important');
    }
    
    if (kpiGreen) {
        kpiGreen.style.setProperty('color', '#06D6A0', 'important');
    }
}

/**
 * 文字換行處理函數
 * @function wrapLabel
 * @param {string} str - 要處理的文字
 * @param {number} maxWidth - 最大寬度
 * @returns {string|Array} 處理後的文字
 */
function wrapLabel(str, maxWidth) {
    if (str.length <= maxWidth) return str;
    const words = str.split(' ');
    let lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
        if ((currentLine + " " + words[i]).length > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i]; 
        } else {
            currentLine += " " + words[i];
        }
    }
    lines.push(currentLine);
    return lines;
}

/**
 * 初始化成本比較圖表
 * @function initializeCostComparisonChart
 */
function initializeCostComparisonChart() {
    const costData = [
        { city: '東京', price: 792 },
        { city: '雪梨', price: 660 },
        { city: '新加坡', price: 590 },
        { city: '紐約', price: 510 },
        { city: '舊金山', price: 415 },
        { city: '溫哥華', price: 405 },
        { city: '倫敦', price: 375 },
        { city: '台北', price: 315 },
        { city: '曼谷', price: 220 },
        { city: '首爾', price: 180 },
    ].sort((a, b) => b.price - a.price);

    const costCtx = document.getElementById('costComparisonChart');
    if (!costCtx) return;

    new Chart(costCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: costData.map(d => wrapLabel(d.city, 16)),
            datasets: [{
                label: '專屬辦公桌平均月費 (USD)',
                data: costData.map(d => d.price),
                backgroundColor: costData.map(d => d.price > 500 ? palette.red : (d.price > 350 ? palette.yellow : palette.green)),
                borderRadius: 4,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            ...globalTooltipConfig,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    beginAtZero: true, 
                    title: { display: true, text: '平均月費 (USD)', color: palette.darkBlue },
                    ticks: { color: palette.darkBlue }
                },
                y: { ticks: { color: palette.darkBlue } }
            },
            plugins: {
                ...globalTooltipConfig.plugins,
                legend: { display: false },
                title: { display: false }
            }
        }
    });
}

/**
 * 初始化活力指數雷達圖
 * @function initializeVibrancyIndexChart
 */
function initializeVibrancyIndexChart() {
    const indexData = [
        { city: '曼谷', values: [4, 5, 5, 5], color: palette.green },
        { city: '倫敦', values: [5, 3, 5, 5], color: palette.blue },
        { city: '台北', values: [3, 4, 5, 4], color: palette.yellow },
        { city: '雪梨', values: [5, 1, 5, 3], color: palette.red },
    ];

    const vibrancyCtx = document.getElementById('vibrancyIndexChart');
    if (!vibrancyCtx) return;

    new Chart(vibrancyCtx.getContext('2d'), {
        type: 'radar',
        data: {
            labels: ['市場成熟度', '成本競爭力', '供應商多樣性', '市場趨勢'],
            datasets: indexData.map(d => ({
                label: d.city,
                data: d.values,
                fill: true,
                backgroundColor: d.color + '40',
                borderColor: d.color,
                pointBackgroundColor: d.color,
                pointBorderColor: '#fff'
            }))
        },
        options: {
            ...globalTooltipConfig,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    pointLabels: { 
                        font: { size: 12 },
                        color: palette.darkBlue
                    },
                    ticks: {
                        backdropColor: 'rgba(255, 255, 255, 0.75)',
                        stepSize: 1,
                        color: palette.darkBlue,
                        font: { size: 10 }
                    },
                    min: 0,
                    max: 5
                }
            },
            plugins: {
                ...globalTooltipConfig.plugins,
                legend: {
                    position: 'top',
                    labels: { color: palette.darkBlue }
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
    initializeCostComparisonChart();
    initializeVibrancyIndexChart();
}

// 顏色配置
const palette = {
    red: '#EF476F',
    yellow: '#FFD166',
    green: '#06D6A0',
    blue: '#118AB2',
    darkBlue: '#073B4C',
};

// 全局工具提示配置
const globalTooltipConfig = {
    plugins: {
        tooltip: {
            enabled: false
        }
    }
};

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('共享辦公空間分析頁面初始化開始');
    
    // 強制 KPI 顏色
    forceKPIColors();
    
    // 初始化圖表
    initializeAllCharts();
    
    console.log('共享辦公空間分析頁面初始化完成');
}); 