-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2023 at 08:11 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fp_kriptografi`
--

-- --------------------------------------------------------

--
-- Table structure for table `userinfo`
--

CREATE TABLE `userinfo` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `vote` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userinfo`
--

INSERT INTO `userinfo` (`id`, `username`, `vote`) VALUES
(1, 'Pemilihpertama', '\"2d6e80654e828afc308709cd7ddda69436bc9422c5abb21e2ba634870740034c-516153857\"'),
(2, 'Ohgituyabang', '\"6470bd36a703b70ecbc2ac986b474613e330260dfd70b8e6cdf0f385a466a286-2305412323\"'),
(3, 'Daripadalu', '\"c45f5466de0f5febbdb3736c754477cec23d7152ce0700c4eb3bf679be643231-2037471293\"'),
(4, 'Awik', '\"e687f8c9944faed167fdf1abc35517be005646205178d438c71daf3e45ac1022-606824767\"'),
(5, 'Awok', '\"af30290e08860003807b05db8a3be0fb5005237f2f9fcea44f500833413c5f66-1448287285\"'),
(6, 'Awikwok', '\"c56d398716412bf52de1af1eaa879ccf86a23b3f559cae83971cb6091ab8f32a-35309678\"'),
(7, 'AwikAwok', '\"766725fc930193daff705cc344ef34f0e2bdefcf51011cd8c1d2172d3a05816d-1434484859\"'),
(8, 'EmangbolehseKIRIini', '\"2d55a76ed2e30386f8adf69f8a7573a4f597bf5563b5107934ec88b6ae315ca6-1197301978\"');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
