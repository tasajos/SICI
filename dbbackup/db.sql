CREATE DATABASE  IF NOT EXISTS `sici_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `sici_db`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sici_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `form_201_resumen_situacion`
--

DROP TABLE IF EXISTS `form_201_resumen_situacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_201_resumen_situacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `incident_date` datetime NOT NULL,
  `location` text NOT NULL,
  `incident_commander` varchar(255) NOT NULL,
  `incident_description` text NOT NULL,
  `actions_taken` text NOT NULL,
  `incident_objectives` text NOT NULL,
  `assigned_resources` text NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_201_resumen_situacion_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_201_resumen_situacion_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_201_resumen_situacion`
--

LOCK TABLES `form_201_resumen_situacion` WRITE;
/*!40000 ALTER TABLE `form_201_resumen_situacion` DISABLE KEYS */;
INSERT INTO `form_201_resumen_situacion` VALUES (1,'ads','2025-10-12 10:06:00','sdasd','asd','asd','asd','asd','asd','asd',2,9,'2025-10-12 14:06:58','2025-10-12 14:06:58'),(2,'Chimba','2025-10-13 11:02:00','cite','Carlos Azcarraga','asdasd','asdasd','asdasd','asdasd','asdasd',2,10,'2025-10-13 15:02:27','2025-10-13 15:02:27'),(3,'embarrancamiento','2025-10-13 22:23:00','sipe sipe','Carlos Azcarraga','se identifico un embarrarcamiento de flota trnas tupiza','establecer comunicacion , ambulancia para despachoi','rescatar personal y heridos','vehiculos ,ambulancias , camiones','rdesdasd',2,12,'2025-10-14 01:24:14','2025-10-14 01:24:14');
/*!40000 ALTER TABLE `form_201_resumen_situacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_202_objetivos_incidente`
--

DROP TABLE IF EXISTS `form_202_objetivos_incidente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_202_objetivos_incidente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `incident_date` datetime NOT NULL,
  `incident_objectives` text NOT NULL,
  `priorities` text NOT NULL,
  `guidelines` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_202_objetivos_incidente_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_202_objetivos_incidente_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_202_objetivos_incidente`
--

LOCK TABLES `form_202_objetivos_incidente` WRITE;
/*!40000 ALTER TABLE `form_202_objetivos_incidente` DISABLE KEYS */;
INSERT INTO `form_202_objetivos_incidente` VALUES (1,'asdasd','2025-10-12 10:13:00','asd','asd','asd',2,9,'2025-10-12 14:13:51','2025-10-12 14:13:51');
/*!40000 ALTER TABLE `form_202_objetivos_incidente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_203_organizacion_incidente`
--

DROP TABLE IF EXISTS `form_203_organizacion_incidente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_203_organizacion_incidente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `incident_date` datetime NOT NULL,
  `incident_commander` varchar(255) NOT NULL,
  `safety_officer` varchar(255) DEFAULT NULL,
  `liaison_officer` varchar(255) DEFAULT NULL,
  `public_information_officer` varchar(255) DEFAULT NULL,
  `operations_chief` varchar(255) DEFAULT NULL,
  `planning_chief` varchar(255) DEFAULT NULL,
  `logistics_chief` varchar(255) DEFAULT NULL,
  `finance_chief` varchar(255) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `organization_notes` text DEFAULT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_203_organizacion_incidente_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_203_organizacion_incidente_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_203_organizacion_incidente`
--

LOCK TABLES `form_203_organizacion_incidente` WRITE;
/*!40000 ALTER TABLE `form_203_organizacion_incidente` DISABLE KEYS */;
INSERT INTO `form_203_organizacion_incidente` VALUES (1,'fghfg','2025-10-12 00:00:00','fgh','fgh','fgh','fgh','fgh','fgh','fgh','fgh',2,'fgh',9,'2025-10-12 14:41:18','2025-10-12 14:41:18'),(2,'asdasd','2025-10-19 00:00:00','asd','asd','asd','asd','asd','asd','asd','asd',2,'asd',9,'2025-10-12 14:45:23','2025-10-12 14:45:23'),(3,'Chimba','2025-10-12 00:00:00','Carlos Azcarraga','Administrador Principa','Alvaro Melgar','david rojas','hjk','hjk','hjk','hjk',2,'hjk',10,'2025-10-12 15:32:53','2025-10-12 15:32:53'),(4,'embarrancamiento','2025-10-14 00:00:00','Carlos Azcarraga','Alvaro Melgar','andrea','alejandromiranda','luz','livan cordova','andrea ballesteros','patricia castellon',2,'personal completo de sci',12,'2025-10-14 01:26:04','2025-10-14 01:26:04');
/*!40000 ALTER TABLE `form_203_organizacion_incidente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_204_asignaciones_tacticas`
--

DROP TABLE IF EXISTS `form_204_asignaciones_tacticas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_204_asignaciones_tacticas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `division_group` varchar(255) NOT NULL,
  `assigned_resources` text NOT NULL,
  `tasks` text NOT NULL,
  `special_instructions` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_204_asignaciones_tacticas_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_204_asignaciones_tacticas_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_204_asignaciones_tacticas`
--

LOCK TABLES `form_204_asignaciones_tacticas` WRITE;
/*!40000 ALTER TABLE `form_204_asignaciones_tacticas` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_204_asignaciones_tacticas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_205_plan_comunicaciones`
--

DROP TABLE IF EXISTS `form_205_plan_comunicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_205_plan_comunicaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `radio_frequencies` text NOT NULL,
  `communication_channels` text NOT NULL,
  `contact_point` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_205_plan_comunicaciones_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_205_plan_comunicaciones_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_205_plan_comunicaciones`
--

LOCK TABLES `form_205_plan_comunicaciones` WRITE;
/*!40000 ALTER TABLE `form_205_plan_comunicaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_205_plan_comunicaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_206_plan_medico`
--

DROP TABLE IF EXISTS `form_206_plan_medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_206_plan_medico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `medical_resources_available` text NOT NULL,
  `medical_attention_point` varchar(255) NOT NULL,
  `medical_procedures` text NOT NULL,
  `medical_contacts` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_206_plan_medico_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_206_plan_medico_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_206_plan_medico`
--

LOCK TABLES `form_206_plan_medico` WRITE;
/*!40000 ALTER TABLE `form_206_plan_medico` DISABLE KEYS */;
INSERT INTO `form_206_plan_medico` VALUES (1,'pacata','asdasd','Punto de Triage','asdasdasd','asdasdasd',2,11,'2025-10-12 23:01:44','2025-10-12 23:01:44');
/*!40000 ALTER TABLE `form_206_plan_medico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_207_lista_recursos`
--

DROP TABLE IF EXISTS `form_207_lista_recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_207_lista_recursos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `resource_type` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `resource_status` enum('disponible','en_uso','mantenimiento','baja') NOT NULL,
  `assignment` varchar(255) NOT NULL,
  `resource_specifications` text DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_207_lista_recursos_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_207_lista_recursos_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_207_lista_recursos`
--

LOCK TABLES `form_207_lista_recursos` WRITE;
/*!40000 ALTER TABLE `form_207_lista_recursos` DISABLE KEYS */;
INSERT INTO `form_207_lista_recursos` VALUES (1,'Chimba','Personal',5,'disponible','fgh','fg','fh',2,10,'2025-10-12 18:48:38','2025-10-12 18:48:38'),(2,'Chimba','Personal',4,'mantenimiento','asd','asd','asd',2,10,'2025-10-12 21:03:25','2025-10-12 21:03:25'),(3,'Chimba','Comunicaciones',2,'disponible','dsa','asd','asdasd',2,10,'2025-10-12 21:11:40','2025-10-12 21:11:40');
/*!40000 ALTER TABLE `form_207_lista_recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_208_resumen_situacion`
--

DROP TABLE IF EXISTS `form_208_resumen_situacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_208_resumen_situacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `incident_description` text NOT NULL,
  `current_status` text NOT NULL,
  `involved_resources` text NOT NULL,
  `objectives_progress` text NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_208_resumen_situacion_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_208_resumen_situacion_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_208_resumen_situacion`
--

LOCK TABLES `form_208_resumen_situacion` WRITE;
/*!40000 ALTER TABLE `form_208_resumen_situacion` DISABLE KEYS */;
INSERT INTO `form_208_resumen_situacion` VALUES (1,'Chimba','sdfsdf','sdf','sdfsdf','sdfsdf','sdf',2,10,'2025-10-12 21:36:39','2025-10-12 21:36:39');
/*!40000 ALTER TABLE `form_208_resumen_situacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_209_registro_progreso`
--

DROP TABLE IF EXISTS `form_209_registro_progreso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_209_registro_progreso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `activity` text NOT NULL,
  `responsible` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_209_registro_progreso_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_209_registro_progreso_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_209_registro_progreso`
--

LOCK TABLES `form_209_registro_progreso` WRITE;
/*!40000 ALTER TABLE `form_209_registro_progreso` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_209_registro_progreso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_211_registro_personal`
--

DROP TABLE IF EXISTS `form_211_registro_personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_211_registro_personal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `person_name` varchar(255) NOT NULL,
  `institution` varchar(255) NOT NULL,
  `entry_time` time NOT NULL,
  `exit_time` time DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_211_registro_personal_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_211_registro_personal_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_211_registro_personal`
--

LOCK TABLES `form_211_registro_personal` WRITE;
/*!40000 ALTER TABLE `form_211_registro_personal` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_211_registro_personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_212_registro_seguridad`
--

DROP TABLE IF EXISTS `form_212_registro_seguridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_212_registro_seguridad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `risk_category` varchar(255) DEFAULT NULL,
  `identified_risk` text NOT NULL,
  `safety_messages` text NOT NULL,
  `safety_measures` text NOT NULL,
  `responsible` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_212_registro_seguridad_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_212_registro_seguridad_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_212_registro_seguridad`
--

LOCK TABLES `form_212_registro_seguridad` WRITE;
/*!40000 ALTER TABLE `form_212_registro_seguridad` DISABLE KEYS */;
INSERT INTO `form_212_registro_seguridad` VALUES (1,'pacata','2025-10-12 19:12:00','Riesgo Ambiental','adsasd','asdsasdasd','','asdasd','asdasd',2,11,'2025-10-12 23:12:36','2025-10-12 23:12:36');
/*!40000 ALTER TABLE `form_212_registro_seguridad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_213_registro_comunicaciones`
--

DROP TABLE IF EXISTS `form_213_registro_comunicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_213_registro_comunicaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `communication_channel` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `sender` varchar(255) NOT NULL,
  `receiver` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_213_registro_comunicaciones_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_213_registro_comunicaciones_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_213_registro_comunicaciones`
--

LOCK TABLES `form_213_registro_comunicaciones` WRITE;
/*!40000 ALTER TABLE `form_213_registro_comunicaciones` DISABLE KEYS */;
INSERT INTO `form_213_registro_comunicaciones` VALUES (1,'sismo','2025-10-12 18:42:00','Radio HF','asd','asd','asd','asdasd',2,8,'2025-10-12 22:43:02','2025-10-12 22:43:02');
/*!40000 ALTER TABLE `form_213_registro_comunicaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_214_registro_actividades`
--

DROP TABLE IF EXISTS `form_214_registro_actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_214_registro_actividades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `activity` text NOT NULL,
  `responsible` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_214_registro_actividades_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_214_registro_actividades_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_214_registro_actividades`
--

LOCK TABLES `form_214_registro_actividades` WRITE;
/*!40000 ALTER TABLE `form_214_registro_actividades` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_214_registro_actividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_215_registro_logistica`
--

DROP TABLE IF EXISTS `form_215_registro_logistica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_215_registro_logistica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `resource` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` enum('disponible','en_uso','agotado','en_mantenimiento') NOT NULL,
  `location` varchar(255) NOT NULL,
  `responsible` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_215_registro_logistica_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_215_registro_logistica_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_215_registro_logistica`
--

LOCK TABLES `form_215_registro_logistica` WRITE;
/*!40000 ALTER TABLE `form_215_registro_logistica` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_215_registro_logistica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_216_registro_finanzas`
--

DROP TABLE IF EXISTS `form_216_registro_finanzas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_216_registro_finanzas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `transaction` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `responsible` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_216_registro_finanzas_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_216_registro_finanzas_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_216_registro_finanzas`
--

LOCK TABLES `form_216_registro_finanzas` WRITE;
/*!40000 ALTER TABLE `form_216_registro_finanzas` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_216_registro_finanzas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_217_informe_evaluacion`
--

DROP TABLE IF EXISTS `form_217_informe_evaluacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_217_informe_evaluacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `evaluator` varchar(255) NOT NULL,
  `observations` text NOT NULL,
  `recommendations` text NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_217_informe_evaluacion_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_217_informe_evaluacion_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_217_informe_evaluacion`
--

LOCK TABLES `form_217_informe_evaluacion` WRITE;
/*!40000 ALTER TABLE `form_217_informe_evaluacion` DISABLE KEYS */;
INSERT INTO `form_217_informe_evaluacion` VALUES (1,'Chimba','2025-10-12 18:11:00','asd','asd','asdasd','asd',2,10,'2025-10-12 22:11:28','2025-10-12 22:11:28');
/*!40000 ALTER TABLE `form_217_informe_evaluacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_218_registro_desmovilizacion_recursos`
--

DROP TABLE IF EXISTS `form_218_registro_desmovilizacion_recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_218_registro_desmovilizacion_recursos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `resource` varchar(255) NOT NULL,
  `responsible` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_218_registro_desmovilizacion_recursos_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_218_registro_desmovilizacion_recursos_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_218_registro_desmovilizacion_recursos`
--

LOCK TABLES `form_218_registro_desmovilizacion_recursos` WRITE;
/*!40000 ALTER TABLE `form_218_registro_desmovilizacion_recursos` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_218_registro_desmovilizacion_recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_219_informe_desmovilizacion`
--

DROP TABLE IF EXISTS `form_219_informe_desmovilizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_219_informe_desmovilizacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `description` text NOT NULL,
  `released_resources` text NOT NULL,
  `observations` text NOT NULL,
  `recommendations` text NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_219_informe_desmovilizacion_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_219_informe_desmovilizacion_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_219_informe_desmovilizacion`
--

LOCK TABLES `form_219_informe_desmovilizacion` WRITE;
/*!40000 ALTER TABLE `form_219_informe_desmovilizacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_219_informe_desmovilizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_220_registro_lecciones_aprendidas`
--

DROP TABLE IF EXISTS `form_220_registro_lecciones_aprendidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_220_registro_lecciones_aprendidas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `record_date` datetime NOT NULL,
  `learned_lesson` text NOT NULL,
  `impact` text NOT NULL,
  `implementation` text NOT NULL,
  `recommendations` text NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_220_registro_lecciones_aprendidas_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_220_registro_lecciones_aprendidas_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_220_registro_lecciones_aprendidas`
--

LOCK TABLES `form_220_registro_lecciones_aprendidas` WRITE;
/*!40000 ALTER TABLE `form_220_registro_lecciones_aprendidas` DISABLE KEYS */;
INSERT INTO `form_220_registro_lecciones_aprendidas` VALUES (1,'Chimba','2025-10-12 18:27:00','asdasd','asdasd','asdasd','asdasd','adad',2,10,'2025-10-12 22:28:09','2025-10-12 22:28:09');
/*!40000 ALTER TABLE `form_220_registro_lecciones_aprendidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_221_verificacion_desmovilizacion`
--

DROP TABLE IF EXISTS `form_221_verificacion_desmovilizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_221_verificacion_desmovilizacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `preparation_datetime` datetime NOT NULL,
  `operational_period` varchar(255) NOT NULL,
  `estimated_completion_time` varchar(255) NOT NULL,
  `planning_section_checklist` text NOT NULL,
  `operations_section_checklist` text NOT NULL,
  `logistics_section_checklist` text NOT NULL,
  `admin_finance_section_checklist` text NOT NULL,
  `observations` text NOT NULL,
  `prepared_by` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `incident_id` (`incident_id`),
  CONSTRAINT `form_221_verificacion_desmovilizacion_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `form_221_verificacion_desmovilizacion_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_221_verificacion_desmovilizacion`
--

LOCK TABLES `form_221_verificacion_desmovilizacion` WRITE;
/*!40000 ALTER TABLE `form_221_verificacion_desmovilizacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_221_verificacion_desmovilizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_assignments`
--

DROP TABLE IF EXISTS `incident_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `incident_id` int(11) NOT NULL,
  `assignment_type` enum('commander','public_information_officer','liaison_officer','safety_officer') NOT NULL,
  `assignment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','completed','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_incident_id` (`incident_id`),
  KEY `idx_assignment_type` (`assignment_type`),
  KEY `idx_status` (`status`),
  CONSTRAINT `incident_assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `incident_assignments_ibfk_2` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_assignments`
--

LOCK TABLES `incident_assignments` WRITE;
/*!40000 ALTER TABLE `incident_assignments` DISABLE KEYS */;
INSERT INTO `incident_assignments` VALUES (1,5,8,'commander','2025-10-11 00:37:01','active','2025-10-11 00:37:01','2025-10-11 00:37:01'),(2,2,8,'public_information_officer','2025-10-11 00:37:01','active','2025-10-11 00:37:01','2025-10-11 00:37:01'),(3,4,8,'liaison_officer','2025-10-11 00:37:01','active','2025-10-11 00:37:01','2025-10-11 00:37:01'),(4,5,8,'safety_officer','2025-10-11 00:37:01','active','2025-10-11 00:37:01','2025-10-11 00:37:01'),(5,2,9,'commander','2025-10-11 16:20:22','active','2025-10-11 16:20:22','2025-10-11 16:20:22'),(6,5,9,'public_information_officer','2025-10-11 16:20:22','active','2025-10-11 16:20:22','2025-10-11 16:20:22'),(7,3,9,'liaison_officer','2025-10-11 16:20:22','active','2025-10-11 16:20:22','2025-10-11 16:20:22'),(8,5,9,'safety_officer','2025-10-11 16:20:22','active','2025-10-11 16:20:22','2025-10-11 16:20:22'),(9,2,10,'commander','2025-10-12 15:15:15','active','2025-10-12 15:15:15','2025-10-12 15:15:15'),(10,5,10,'public_information_officer','2025-10-12 15:15:15','active','2025-10-12 15:15:15','2025-10-12 15:15:15'),(11,4,10,'liaison_officer','2025-10-12 15:15:15','active','2025-10-12 15:15:15','2025-10-12 15:15:15'),(12,1,10,'safety_officer','2025-10-12 15:15:15','active','2025-10-12 15:15:15','2025-10-12 15:15:15'),(13,2,11,'commander','2025-10-12 22:45:19','active','2025-10-12 22:45:19','2025-10-12 22:45:19'),(14,5,11,'public_information_officer','2025-10-12 22:45:19','active','2025-10-12 22:45:19','2025-10-12 22:45:19'),(15,2,11,'liaison_officer','2025-10-12 22:45:19','active','2025-10-12 22:45:19','2025-10-12 22:45:19'),(16,2,11,'safety_officer','2025-10-12 22:45:19','active','2025-10-12 22:45:19','2025-10-12 22:45:19'),(17,2,12,'commander','2025-10-14 01:20:31','active','2025-10-14 01:20:31','2025-10-14 01:20:31'),(18,7,12,'public_information_officer','2025-10-14 01:20:31','active','2025-10-14 01:20:31','2025-10-14 01:20:31'),(19,6,12,'liaison_officer','2025-10-14 01:20:31','active','2025-10-14 01:20:31','2025-10-14 01:20:31'),(20,4,12,'safety_officer','2025-10-14 01:20:31','active','2025-10-14 01:20:31','2025-10-14 01:20:31');
/*!40000 ALTER TABLE `incident_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_forms`
--

DROP TABLE IF EXISTS `incident_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_forms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_id` int(11) NOT NULL,
  `form_type` enum('form_201','form_202','form_203','form_204','form_205','form_206','form_207','form_208','form_209','form_211','form_212','form_213','form_214','form_215','form_216','form_217','form_218','form_219','form_220','form_221') NOT NULL,
  `form_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `status` enum('borrador','completado','revisado') DEFAULT 'borrador',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_incident_form` (`incident_id`,`form_type`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `incident_forms_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`),
  CONSTRAINT `incident_forms_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_forms`
--

LOCK TABLES `incident_forms` WRITE;
/*!40000 ALTER TABLE `incident_forms` DISABLE KEYS */;
INSERT INTO `incident_forms` VALUES (1,9,'',1,2,'borrador','2025-10-12 14:06:58','2025-10-12 14:06:58'),(2,9,'',1,2,'borrador','2025-10-12 14:13:51','2025-10-12 14:13:51'),(3,9,'',1,2,'borrador','2025-10-12 14:41:18','2025-10-12 14:41:18'),(4,9,'',2,2,'borrador','2025-10-12 14:45:23','2025-10-12 14:45:23'),(5,10,'',3,2,'borrador','2025-10-12 15:32:53','2025-10-12 15:32:53'),(6,10,'',1,2,'borrador','2025-10-12 18:48:38','2025-10-12 18:48:38'),(7,10,'',2,2,'borrador','2025-10-12 21:03:25','2025-10-12 21:03:25'),(8,10,'',3,2,'borrador','2025-10-12 21:11:40','2025-10-12 21:11:40'),(9,10,'',1,2,'borrador','2025-10-12 21:36:39','2025-10-12 21:36:39'),(10,10,'',1,2,'borrador','2025-10-12 22:11:28','2025-10-12 22:11:28'),(11,10,'',1,2,'borrador','2025-10-12 22:28:09','2025-10-12 22:28:09'),(12,8,'',1,2,'borrador','2025-10-12 22:43:02','2025-10-12 22:43:02'),(13,11,'',1,2,'borrador','2025-10-12 23:01:44','2025-10-12 23:01:44'),(14,11,'',1,2,'borrador','2025-10-12 23:12:36','2025-10-12 23:12:36'),(15,10,'',2,2,'borrador','2025-10-13 15:02:27','2025-10-13 15:02:27'),(16,12,'',3,2,'borrador','2025-10-14 01:24:14','2025-10-14 01:24:14'),(17,12,'',4,2,'borrador','2025-10-14 01:26:04','2025-10-14 01:26:04');
/*!40000 ALTER TABLE `incident_forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidents`
--

DROP TABLE IF EXISTS `incidents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_name` varchar(255) NOT NULL,
  `incident_type` varchar(100) NOT NULL,
  `severity_level` enum('bajo','medio','alto','critico') NOT NULL,
  `location` text NOT NULL,
  `description` text NOT NULL,
  `commander` varchar(255) NOT NULL,
  `public_information_officer` varchar(255) DEFAULT NULL,
  `liaison_officer` varchar(255) DEFAULT NULL,
  `safety_officer` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `estimated_duration` varchar(100) DEFAULT NULL,
  `resources_needed` text DEFAULT NULL,
  `emergency_contacts` text DEFAULT NULL,
  `status` enum('activo','cerrado','suspendido') DEFAULT 'activo',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidents`
--

LOCK TABLES `incidents` WRITE;
/*!40000 ALTER TABLE `incidents` DISABLE KEYS */;
INSERT INTO `incidents` VALUES (1,'sismo','Terremoto','medio','cala','adsads','5','3','2','4','2025-10-09 11:21:00','23','asd','asd','cerrado',1,'2025-10-09 15:21:17','2025-10-10 21:57:41'),(2,'Incendio Forestal','Incendio Forestal','alto','Tunari','incendio de magnitud','4','3','2','4','2025-10-09 22:32:00','20 horas','equipos de primera respuesta','70776212','cerrado',1,'2025-10-10 02:32:36','2025-10-10 21:57:41'),(3,'Incendio Forestal Tirani','Incendio Forestal','alto','parque tunari','parque tunari','5','4','2','4','2025-10-10 17:30:00','20 horas','asd','asd','cerrado',2,'2025-10-10 21:30:54','2025-10-13 01:32:08'),(4,'Inundacion Tiquipaya','Inundación','alto','tiquipaya','inudacion','5','4','4','3','2025-10-10 17:45:00','20 horas','asd','asdasd','cerrado',2,'2025-10-10 21:45:21','2025-10-14 01:21:40'),(5,'Incendio Forestal Tirani','Incendio Forestal','alto','casa blanca','casa blanca','2','4','5','3','2025-10-10 18:44:00','10 horas','aasd','70776212','cerrado',2,'2025-10-10 22:44:49','2025-10-14 01:21:43'),(6,'Incendio Forestal Tirani','Incendio Forestal','alto','tras','dasdasd','2','5','4','3','2025-10-10 19:36:00','10 horas','ad','adad','cerrado',1,'2025-10-10 23:36:26','2025-10-14 01:21:46'),(7,'sismo','Incendio Estructural','alto','colegio cushieri','asdasd','2','3','5','4','2025-10-10 20:28:00','20 horas','asd','asd','cerrado',1,'2025-10-11 00:28:34','2025-10-14 01:21:49'),(8,'sismo','Incendio Forestal','medio','colegio cushieri','asasa','5','2','4','5','2025-10-10 20:36:00','22','sd','sdsd','activo',1,'2025-10-11 00:37:01','2025-10-11 00:37:01'),(9,'Incendio Forestal Tirani','Incendio Forestal','alto','sipe sipe','sipe sipe','2','5','3','5','2025-10-11 12:20:00','20 horas','ads','asdad','activo',2,'2025-10-11 16:20:22','2025-10-11 16:20:22'),(10,'Chimba','Inundación','alto','cite','asdasd','2','5','4','1','2025-10-12 11:15:00','20 horas','asdasd','asdasd','activo',1,'2025-10-12 15:15:15','2025-10-12 15:15:15'),(11,'pacata','Terremoto','alto','colegio cushieri','dfsds','2','5','2','2','2025-10-12 18:45:00','20 horas','sad','sasad','activo',2,'2025-10-12 22:45:19','2025-10-12 22:45:19'),(12,'embarrancamiento','Terremoto','alto','sipe sipe','flota se accidenta en el km 10','2','7','6','4','2025-10-13 21:20:00','10 horas','vehiculos , ambulancia','470776212','activo',2,'2025-10-14 01:20:31','2025-10-14 01:20:31');
/*!40000 ALTER TABLE `incidents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador'),(3,'Estado'),(2,'Voluntario');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_configuration`
--

DROP TABLE IF EXISTS `system_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_configuration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config_key` varchar(100) NOT NULL,
  `config_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config_value`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_key` (`config_key`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_configuration`
--

LOCK TABLES `system_configuration` WRITE;
/*!40000 ALTER TABLE `system_configuration` DISABLE KEYS */;
INSERT INTO `system_configuration` VALUES (1,'ics_forms','{\"form201\":true,\"form202\":true,\"form203\":false,\"form204\":false,\"form205\":false,\"form206\":false,\"form207\":false,\"form208\":true,\"form209\":true,\"form211\":false,\"form212\":false,\"form213\":false,\"form214\":false,\"form215\":false,\"form216\":false,\"form217\":true,\"form218\":false,\"form219\":true,\"form220\":true,\"form221\":false}','2025-10-11 18:09:44','2025-10-11 18:09:44');
/*!40000 ALTER TABLE `system_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_types`
--

DROP TABLE IF EXISTS `unit_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_emergency_unit` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_types`
--

LOCK TABLES `unit_types` WRITE;
/*!40000 ALTER TABLE `unit_types` DISABLE KEYS */;
INSERT INTO `unit_types` VALUES (1,'Bomberos','Cuerpo de bomberos voluntarios o profesionales',1,'2025-10-10 01:21:44'),(2,'Cruz Roja','Unidades de la Cruz Roja',1,'2025-10-10 01:21:44'),(3,'Policía','Unidades policiales',1,'2025-10-10 01:21:44'),(4,'Rescate','Equipos de rescate especializado',1,'2025-10-10 01:21:44'),(5,'Ambulancia','Servicios de ambulancia y paramédicos',1,'2025-10-10 01:21:44'),(6,'Defensa Civil','Unidades de defensa civil',1,'2025-10-10 01:21:44'),(7,'ONG','Organizaciones no gubernamentales',0,'2025-10-10 01:21:44'),(8,'Municipalidad','Unidades municipales',0,'2025-10-10 01:21:44'),(9,'Otros','Otras instituciones',0,'2025-10-10 01:21:44'),(10,'Bomberos Voluntarios','Bomberos Voluntarios',1,'2025-10-10 01:21:44'),(11,'EPR','Equipo de Primera Respuesta',1,'2025-10-10 01:21:44');
/*!40000 ALTER TABLE `unit_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `unit_type_id` int(11) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `available_members` int(11) DEFAULT 0,
  `available_vehicles` int(11) DEFAULT 0,
  `available_equipment` text DEFAULT NULL,
  `status` enum('activo','inactivo','en_mision') DEFAULT 'activo',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `unit_type_id` (`unit_type_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `units_ibfk_1` FOREIGN KEY (`unit_type_id`) REFERENCES `unit_types` (`id`),
  CONSTRAINT `units_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'Yunka Atoq',10,'Carlos Azcarraga','70776212','presidente@bomberosatoq.org','mariano mendez 2135',10,0,'10 batefuegos\n5 mochilas','activo',NULL,NULL,'Fundacion de Voluntarios',1,'2025-10-10 01:33:45','2025-10-10 01:33:45'),(2,'Tunari sin Fuego',9,'Janeth','76439833',NULL,NULL,5,5,NULL,'activo',NULL,NULL,NULL,1,'2025-10-10 01:36:09','2025-10-10 01:36:09'),(3,'vtlv',9,'juan pablo','7071231','vtlv@vtlv.com','calac',5,20,'asdasd','activo',0.00000000,0.00000000,'asdasd',1,'2025-10-14 01:17:31','2025-10-14 01:17:31');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_created_by` (`created_by`),
  KEY `idx_users_is_active` (`is_active`),
  KEY `fk_users_unit_id` (`unit_id`),
  CONSTRAINT `fk_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_users_unit_id` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','adminpass','Administrador Principal','tasajos@gmail.com','70776212',1,NULL,1,'2025-10-09 21:31:11','2025-10-09 21:32:07',NULL,NULL),(2,'cazcarraga','4947021','Carlos Azcarraga','presidente@bomberosatoq.org','70776212',2,1,1,'2025-10-09 21:33:27','2025-10-10 22:42:20',1,'fundacion yunka atoq'),(3,'atoq','4947022','atoq','informacion@bomberosatoq.org','70776212',3,NULL,0,'2025-10-09 21:44:05','2025-10-11 17:15:27',1,'atoq'),(4,'amelgar','4947021','Alvaro Melgar','amelgar@gmail.com','76982189',2,1,1,'2025-10-10 21:00:49','2025-10-10 21:15:46',1,'atoq'),(5,'drojas','4947021','david rojas','drojas@bomberosatoq.org',NULL,2,1,1,'2025-10-10 21:14:51','2025-10-10 21:14:51',1,'sdd'),(6,'sandoval','sandoval','andrea','asandoval@gmail.com','707112345',2,1,1,'2025-10-14 01:16:32','2025-10-14 01:16:32',1,NULL),(7,'amiranda','miranda','alejandromiranda','amiranda@gmail.com','7077612',2,3,1,'2025-10-14 01:18:07','2025-10-14 01:18:07',1,NULL);
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

-- Dump completed on 2025-10-13 21:58:15
