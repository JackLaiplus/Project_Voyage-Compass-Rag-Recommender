# Qdrant 檢索模組
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter

client = QdrantClient(host="qdrant", port=6333)
COLLECTION = "city_docs"

def retrieve_documents(vector, top_k=5):
    results = client.search(
        collection_name=COLLECTION,
        query_vector=vector,
        limit=top_k
    )
    return [r.payload["text"] for r in results]
