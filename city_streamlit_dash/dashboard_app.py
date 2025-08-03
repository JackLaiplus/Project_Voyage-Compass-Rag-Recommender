# streamlit_app-v6.py

#######################
# Import libraries
import base64

import altair as alt
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st
import streamlit.components.v1 as components
from matplotlib import cm
from PIL import Image
from streamlit_javascript import st_javascript

#######################
# Page configuration
st.set_page_config(
    page_title="City Dashboard",
    page_icon="🏂",
    layout="wide",
    initial_sidebar_state="expanded")

alt.themes.enable("dark")

# 取得瀏覽器寬度, 在最上方（如 import 下方）執行一次，設定字體大小
client_width = st_javascript("window.innerWidth", key="window_width")
font_size = 24 if client_width is None else max(24, min(26, int(client_width * 0.01)))

# 取得 query string 中的 city 參數
# query_params = st.experimental_get_query_params()
query_params = st.query_params
# city_param = query_params.get("city", ["Unknown"])[0]
city_param = query_params.get("city", "Unknown").strip()  # ← 安全處理空白

# 將 city slug 轉換為顯示名稱（可擴充）
city_mapping = {
    "new-york-city": "New York City",
    "san-francisco": "San Francisco",
    "london": "London",
    "singapore": "Singapore",
    "sydney": "Sydney",
    "vancouver": "Vancouver",
    "seoul": "Seoul",
    "tokyo": "Tokyo",
    "taipei": "Taipei",
    "bangkok": "Bangkok",
    "hong-kong": "Hong Kong"
}

# city display name 對應到 MySQL 中的 city_id（如 cpi 表的 city_id 欄位）
city_id_mapping = {
    "New York City": "nyc", 
    "San Francisco": "sfo", 
    "London": "lon", 
    "Singapore": "sgp", 
    "Sydney": "syd", 
    "Vancouver": "yvr",
    "Seoul": "sel", 
    "Tokyo": "tyo", 
    "Taipei": "tpe", 
    "Bangkok": "bkk", 
    "Hong Kong": "hkg" 
}

# Temperatures 圖片路徑對應
season_image_paths = {
    "Spring": "data/spring.png",
    "Summer": "data/summer.png",
    "Autumn": "data/autumn.png",
    "Winter": "data/winter.png"
}

city_display_name = city_mapping.get(city_param, city_param.replace("-", " ").title())

# 根據網頁上的 city_display_name 找出對應的 city_id
selected_city_id = city_id_mapping.get(city_display_name, None)

# 顯示 selected_city_id（黑色字體）
# st.markdown(f"<p style='color: black;'>City ID: {selected_city_id}</p>", unsafe_allow_html=True)

# 顯示城市名稱於網頁最上方
# st.markdown(
#     f"<h1 style='text-align: center; color: white;'>{city_display_name}</h1>",
#     unsafe_allow_html=True
# )

# 顯示主要指標區塊 (KPI summary)
with st.container():
    pass # st.markdown("###")
    # st.columns((1,))  # 微調上邊距

    # KPI 資料

    # 載入 GDP 資料
    df_gdp = pd.read_csv("data/gdp.csv")
    df_gdp.columns = df_gdp.columns.str.strip()

    # 城市選單
    # city_list = sorted(df_gdp["city_id"].dropna().astype(str).unique())
    # selected_city_id = st.selectbox("Select a city for map view", city_list, key="map_city")
    selected_city = selected_city_id

    # 找出對應城市的資料
    if selected_city_id and selected_city_id in df_gdp["city_id"].values:
        city_row = df_gdp[df_gdp["city_id"] == selected_city_id].iloc[0]
        population = f"{float(city_row['population']):,} M"
        density = f"{float(city_row['density']):,}"
        gdp = f"${city_row['gdp']} B"
        income = f"${float(city_row['income']):,}"
        per_capita_he = f"${float(city_row['per_capita_he'])}"
    else:
        st.warning("City ID not found in gdp.csv. Using default KPI values.")
        population = "647,484"
        density = "11,158"
        gdp = "$121.1 B"
        income = "$73,505"
        per_capita_he = "40 Minutes"


    kpi1, kpi2, kpi3, kpi4, kpi5 = st.columns(5)

    with kpi1:
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-value">{population}</div>
            <div class="kpi-label">人口</div>
        </div>
        """, unsafe_allow_html=True)

    with kpi2:
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-value">{density}</div>
            <div class="kpi-label">人口密度(people/km²)</div>
        </div>
        """, unsafe_allow_html=True)

    with kpi3:
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-value">{gdp}</div>
            <div class="kpi-label">地區生產毛額</div>
        </div>
        """, unsafe_allow_html=True)

    with kpi4:
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-value">{income}</div>
            <div class="kpi-label">人均所得(USD)</div>
        </div>
        """, unsafe_allow_html=True)

    with kpi5:
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-value">{per_capita_he}</div>
            <div class="kpi-label">每人平均醫療支出(USD)</div>
        </div>
        """, unsafe_allow_html=True)


#remove default theme
# theme_plotly = None # None or streamlit

# CSS Style
with open('style.css')as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html = True)

#######################
# Streamlit + 圖像 + 四季溫度排版程式碼
# 資料讀取與前處理
df_temp = pd.read_csv("data/temper.csv")
df_temp.columns = df_temp.columns.str.strip()

# 季節對應
season_map = {
    3: "Spring", 4: "Spring", 5: "Spring",
    6: "Summer", 7: "Summer", 8: "Summer",
    9: "Autumn", 10: "Autumn", 11: "Autumn",
    12: "Winter", 1: "Winter", 2: "Winter"
}
df_temp["season"] = df_temp["month"].map(season_map)

# 每城市每季的平均溫度
df_season_avg = (
    df_temp.groupby(["city_id", "season"])["avg_temperature"]
    .mean()
    .reset_index()
    .pivot(index="city_id", columns="season", values="avg_temperature")
    .reset_index()
)

# 圖片路徑對應
season_images = {
    "Spring": "data/spring.png",
    "Summer": "data/summer.png",
    "Autumn": "data/autumn.png",
    "Winter": "data/winter.png"
}

#######################
# CSS styling
st.markdown("""
<style>

[data-testid="block-container"] {
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 1rem;
    padding-bottom: 0rem;
    margin-bottom: -7rem;
}

.chart-box {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
            
.kpi-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px 10px;
    margin-bottom: 20px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    border: 1px solid #e1e1e1;
}
            
.kpi-value {
    font-size: 28px;
    font-weight: bold;
    color: #00aaff;
    margin-bottom: 0.3rem;
}
            
.kpi-label {
    font-size: clamp(12px, 1.2vw, 18px);
    color: #444444;
}

</style>
""", unsafe_allow_html=True)

#######################
# Load data
# df_reshaped = pd.read_csv('data/us-population-2010-2019-reshaped.csv')
df_cpi = pd.read_csv('data/cpi.csv')

#######################
@st.cache_resource
def make_radar_chart(norm_df, n_clusters):
    fig = go.Figure()
    cmap = cm.get_cmap('tab20b')
    angles = list(norm_df.columns[1:])
    angles.append(angles[0])

    for i in range(n_clusters):
       subset = norm_df[norm_df['cluster'] == i]
       data = [np.mean(subset[col]) for col in angles[:-1]]
       data.append(data[0])
       rgba = cmap(i / n_clusters)
       rgba_str = f'rgba({int(rgba[0]*255)}, {int(rgba[1]*255)}, {int(rgba[2]*255)}, {rgba[3]:.2f})'
       fig.add_trace(go.Scatterpolar(
           r=data,
           theta=angles,
           mode='lines',
           line_color=rgba_str,
           name=f"Cluster {i}"
        ))

    # 要刪除雷達圖右上角的 圖例（legend），只需在 plotly 的 update_layout() 方法中設定 showlegend=False。
    fig.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, 1])),
        showlegend=False,
        margin=dict(l=10, r=10, t=30, b=10),
        height=350,
    )
    return fig

def make_radar_chart_single_city(values, theta, city_name="Selected City"):
    fig = go.Figure()
    cmap = cm.get_cmap('tab20b')

    rgba = cmap(1)
    rgba_str = f'rgba({int(rgba[0]*255)}, {int(rgba[1]*255)}, {int(rgba[2]*255)}, {rgba[3]:.2f})'

    fig.add_trace(go.Scatterpolar(
        r=values,
        theta=theta,
        fill='toself',
        name=city_name,
        line=dict(color="#00aaff")
    ))

    fig.update_layout(
        height=350,  # ✅ 新增高度設定
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 80],
                tickfont=dict(size=font_size),  # ✅ 軸刻度字體大小
            ),
            angularaxis=dict(
                tickfont=dict(size=font_size),  # ✅ 標籤字體大小
            ),
        ),
        showlegend=True,
        legend=dict(font=dict(size=font_size)),  # ✅ 圖例字體大小
        title=dict(
            text=f"{city_name} Radar Chart",
            font=dict(size=font_size + 4)       # ✅ 標題字體大小
        ),
        margin=dict(l=20, r=20, t=50, b=20)
    )

    return fig


# Temperatures
 
def image_to_base64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

season_images_base64 = {
    season: image_to_base64(path)
    for season, path in season_image_paths.items()
}

#######################
# Dashboard Main Panel
# col = st.columns((1.5, 4.5, 2), gap='medium')
col = st.columns((4), gap='medium')
# col = st.columns((4), gap='large')

with col[0]:
    # with st.container():
    #     st.subheader("City Map")

    #     st.markdown(
    #         "[View Taipei City on Google Maps](https://www.google.com/maps?q=25.033,121.567)",
    #         unsafe_allow_html=True
    #     )

    with st.container():
        st.subheader("城市地圖")

        # 讀取城市座標資料
        df_coord = pd.read_csv("data/city_coordinates.csv")
        df_coord.columns = df_coord.columns.str.strip()  # 清除欄位空白

        # 城市選單
        # city_list = sorted(df_coord["city_id"].dropna().astype(str).unique())
        # selected_city = st.selectbox("Select a city for map view", city_list)
        selected_city = selected_city_id

        # 取得該城市的 N（緯度）與 E（經度）
        row = df_coord[df_coord["city_id"] == selected_city].iloc[0]
        latitude = row["N"]
        longitude = row["E"]

        # 建立 Google Maps iframe HTML（不需 API Key）
        map_html = f"""
        <iframe
            width="100%"
            height="350"
            style="border:0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q={latitude},{longitude}&z=12&output=embed">
        </iframe>
        """

        # 顯示地圖
        # with st.container():
        components.html(map_html, height=350)

        # components.html(
        #     '<iframe src="https://maps.google.com/maps?q=25.033,121.567&z=12&output=embed" width="100%" height="350"></iframe>',
        #     height=400
        # )

    # st.markdown("""---""")

    with st.container():
        st.subheader("人口金字塔")

        df_pop = pd.read_csv("data/population_pyramid.csv", encoding="big5", dtype={"year": str})
        df_pop.columns = df_pop.columns.str.strip()

        df_pop["male"] = pd.to_numeric(df_pop["male"], errors="coerce").fillna(0)
        df_pop["female"] = pd.to_numeric(df_pop["female"], errors="coerce").fillna(0)

        # city_options = sorted(df_pop["city_id"].unique())
        # selected_city = st.selectbox("Select a city", city_options, key="pyramid_city")
        selected_city = selected_city_id

        df_city_all = df_pop[df_pop["city_id"] == selected_city]
        selected_year = df_city_all["year"].astype(str).max()
        df_filtered = df_city_all[df_city_all["year"].astype(str) == selected_year].copy()

        if selected_city == "tpe":
            df_filtered = pd.DataFrame()

        if df_filtered.empty:
            st.warning("No data available for the selected city and year.")
        else:
            df_filtered["Male"] = -df_filtered["male"]
            df_filtered["Female"] = df_filtered["female"]
            df_filtered["Age Group"] = df_filtered["age_group"]

            # 動態 X 軸刻度範圍
            max_male = abs(df_filtered["Male"]).max()
            max_female = df_filtered["Female"].max()
            max_val = max(max_male, max_female)
            if max_val == 0:
                max_val = 1

            max_tick = int((max_val + 99999) // 100000 * 100000)
            tick_step = 100000
            tickvals = list(range(-max_tick, max_tick + tick_step, tick_step))
            ticktext = [f"{abs(v)//1000}k" for v in tickvals]

            # 繪製人口金字塔圖表
            fig_pyramid = go.Figure()
            fig_pyramid.add_trace(go.Bar(
                y=df_filtered["Age Group"],
                x=df_filtered["Male"],
                name="Male",
                orientation="h",
                marker=dict(color="#3674B5"),  # 深藍
            ))
            fig_pyramid.add_trace(go.Bar(
                y=df_filtered["Age Group"],
                x=df_filtered["Female"],
                name="Female",
                orientation="h",
               marker=dict(color="#FADA7A"),  # 淺橘
            ))

            fig_pyramid.update_layout(
                barmode="relative",
                xaxis=dict(
                    title=dict(
                        text="Population",
                        font=dict(size=font_size)
                    ),
                    tickvals=tickvals,
                    ticktext=ticktext,
                    tickfont=dict(size=font_size)
                ),
                yaxis=dict(
                    title=dict(
                        text="Age Group",
                        font=dict(size=font_size)
                    ),
                    tickfont=dict(size=font_size)
                ),
                height=350,
                margin=dict(l=10, r=10, t=30, b=10),
                legend=dict(
                    orientation="h",
                    yanchor="bottom",
                    y=1.02,
                    xanchor="right",
                    x=1,
                    font=dict(size=font_size)
                ),
                title=dict(
                    text=f"Population Pyramid – {selected_city.upper()}, {selected_year}",
                    font=dict(size=font_size + 4)
                ),
            )

            st.plotly_chart(fig_pyramid, use_container_width=True)

        # st.markdown("""---""")


with col[1]:
    with st.container():
        # st.markdown('<div class="chart-box">', unsafe_allow_html=True)
        st.subheader("雷達圖")

        # 讀取 radar_score.csv
        df_radar = pd.read_csv("data/radar_score.csv")
        df_radar.columns = df_radar.columns.str.strip()  # 去除欄位空白

        # 若 city_id 沒有在網址 query string 裡，使用 selectbox
        # radar_city_options = sorted(df_radar["city_id"].unique())
        # selected_city = st.selectbox("Select a city for radar", radar_city_options, key="radar_city")
        selected_city = selected_city_id

        # 篩選出該城市資料
        radar_row = df_radar[df_radar["city_id"] == selected_city]

        if radar_row.empty:
            st.warning("No radar data for this city.")
        else:
            categories = ['col', 'traffic', 'welfare', 'innovation', 'salary', 'crime_index']
            # categories = ['生活成本', '交通', '社福', '創新', '就業&薪資', '環境&生活品質']

            # 建立 radar chart 的資料格式（單筆資料，複製首筆作閉環）
            values = radar_row[categories].values.flatten().tolist()
            values.append(values[0])  # 收尾相連
            theta = categories + [categories[0]]

            n_clusters = 1
            # np.random.seed(0)
            # mock_data = pd.DataFrame({
            #     'cluster': np.random.choice(range(n_clusters), size=30),
            #     **{cat: np.clip(np.random.rand(30), 0.2, 1.0) for cat in categories}
            # })
            # radar_fig = make_radar_chart(mock_data, n_clusters)

            # 呼叫修正後的函式
            radar_fig = make_radar_chart_single_city(values, theta, city_name=selected_city)
            st.plotly_chart(radar_fig, use_container_width=True)
        # st.markdown('</div>', unsafe_allow_html=True)

    # st.markdown("""---""")

    with st.container():
        # 單一城市 CPI 年增率（YoY）
        st.subheader("CPI年增率(%)")

        # 載入資料
        df_cpi = pd.read_csv("data/cpi.csv")
        df_cpi.columns = df_cpi.columns.str.strip()

        # 城市選單
        # city_list = sorted(df_cpi["city_id"].dropna().unique())
        # selected_city = st.selectbox("Select a city", city_list, key="cpi_yoy_city")
        selected_city = selected_city_id

        # 選定城市資料並排序
        df_city = df_cpi[df_cpi["city_id"] == selected_city].sort_values("year").copy()

        # 計算每年年增率
        df_city["yoy_growth"] = df_city["cpi"].pct_change() * 100

        # 畫圖
        fig_yoy = px.line(
            df_city,
            x="year",
            y="yoy_growth",
            markers=True,
            labels={"yoy_growth": "年增率 (%)", "year": "年份"},
            title=f"{selected_city.upper()} Annual CPI Growth Rate",
            template="plotly_white"
        )

        fig_yoy.update_traces(
            line=dict(color="#00aaff"),
            marker=dict(size=6),
            textfont=dict(size=font_size)
        )

        fig_yoy.update_layout(
            yaxis=dict(
                title=dict(
                    text="年增率 (%)",
                    font=dict(size=font_size)
                ),
                tickfont=dict(size=font_size)
            ),
            xaxis=dict(
                title=dict(
                    text="年份",
                    font=dict(size=font_size)
                ),
                tickfont=dict(size=font_size)
            ),
            title=dict(
                text=f"{selected_city.upper()} Annual CPI Growth Rate",
                font=dict(size=font_size + 4)
            ),
            legend=dict(
                font=dict(size=font_size)
            ),
            height=350,
            margin=dict(l=10, r=10, t=40, b=10)
        )

        st.plotly_chart(fig_yoy, use_container_width=True)


with col[2]:
    with st.container():
        st.subheader("薪資")

        # 讀取薪資資料並清理欄位名稱
        df_sal = pd.read_csv("data/sal.csv", sep="\t")
        df_sal.columns = df_sal.columns.str.strip()  # <== 關鍵修正行！

        # selected_city = st.selectbox("Select a city", sorted(df_sal["city_id"].unique()), key="salary_city")
        selected_city = selected_city_id
        df_city = df_sal[df_sal["city_id"] == selected_city].iloc[0]

        salary_data = pd.DataFrame({
            "Level": ["Low", "Median", "High"] * 2,
            "Salary": [
                df_city["junior_low"], df_city["junior_median"], df_city["junior_high"],
                df_city["senior_low"], df_city["senior_median"], df_city["senior_high"],
            ],
            "Role": ["Junior"] * 3 + ["Senior"] * 3
        })

        # 使用 ColorHunt 配色
        role_color_map = {
            "Junior": "#578FCA",  # 淺藍
            "Senior": "#FADA7A",  # 淺橘
        }

        fig_salary = px.bar(
            salary_data,
            x="Level",
            y="Salary",
            color="Role",
            barmode="group",
            text="Salary",
            labels={"Salary": "Annual Salary (US $)", "Level": "Salary Level"},
            template="plotly_white",
            color_discrete_map=role_color_map,  # 套用自定顏色
        )

        fig_salary.update_traces(
            textposition="outside",
            textfont=dict(size=font_size)
        ) 

        fig_salary.update_layout(
            height=350,
            margin=dict(l=10, r=10, t=40, b=20),
            title=dict(
                text=f"Junior vs Senior Salary – {selected_city.upper()}",
                font=dict(size=font_size + 4)
            ),
            yaxis=dict(
                title=dict(
                    text="Annual Salary (US $)",
                    font=dict(size=font_size)
                ),
                tickprefix="$",
                tickfont=dict(size=font_size)
            ),
            xaxis=dict(
                tickfont=dict(size=font_size),
                title=dict(font=dict(size=font_size))
            ),
            legend=dict(
                title=dict(text="Role", font=dict(size=font_size)),
                font=dict(size=font_size)
            )
        )

        st.plotly_chart(fig_salary, use_container_width=True)

    # st.markdown("""---""")

    with st.container():
        st.subheader("工作機會")

        # 讀取資料
        df_vac = pd.read_csv("data/vac.csv")
        df_vac.columns = df_vac.columns.str.strip()

        # 城市選單
        # city_list = sorted(df_vac["city_id"].dropna().astype(str).unique())
        # selected_city = st.selectbox("Select a city for job data", city_list)
        selected_city = selected_city_id

        # 抓該城市最新年份資料
        df_city = df_vac[df_vac["city_id"] == selected_city].sort_values(by="year", ascending=False).iloc[0]

        # 準備繪圖資料
        job_data = pd.DataFrame({
            "Category": ["Total Jobs", "Junior", "Medium", "Senior"],
            "Count": [df_city["total_jobs"], df_city["junior"], df_city["medium"], df_city["senior"]],
        })

        # 額外加入 'color' 欄位指定顏色（你可自行調整色碼）
        color_map = {
            # "Total Jobs": "#3674B5",  # 深藍 "#3674B5"
            "Total Jobs": "#FADA7A",      # 淺橘 "#FADA7A"
            # "Junior": "#578FCA",      # 淺藍 "#578FCA"
            "Junior":  "#F5F0CD",      # 米黃 "#F5F0CD"
            # "Medium": "#F5F0CD",      # 米黃 "#F5F0CD"
            "Medium": "#578FCA",      # 淺藍 "#578FCA"
            # "Senior": "#FADA7A",      # 淺橘 "#FADA7A"
            "Senior": "#3674B5",  # 深藍 "#3674B5"
        }
        job_data["Color"] = job_data["Category"].map(color_map)

        # 畫橫條圖，設定 color=Category，並使用 color_discrete_map
        fig_jobs = px.bar(
            job_data,
            x="Count",
            y="Category",
            orientation="h",
            text="Count",
            color="Category",
            color_discrete_map=color_map,
            labels={"Count": "Job Count", "Category": "Job Level"},
            title=f"Job Distribution – {selected_city.upper()}",
            template="plotly_white"
        )

        # 更新樣式（字體大小隨視窗縮放）
        fig_jobs.update_traces(
            textposition="outside",
            textfont_size=font_size,
        )
        fig_jobs.update_layout(
            xaxis=dict(
                title=dict(
                    text="Job Count",
                    font=dict(size=font_size)
                )
            ),
            yaxis=dict(
                title="", 
                tickfont=dict(size=font_size)
            ),
            title_font_size=font_size + 4,
            legend_font_size=font_size,
            margin=dict(l=10, r=10, t=40, b=20),
            height=350,
        )

        st.plotly_chart(fig_jobs, use_container_width=True)


with col[3]:
    with st.container():
        st.subheader("公司類型")

        # 讀取資料與欄位清理
        df_size = pd.read_csv("data/comp_size.csv")
        df_size.columns = df_size.columns.str.strip()

        # 避免 NaN 或非字串造成錯誤
        # city_list = sorted(df_size["city_id"].dropna().astype(str).unique())
        # selected_city = st.selectbox("Select a city for firm size", city_list)
        selected_city = selected_city_id

        # 取得該城市資料
        df_city = df_size[df_size["city_id"] == selected_city].iloc[0]

        # 整理成適合畫圖的格式
        firm_data = pd.DataFrame({
            "Firm Size": ["Micro", "Small", "Medium", "Large", "Extra"],
            "Count": [
                df_city["micro"],
                df_city["small"],
                df_city["medium"],
                df_city["large"],
                df_city["extra"],
            ]
        })

         # ColorHunt 色碼對應每種公司規模
        color_sequence = {
            "Micro": "#3674B5",   # 深藍
            "Small": "#578FCA",   # 淺藍
            "Medium": "#F5F0CD",  # 米黃
            "Large": "#FADA7A",   # 淺橘
            "Extra": "#FFD47A",   # 類似延伸色（自選補色）
        }

        fig_donut = px.pie(
            firm_data,
            values="Count",
            names="Firm Size",
            hole=0.5,
            title=f"Firm Size Distribution – {selected_city.upper()}",
            color="Firm Size",
            color_discrete_map=color_sequence,
        )

        fig_donut.update_traces(
            textinfo="percent+label",
            textfont_size=font_size,
            marker=dict(line=dict(color="#000000", width=1)),
        )

        fig_donut.update_layout(
            title_font_size=font_size + 4,
            legend_font_size=font_size,
            height=350,
            margin=dict(l=10, r=10, t=40, b=10),
        )

        st.plotly_chart(fig_donut, use_container_width=True)

    # st.markdown("""---""")

    with st.container():
        st.subheader("四季溫度")

        # 城市選單
        # cities = sorted(df_season_avg["city_id"].dropna().astype(str))
        # selected_city = st.selectbox("Select a city", cities)
        selected_city = selected_city_id

        # 該城市四季華氏溫度與攝氏溫度
        if selected_city == "hkg":
            row_f = pd.Series({"Spring": 0, "Summer": 0, "Autumn": 0, "Winter": 0})
            row_c = {season: 0 for season in ["Spring", "Summer", "Autumn", "Winter"]}
        else:
            row_f = df_season_avg[df_season_avg["city_id"] == selected_city].iloc[0]
            row_c = {season: (row_f[season] - 32) * 5 / 9 for season in ["Spring", "Summer", "Autumn", "Winter"]}

        # 建立卡片區塊 HTML + CSS
        # card_css = """
        #     <style>
        #     .season-card {
        #         display: flex;
        #         align-items: center;
        #         background-color: #f9f9f9;
        #         border-radius: 12px;
        #         padding: 10px 16px;
        #         margin-bottom: 12px;
        #         box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        #     }
        #     .season-card img {
        #         width: 50px;
        #         height: 50px;
        #         margin-right: 16px;
        #     }
        #     .season-info {
        #         display: flex;
        #         flex-direction: column;
        #     }
        #     .season-name {
        #         font-weight: bold;
        #         font-size: 1.1rem;
        #     }
        #     .season-temp {
        #         font-size: 1rem;
        #         color: #333;
        #     }
        #     </style>
        # """

        card_css = """
            <style>
            .season-card { 
                display: flex; 
                align-items: 
                center; 
                background-color: #f9f9f9; 
                border-radius: 12px; 
                padding: 10px 16px; 
                margin-bottom: 12px; 
                box-shadow: 0 2px 6px rgba(0,0,0,0.1); 
            } 
            .season-left img { 
                width: 50px; 
                height: 50px; 
                margin-right: 16px; 
            } 
            .season-right { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                width: 100%; 
            } 
            .season-name { 
                font-weight: bold; 
                font-size: 1.1rem; 
            } 
            .season-temp { 
                font-size: 2rem;  /* 原本是 1rem，這裡加大到 1.5rem */
                font-weight: bold;  /* 可選：加粗讓溫度更醒目 */
                color: #333; 
            } 
            </style>
        """
        st.markdown(card_css, unsafe_allow_html=True)

        # 顯示每張卡片
        for season in ["Spring", "Summer", "Autumn", "Winter"]:
            image_data = season_images_base64[season]
            temp_c = f"{row_c[season]:.1f} °C"
            html = f"""
            <div class="season-card">
                <div class="season-left"> 
                    <img src="data:image/png;base64,{image_data}"> 
                </div> 
                <div class="season-right">
                    <div class="season-name">{season}</div> 
                    <div class="season-temp">{temp_c}</div>
                </div>
            </div> """
            
            st.markdown(html, unsafe_allow_html=True)

        # 顯示每張卡片
        # for season in ["Spring", "Summer", "Autumn", "Winter"]:
        #     image_data = season_images_base64[season]
        #     temp_c = f"{row_c[season]:.1f} °C"
        #     html = f"""
        #     <div class="season-card">
        #         <img src="data:image/png;base64,{image_data}">
        #         <div class="season-info">
        #             <div class="season-name">{season}</div>
        #             <div class="season-temp">{temp_c}</div>
        #         </div>
        #     </div>
        #     """
        #     st.markdown(html, unsafe_allow_html=True)



