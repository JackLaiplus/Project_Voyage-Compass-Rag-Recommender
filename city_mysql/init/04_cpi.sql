-- 創建 CPI(CPI) 表格 --

CREATE TABLE cpi (
	id			INT AUTO_INCREMENT PRIMARY KEY,
	city_id		VARCHAR(10) NOT NULL,
	year		INT NOT NULL,
	cpi			DECIMAL(10,4),
	FOREIGN KEY (city_id) REFERENCES city_name(city_id),
	UNIQUE (city_id, year)
);