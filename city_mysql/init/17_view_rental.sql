CREATE OR REPLACE VIEW city_study.view_rental AS
WITH ranked_data AS (
  SELECT
    city_id,
    year,
    month,
    date,
    monthly_rent,
    price_per_sqm,
    ROW_NUMBER() OVER (PARTITION BY city_id, year, month, date ORDER BY monthly_rent) AS rn_rent,
    ROW_NUMBER() OVER (PARTITION BY city_id, year, month, date ORDER BY price_per_sqm) AS rn_ppsqm,
    COUNT(*) OVER (PARTITION BY city_id, year, month, date) AS cnt
  FROM city_study.ren
),
median_values AS (
  SELECT 
    city_id,
    year,
    month,
    date,
    AVG(monthly_rent) AS median_monthly,
    AVG(price_per_sqm) AS median_ppsqm
  FROM ranked_data
  WHERE 
    rn_rent IN (FLOOR((cnt + 1) / 2), CEIL((cnt + 1) / 2)) OR
    rn_ppsqm IN (FLOOR((cnt + 1) / 2), CEIL((cnt + 1) / 2))
  GROUP BY city_id, year, month, date
),
avg_values AS (
  SELECT 
    city_id,
    year,
    month,
    date,
    AVG(monthly_rent) AS avg_mly,
    AVG(price_per_sqm) AS avg_ppsqm
  FROM city_study.ren
  GROUP BY city_id, year, month, date
)
SELECT 
  a.city_id,
  a.year,
  a.month,
  a.date,
  a.avg_mly,
  m.median_monthly,
  a.avg_ppsqm,
  m.median_ppsqm
FROM avg_values a
JOIN median_values m
  ON a.city_id = m.city_id AND a.year = m.year AND a.month = m.month AND a.date = m.date;
