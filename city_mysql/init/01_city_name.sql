CREATE TABLE city_name (
  city_id VARCHAR(10) PRIMARY KEY,
  english_name VARCHAR(100) NOT NULL,
  chinese_name VARCHAR(100)
);

INSERT INTO city_name (city_id, english_name, chinese_name) VALUES
('nyc', 'New York City', '紐約'),
('sfo', 'San Francisco', '舊金山'),
('lon', 'London', '倫敦'),
('sgp', 'Singapore', '新加坡'),
('hkg', 'Hong Kong', '香港'),
('syd', 'Sydney', '雪梨'),
('yvr', 'Vancouver', '溫哥華'),
('sel', 'Seoul', '首爾'),
('tyo', 'Tokyo', '東京'),
('bkk', 'Bangkok', '曼谷'),
('tpe', 'Taipei', '臺北');