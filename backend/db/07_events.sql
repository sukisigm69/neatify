-- TABLE: events
-- Purpose: Concert listings and descriptions
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(36) NOT NULL,
  `organizer_id` VARCHAR(36) NOT NULL,
  `venue_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(250) NOT NULL,
  `description` TEXT NOT NULL,
  `banner` TEXT DEFAULT NULL,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `status` ENUM('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'SOLD_OUT', 'FINISHED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_events_slug` (`slug`),
  KEY `idx_events_organizer` (`organizer_id`),
  KEY `idx_events_venue` (`venue_id`),
  KEY `idx_events_status` (`status`),
  KEY `idx_events_dates` (`start_date`, `end_date`),
  CONSTRAINT `fk_events_organizer_id` FOREIGN KEY (`organizer_id`) REFERENCES `organizers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_events_venue_id` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
