-- SEED DATA
-- Purpose: Initial roles, sample users, venues, artists, and event setup
-- Engine: InnoDB
-- Charset: utf8mb4

USE `konsera`;

-- 1. Insert Roles
INSERT INTO `roles` (`id`, `name`) VALUES
('r-user-0000-0000-000000000001', 'USER'),
('r-org-0000-0000-000000000002', 'ORGANIZER'),
('r-admin-0000-0000-000000000003', 'ADMIN'),
('r-super-0000-0000-000000000004', 'SUPER_ADMIN')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Insert Users (Sample passwords hashed or placeholder strings)
INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `password`, `is_verified`) VALUES
('u-user-0000-0000-000000000001', 'r-user-0000-0000-000000000001', 'Regular User', 'user@konsera.com', '$2b$10$vI8aWBnd3JJgWv6n/4H29.T5L7kZ03gG/7RreGzZ91w70w8p9n5K2', TRUE),
('u-org-0000-0000-000000000002', 'r-org-0000-0000-000000000002', 'Organizer User', 'organizer@konsera.com', '$2b$10$vI8aWBnd3JJgWv6n/4H29.T5L7kZ03gG/7RreGzZ91w70w8p9n5K2', TRUE),
('u-admin-0000-0000-000000000003', 'r-admin-0000-0000-000000000003', 'Admin User', 'admin@konsera.com', '$2b$10$vI8aWBnd3JJgWv6n/4H29.T5L7kZ03gG/7RreGzZ91w70w8p9n5K2', TRUE),
('u-super-0000-0000-000000000004', 'r-super-0000-0000-000000000004', 'Super Admin', 'superadmin@konsera.com', '$2b$10$vI8aWBnd3JJgWv6n/4H29.T5L7kZ03gG/7RreGzZ91w70w8p9n5K2', TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Insert Organizers
INSERT INTO `organizers` (`id`, `user_id`, `org_name`, `is_approved`) VALUES
('o-org-0000-0000-000000000001', 'u-org-0000-0000-000000000002', 'Konsera Entertainment Ltd', TRUE)
ON DUPLICATE KEY UPDATE `org_name` = VALUES(`org_name`), `is_approved` = VALUES(`is_approved`);

-- 4. Insert Venues
INSERT INTO `venues` (`id`, `name`, `address`, `city`, `province`, `capacity`) VALUES
('v-venue-0000-0000-000000000001', 'Gelora Bung Karno Stadium', 'Jl. Pintu Satu Senayan', 'Jakarta', 'DKI Jakarta', 80000),
('v-venue-0000-0000-000000000002', 'ICE BSD Hall 1', 'Jl. BSD Grand Boulevard No.1', 'Tangerang', 'Banten', 10000)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `capacity` = VALUES(`capacity`);

-- 5. Insert Artists
INSERT INTO `artists` (`id`, `name`, `genre`) VALUES
('a-artist-0000-0000-000000000001', 'Coldplay', 'Alternative Rock'),
('a-artist-0000-0000-000000000002', 'Tulus', 'Pop')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `genre` = VALUES(`genre`);

-- 6. Insert Events
INSERT INTO `events` (`id`, `organizer_id`, `venue_id`, `title`, `slug`, `description`, `start_date`, `end_date`, `status`) VALUES
('e-event-0000-0000-000000000001', 'o-org-0000-0000-000000000001', 'v-venue-0000-0000-000000000001', 'Coldplay Music of the Spheres Tour', 'coldplay-jakarta-2026', 'Coldplay live concert in Jakarta', '2026-11-15 19:00:00', '2026-11-15 23:00:00', 'PUBLISHED')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `status` = VALUES(`status`);

-- 7. Associate Artists with Events
INSERT INTO `event_artists` (`event_id`, `artist_id`) VALUES
('e-event-0000-0000-000000000001', 'a-artist-0000-0000-000000000001')
ON DUPLICATE KEY UPDATE `event_id` = `event_id`;

-- 8. Add Ticket Categories
INSERT INTO `ticket_categories` (`id`, `event_id`, `name`, `price`, `quota`, `sale_start`, `sale_end`) VALUES
('tc-cat-0000-0000-000000000001', 'e-event-0000-0000-000000000001', 'VIP Seating', 5000000.00, 500, '2026-08-01 10:00:00', '2026-11-01 23:59:59'),
('tc-cat-0000-0000-000000000002', 'e-event-0000-0000-000000000001', 'Festival (Standing)', 2500000.00, 5000, '2026-08-01 10:00:00', '2026-11-01 23:59:59')
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`), `quota` = VALUES(`quota`);
