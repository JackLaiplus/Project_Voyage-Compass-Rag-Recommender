import streamlit as st
import requests

# 📍 API 設定
RAG_API_URL = "http://city_rag:8080/recommend"

# 🎭 角色選單
roles = [
    "職場新人",
    "穩健高薪",
    "數位遊牧",
    "創業浪客"
]

st.set_page_config(page_title="海外移居推薦", layout="centered")

st.title("🌍 海外移居與就業推薦系統")
st.markdown("根據你的角色與目標地點，推薦最適合的移居選項與分析。")

# 🔽 使用者輸入區
selected_role = st.selectbox("選擇你的角色", roles)
target_country = st.text_input("輸入你想移居的國家或城市", placeholder="例如：葡萄牙、泰國、加拿大")

# 🔍 查詢按鈕
if st.button("查詢推薦"):
    if not target_country:
        st.warning("請輸入想移居的地點")
    else:
        with st.spinner("查詢中..."):
            response = requests.post(RAG_API_URL, json={
                "role": selected_role,
                "country": target_country
            })

            if response.status_code == 200:
                rec = response.json()["recommendation"]
                st.success("✅ 以下是推薦結果")
                st.markdown("---")
                st.markdown(rec)
            else:
                st.error(f"查詢失敗：{response.status_code}")
