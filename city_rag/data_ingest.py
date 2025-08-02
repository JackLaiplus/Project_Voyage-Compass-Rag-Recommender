#初始向量載入腳本
import mysql.connector
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

# ⚙️ 參數設定
MYSQL_CONFIG = {
    "host": "city_mysql",
    "port": 3306,
    "user": "root",
    "password": "root",
    "database": "citydb"
}

QDRANT_HOST = "qdrant"
QDRANT_PORT = 6333
COLLECTION_NAME = "city_docs"
EMBED_DIM = 384  # 取決於你使用的 embedding 模型維度
BATCH_SIZE = 50

# 1️⃣ 連接 MySQL
def load_documents():
    conn = mysql.connector.connect(**MYSQL_CONFIG)
    cursor = conn.cursor()
    cursor.execute("SELECT id, city_name, country, description FROM city_profiles")
    rows = cursor.fetchall()
    conn.close()
    return rows

# 2️⃣ 建立 Qdrant collection（若尚未建立）
def init_qdrant_collection(client):
    if not client.collection_exists(COLLECTION_NAME):
        client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=EMBED_DIM, distance=Distance.COSINE)
        )

# 3️⃣ 載入模型並寫入向量
def embed_and_upload(rows, client):
    model = SentenceTransformer("all-MiniLM-L6-v2")

    points = []
    for idx, (row_id, city, country, desc) in enumerate(rows):
        full_text = f"{city}, {country}: {desc}"
        vec = model.encode(full_text).tolist()
        payload = {
            "id": row_id,
            "city": city,
            "country": country,
            "text": desc
        }
        point = PointStruct(id=row_id, vector=vec, payload=payload)
        points.append(point)

        if len(points) >= BATCH_SIZE:
            client.upsert(COLLECTION_NAME, points=points)
            points = []

    if points:
        client.upsert(COLLECTION_NAME, points=points)

# 🟢 主流程
if __name__ == "__main__":
    print("🚀 Loading city documents from MySQL...")
    docs = load_documents()

    print("🔗 Connecting to Qdrant...")
    client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

    print("📦 Initializing Qdrant collection...")
    init_qdrant_collection(client)

    print(f"🧠 Embedding and uploading {len(docs)} city entries...")
    embed_and_upload(docs, client)

    print("✅ Ingestion complete.")
