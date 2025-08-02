# prompt 設計模組
def build_prompt(role: str, country: str, docs: list):
    context = "\n".join(docs)
    return (
        f"你是一位海外職涯顧問，針對 {role} 考慮移居 {country}，請根據以下資料進行評估：\n"
        f"{context}\n"
        "請用『優勢 / 劣勢 / 建議』格式回應。"
    )
