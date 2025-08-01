import os
import time

import pandas as pd
import pymysql
from flask import Flask, jsonify, redirect, render_template, request

app = Flask(__name__, static_folder="static", template_folder="templates")

# 資料庫連線設定
DB_CONFIG = {
    "host": os.environ.get("MYSQL_HOST", "city_mysql"),
    "port": int(os.environ.get("MYSQL_PORT", 3306)),
    "user": os.environ.get("MYSQL_USER", "root"),
    "password": os.environ.get("MYSQL_PASSWORD", "root"),
    "database": os.environ.get("MYSQL_DATABASE", "city_mysql"),
}

# 預設空資料
df = pd.DataFrame()

# 加入 retry 機制：等待 MySQL 啟動完成
MAX_RETRY = 10
for i in range(MAX_RETRY):
    try:
        print(f"第 {i+1} 次嘗試連線到資料庫...")
        conn = pymysql.connect(**DB_CONFIG)
        df = pd.read_sql("SELECT * FROM year", conn)
        conn.close()
        print(f"成功載入資料，共 {len(df)} 筆")
        break
    except Exception as e:
        print("資料庫連線失敗：", e)
        time.sleep(3)
else:
    print("無法連接資料庫，df 將保持空")


# 首頁載入 HTML 頁面
@app.route("/")
def index():
    return render_template("index.html")


# Generic 頁面
@app.route("/generic")
def generic():
    return render_template("generic.html")


# Elements 頁面
@app.route("/elements")
def elements():
    return render_template("elements.html")

# city-profile 頁面
@app.route("/city-profile")
def city_profile():
    return render_template("city-profile.html")

# character1 頁面
@app.route("/character1")
def character1():
    return render_template("character1.html")

# rocket-dev 頁面
@app.route("/rocket-dev")
def rocket_dev():
    return render_template("rocket-dev.html")

# steady-pro 頁面
@app.route("/steady-pro")
def steady_pro():
    return render_template("steady-pro.html")

# nomad-coder 頁面
@app.route("/nomad-coder")
def nomad_coder():
    return render_template("nomad-coder.html")

# startup-maverick 頁面
@app.route("/startup-maverick")
def startup_maverick():
    return render_template("startup-maverick.html")

# new-york-city 頁面
@app.route("/new-york-city")
# def new_york_city():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=new-york-city"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def new_york_city():
    return render_template("new-york-city.html")

# san-francisco 頁面
@app.route("/san-francisco")
# def san_francisco():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=san-francisco"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def san_francisco():
    return render_template("san-francisco.html")

# london 頁面
@app.route("/london")
# def london():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=london"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def london():
    return render_template("london.html")

# singapore 頁面
@app.route("/singapore")
# def singapore():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=singapore"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def singapore():
    return render_template("singapore.html")

# sydney 頁面
@app.route("/sydney")
# def sydney():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=sydney"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def sydney():
    return render_template("sydney.html")

# vancouver 頁面
@app.route("/vancouver")
# def vancouver():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=vancouver"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def vancouver():
    return render_template("vancouver.html")

# seoul 頁面
@app.route("/seoul")
# def seoul():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=seoul"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def seoul():
    return render_template("seoul.html")

# tokyo 頁面
@app.route("/tokyo")
# def tokyo():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=tokyo"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def tokyo():
    return render_template("tokyo.html")

# taipei 頁面
@app.route("/taipei")
# def taipei():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=taipei"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def taipei():
    return render_template("taipei.html")

# bangkok 頁面
@app.route("/bangkok")
# def bangkok():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=bangkok"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def bangkok():
    return render_template("bangkok.html")

# hong-kong 頁面
@app.route("/hong-kong")
# def hong_kong():
# # 偵測用戶端是透過哪個 host/IP 訪問 Flask
#     host = request.host.split(":")[0]  # 拿到 IP，不含 port
#     streamlit_url = f"http://{host}:8501?city=hong-kong"

#     return f"""
#     <html>
#         <head><title>Streamlit Page</title></head>
#             <body>
#                 <iframe src="{streamlit_url}" width="100%" height="900px" style="border:none;"></iframe>
#             </body>
#     </html>
#     """
def hong_kong():
    return render_template("hong-kong.html")


# 提供 cr 資料的 API（未來前端可 AJAX 調用）
@app.route("/api/cr")
def get_cr_data():
    try:
        conn = pymysql.connect(**DB_CONFIG)
        col_df = pd.read_sql("SELECT * FROM cr", conn)
        conn.close()
        col_df = col_df.fillna("")
        return jsonify(col_df.to_dict(orient='records'))
    except Exception as e:
        print("載入 col_data 失敗：", e)
        return jsonify([])


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
