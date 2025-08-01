-- 創建 Rental(ren) 表格 --

CREATE TABLE ren (
	id				INT AUTO_INCREMENT PRIMARY KEY,
    city_id			VARCHAR(10) NOT NULL,
    property_id		VARCHAR(50) NOT NULL,
    year			INT NOT NULL,
    month			INT,
    date			INT,
    monthly_rent	DECIMAL(10,4),
    price_per_sqm	DECIMAL(10,4),
    FOREIGN KEY (city_id) REFERENCES city_name(city_id),
    UNIQUE (property_id, year, month, date)
);