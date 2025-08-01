# 使用官方 Python 輕量映像檔
FROM python:3.10-slim

# 設定環境變數以支援 UTF-8
ENV PYTHONIOENCODING=UTF-8 \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# 設定容器內部工作目錄
WORKDIR /app

# 複製目前資料夾所有檔案到容器內部
COPY . .

# 安裝必要套件
RUN pip install --no-cache-dir -r requirements.txt

# 複製應用程式檔案與資料夾
COPY show_data.py .
COPY templates ./templates
COPY static ./static

# 開放 Flask Web 服務使用的埠口
EXPOSE 5000

# 啟動 Flask 應用程式
CMD ["python", "show_data.py"]
