# 主入口 API (FastAPI)
from fastapi import FastAPI, Request
from embedding import embed_text
from retriever import retrieve_documents
from prompt_engineer import build_prompt
from llm_client import call_llm

app = FastAPI()

@app.post("/recommend")
async def recommend(req: Request):
    data = await req.json()
    role = data.get("role")
    country = data.get("country")

    query_vec = embed_text(f"{role} in {country}")
    docs = retrieve_documents(query_vec)
    prompt = build_prompt(role, country, docs)
    response = call_llm(prompt)

    return {"recommendation": response}
