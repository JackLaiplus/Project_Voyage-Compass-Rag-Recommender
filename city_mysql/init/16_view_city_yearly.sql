-- 若 view 已存在則刪除
DROP VIEW IF EXISTS view_city_yearly;

-- 建立 view：結合 CPI、CR、RI
CREATE VIEW view_city_yearly AS
SELECT
    cpi.city_id,
    cpi.year,
    cpi.cpi,
    cr.cr,
    ri.ri
FROM cpi
LEFT JOIN cr ON cpi.city_id = cr.city_id AND cpi.year = cr.year
LEFT JOIN ri ON cpi.city_id = ri.city_id AND cpi.year = ri.year;