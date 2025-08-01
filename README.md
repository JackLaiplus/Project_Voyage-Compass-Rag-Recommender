# BDSE end of term project + RAG

本專案使用 Docker Compose 建立一個可協作的多容器環境，

1. MySQL 資料庫容器
2. ETL 資料處理容器（匯入 city_feature.csv）
3. Web 容器（Flask 顯示 HTML 頁面）
4. Streamlit 容器（資料視覺化城市指標）

請見下方啟動方式與專案目錄結構。

## 專案環境需求

- Docker & Docker Compose

## 專案目錄結構簡介

|目錄 | 用途 |
|---------------|------|
| city_mysql/init   | 初始化 SQL table |
| city_streamlit/    | 資料視覺化城市指標 |
| city_web/          | Flask 顯示 HTML 頁面 |
| city_loader/   | ETL 資料處理容器 |

## 啟動方式

```bash
git clone https://github.com/JackLaiplus/Project_Voyage-Compass.git
cd Project_Voyage-Compass
docker compose up -d --build # 在背景執行
```
