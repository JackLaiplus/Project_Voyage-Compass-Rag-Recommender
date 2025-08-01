-- 創建 Salary(sal) 表格 --

CREATE TABLE sal (
	id			INT AUTO_INCREMENT PRIMARY KEY,
    city_id		VARCHAR(10) NOT NULL,
    year		INT NOT NULL,
    month		INT,
    date		INT,
    ju_low		DECIMAL(10,4),
    ju_med		DECIMAL(10,4),
    ju_high		DECIMAL(10,4),
    se_low		DECIMAL(10,4),
    se_med		DECIMAL(10,4),
    se_high		DECIMAL(10,4),
    FOREIGN KEY (city_id) REFERENCES city_name(city_id),
    UNIQUE (city_id, year)
);