-- TABLE: event_artists
-- Purpose: Junction table mapping artists to events (Many-to-Many)
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

CREATE TABLE IF NOT EXISTS `event_artists` (
  `event_id` VARCHAR(36) NOT NULL,
  `artist_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`event_id`, `artist_id`),
  KEY `idx_event_artists_artist_id` (`artist_id`),
  CONSTRAINT `fk_event_artists_event_id` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_event_artists_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
