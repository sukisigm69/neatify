-- TABLE: ticket_scans
-- Purpose: Audit validation log when gate scanners scan tickets
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

CREATE TABLE IF NOT EXISTS `ticket_scans` (
  `id` VARCHAR(36) NOT NULL,
  `ticket_id` VARCHAR(36) NOT NULL,
  `scanned_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` VARCHAR(200) DEFAULT NULL,
  `scanner_user_id` VARCHAR(36) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_scans_ticket_id` (`ticket_id`),
  KEY `idx_ticket_scans_scanner` (`scanner_user_id`),
  CONSTRAINT `fk_ticket_scans_ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_scans_scanner_id` FOREIGN KEY (`scanner_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
