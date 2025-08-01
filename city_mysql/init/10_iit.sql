-- 創建 犯罪率(CR) 表格 --

CREATE TABLE iit (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  city_id     VARCHAR(10) NOT NULL,
  year_id     INT NOT NULL,
  iit  DECIMAL(10,4),
  FOREIGN KEY (city_id) REFERENCES city_name(city_id),
  UNIQUE (city_id, year_id)
);