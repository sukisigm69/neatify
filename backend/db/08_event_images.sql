-- TABLE: event_images
-- Purpose: Carousel image gallery for events
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

CREATE TABLE IF NOT EXISTS `event_images` (
  `id` VARCHAR(36) NOT NULL,
  `event_id` VARCHAR(36) NOT NULL,
  `image_url` TEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_event_images_event_id` (`event_id`),
  CONSTRAINT `fk_event_images_event_id` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
