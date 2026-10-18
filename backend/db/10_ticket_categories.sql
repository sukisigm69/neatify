-- TABLE: ticket_categories
-- Purpose: Ticket category pricing and seat quotas per event
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

CREATE TABLE IF NOT EXISTS `ticket_categories` (
  `id` VARCHAR(36) NOT NULL,
  `event_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `price` DECIMAL(12, 2) NOT NULL,
  `quota` INT NOT NULL,
  `sold` INT NOT NULL DEFAULT 0,
  `sale_start` DATETIME NOT NULL,
  `sale_end` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_categories_event_id` (`event_id`),
  CONSTRAINT `fk_ticket_categories_event_id` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_ticket_categories_quota` CHECK (`quota` >= 0),
  CONSTRAINT `chk_ticket_categories_sold` CHECK (`sold` >= 0 AND `sold` <= `quota`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
