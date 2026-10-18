-- TABLE: organizers
-- Purpose: Profiles of organizers requiring admin approval
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

CREATE TABLE IF NOT EXISTS `organizers` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `org_name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `logo` TEXT DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `is_approved` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_organizers_user_id` (`user_id`),
  KEY `idx_organizers_is_approved` (`is_approved`),
  CONSTRAINT `fk_organizers_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
