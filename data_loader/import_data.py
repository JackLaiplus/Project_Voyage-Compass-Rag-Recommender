import time
import os
import pandas as pd
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# 讀取資料庫設定
db_user = os.getenv("MYSQL_USER", "root")
db_pass = os.getenv("MYSQL_PASSWORD", "P%40ssw0rd") # root
db_host = os.getenv("MYSQL_HOST", "localhost") # city_mysql
db_port = os.getenv("MYSQL_PORT", "3306")
db_name = os.getenv("MYSQL_DATABASE", "city_study")

DB_URI = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

MAX_RETRIES = 10
WAIT_TIME = 3

# 建立連線
for attempt in range(MAX_RETRIES):
    try:
        engine = create_engine(DB_URI)
        with engine.connect():
            print(f"Connected to MySQL at {db_host}:{db_port}, DB: {db_name}")
            break
    except OperationalError as e:
        print(f"Attempt {attempt+1} failed, retrying in {WAIT_TIME}s... ({e})")
        time.sleep(WAIT_TIME)
else:
    print("Failed to connect to MySQL.")
    exit(1)

# 欄位轉換
def transform(df, table):
    df.columns = df.columns.str.strip().str.lower()  # 清理欄位名稱
    if table == "cr":
        df = df[["city_id", "year", "cr"]]
        df.columns = ["city_id", "year", "cr"]
    elif table == "cpi":
        df = df[["city_id", "year", "cpi"]]
        df.columns = ["city_id", "year", "cpi"]
    elif table == "ri":
        df = df[["city_id", "year", "ri"]]
        df.columns = ["city_id", "year", "ri"]
    return df

# 匯入所有 CSV 檔
csv_files = list(Path("./csv").glob("*.csv"))
if not csv_files:
    print("No CSV files found in ./csv/")
    exit(1)

for csv_path in csv_files:
    csv_filename = csv_path.name
    table_name = csv_filename.split(".")[0]

    try:
        df = pd.read_csv(csv_path, encoding="big5")
        df = transform(df, table_name)
        print(f"Reading '{csv_filename}', records: {len(df)}")

        with engine.begin() as conn:
            if table_name == "cpi":
                query = text("""
                    INSERT INTO cpi (city_id, year, cpi)
                    VALUES (:city_id, :year, :cpi)
                    ON DUPLICATE KEY UPDATE cpi = VALUES(cpi)
                """)
            elif table_name == "cr":
                query = text("""
                    INSERT INTO cr (city_id, year, cr)
                    VALUES (:city_id, :year, :cr)
                    ON DUPLICATE KEY UPDATE cr = VALUES(cr)
                """)
            elif table_name == "ri":
                query = text("""
                    INSERT INTO ri (city_id, year, ri)
                    VALUES (:city_id, :year, :ri)
                    ON DUPLICATE KEY UPDATE ri = VALUES(ri)
                """)
            else:
                print(f"Unknown table: {table_name}, skipping.")
                continue

            conn.execute(query, df.to_dict(orient="records"))

        print(f"✅ Successfully imported '{csv_filename}' into table '{table_name}'")

    except Exception as e:
        print(f"❌ Import failed for '{csv_filename}': {e}")
