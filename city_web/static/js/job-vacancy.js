/**
 * ========================================
 * FILE: job-vacancy.js
 * PURPOSE: 全球科技業就業市場儀表板專用 JavaScript
 * FEATURES: 數據處理、圖表初始化、城市切換
 * AUTHOR: Voyage Compass Team
 * LAST UPDATED: 2024-12-19
 * DEPENDENCIES: Chart.js
 * ========================================
 */

// 職缺機會數據
const jobOpportunitiesData = [
    { "排名": 1, "城市": "Seoul", "城市代碼": "SEL", "總共有職位": 1422, "Junior職位": 785, "Mid職位": 331, "Senior職位": 306, "Junior比例": 55.2, "求職建議": "首爾的科技業正經歷爆炸性成長，政府大力推動數位新政，創造大量就業機會。對於初階人才來說，這裡是絕佳的起點，特別是在由大型國際企業主導的研發中心。" },
    { "排名": 2, "城市": "Tokyo", "城市代碼": "TYO", "總共有職位": 1500, "Junior職位": 798, "Mid職位": 358, "Senior職位": 344, "Junior比例": 53.2, "求職建議": "東京因人口結構挑戰導致科技人才嚴重短缺，迫使企業（包括傳統大公司）積極招聘和培養初階工程師。國際人才在此有很好的發展機會。" },
    { "排名": 3, "城市": "Bangkok", "城市代碼": "BKK", "總共有職位": 1660, "Junior職位": 844, "Mid職位": 372, "Senior職位": 444, "Junior比例": 50.8, "求職建議": "在「泰國4.0」政策推動下，曼谷的數位經濟發展迅速，創業生態蓬勃。市場對新鮮血液的需求極大，是初階人才投入東南亞市場的理想切入點。" },
    { "排名": 4, "城市": "Taipei", "城市代碼": "TPE", "總共有職位": 1040, "Junior職位": 419, "Mid職位": 237, "Senior職位": 384, "Junior比例": 40.3, "求職建議": "台北擁有充滿活力的創業文化和政府支持，市場由中小型企業主導。這些成長型公司更願意招聘和培養初階人才，提供了豐富的學習和成長機會。" },
    { "排名": 5, "城市": "Hong Kong", "城市代碼": "HKG", "總共有職位": 996, "Junior職位": 302, "Mid職位": 198, "Senior職位": 496, "Junior比例": 30.3, "求職建議": "香港作為國際金融中心，科技業與金融結合緊密。雖然市場相對成熟，但仍為初階人才提供了一定的機會，特別是在金融科技領域。" },
    { "排名": 6, "城市": "Singapore", "城市代碼": "SGP", "總共有職位": 1077, "Junior職位": 326, "Mid職位": 213, "Senior職位": 538, "Junior比例": 30.3, "求職建議": "新加坡是亞洲的科技樞紐，擁有穩定的經濟和大量的跨國公司。市場競爭激烈，但對於有潛力的初階人才，仍有不錯的發展空間。" },
    { "排名": 7, "城市": "London", "城市代碼": "LON", "總共有職位": 1140, "Junior職位": 312, "Mid職位": 188, "Senior職位": 640, "Junior比例": 27.4, "求職建議": "倫敦是全球頂尖的科技中心，市場成熟且高度專業化，尤其在金融科技和AI領域。對高階人才需求旺盛，初階職位競爭激烈，需要展現出色的潛力。" },
    { "排名": 8, "城市": "New York", "城市代碼": "NYC", "總共有職位": 1139, "Junior職位": 293, "Mid職位": 198, "Senior職位": 648, "Junior比例": 25.7, "求職建議": "紐約的科技深度融入金融、媒體等成熟產業，對能處理複雜系統的資深專家需求巨大。初階職位機會相對較少，競爭者眾多。" },
    { "排名": 9, "城市": "Vancouver", "城市代碼": "YVR", "總共有職位": 1038, "Junior職位": 249, "Mid職位": 222, "Senior職位": 567, "Junior比例": 24.0, "求職建議": "溫哥華擁有均衡的科技生態，但市場更偏向於有經驗的專業人士。初階求職者需要有亮眼的專案或實習經歷才能脫穎而出。" },
    { "排名": 10, "城市": "San Francisco", "城市代碼": "SFO", "總共有職位": 1083, "Junior職位": 222, "Mid職位": 248, "Senior職位": 613, "Junior比例": 20.5, "求職建議": "舊金山是全球科技業的聖地，市場高度飽和且極度專業化。公司傾向於招聘有實戰經驗的工程師，初階職位門檻非常高，是資深專家的戰場。" },
    { "排名": 11, "城市": "Sydney", "城市代碼": "SYD", "總共有職位": 1022, "Junior職位": 198, "Mid職位": 234, "Senior職位": 590, "Junior比例": 19.4, "求職建議": "雪梨的市場結構與其他西方成熟市場相似，對高階人才有較大需求。初階職位的機會相對有限，求職者需要做好充分準備。" }
];

// 公司摘要數據
const companySummaryData = [
    { "city_id": "bkk", "year": 2025, "micro": 11, "small": 56, "medium": 326, "large": 167, "extra": 156, "local": 80, "international": 636, "total": 716 },
    { "city_id": "hkg", "year": 2025, "micro": 22, "small": 68, "medium": 153, "large": 68, "extra": 47, "local": 191, "international": 167, "total": 358 },
    { "city_id": "lon", "year": 2025, "micro": 8, "small": 48, "medium": 279, "large": 132, "extra": 119, "local": 313, "international": 273, "total": 586 },
    { "city_id": "nyc", "year": 2025, "micro": 4, "small": 47, "medium": 246, "large": 118, "extra": 103, "local": 445, "international": 73, "total": 518 },
    { "city_id": "sel", "year": 2025, "micro": 5, "small": 54, "medium": 283, "large": 165, "extra": 152, "local": 34, "international": 625, "total": 659 },
    { "city_id": "sfo", "year": 2025, "micro": 11, "small": 43, "medium": 189, "large": 110, "extra": 86, "local": 379, "international": 60, "total": 439 },
    { "city_id": "sgp", "year": 2025, "micro": 1, "small": 58, "medium": 119, "large": 78, "extra": 95, "local": 194, "international": 157, "total": 351 },
    { "city_id": "syd", "year": 2025, "micro": 1, "small": 41, "medium": 153, "large": 95, "extra": 76, "local": 218, "international": 148, "total": 366 },
    { "city_id": "tpe", "year": 2025, "micro": 13, "small": 197, "medium": 295, "large": 56, "extra": 15, "local": 549, "international": 27, "total": 576 },
    { "city_id": "tyo", "year": 2025, "micro": 1, "small": 71, "medium": 336, "large": 168, "extra": 133, "local": 121, "international": 588, "total": 709 },
    { "city_id": "yvr", "year": 2025, "micro": 13, "small": 48, "medium": 156, "large": 101, "extra": 84, "local": 299, "international": 103, "total": 402 }
];

// 城市名稱對照表
const cityFullName = {
    "NYC": "New York", "SFO": "San Francisco", "LON": "London", "SGP": "Singapore",
    "HKG": "Hong Kong", "SYD": "Sydney", "YVR": "Vancouver", "SEL": "Seoul",
    "TYO": "Tokyo", "BKK": "Bangkok", "TPE": "Taipei"
};

const cityChineseName = {
    "NYC": "紐約", "SFO": "舊金山", "LON": "倫敦", "SGP": "新加坡",
    "HKG": "香港", "SYD": "雪梨", "YVR": "溫哥華", "SEL": "首爾",
    "TYO": "東京", "BKK": "曼谷", "TPE": "台北"
};

// 合併數據
const mergedData = jobOpportunitiesData.map(job => {
    const companyData = companySummaryData.find(c => c.city_id.toUpperCase() === job.城市代碼);
    return { ...job, ...companyData };
});

// 圖表實例變數
let juniorRatioChart, seniorityChart, companySizeChart, companyOriginChart;

// 顏色配置
const chartColors = {
    blue: 'rgba(59, 130, 246, 0.7)',
    sky: 'rgba(14, 165, 233, 0.7)',
    cyan: 'rgba(6, 182, 212, 0.7)',
    teal: 'rgba(20, 184, 166, 0.7)',
    emerald: 'rgba(16, 185, 129, 0.7)',
    green: 'rgba(34, 197, 94, 0.7)',
    slate: 'rgba(100, 116, 139, 0.7)',
    indigo: 'rgba(99, 102, 241, 0.7)',
    purple: 'rgba(139, 92, 246, 0.7)',
    rose: 'rgba(244, 63, 94, 0.7)',
};

const chartHoverColors = {
    blue: 'rgba(59, 130, 246, 1)',
    sky: 'rgba(14, 165, 233, 1)',
    cyan: 'rgba(6, 182, 212, 1)',
    teal: 'rgba(20, 184, 166, 1)',
    emerald: 'rgba(16, 185, 129, 1)',
    green: 'rgba(34, 197, 94, 1)',
    slate: 'rgba(100, 116, 139, 1)',
    indigo: 'rgba(99, 102, 241, 1)',
    purple: 'rgba(139, 92, 246, 1)',
    rose: 'rgba(244, 63, 94, 1)',
};

/**
 * 填充城市選擇下拉選單
 * @function populateSelect
 */
function populateSelect() {
    const citySelect = document.getElementById('city-select');
    mergedData.forEach(city => {
        const option = document.createElement('option');
        option.value = city.城市代碼;
        option.textContent = cityChineseName[city.城市代碼] || city.城市;
        citySelect.appendChild(option);
    });
}

/**
 * 渲染全球總覽
 * @function renderGlobalView
 */
function renderGlobalView() {
    const sortedData = [...jobOpportunitiesData].sort((a, b) => b.Junior比例 - a.Junior比例);
    
    createJuniorRatioChart(sortedData);
    populateGlobalTable(sortedData);
}

/**
 * 填充全球表格
 * @function populateGlobalTable
 * @param {Array} data - 排序後的數據
 */
function populateGlobalTable(data) {
    const tableBody = document.getElementById('global-table-body');
    tableBody.innerHTML = '';
    data.forEach(city => {
        const row = `
            <tr class="hover:bg-slate-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">${city.排名}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">${cityChineseName[city.城市代碼] || city.城市}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${city.總共有職位.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${city.Junior職位.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${city.Mid職位.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${city.Senior職位.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-sky-600">${city.Junior比例}%</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

/**
 * 渲染城市詳細視圖
 * @function renderCityView
 * @param {string} cityCode - 城市代碼
 */
function renderCityView(cityCode) {
    const data = mergedData.find(c => c.城市代碼 === cityCode);
    if (!data) return;

    document.getElementById('city-name-header').textContent = `${cityChineseName[data.城市代碼] || data.城市} - 詳細數據`;
    document.getElementById('total-jobs').textContent = data.總共有職位.toLocaleString();
    document.getElementById('junior-jobs').textContent = data.Junior職位.toLocaleString();
    document.getElementById('mid-jobs').textContent = data.Mid職位.toLocaleString();
    document.getElementById('senior-jobs').textContent = data.Senior職位.toLocaleString();
    document.getElementById('job-advice').textContent = data.求職建議;

    createOrUpdateSeniorityChart(data);
    createOrUpdateCompanySizeChart(data);
    createOrUpdateCompanyOriginChart(data);
}

/**
 * 創建 Junior 比例圖表
 * @function createJuniorRatioChart
 * @param {Array} data - 圖表數據
 */
function createJuniorRatioChart(data) {
    const ctx = document.getElementById('juniorRatioChart').getContext('2d');
    if (juniorRatioChart) {
        juniorRatioChart.destroy();
    }
    juniorRatioChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(c => cityChineseName[c.城市代碼] || c.城市),
            datasets: [{
                label: 'Junior 職位比例 (%)',
                data: data.map(c => c.Junior比例),
                backgroundColor: chartColors.sky,
                borderColor: chartHoverColors.sky,
                borderWidth: 1,
                borderRadius: 4,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '比例 (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 創建或更新職位層級圖表
 * @function createOrUpdateSeniorityChart
 * @param {Object} data - 城市數據
 */
function createOrUpdateSeniorityChart(data) {
    const ctx = document.getElementById('seniorityChart').getContext('2d');
    const chartData = {
        labels: ['Junior', 'Mid-level', 'Senior'],
        datasets: [{
            label: '職位層級',
            data: [data.Junior職位, data.Mid職位, data.Senior職位],
            backgroundColor: [chartColors.sky, chartColors.teal, chartColors.indigo],
            hoverBackgroundColor: [chartHoverColors.sky, chartHoverColors.teal, chartHoverColors.indigo],
            borderColor: '#ffffff',
            borderWidth: 2,
        }]
    };

    if (seniorityChart) {
        seniorityChart.data = chartData;
        seniorityChart.update();
    } else {
        seniorityChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        });
    }
}

/**
 * 創建或更新公司規模圖表
 * @function createOrUpdateCompanySizeChart
 * @param {Object} data - 城市數據
 */
function createOrUpdateCompanySizeChart(data) {
    const ctx = document.getElementById('companySizeChart').getContext('2d');
    const chartData = {
        labels: ['微型 (<10)', '小型 (10-49)', '中型 (50-249)', '大型 (250-999)', '巨型 (1000+)'],
        datasets: [{
            label: '公司數量',
            data: [data.micro, data.small, data.medium, data.large, data.extra],
            backgroundColor: [chartColors.sky, chartColors.cyan, chartColors.teal, chartColors.emerald, chartColors.green],
            hoverBackgroundColor: [chartHoverColors.sky, chartHoverColors.cyan, chartHoverColors.teal, chartHoverColors.emerald, chartHoverColors.green],
            borderColor: '#ffffff',
            borderWidth: 1,
            borderRadius: 4,
        }]
    };

    if (companySizeChart) {
        companySizeChart.data = chartData;
        companySizeChart.update();
    } else {
        companySizeChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: '公司數量' }
                    }
                }
            }
        });
    }
}

/**
 * 創建或更新公司來源圖表
 * @function createOrUpdateCompanyOriginChart
 * @param {Object} data - 城市數據
 */
function createOrUpdateCompanyOriginChart(data) {
    const ctx = document.getElementById('companyOriginChart').getContext('2d');
    const chartData = {
        labels: ['本地公司', '國際公司'],
        datasets: [{
            label: '公司來源',
            data: [data.local, data.international],
            backgroundColor: [chartColors.purple, chartColors.rose],
            hoverBackgroundColor: [chartHoverColors.purple, chartHoverColors.rose],
            borderColor: '#ffffff',
            borderWidth: 2,
        }]
    };
     if (companyOriginChart) {
        companyOriginChart.data = chartData;
        companyOriginChart.update();
    } else {
        companyOriginChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        });
    }
}

/**
 * 初始化頁面
 * @function initializePage
 */
function initializePage() {
    console.log('全球科技業就業市場儀表板初始化開始');
    
    populateSelect();
    renderGlobalView();

    // 添加城市選擇事件監聽器
    const citySelect = document.getElementById('city-select');
    const globalView = document.getElementById('global-view');
    const cityView = document.getElementById('city-view');

    citySelect.addEventListener('change', (e) => {
        const selectedCityCode = e.target.value;
        if (selectedCityCode === 'all') {
            globalView.style.display = 'block';
            cityView.style.display = 'none';
        } else {
            globalView.style.display = 'none';
            cityView.style.display = 'block';
            renderCityView(selectedCityCode);
        }
    });

    console.log('全球科技業就業市場儀表板初始化完成');
}

// 頁面載入完成後初始化
window.onload = function() {
    initializePage();
}; 