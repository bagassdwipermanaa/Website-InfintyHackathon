-- --------------------------------------------------------
-- Host:                         pintu2.minecuta.com
-- Server version:               11.7.2-MariaDB-ubu2404 - mariadb.org binary distribution
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for blockrights
DROP DATABASE IF EXISTS `blockrights`;
CREATE DATABASE IF NOT EXISTS `blockrights` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `blockrights`;

-- Dumping structure for table blockrights.activity_logs
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `activity_logs_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table blockrights.activity_logs: ~51 rows (approximately)
INSERT INTO `activity_logs` (`id`, `user_id`, `admin_id`, `action`, `description`, `ip_address`, `user_agent`, `metadata`, `created_at`) VALUES
	(1, NULL, 1, 'admin_login', 'Admin admin logged in', '127.0.0.1', 'Test Agent', NULL, '2025-10-04 22:17:25'),
	(2, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.6584', NULL, '2025-10-04 22:18:16'),
	(3, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.6584', NULL, '2025-10-04 22:20:46'),
	(4, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:20:55'),
	(5, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.6584', NULL, '2025-10-04 22:21:04'),
	(6, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:21:44'),
	(7, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:23:54'),
	(8, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:24:44'),
	(9, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:25:19'),
	(10, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:28:37'),
	(11, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:30:24'),
	(12, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:33:37'),
	(13, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:43:50'),
	(14, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:56:08'),
	(15, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:56:31'),
	(16, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 22:56:54'),
	(17, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-04 23:02:19'),
	(18, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:26:40'),
	(19, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:28:19'),
	(20, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:35:17'),
	(21, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:37:36'),
	(22, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:38:48'),
	(23, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:39:23'),
	(24, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:43:00'),
	(25, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:45:24'),
	(26, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:49:24'),
	(27, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:49:44'),
	(28, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 17:58:53'),
	(29, NULL, 1, 'user_status_toggle', 'User status changed to inactive', '::1', 'node', NULL, '2025-10-05 18:06:07'),
	(30, NULL, 1, 'user_status_toggle', 'User status changed to active', '::1', 'node', NULL, '2025-10-05 18:06:10'),
	(31, NULL, 1, 'user_status_toggle', 'User status changed to inactive', '::1', 'node', NULL, '2025-10-05 18:06:12'),
	(32, NULL, 1, 'user_status_toggle', 'User status changed to active', '::1', 'node', NULL, '2025-10-05 18:06:13'),
	(33, NULL, 1, 'user_status_toggle', 'User status changed to inactive', '::1', 'node', NULL, '2025-10-05 18:06:14'),
	(34, NULL, 1, 'user_status_toggle', 'User status changed to active', '::1', 'node', NULL, '2025-10-05 18:06:16'),
	(35, 3, NULL, 'artwork_upload', 'User uploaded artwork: asdsad', '::1', 'node', NULL, '2025-10-05 18:10:31'),
	(36, 3, NULL, 'artwork_upload', 'User uploaded artwork: asdasdas', '::1', 'node', NULL, '2025-10-05 18:12:10'),
	(37, 3, NULL, 'artwork_upload', 'User uploaded artwork: asdasd', '::1', 'node', NULL, '2025-10-05 18:13:18'),
	(38, 3, NULL, 'artwork_upload', 'User uploaded artwork: JADWAL PANDUAN', '::1', 'node', NULL, '2025-10-05 18:16:45'),
	(39, 3, NULL, 'artwork_upload', 'User uploaded artwork: anjaw', '::1', 'node', NULL, '2025-10-05 18:18:12'),
	(40, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 18:32:37'),
	(41, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-05 18:32:54'),
	(42, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-06 07:10:21'),
	(43, NULL, NULL, 'artwork_upload', 'User uploaded artwork: yaya', '::1', 'node', NULL, '2025-10-14 15:59:12'),
	(44, NULL, NULL, 'artwork_upload', 'User uploaded artwork: qqqq', '::1', 'node', NULL, '2025-10-14 16:16:52'),
	(45, NULL, NULL, 'artwork_upload', 'User uploaded artwork: yaya', '::1', 'node', NULL, '2025-10-14 16:27:12'),
	(46, 8, NULL, 'artwork_upload', 'User uploaded artwork: SINOBI', '::1', 'node', NULL, '2025-10-21 16:54:24'),
	(47, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-21 16:55:50'),
	(48, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-21 16:56:12'),
	(49, NULL, 1, 'artwork_status_update', 'Admin admin updated artwork 10 status to verified', '::1', 'node', '{"artworkId":"10","newStatus":"verified"}', '2025-10-21 16:56:21'),
	(50, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'node', NULL, '2025-10-21 17:15:59'),
	(51, NULL, 1, 'admin_login', 'Admin admin logged in', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.6899', NULL, '2025-10-21 18:52:09');

-- Dumping structure for table blockrights.admin_refresh_tokens
DROP TABLE IF EXISTS `admin_refresh_tokens`;
CREATE TABLE IF NOT EXISTS `admin_refresh_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `admin_refresh_tokens_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table blockrights.admin_refresh_tokens: ~4 rows (approximately)
INSERT INTO `admin_refresh_tokens` (`id`, `admin_id`, `token`, `expires_at`, `created_at`) VALUES
	(1, 1, 'admin-refresh-1759616916873-fnz1f13od', '2025-11-03 22:28:36', '2025-10-04 22:28:37'),
	(2, 1, 'admin-refresh-1759617023836-c67nhuvl4', '2025-11-03 22:30:23', '2025-10-04 22:30:24'),
	(3, 1, 'admin-refresh-1759689156274-audrg5uoi', '2025-11-04 18:32:36', '2025-10-05 18:32:37'),
	(4, 1, 'admin-refresh-1759689174047-b6p0k26pj', '2025-11-04 18:32:54', '2025-10-05 18:32:54');

-- Dumping structure for table blockrights.admin_users
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','moderator') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table blockrights.admin_users: ~1 rows (approximately)
INSERT INTO `admin_users` (`id`, `username`, `email`, `password`, `full_name`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
	(1, 'admin', 'admin@blockrights.com', '$2b$10$neGeA0JGxsdKjNRi4TwILu8ZYYq1vBiYwGup/idkPeRRraiwJXwdi', 'System Administrator', 'super_admin', 1, '2025-10-21 18:52:08', '2025-10-04 21:51:28', '2025-10-21 18:52:08');

-- Dumping structure for table blockrights.artworks
DROP TABLE IF EXISTS `artworks`;
CREATE TABLE IF NOT EXISTS `artworks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `file_hash` varchar(255) NOT NULL,
  `blockchain_hash` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','rejected','disputed') DEFAULT 'pending',
  `verification_date` timestamp NULL DEFAULT NULL,
  `verified_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `original_artwork_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `verified_by` (`verified_by`),
  KEY `idx_original_artwork_id` (`original_artwork_id`),
  CONSTRAINT `artworks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `artworks_ibfk_2` FOREIGN KEY (`verified_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `artworks_ibfk_3` FOREIGN KEY (`original_artwork_id`) REFERENCES `artworks` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table blockrights.artworks: ~1 rows (approximately)
INSERT INTO `artworks` (`id`, `user_id`, `title`, `description`, `file_path`, `file_size`, `file_type`, `file_hash`, `blockchain_hash`, `status`, `verification_date`, `verified_by`, `created_at`, `updated_at`, `original_artwork_id`) VALUES
	(10, 8, 'SINOBI', 'SINOBISSSS', '', 683326, 'image/png', '448a17517382ca86d8c9f45db576f2756ef58f27487d4ceef6a9d810900ea72c', NULL, 'verified', '2025-10-21 16:56:21', 1, '2025-10-21 16:54:24', '2025-10-21 16:56:21', NULL);

-- Dumping structure for table blockrights.refresh_tokens
DROP TABLE IF EXISTS `refresh_tokens`;
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table blockrights.refresh_tokens: ~11 rows (approximately)
INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
	(1, 3, 'refresh-1759612724689-8eg9zr9pa', '2025-11-03 21:18:44', '2025-10-04 21:18:44'),
	(2, 3, 'refresh-1759612901351-7fr0af0ry', '2025-11-03 21:21:41', '2025-10-04 21:21:41'),
	(3, 3, 'refresh-1759613276859-rd3m0z59y', '2025-11-03 21:27:56', '2025-10-04 21:27:57'),
	(4, 3, 'refresh-1759614100331-dpm11m7wa', '2025-11-03 21:41:40', '2025-10-04 21:41:40'),
	(5, 3, 'refresh-1759614145879-hlbxlvhpw', '2025-11-03 21:42:25', '2025-10-04 21:42:26'),
	(6, 3, 'refresh-1759615229356-cq7lg372r', '2025-11-03 22:00:29', '2025-10-04 22:00:29'),
	(7, 3, 'refresh-1759616399340-ikynnvkri', '2025-11-03 22:19:59', '2025-10-04 22:19:59'),
	(8, 3, 'refresh-1759689490010-uls62ypgy', '2025-11-04 18:38:10', '2025-10-05 18:38:10'),
	(9, 3, 'refresh-1759744349878-8r8cth43f', '2025-11-05 09:52:29', '2025-10-06 09:52:29'),
	(10, 3, 'refresh-1760122975633-p6or1erjp', '2025-11-09 19:02:55', '2025-10-10 19:02:56'),
	(11, 3, 'refresh-1761064980413-3zz1rc17f', '2025-11-20 16:43:00', '2025-10-21 16:42:59');

-- Dumping structure for table blockrights.system_settings
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table blockrights.system_settings: ~0 rows (approximately)

-- Dumping structure for table blockrights.password_reset_tokens
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  KEY `idx_token` (`token`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping structure for table blockrights.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `wallet_address` varchar(255) DEFAULT NULL,
  `profile_completed` tinyint(1) DEFAULT 0,
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bio` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_links`)),
  `role` enum('user','admin','super_admin') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_wallet_address` (`wallet_address`),
  KEY `idx_google_id` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table blockrights.users: ~3 rows (approximately)
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `wallet_address`, `profile_completed`, `email_verified`, `created_at`, `updated_at`, `bio`, `website`, `social_links`, `role`, `is_active`, `last_login`, `phone`, `address`, `google_id`) VALUES
	(3, 'bagas', 'bagas', 'bagas@minecuta.com', '$2a$12$DfDSG7vR3LE7AS2MU0cH0.BtT7tmVk8Pnw3EBO4qFxsEoHqJxmCUi', '', 1, 0, '2025-10-04 21:08:47', '2025-10-22 18:09:10', 'aku keren', 'https://bagasdwipermana.netlify.app/', '{"twitter":"bagas","instagram":"@bagassdwipermanaa","linkedin":"bagas","github":"bagas"}', 'user', 1, '2025-10-22 18:09:10', '212121', '', NULL),
	(8, 'about', 'about', 'about@minecuta.com', '$2a$12$qxHXQ6zTegIvN5iXOjmvQOIQ7I49CiJAxWxx2brTqei32Er8tTOHa', '', 0, 0, '2025-10-09 14:41:30', '2025-10-22 17:29:37', '', '', '{"twitter":"","instagram":"","linkedin":"","github":""}', 'user', 1, '2025-10-22 17:29:37', '', '', NULL),
	(10, 'Bagas Dwi Permana', 'bagastelkomschool_5s1wb', 'bagastelkomschool@gmail.com', '$2a$12$JO/cFOwGK87NXOSjfHUVS.s7m5uTKAMTKxOLk43Q/am/SFv33DHei', NULL, 0, 0, '2025-10-22 18:01:49', '2025-10-22 18:24:26', NULL, NULL, NULL, 'user', 1, '2025-10-22 18:24:26', NULL, NULL, '117469809230035578008');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
