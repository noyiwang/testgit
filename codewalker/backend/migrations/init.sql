CREATE DATABASE IF NOT EXISTS codewalker DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE codewalker;

CREATE USER IF NOT EXISTS 'codewalker'@'%' IDENTIFIED BY 'codewalker123';
GRANT ALL PRIVILEGES ON codewalker.* TO 'codewalker'@'%';
FLUSH PRIVILEGES;
