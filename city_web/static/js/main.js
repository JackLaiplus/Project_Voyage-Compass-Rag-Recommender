/**
 * ========================================
 * FILE: main.js
 * PURPOSE: Voyage Compass 專案主要 JavaScript 功能
 * FEATURES: 導航選單、響應式設計、動畫效果、數據載入
 * AUTHOR: Voyage Compass Team
 * LAST UPDATED: 2024-12-19
 * DEPENDENCIES: jQuery, Font Awesome
 * ========================================
 */

/**
 * 頁面載入完成後的初始化函數
 * 設定事件監聽器、載入初始數據、初始化組件
 * @fires DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Voyage Compass 頁面初始化開始');
    
    // 初始化導航選單
    initializeNavigation();
    
    // 載入當前城市數據
    const currentCity = getCurrentCityFromURL();
    if (currentCity) {
        loadCityData(currentCity);
    }
    
    // 初始化圖表
    initializeCharts();
    
    // 設定響應式事件
    setupResponsiveEvents();
    
    console.log('Voyage Compass 頁面初始化完成');
});

/**
 * 初始化導航選單功能
 * 包含選單切換、響應式行為、當前頁面高亮
 * @function initializeNavigation
 */
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const leftMenu = document.getElementById('leftMenu');
    const mainContent = document.getElementById('mainContent');
    
    // 選單切換功能
    if (menuToggle && leftMenu) {
        menuToggle.addEventListener('click', function() {
            leftMenu.classList.toggle('menu-collapsed');
            mainContent.classList.toggle('content-expanded');
        });
    }
    
    // 高亮當前頁面
    highlightCurrentPage();
    
    // 響應式選單行為
    setupResponsiveMenu();
}

/**
 * 從 URL 獲取當前城市識別碼
 * @function getCurrentCityFromURL
 * @returns {string|null} 城市識別碼或 null
 * @example
 * // URL: /singapore.html
 * getCurrentCityFromURL(); // 返回 "singapore"
 */
function getCurrentCityFromURL() {
    const path = window.location.pathname;
    const cityMatch = path.match(/([^\/]+)\.html$/);
    return cityMatch ? cityMatch[1] : null;
}

/**
 * 載入城市數據並更新頁面內容
 * @async
 * @function loadCityData
 * @param {string} cityId - 城市識別碼 (如: 'singapore', 'new-york')
 * @param {Object} options - 載入選項
 * @param {boolean} options.showLoading - 是否顯示載入動畫
 * @param {boolean} options.updateChart - 是否更新圖表
 * @returns {Promise<Object>} 城市數據物件
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * 
 * @example
 * // 基本用法
 * await loadCityData('singapore');
 * 
 * // 進階用法
 * await loadCityData('new-york', {
 *     showLoading: true,
 *     updateChart: false
 * });
 */
async function loadCityData(cityId, options = {}) {
    const { showLoading = true, updateChart = true } = options;
    
    try {
        // 顯示載入動畫
        if (showLoading) {
            showLoadingSpinner();
        }
        
        // 發送 API 請求
        const response = await fetch(`/api/cities/${cityId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const cityData = await response.json();
        
        // 更新頁面內容
        updateCityPageContent(cityData);
        
        // 更新圖表
        if (updateChart) {
            updateRadarChart(cityData.radar_data);
            updateSalaryChart(cityData.salary_data);
        }
        
        return cityData;
        
    } catch (error) {
        console.error('載入城市數據失敗:', error);
        showErrorMessage('無法載入城市數據，請稍後再試');
        throw error;
        
    } finally {
        // 隱藏載入動畫
        if (showLoading) {
            hideLoadingSpinner();
        }
    }
}

/**
 * 更新雷達圖數據
 * @function updateRadarChart
 * @param {Array} data - 雷達圖數據陣列
 * @param {string} data[].label - 指標標籤
 * @param {number} data[].value - 指標數值 (0-10)
 * @param {string} data[].color - 指標顏色
 */
function updateRadarChart(data) {
    // 驗證輸入數據
    if (!Array.isArray(data) || data.length === 0) {
        console.warn('雷達圖數據格式錯誤');
        return;
    }
    
    // 獲取 SVG 元素
    const svg = document.querySelector('.radar-svg');
    if (!svg) {
        console.error('找不到雷達圖 SVG 元素');
        return;
    }
    
    // 更新數據點位置
    data.forEach((item, index) => {
        const point = svg.querySelector(`.radar-dot:nth-child(${index + 1})`);
        if (point) {
            // 計算新位置
            const angle = (index * 60) * (Math.PI / 180);
            const radius = item.value * 19; // 19 = 190/10 (最大半徑/最大數值)
            const x = 200 + radius * Math.cos(angle);
            const y = 200 + radius * Math.sin(angle);
            
            // 更新位置
            point.setAttribute('cx', x);
            point.setAttribute('cy', y);
            
            // 更新顏色
            point.setAttribute('fill', item.color);
        }
    });
    
    // 更新多邊形路徑
    updateRadarPolygon(data);
}

/**
 * 設定響應式事件監聽器
 * 處理視窗大小變化、觸控事件等
 * @function setupResponsiveEvents
 */
function setupResponsiveEvents() {
    // 視窗大小變化處理
    window.addEventListener('resize', debounce(function() {
        handleWindowResize();
    }, 250));
    
    // 觸控事件處理 (行動裝置)
    if ('ontouchstart' in window) {
        setupTouchEvents();
    }
    
    // 鍵盤快捷鍵
    setupKeyboardShortcuts();
}

/**
 * 防抖函數 - 限制函數執行頻率
 * @function debounce
 * @param {Function} func - 要防抖的函數
 * @param {number} wait - 等待時間 (毫秒)
 * @returns {Function} 防抖後的函數
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 統一的錯誤處理函數
 * @function handleError
 * @param {Error} error - 錯誤物件
 * @param {string} context - 錯誤發生的上下文
 * @param {Object} options - 錯誤處理選項
 */
function handleError(error, context = 'Unknown', options = {}) {
    const { showUserMessage = true, logToConsole = true } = options;
    
    // 記錄錯誤到控制台
    if (logToConsole) {
        console.error(`[${context}] 錯誤:`, error);
        console.error('錯誤堆疊:', error.stack);
    }
    
    // 顯示用戶友好的錯誤訊息
    if (showUserMessage) {
        const message = getUserFriendlyErrorMessage(error);
        showErrorMessage(message);
    }
    
    // 發送錯誤報告到分析服務 (可選)
    if (window.analytics) {
        window.analytics.track('Error', {
            context: context,
            message: error.message,
            stack: error.stack
        });
    }
}

/**
 * 將技術錯誤轉換為用戶友好的訊息
 * @function getUserFriendlyErrorMessage
 * @param {Error} error - 原始錯誤
 * @returns {string} 用戶友好的錯誤訊息
 */
function getUserFriendlyErrorMessage(error) {
    const errorMessages = {
        'NetworkError': '網路連線失敗，請檢查您的網路連線',
        'TimeoutError': '請求超時，請稍後再試',
        'NotFoundError': '找不到請求的資料',
        'default': '發生未知錯誤，請重新整理頁面'
    };
    
    return errorMessages[error.name] || errorMessages.default;
}

/**
 * 顯示載入動畫
 * @function showLoadingSpinner
 */
function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

/**
 * 隱藏載入動畫
 * @function hideLoadingSpinner
 */
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

/**
 * 顯示錯誤訊息
 * @function showErrorMessage
 * @param {string} message - 錯誤訊息
 */
function showErrorMessage(message) {
    // 創建錯誤訊息元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // 添加到頁面
    document.body.appendChild(errorDiv);
    
    // 3秒後自動移除
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}