-- Ensure dev user exists and uses password auth for local/dev setups (MariaDB-compatible)
CREATE DATABASE IF NOT EXISTS officecare_dev;
DROP USER IF EXISTS 'officecare'@'%';
CREATE USER 'officecare'@'%' IDENTIFIED BY 'officecare';
GRANT ALL PRIVILEGES ON officecare_dev.* TO 'officecare'@'%';
FLUSH PRIVILEGES; -- ensure changes take effect
