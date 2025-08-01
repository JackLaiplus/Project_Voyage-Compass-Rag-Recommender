/* Custom JavaScript for Index Page */

// Random Background Images - From large images directory
const backgroundImages = [
    'large/bangkok1.jpg',
    'large/bangkok2.jpg',
    'large/bangkok3.jpg',
    'large/hongkong1.jpg',
    'large/hongkong2.jpg',
    'large/hongkong3.jpg',
    'large/hongkong4.jpg',
    'large/hongkong5.jpg',
    'large/tokyo1.jpg',
    'large/tokyo2.jpg',
    'large/tokyo3.jpg',
    'large/tokyo4.jpg',
    'large/tokyo5.jpg',
    'large/seoul1.jpg',
    'large/seoul2.jpg',
    'large/seoul3.jpg',
    'large/seoul4.jpg',
    'large/seoul5.jpg',
    'large/singapore1.jpg',
    'large/singapore2.jpg',
    'large/singapore4.jpg',
    'large/singapore5.jpg',
    'large/sydney1.jpg',
    'large/sydney2.jpg',
    'large/sydney3.jpg',
    'large/sydney4.jpg',
    'large/vancouver1.jpg',
    'large/vancouver2.jpg',
    'large/vancouver3.jpg',
    'large/vancouver4.jpg',
    'large/vancouver5.jpg',
    'large/london1.jpg',
    'large/london2.jpg',
    'large/london3.jpg',
    'large/london4.jpg',
    'large/london5.jpg',
    'large/sf2.jpg',
    'large/sf3.jpg',
    'large/sf4.jpg',
    'large/nyc1.jpg',
    'large/nyc2.jpg',
    'large/nyc3.jpg',
    'large/nyc4.jpg',
    'large/taipei1.jpg',
    'large/taipei2.jpg',
    'large/taipei3.jpg',
    'large/taipei4.jpg'
];

// Set random background on page load
document.addEventListener('DOMContentLoaded', function() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const heroSection = document.getElementById('index-banner');
    if (heroSection) {
        heroSection.style.backgroundImage = `url('assets/images/${backgroundImages[randomIndex]}')`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        heroSection.style.backgroundRepeat = 'no-repeat';
        heroSection.style.minHeight = '60vh';
    }
    
    // 移除按鈕效果初始化，讓 CSS 效果完全生效
    // initializeButtonEffects();
});

/**
 * 初始化按鈕點擊效果和動畫
 * 為所有 .btn 類別的按鈕添加點擊動畫效果
 */
function initializeButtonEffects() {
    // 為所有按鈕添加點擊效果
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // 添加點擊動畫效果
        button.addEventListener('click', function(e) {
            // 創建漣漪效果
            createRippleEffect(e, this);
        });
    });
}

/**
 * 創建按鈕點擊漣漪效果
 * @param {Event} event - 點擊事件
 * @param {HTMLElement} button - 按鈕元素
 */
function createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // 添加漣漪樣式
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    // 動畫結束後移除漣漪元素
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Smooth scrolling for menu items
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gallery item click handlers to navigate to city pages
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const cityName = this.querySelector('.gallery-item-title').textContent;
        
        // Map Chinese city names to their respective HTML files
        const cityMap = {
            '紐約': 'new-york-city.html',
            '舊金山': 'san-francisco.html',
            '倫敦': 'london.html',
            '新加坡': 'singapore.html',
            '雪梨': 'sydney.html',
            '溫哥華': 'vancouver.html',
            '首爾': 'seoul.html',
            '東京': 'tokyo.html',
            '曼谷': 'bangkok.html',
            '香港': 'hong-kong.html'
        };
        
        if (cityMap[cityName]) {
            window.location.href = cityMap[cityName];
        }
    });
}); 

// 新增 Chart.js 薪資條狀圖
if (document.getElementById('singaporeSalaryChart')) {
  const labels = ['Low', 'Median', 'High'];
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Junior Salary (USD)',
        data: [53000, 62900, 89300],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 0.5
      },
      {
        label: 'Senior Salary (USD)',
        data: [95900, 131400, 209000],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 0.5
      }
    ]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 0 },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { size: 12 },
            boxWidth: 20,
            boxHeight: 12,
            padding: 2,
            maxWidth: 300
          }
        },
        title: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: false },
          ticks: {
            callback: function(value) { return '$' + (value / 1000) + 'k'; }
          }
        },
        x: {
          title: { display: false }
        }
      }
    }
  };
  const ctx = document.getElementById('singaporeSalaryChart').getContext('2d');
  new Chart(ctx, config);
} 