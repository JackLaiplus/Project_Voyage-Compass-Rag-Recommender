# 使用官方 Python 輕量映像檔
FROM python:3.11-slim

# 設定容器內部工作目錄
WORKDIR /app

# 複製目前資料夾所有檔案到容器內部
COPY requirements.txt ./

# 安裝必要套件
RUN pip install --no-cache-dir -r requirements.txt

# 複製應用程式程式碼
COPY . .

# 開放 Flask Web 服務使用的埠口
EXPOSE 8502

# 預設啟動指令可選擇放這，compose 裡也有設 command
CMD ["streamlit", "run", "rag_app.py", "--server.port=8502", "--server.enableCORS=false", "--server.address=0.0.0.0"]