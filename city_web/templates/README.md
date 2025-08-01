# Voyage Compass 專案說明書與使用手冊

## 📋 目錄
1. [專案概述](#專案概述)
2. [技術架構](#技術架構)
3. [目錄結構](#目錄結構)
4. [頁面功能說明](#頁面功能說明)
5. [API 整合指南](#api-整合指南)
6. [部署說明](#部署說明)
7. [開發指南](#開發指南)
8. [程式碼註解指南](#程式碼註解指南)

---

## 🎯 專案概述

### 專案名稱
**Voyage Compass - 跨國職涯導航儀**

### 專案目標
為想出國工作的專業人士提供城市選擇指南，透過角色情境分析、城市比較、薪資支出計算等功能，協助用戶做出最佳職涯決策。

### 核心功能
- **角色情境分析**：4種不同職涯發展模式
- **城市探索**：10個主要國際城市詳細資訊
- **視覺化數據**：雷達圖、薪資比較、生活成本分析
- **響應式設計**：支援桌面與行動裝置

---

## 🏗️ 技術架構

### 前端技術
- **HTML5**：語義化標籤，無障礙設計
- **CSS3**：Flexbox/Grid 佈局，響應式設計
- **JavaScript (ES6+)**：動態內容載入，隨機圖片顯示
- **Font Awesome**：圖示庫
- **Tailwind CSS**：實用優先的 CSS 框架

### 設計特色
- **左側導航選單**：固定式側邊欄，支援折疊
- **全螢幕 Banner**：動態背景圖片，隨機顯示
- **卡片式佈局**：角色與城市資訊展示
- **雷達圖視覺化**：技能與城市評分展示

---

## 📁 目錄結構

```
Voyage Compass/
├── assets/
│   ├── css/
│   │   ├── main.css              # 主要樣式
│   │   ├── custom.css            # 自定義樣式
│   │   ├── index-custom.css      # 首頁專用樣式
│   │   ├── fontawesome-all.min.css
│   │   └── noscript.css
│   ├── js/
│   │   ├── main.js               # 主要 JavaScript
│   │   ├── index-custom.js       # 首頁專用 JS
│   │   ├── jquery.min.js
│   │   └── util.js
│   ├── images/
│   │   ├── large/                # 大圖檔案 (49個)
│   │   └── *.png                 # 一般圖檔 (52個)
│   ├── sass/                     # Sass 原始檔
│   └── webfonts/                 # 字型檔案
├── sample assets/                # 設計資源 (27個)
├── labor_data/                   # 勞動數據資料
├── index.html                    # 首頁
├── character1.html               # 角色情境頁面
├── [城市名稱].html               # 10個城市頁面
└── [角色名稱].html               # 4個角色頁面
```

---

## 📄 頁面功能說明

### 1. 首頁 (index.html)
**功能**：專案入口，展示核心概念與導航
- **隨機 Banner**：每次載入隨機顯示 `assets/images/large/` 中的城市圖片
- **角色情境區塊**：4種職涯發展模式介紹
- **城市探索區塊**：10個城市縮圖與簡介

**關鍵元素**：
```html
<!-- 隨機 Banner 實作 -->
<section class="hero-section" id="index-banner">
<script>
const bannerImages = ['bangkok1.jpg', 'london1.jpg', ...];
const randomImg = bannerImages[Math.floor(Math.random() * bannerImages.length)];
// 設定背景圖片
</script>
```

### 2. 角色情境頁面
**頁面**：`rocket-dev.html`, `steady-pro.html`, `nomad-coder.html`, `startup-maverick.html`

**功能**：
- 角色詳細介紹
- 適合的城市推薦
- 職涯發展建議

### 3. 城市頁面
**頁面**：`new-york-city.html`, `london.html`, `singapore.html` 等

**功能**：
- 城市背景介紹
- 就業市場分析
- 生活成本比較
- 雷達圖視覺化

**關鍵結構**：
```html
<div class="city-profile-header" data-city="city-name">
    <!-- 動態背景圖片 -->
</div>
<section class="employment-section">
    <div class="radar-chart">
        <!-- SVG 雷達圖 -->
    </div>
    <div class="data-section">
        <!-- 數據表格 -->
    </div>
</section>
```

---

## 🔌 API 整合指南

### 1. 數據結構建議

#### 城市數據格式
```json
{
  "city_id": "new-york",
  "name": "New York",
  "name_zh": "紐約",
  "description": "全球金融中心，無限可能的職涯發展機會",
  "banner_image": "assets/images/large/new_york_1.jpeg",
  "thumbnail": "assets/images/New York.png",
  "employment_data": {
    "average_salary": 85000,
    "currency": "USD",
    "job_market_score": 95,
    "cost_of_living": 85,
    "quality_of_life": 80,
    "tech_ecosystem": 90
  },
  "radar_chart_data": {
    "salary_growth": 9,
    "job_opportunities": 10,
    "work_life_balance": 7,
    "cost_of_living": 6,
    "cultural_diversity": 10,
    "innovation": 9
  }
}
```

#### 角色數據格式
```json
{
  "role_id": "rocket-dev",
  "name": "Rocket Dev",
  "name_zh": "火箭升薪衝履歷",
  "description": "專為追求快速職涯成長的開發者設計",
  "icon": "sample assets/radar.gif",
  "suitable_cities": ["san-francisco", "new-york", "london"],
  "career_advice": [
    "專注於高成長技術領域",
    "積極參與開源專案",
    "建立個人品牌"
  ]
}
```

### 2. Flask API 整合建議

#### 主要端點設計
```python
# Flask 路由建議
@app.route('/api/cities')
def get_cities():
    """獲取所有城市列表"""
    pass

@app.route('/api/cities/<city_id>')
def get_city_detail(city_id):
    """獲取特定城市詳細資訊"""
    pass

@app.route('/api/roles')
def get_roles():
    """獲取所有角色列表"""
    pass

@app.route('/api/roles/<role_id>')
def get_role_detail(role_id):
    """獲取特定角色詳細資訊"""
    pass

@app.route('/api/recommendations/<role_id>')
def get_recommendations(role_id):
    """根據角色獲取推薦城市"""
    pass
```

#### 前端整合方式
```javascript
// 動態載入城市數據
async function loadCityData(cityId) {
    const response = await fetch(`/api/cities/${cityId}`);
    const cityData = await response.json();
    
    // 更新頁面內容
    updateCityPage(cityData);
}

// 更新雷達圖
function updateRadarChart(data) {
    // 使用現有的 SVG 結構更新數據
    const radarChart = document.querySelector('.radar-chart svg');
    // 更新路徑數據
}
```

### 3. 數據更新機制

#### 靜態數據更新
- 城市資訊：修改 JSON 檔案或資料庫
- 圖片資源：替換 `assets/images/` 中的檔案
- 樣式調整：修改 CSS 檔案

#### 動態數據整合
- 薪資數據：從外部 API 獲取實時數據
- 匯率資訊：整合外匯 API
- 就業市場：連接招聘平台 API

---

## 🚀 部署說明

### 1. 靜態檔案部署
```bash
# 直接部署到 Web 伺服器
cp -r "Voyage Compass/" /var/www/html/

# 或使用 GitHub Pages
# 1. 推送到 GitHub
git push origin main
# 2. 在 GitHub 設定中啟用 Pages
```

### 2. 本地開發環境
```bash
# 使用 Python 簡易伺服器
python -m http.server 8000

# 或使用 Node.js
npx serve .

# 或使用 PHP
php -S localhost:8000
```

---

## 👨‍💻 開發指南

### 1. 開發環境設定
```bash
# 克隆專案
git clone https://github.com/Lathari421/voyage-compass.git
cd voyage-compass

# 安裝依賴 (如果需要)
npm install
# 或
yarn install
```

### 2. 程式碼規範
- **HTML**: 使用語義化標籤，確保無障礙性
- **CSS**: 使用 Tailwind CSS 類別，自定義樣式放在 `custom.css`
- **JavaScript**: 使用 ES6+ 語法，模組化開發
- **圖片**: 優化圖片大小，使用適當格式 (WebP/PNG/JPG)

### 3. 測試指南
- **跨瀏覽器測試**: Chrome, Firefox, Safari, Edge
- **響應式測試**: 桌面、平板、手機
- **無障礙測試**: 使用螢幕閱讀器測試

---

## 📝 程式碼註解指南

### 1. HTML 檔案註解規範

#### 頁面結構註解
```html
<!-- ========================================
    PAGE: Dashboard
    PURPOSE: 城市數據儀表板，顯示新加坡的詳細統計資訊
    AUTHOR: [開發者姓名]
    LAST UPDATED: [日期]
======================================== -->

<!-- 左側導航選單 - 固定式側邊欄 -->
<nav class="left-menu" id="leftMenu">
    <!-- Logo 區域 -->
    <div class="menu-header">
        <!-- ... -->
    </div>
    
    <!-- 導航項目區域 -->
    <div class="menu-nav">
        <!-- ... -->
    </div>
</nav>

<!-- 主要內容區域 -->
<main class="flex-1 flex flex-col px-2 pb-5 gap-8 pl-64 bg-gray-100 min-h-screen mx-auto">
    <!-- 城市檔案標題區塊 -->
    <section class="city-profile-header mb-8" data-city="singapore">
        <!-- ... -->
    </section>
    
    <!-- 數據卡片網格佈局 -->
    <div class="grid grid-cols-3 gap-6 mb-6 w-full">
        <!-- ... -->
    </div>
</main>
```

#### 功能區塊註解
```html
<!-- 雷達圖視覺化區域 -->
<div class="col-span-2 dashboard-card flex items-center justify-center">
    <!-- SVG 雷達圖 - 顯示城市各項指標評分 -->
    <svg viewBox="-60 -40 560 480" class="radar-svg w-full h-full">
        <!-- 漸層背景定義 -->
        <defs>
            <radialGradient id="radarBackground" cx="50%" cy="50%" r="50%">
                <!-- ... -->
            </radialGradient>
        </defs>
        
        <!-- 背景圓圈 -->
        <circle cx="200" cy="200" r="190" fill="url(#radarBackground)" />
        
        <!-- 網格線 - 5個同心圓 + 6條放射線 -->
        <g class="radar-grid">
            <!-- ... -->
        </g>
        
        <!-- 數據區域 - 多邊形填充 -->
        <g class="radar-data">
            <!-- ... -->
        </g>
        
        <!-- 數據點 - 6個指標點 -->
        <g class="radar-points">
            <!-- ... -->
        </g>
        
        <!-- 標籤文字 -->
        <g class="radar-labels">
            <!-- ... -->
        </g>
    </svg>
</div>
```

### 2. CSS 檔案註解規範

#### 樣式區塊註解
```css
/* ========================================
    COMPONENT: Left Menu Navigation
    PURPOSE: 左側固定導航選單樣式
    FEATURES: 響應式設計、懸停效果、圖示支援
======================================== */

.left-menu {
    /* 固定定位，左側對齊 */
    position: fixed;
    left: 0;
    top: 0;
    
    /* 尺寸設定 */
    width: 240px;
    height: 100vh;
    
    /* 視覺樣式 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    
    /* 層級控制 */
    z-index: 1000;
}

/* 選單項目樣式 */
.menu-item {
    /* 佈局設定 */
    display: flex;
    align-items: center;
    padding: 12px 20px;
    
    /* 視覺效果 */
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    transition: all 0.3s ease;
    
    /* 懸停效果 */
    &:hover {
        background: rgba(255,255,255,0.1);
        color: white;
        transform: translateX(5px);
    }
}

/* 主要選單項目樣式 */
.main-menu-item {
    /* 特殊樣式 */
    font-weight: 600;
    font-size: 1.1em;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 10px;
}
```

#### 響應式設計註解
```css
/* ========================================
    RESPONSIVE DESIGN: Mobile Breakpoints
    PURPOSE: 行動裝置適配樣式
======================================== */

/* 平板裝置 (768px 以下) */
@media (max-width: 768px) {
    .left-menu {
        /* 轉換為頂部導航 */
        position: relative;
        width: 100%;
        height: auto;
    }
    
    .main-content {
        /* 調整主要內容區域 */
        padding-left: 0;
        margin-top: 60px;
    }
}

/* 手機裝置 (480px 以下) */
@media (max-width: 480px) {
    .dashboard-card {
        /* 調整卡片佈局 */
        margin: 10px 0;
        padding: 15px;
    }
    
    .radar-svg {
        /* 縮小雷達圖 */
        height: 200px;
    }
}
```

### 3. JavaScript 檔案註解規範

#### 函數註解
```javascript
/**
 * 載入城市數據並更新頁面內容
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
```

#### 事件處理註解
```javascript
/**
 * 頁面載入完成後的初始化函數
 * 設定事件監聽器、載入初始數據、初始化圖表
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
 * 設定響應式事件監聽器
 * 處理視窗大小變化、觸控事件等
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
```

### 4. 檔案命名規範

#### HTML 檔案
- `index.html` - 首頁
- `dashboard.html` - 數據儀表板
- `new-character-design.html` - 新角色設計頁面
- `[城市名稱].html` - 城市頁面 (如: `singapore.html`, `new-york-city.html`)
- `[角色名稱].html` - 角色頁面 (如: `rocket-dev.html`, `steady-pro.html`)

#### CSS 檔案
- `main.css` - 主要樣式
- `custom.css` - 自定義樣式覆蓋
- `index-custom.css` - 首頁專用樣式
- `noscript.css` - 無 JavaScript 時的樣式

#### JavaScript 檔案
- `main.js` - 主要功能
- `index-custom.js` - 首頁專用功能
- `util.js` - 工具函數

### 5. 變數命名規範

#### CSS 類別命名
```css
/* 使用 BEM 命名法 */
.dashboard-card {}           /* 區塊 */
.dashboard-card__title {}    /* 元素 */
.dashboard-card--featured {} /* 修飾符 */

/* 或使用語義化命名 */
.left-menu {}               /* 左側選單 */
.city-profile-header {}     /* 城市檔案標題 */
.radar-chart {}             /* 雷達圖 */
```

#### JavaScript 變數命名
```javascript
// 使用 camelCase
const currentCity = 'singapore';
const cityData = await loadCityData(currentCity);
const radarChartData = cityData.radar_data;

// 布林值使用 is/has/can 前綴
const isLoading = false;
const hasData = true;
const canUpdate = true;

// 常數使用 UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.voyage-compass.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_CHART_COLORS = ['#0ea5e9', '#14b8a6', '#f59e0b'];
```

### 6. 錯誤處理註解

```javascript
/**
 * 統一的錯誤處理函數
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
```

---

## 🔧 維護指南

### 1. 定期維護任務
- **圖片優化**: 定期壓縮和轉換圖片格式
- **程式碼清理**: 移除未使用的 CSS 和 JavaScript
- **依賴更新**: 定期更新第三方庫
- **效能監控**: 監控頁面載入速度和用戶體驗

### 2. 常見問題解決
- **跨瀏覽器相容性**: 使用 polyfill 和 fallback
- **響應式問題**: 測試不同裝置和螢幕尺寸
- **效能問題**: 使用圖片懶載入和程式碼分割

### 3. 擴展建議
- **PWA 支援**: 添加 Service Worker 和離線功能
- **國際化**: 支援多語言
- **深色模式**: 添加主題切換功能
- **動畫效果**: 使用 CSS 動畫提升用戶體驗

---

## 📞 聯絡資訊

- **專案負責人**: [姓名]
- **技術支援**: [Email]
- **GitHub**: https://github.com/Lathari421/voyage-compass
- **文件更新**: [日期]

---

*最後更新: 2024年12月* 