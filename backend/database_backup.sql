-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: LFD
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announced`
--

DROP TABLE IF EXISTS `announced`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announced` (
  `id` int NOT NULL AUTO_INCREMENT,
  `announcer_name` varchar(100) NOT NULL,
  `material_name` varchar(100) NOT NULL,
  `date_announced` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `photo` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  `claimer_phone` varchar(15) DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announced`
--

LOCK TABLES `announced` WRITE;
/*!40000 ALTER TABLE `announced` DISABLE KEYS */;
INSERT INTO `announced` VALUES (15,'MUNYANEZA ERIC','impapuro zumurima','2026-07-27 18:16:41',NULL,'claimed',NULL,'2026-08-08 15:02:40'),(16,'MUNYANEZA ERIC','impapuro zumurima','2026-07-27 18:16:41',NULL,'claimed',NULL,'2026-08-08 15:02:40'),(26,'sibomana edouard','identity card','2026-07-28 09:45:03','1785231903795.jpg','claimed','0723662295','2026-08-08 15:02:40'),(30,'KANYABUGANDE','white car','2026-08-04 01:53:08','1785808388738.jpg','claimed',NULL,'2026-08-08 15:02:40'),(31,'KANYABUGANDE','whitecar','2026-08-04 01:54:05','1785808445803.jpg','claimed',NULL,'2026-08-12 17:22:00'),(32,'uwambajimana','   ibyangombwa byimodoka','2026-08-06 13:45:24','1786023924102.png','claimed',NULL,'2026-08-12 21:44:37'),(34,'uwambajimana','ikayi','2026-08-10 10:11:08',NULL,'active',NULL,'2026-08-11 14:50:44');
/*!40000 ALTER TABLE `announced` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `claim_requests`
--

DROP TABLE IF EXISTS `claim_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `claim_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `material_name` varchar(100) NOT NULL,
  `claimer_name` varchar(100) NOT NULL,
  `claimer_province` varchar(50) NOT NULL,
  `claimer_district` varchar(50) NOT NULL,
  `claimer_sector` varchar(50) NOT NULL,
  `claimer_umudugudu` varchar(50) NOT NULL,
  `claimer_phone` varchar(15) NOT NULL,
  `id_card_front` varchar(255) NOT NULL,
  `id_card_back` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `claim_requests`
--

LOCK TABLES `claim_requests` WRITE;
/*!40000 ALTER TABLE `claim_requests` DISABLE KEYS */;
INSERT INTO `claim_requests` VALUES (1,16,'impapuro zumurima','Nsabiyumva Eric','north','burera','kagogo','rukoro','o723662295','1785539972245.png','1785539972286.png','approved','2026-07-31 23:19:32'),(2,15,'impapuro zumurima','Nsabiyumva Eric','north','burera','kagogo','rukoro','0723662295','1785572646858.png','1785572646861.png','rejected','2026-08-01 08:24:06'),(3,29,'ikofi ','Nsabiyumva Eric','north','burera','kagogo','rukoro','0723662295','','','approved','2026-08-02 10:55:11'),(4,15,'impapuro zumurima','uwambajimana','north','burera','kagogo','rukoro','0723662295','','','approved','2026-08-04 01:46:20'),(5,15,'impapuro zumurima','uwambajimana','north','burera','kagogo','rukoro','0723662295','','','approved','2026-08-04 01:46:43'),(6,30,'white car','uwambajimana','north','burera','kagogo','rukoro','0785639867','','','approved','2026-08-04 13:21:02'),(7,31,'whitecar','uwambajimana','north','burera','kagogo','rukoro','0783662295','1786440726155.jpeg','1786440726156.png','approved','2026-08-11 09:32:06'),(8,32,'   ibyangombwa byimodoka','KANYABUGANDE','south','ruhango','ruhango','rwoga','0795565074','1786549905485.jpeg','1786549905485.png','rejected','2026-08-12 15:51:45'),(9,32,'   ibyangombwa byimodoka','KANYABUGANDE','south','ruhango','ruhango','rwoga','0785639867','1786552758978.jpeg','1786552758979.png','approved','2026-08-12 16:39:19'),(10,32,'   ibyangombwa byimodoka','KANYABUGANDE','south','ruhango','ruhango','rwoga','0899999476738','1786553581411.jpeg','1786553581415.png','approved','2026-08-12 16:53:01');
/*!40000 ALTER TABLE `claim_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lost_found`
--

DROP TABLE IF EXISTS `lost_found`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lost_found` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receiver_name` varchar(100) NOT NULL,
  `material_name` varchar(100) NOT NULL,
  `date_received` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lost_found`
--

LOCK TABLES `lost_found` WRITE;
/*!40000 ALTER TABLE `lost_found` DISABLE KEYS */;
INSERT INTO `lost_found` VALUES (1,'Nsabiyumva Eric','identity card','2026-07-29 10:56:53'),(2,'Nsabiyumva Eric','impapuro zumurima','2026-07-31 23:55:01'),(3,'Nsabiyumva Eric','ikofi ','2026-08-02 10:57:25'),(4,'uwambajimana','impapuro zumurima','2026-08-04 01:49:01'),(5,'uwambajimana','impapuro zumurima','2026-08-04 01:49:22'),(6,'uwambajimana','white car','2026-08-04 13:23:50'),(7,'uwambajimana','whitecar','2026-08-12 15:22:00'),(8,'KANYABUGANDE','   ibyangombwa byimodoka','2026-08-12 19:44:28'),(9,'KANYABUGANDE','   ibyangombwa byimodoka','2026-08-12 19:44:37');
/*!40000 ALTER TABLE `lost_found` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_name` varchar(100) NOT NULL,
  `date_posted` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_name` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `reply` text,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `replied_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'Nsabiyumva Eric','hello  admin','hell0?',1,'2026-07-30 10:21:13','2026-07-30 23:29:30'),(2,'Nsabiyumva Eric','hello admin?\n','  hello what can we help you?\n',1,'2026-07-30 23:25:38','2026-07-30 23:28:54'),(3,'uwambajimana','hy admin?','hello how this system work\n',1,'2026-08-04 02:06:29','2026-08-04 02:10:25');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'uwambajimana','Muhamagare kuri iyi nimero ya telefone: 0723662295 — Nsabiyumva Eric asaba ikofi  ye.',1,'2026-08-02 10:57:25'),(2,'MUNYANEZA ERIC','Muhamagare kuri iyi nimero ya telefone: 0723662295 — uwambajimana asaba impapuro zumurima ye.',0,'2026-08-04 01:49:01'),(3,'MUNYANEZA ERIC','Muhamagare kuri iyi nimero ya telefone: 0723662295 — uwambajimana asaba impapuro zumurima ye.',0,'2026-08-04 01:49:22'),(4,'KANYABUGANDE','Muhamagare kuri iyi nimero ya telefone: 0785639867 — uwambajimana asaba white car ye.',1,'2026-08-04 13:23:50'),(5,'KANYABUGANDE','uwambajimana yemeje ko icyo watangaje (\"whitecar\") ari icye kandi yatanze n\'ibimenyetso. Nimero ye ni 0783662295.',1,'2026-08-11 09:32:06'),(6,'uwambajimana','KANYABUGANDE yemeje ko icyo watangaje (\"   ibyangombwa byimodoka\") ari icye kandi yatanze n\'ibimenyetso. Nimero ye ni 0795565074.',1,'2026-08-12 15:51:45'),(7,'uwambajimana','KANYABUGANDE yemeje ko icyo watangaje (\"   ibyangombwa byimodoka\") ari icye kandi yatanze n\'ibimenyetso. Nimero ye ni 0785639867.',0,'2026-08-12 16:39:19'),(8,'uwambajimana','KANYABUGANDE yemeje ko icyo watangaje (\"   ibyangombwa byimodoka\") ari icye kandi yatanze n\'ibimenyetso. Nimero ye ni 0899999476738.',0,'2026-08-12 16:53:01');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `id_card` char(16) NOT NULL,
  `province` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `sector` varchar(50) NOT NULL,
  `umudugudu` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'active',
  `profile_pic` varchar(255) DEFAULT NULL,
  `language` varchar(20) DEFAULT 'english',
  `theme` varchar(10) DEFAULT 'light',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_card` (`id_card`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'Nsabiyumva Eric','1200580213537085','North','Burera','Kagogo','Rukoro','$2b$10$W6h/NzwL9Y0Vd7H3FqMp4uy3Xot1FBKQ9Cq14eDW3LK6829YxsJmm','2026-07-27 15:37:05','active',NULL,'english','dark'),(7,'MUNYANEZA ERIC','1200675689041231','north','burera','ruhango','rwoga','$2b$10$/CZsQGy6UeJQTWriQXWpH.FHdZze91rPF1io7Og7IzgKNmr37.RYm','2026-07-27 18:12:36','active',NULL,'english','light'),(8,'sibomana edouard','1200345678342110','north','kamonyi','kayenzi',' gisasamana','$2b$10$xSRv7DocAJs4gO8hOeJSYOh416O1kDHAoTySjOUkEBvPK6EKlZCAK','2026-07-28 09:29:36','active',NULL,'english','light'),(9,'uwambajimana','1111111111111111','north','burera','kagogo','rukoro','$2b$10$iFMbjuOILv0Tv3Eo1f4hD.ib3iR9YAJj0pRIp0Vv7DveQdCbDNnSS','2026-08-02 09:47:18','active',NULL,'english','dark'),(10,'KANYABUGANDE','2222222222222222','south','ruhango','ruhango','rwoga','$2b$10$hz/mr1n0t3fyEbMyqQK8BO4grGKsjXCBL/PQHLaFM4M01LiT4Qqw.','2026-08-04 01:52:03','active',NULL,'english','light'),(11,'sebanani siriro','5555555555555555','north','musanze','rwaza','rwara','$2b$10$qhtxd.dAJcQDatW0Rv5vKOlY1mzqCT8gfx14K.utDYII5tpYJyrEm','2026-08-08 09:26:25','active',NULL,'english','light'),(12,'munyana','3333333333333333','amajyepfo','nyanza','nyanza',' kagobe','$2b$10$oTsLxyguaXzFKnnzrr8bF.fY3Uv/2gC8Rwr1JOtqpalhas6LT0ipy','2026-08-10 09:45:05','deleted',NULL,'english','light');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-13 13:26:09
