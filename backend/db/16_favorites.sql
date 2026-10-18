-- TABLE: favorites
-- Purpose: Join table for users bookmarking / wishlisting events
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

CREATE TABLE IF NOT EXISTS `favorites` (
  `user_id` VARCHAR(36) NOT NULL,
  `event_id` VARCHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `event_id`),
  KEY `idx_favorites_event_id` (`event_id`),
  CONSTRAINT `fk_favorites_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_favorites_event_id` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
