CREATE TABLE IF NOT EXISTS `gem_tenders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_no` int DEFAULT NULL,
  `bid_number` varchar(100) DEFAULT NULL,
  `detail_url` text,
  `items` text,
  `quantity` varchar(50) DEFAULT NULL,
  `department` text,
  `start_date` varchar(50) DEFAULT NULL,
  `end_date` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `relevance` tinyint(1) DEFAULT '0',
  `relevance_score` float DEFAULT '0',
  `match_count` int DEFAULT '0',
  `match_relevency` float DEFAULT 0,
  `matches` text,
  `matches_status` enum('Yes','No') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'No',
  `MainRelevencyModelStatus` enum('Yes','No') NOT NULL DEFAULT 'No',
  `relevency_result` tinyint(1) DEFAULT '0',
  `main_relevency_score` float DEFAULT '0',
  `dept` varchar(255) DEFAULT NULL,
  `is_interested` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bid_number` (`bid_number`)
);

CREATE TABLE IF NOT EXISTS `gem_tender_docs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bid_number` varchar(50) NOT NULL,
  `detail_url` text,
  `pdf_url` text,
  `pdf_path` text,
  `json_path` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `did_reflected_master` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bid_number` (`bid_number`)
);

CREATE TABLE IF NOT EXISTS `main_relevency` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bid_number` varchar(50) DEFAULT NULL,
  `query` text,
  `detected_category` varchar(255) DEFAULT NULL,
  `relevancy_score` float DEFAULT NULL,
  `relevant` tinyint(1) DEFAULT NULL,
  `best_match` json DEFAULT NULL,
  `top_matches` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin','Tender','Finance','Sales','Management') DEFAULT 'Tender',
  status ENUM('Active','Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE INDEX idx_gem_relevance ON gem_tenders(relevency_result);
CREATE INDEX idx_gem_dept ON gem_tenders(dept);
CREATE INDEX idx_gem_interested ON gem_tenders(is_interested);
CREATE INDEX idx_gem_created ON gem_tenders(created_at);
-- gem_tender_docs
CREATE INDEX idx_docs_created ON gem_tender_docs(created_at);

-- main_relevency
CREATE INDEX idx_main_relevency_score ON main_relevency(relevancy_score);