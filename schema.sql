-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u8
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 28, 2017 at 01:28 PM
-- Server version: 5.5.54
-- PHP Version: 5.4.45-0+deb7u9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `lambda`
--

-- --------------------------------------------------------

--
-- Table structure for table `coinflips`
--

CREATE TABLE IF NOT EXISTS `coinflips` (
  `gameID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` varchar(30) NOT NULL,
  `guildID` varchar(30) NOT NULL,
  `bet` int(11) NOT NULL,
  `isHeads` tinyint(1) NOT NULL,
  `created_timestamp` datetime NOT NULL,
  PRIMARY KEY (`gameID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=31 ;

-- --------------------------------------------------------

--
-- Table structure for table `customreactions`
--

CREATE TABLE IF NOT EXISTS `customreactions` (
  `crID` int(11) NOT NULL AUTO_INCREMENT,
  `triggerText` text CHARACTER SET utf8 NOT NULL,
  `reactionText` text CHARACTER SET utf8 NOT NULL,
  `guildID` varchar(30) NOT NULL,
  PRIMARY KEY (`crID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

-- --------------------------------------------------------

--
-- Table structure for table `ownership`
--

CREATE TABLE IF NOT EXISTS `ownership` (
  `created` datetime DEFAULT NULL,
  `masterID` varchar(20) NOT NULL DEFAULT '',
  `slaveID` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`masterID`,`slaveID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE IF NOT EXISTS `properties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(20) NOT NULL DEFAULT '',
  `balance` int(11) DEFAULT NULL,
  `experience` int(11) DEFAULT NULL,
  `created_timestamp` datetime DEFAULT NULL,
  `lastmessage_timestamp` datetime DEFAULT NULL,
  `lastimage_timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
