-- https://stackoverflow.com/questions/43056220/store-uuid-v4-in-mysql
-- https://www.percona.com/blog/store-uuid-optimized-way/

DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `ordered_uuid`(uuid BINARY(36)) 
RETURNS binary(16) DETERMINISTIC 
RETURN UNHEX(CONCAT(SUBSTR(uuid, 15, 4),SUBSTR(uuid, 10, 4),SUBSTR(uuid, 1, 8),SUBSTR(uuid, 20, 4),SUBSTR(uuid, 25)));
//
DELIMITER ;

CREATE TABLE IF NOT EXISTS `users` (
  `id` binary(16) NOT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8_unicode_ci NOT NULL,	
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_users_on_username` (`username`),
  KEY `index_users_on_created_at` (`created_at`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` binary(16) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `author_id` binary(16) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_posts_on_author_id` (`author_id`),
  KEY `index_posts_on_created_at` (`created_at`),
  CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `comments` (
  `id` binary(16) NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `author_id` binary(16) NOT NULL,
  `post_parent_id` binary(16) NULL,
  `comment_parent_id` binary(16) NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_comments_on_author_id` (`author_id`),
  KEY `index_comments_on_post_parent_id` (`post_parent_id`),
  KEY `index_comments_on_comment_parent_id` (`comment_parent_id`),
  KEY `index_comments_on_created_at` (`created_at`),
  CONSTRAINT `fk_comments_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_comments_post_parent` FOREIGN KEY (`post_parent_id`) REFERENCES `posts` (`id`),
  CONSTRAINT `fk_comments_comment_parent` FOREIGN KEY (`comment_parent_id`) REFERENCES `comments` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `posts_likes` (
  `post_id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  PRIMARY KEY (`post_id`, `user_id`),
  KEY `index_posts_likes_on_user_id` (`user_id`),
  CONSTRAINT `fk_posts_likes_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  CONSTRAINT `fk_posts_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;
