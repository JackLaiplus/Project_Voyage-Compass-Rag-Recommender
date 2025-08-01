-- 選擇資料庫
USE city_study;

-- 若 view 已存在則刪除
DROP VIEW IF EXISTS city_yearly_stats;

-- 建立 view：結合 CPI、Crime Rate、RI
CREATE VIEW city_yearly_stats AS
SELECT
    cpi.city_id,
    cpi.year_id,
    cpi.cpi,
    cr.crime_rate,
    ri.ri
FROM cpi
LEFT JOIN cr ON cpi.city_id = cr.city_id AND cpi.year_id = cr.year_id
LEFT JOIN ri ON cpi.city_id = ri.city_id AND cpi.year_id = ri.year_id;