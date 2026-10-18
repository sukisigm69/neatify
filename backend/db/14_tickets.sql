-- TABLE: tickets
-- Purpose: QR code entry credentials generated for paid orders
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

CREATE TABLE IF NOT EXISTS `tickets` (
  `id` VARCHAR(36) NOT NULL,
  `order_item_id` VARCHAR(36) NOT NULL,
  `qr_code` VARCHAR(255) NOT NULL,
  `qr_image` TEXT DEFAULT NULL,
  `attendee_name` VARCHAR(100) NOT NULL,
  `attendee_email` VARCHAR(255) NOT NULL,
  `attendee_phone` VARCHAR(20) NOT NULL,
  `status` ENUM('ACTIVE', 'USED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tickets_qr_code` (`qr_code`),
  KEY `idx_tickets_order_item_id` (`order_item_id`),
  KEY `idx_tickets_status` (`status`),
  CONSTRAINT `fk_tickets_order_item_id` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
