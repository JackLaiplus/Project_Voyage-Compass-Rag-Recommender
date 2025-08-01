CREATE OR REPLACE VIEW view_ch1_score AS
WITH
sal_base AS (
  SELECT city_id, year, ju_med AS salary FROM sal
),
ren_base AS (
  SELECT city_id, year, avg_ppsqm AS rent FROM city_study.view_rental
),
base AS (
  SELECT DISTINCT city_id, year FROM sal_base
  UNION
  SELECT DISTINCT city_id, year FROM ren_base
  UNION
  SELECT DISTINCT city_id, year FROM vt
),
sal_stat AS (
  SELECT year, MIN(salary) AS min_sal, MAX(salary) AS max_sal FROM sal_base GROUP BY year
),
ren_stat AS (
  SELECT year, MIN(rent) AS min_ren, MAX(rent) AS max_ren FROM ren_base GROUP BY year
),
vt_stat AS (
  SELECT year, MIN(vt) AS min_vt, MAX(vt) AS max_vt FROM vt GROUP BY year
)

SELECT
  b.city_id,
  b.year,
  ROUND(((s.salary - ss.min_sal) / NULLIF(ss.max_sal - ss.min_sal, 0)) * 100, 2) AS norm_sal,
  ROUND(((r.rent   - rs.min_ren) / NULLIF(rs.max_ren - rs.min_ren, 0)) * 100, 2) AS norm_ren,
  ROUND((1 - ((v.vt - vs.min_vt) / NULLIF(vs.max_vt - vs.min_vt, 0))) * 100, 2) AS norm_vt,
  ROUND(
    COALESCE(((s.salary - ss.min_sal) / NULLIF(ss.max_sal - ss.min_sal, 0)) * 100, 0) +
    COALESCE(((r.rent   - rs.min_ren) / NULLIF(rs.max_ren - rs.min_ren, 0)) * 100, 0) +
    COALESCE((1 - ((v.vt - vs.min_vt) / NULLIF(vs.max_vt - vs.min_vt, 0))) * 100, 0),
    2
  ) AS total
FROM base b
LEFT JOIN sal_base s ON s.city_id = b.city_id AND s.year = b.year
LEFT JOIN ren_base r ON r.city_id = b.city_id AND r.year = b.year
LEFT JOIN vt v ON v.city_id = b.city_id AND v.year = b.year
JOIN sal_stat ss ON ss.year = b.year
JOIN ren_stat rs ON rs.year = b.year
JOIN vt_stat vs ON vs.year = b.year;
