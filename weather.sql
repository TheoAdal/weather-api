-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: weather
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `forecasts`
--

DROP TABLE IF EXISTS `forecasts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forecasts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_id` int DEFAULT NULL,
  `date` date NOT NULL,
  `temperature` float NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `humidity` decimal(5,2) DEFAULT NULL,
  `wind_speed` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `forecasts_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecasts`
--

LOCK TABLES `forecasts` WRITE;
/*!40000 ALTER TABLE `forecasts` DISABLE KEYS */;
INSERT INTO `forecasts` VALUES (219,1,'2025-04-04',10.3,'2025-04-04 10:54:46',81.20,2.20),(220,1,'2025-04-05',9.4,'2025-04-04 10:54:46',89.40,0.70),(221,1,'2025-04-06',9.7,'2025-04-04 10:54:46',94.30,0.20),(222,1,'2025-04-07',7.4,'2025-04-04 10:54:46',71.40,3.20),(223,1,'2025-04-08',5.9,'2025-04-04 10:54:46',77.40,2.40),(224,1,'2025-04-09',6.2,'2025-04-04 10:54:46',90.40,1.20),(225,1,'2025-04-10',7.1,'2025-04-04 10:54:46',90.80,1.10),(226,2,'2025-04-04',13.3,'2025-04-04 10:54:46',80.30,5.00),(227,2,'2025-04-05',12.7,'2025-04-04 10:54:46',94.30,5.80),(228,2,'2025-04-06',11.8,'2025-04-04 10:54:46',89.80,2.30),(229,2,'2025-04-07',11.5,'2025-04-04 10:54:46',88.10,1.50),(230,2,'2025-04-08',12.4,'2025-04-04 10:54:46',90.80,1.30),(231,2,'2025-04-09',15.7,'2025-04-04 10:54:46',77.30,2.60),(232,2,'2025-04-10',16.1,'2025-04-04 10:54:46',82.60,0.90),(233,3,'2025-04-04',15.4,'2025-04-04 10:54:46',59.70,5.50),(234,3,'2025-04-05',20.4,'2025-04-04 10:54:46',30.00,4.80),(235,3,'2025-04-06',27.6,'2025-04-04 10:54:46',7.80,2.70),(236,3,'2025-04-07',25.5,'2025-04-04 10:54:46',13.80,3.70),(237,3,'2025-04-08',23.6,'2025-04-04 10:54:46',27.40,2.50),(238,3,'2025-04-09',23.4,'2025-04-04 10:54:46',32.50,2.60),(239,3,'2025-04-10',25.4,'2025-04-04 18:54:46',32.40,2.80),(240,3,'2025-04-10',40,'2025-04-04 11:00:00',30.00,3.00),(242,3,'2025-04-10',40,'2025-04-04 15:00:00',30.00,3.00),(243,3,'2025-04-10',40,'2025-04-04 17:00:00',30.00,3.00);
/*!40000 ALTER TABLE `forecasts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (3,'Los Angeles'),(2,'Porto'),(1,'Rome');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'weather'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-07 11:29:51
