-- TABLE: payments
-- Purpose: Payment records (including Midtrans snapshots/logs)
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(36) NOT NULL,
  `order_id` VARCHAR(36) NOT NULL,
  `midtrans_id` VARCHAR(100) DEFAULT NULL,
  `snap_token` VARCHAR(255) DEFAULT NULL,
  `snap_url` TEXT DEFAULT NULL,
  `amount` DECIMAL(14, 2) NOT NULL,
  `method` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `transaction_id` VARCHAR(100) DEFAULT NULL,
  `payment_type` VARCHAR(50) DEFAULT NULL,
  `transaction_status` VARCHAR(50) DEFAULT NULL,
  `fraud_status` VARCHAR(50) DEFAULT NULL,
  `expiry_time` DATETIME DEFAULT NULL,
  `paid_at` DATETIME DEFAULT NULL,
  `raw_response` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payments_transaction_id` (`transaction_id`),
  UNIQUE KEY `uq_payments_midtrans_id` (`midtrans_id`),
  KEY `idx_payments_order_id` (`order_id`),
  KEY `idx_payments_status` (`status`),
  CONSTRAINT `fk_payments_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
