-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 09, 2025 at 04:15 AM
-- Server version: 11.8.2-MariaDB
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `teras_rasa`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `nama_admin` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `nama_admin`, `username`, `password`) VALUES
(1, 'Mamang', 'mamang', '123456789');

-- --------------------------------------------------------

--
-- Table structure for table `kasir`
--

CREATE TABLE `kasir` (
  `id_kasir` int(11) NOT NULL,
  `nama_kasir` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kasir`
--

INSERT INTO `kasir` (`id_kasir`, `nama_kasir`, `username`, `password`) VALUES
(1, 'Asep', 'asep', '12345');

-- --------------------------------------------------------

--
-- Table structure for table `koki`
--

CREATE TABLE `koki` (
  `id_koki` int(11) NOT NULL,
  `nama_koki` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `koki`
--

INSERT INTO `koki` (`id_koki`, `nama_koki`, `username`, `password`) VALUES
(1, 'Udin', 'udin', '12345');

-- --------------------------------------------------------

--
-- Table structure for table `meja`
--

CREATE TABLE `meja` (
  `id_meja` int(11) NOT NULL,
  `status_meja` enum('KOSONG','TERISI') NOT NULL DEFAULT 'KOSONG'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meja`
--

INSERT INTO `meja` (`id_meja`, `status_meja`) VALUES
(1, 'KOSONG'),
(2, 'KOSONG'),
(3, 'KOSONG'),
(4, 'KOSONG'),
(5, 'KOSONG'),
(6, 'KOSONG'),
(7, 'KOSONG'),
(8, 'KOSONG'),
(9, 'KOSONG'),
(10, 'KOSONG'),
(11, 'KOSONG');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id_menu` int(11) NOT NULL,
  `nama_menu` varchar(255) NOT NULL,
  `jenis_menu` enum('MAKANAN','MINUMAN') NOT NULL,
  `harga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id_menu`, `nama_menu`, `jenis_menu`, `harga`) VALUES
(1, 'Nasi Goreng', 'MAKANAN', 15000),
(2, 'Mie Goreng', 'MAKANAN', 10000),
(3, 'Es Teh Manis', 'MINUMAN', 3000),
(4, 'Es Teh Tawar', 'MINUMAN', 2000),
(5, 'Chocolatos Matcha', 'MINUMAN', 5000),
(6, 'Mie Kocok Bandung', 'MAKANAN', 15000),
(7, 'Nutrisari Blewah', 'MINUMAN', 4000),
(8, 'Nasi Goreng Sosis', 'MAKANAN', 12000),
(9, 'Nasi Goreng Mawut', 'MAKANAN', 13000),
(10, 'Nasi Goreng Omelet', 'MAKANAN', 16000),
(11, 'Nasi Telor Dadar', 'MAKANAN', 9000),
(12, 'Nasi Ayam Suwir', 'MAKANAN', 10000),
(13, 'Indomie Goreng Aceh', 'MAKANAN', 6000),
(14, 'Indomie Goreng Special', 'MAKANAN', 6000),
(15, 'Indomie Goreng Geprek', 'MAKANAN', 6000);

-- --------------------------------------------------------

--
-- Table structure for table `menu_pesanan`
--

CREATE TABLE `menu_pesanan` (
  `id_menu` int(11) DEFAULT NULL,
  `id_pesanan` int(11) DEFAULT NULL,
  `nama_menu` varchar(255) DEFAULT NULL,
  `jumlah` int(11) NOT NULL DEFAULT 0,
  `sub_total` int(11) NOT NULL DEFAULT 0,
  `ketersediaan` enum('TERSEDIA','TIDAK_TERSEDIA') NOT NULL DEFAULT 'TERSEDIA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pelanggan`
--

CREATE TABLE `pelanggan` (
  `id_pelanggan` int(11) NOT NULL,
  `nama_pelanggan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pelayan`
--

CREATE TABLE `pelayan` (
  `id_pelayan` int(11) NOT NULL,
  `nama_pelayan` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pelayan`
--

INSERT INTO `pelayan` (`id_pelayan`, `nama_pelayan`, `username`, `password`) VALUES
(1, 'Jaka', 'jaka', '12345');

-- --------------------------------------------------------

--
-- Table structure for table `pesanan`
--

CREATE TABLE `pesanan` (
  `id_pesanan` int(11) NOT NULL,
  `id_pelanggan` int(11) NOT NULL,
  `id_pelayan` int(11) DEFAULT NULL,
  `id_meja` int(11) NOT NULL,
  `id_koki` int(11) DEFAULT NULL,
  `status_pesanan` enum('BELUM_DIMASAK','SEDANG_DIMASAK','SIAP_DISAJIKAN','SUDAH_DISAJIKAN') NOT NULL DEFAULT 'BELUM_DIMASAK',
  `waktu_pesan` datetime NOT NULL,
  `waktu_bayar` datetime NOT NULL,
  `total_harga` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_pesanan`
--

CREATE TABLE `riwayat_pesanan` (
  `id_riwayat` int(11) NOT NULL,
  `nama_pelanggan` varchar(64) NOT NULL,
  `menu_pesanan` varchar(255) NOT NULL,
  `harga_total` int(11) NOT NULL,
  `id_meja` int(11) NOT NULL,
  `nama_kasir` varchar(64) NOT NULL,
  `waktu_bayar` datetime NOT NULL,
  `waktu_pesan` datetime NOT NULL,
  `id_kasir` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `riwayat_pesanan`
--

INSERT INTO `riwayat_pesanan` (`id_riwayat`, `nama_pelanggan`, `menu_pesanan`, `harga_total`, `id_meja`, `nama_kasir`, `waktu_bayar`, `waktu_pesan`, `id_kasir`) VALUES
(11, 'Pelanggan 4', '1x Chocolatos Matcha, 1x Mie Kocok Bandung', 20000, 4, 'Asep', '2025-08-07 10:50:50', '2025-08-07 10:38:59', 1),
(12, 'Pelanggan 3', '1x Es Teh Tawar, 1x Nasi Ayam Suwir', 12000, 3, 'Asep', '2025-08-07 10:50:54', '2025-08-07 10:36:49', 1),
(13, 'Pelanggan 2', '1x Mie Goreng, 1x Nutrisari Blewah', 14000, 2, 'Asep', '2025-08-07 10:50:58', '2025-08-07 10:32:29', 1),
(14, 'Pelanggan 1', '2x Nutrisari Blewah, 1x Indomie Goreng Aceh', 14000, 1, 'Asep', '2025-08-07 12:47:43', '2025-08-07 05:16:36', 1),
(15, 'Pelanggan 5', '1x Nutrisari Blewah, 1x Nasi Telor Dadar', 13000, 5, 'Asep', '2025-08-07 12:50:01', '2025-08-07 10:41:14', 1),
(16, 'Pelanggan 7', '1x Es Teh Tawar, 1x Indomie Goreng Aceh', 8000, 7, 'Asep', '2025-08-07 12:50:04', '2025-08-07 12:32:03', 1),
(17, 'Pelanggan 8', '1x Mie Kocok Bandung, 1x Nutrisari Blewah', 19000, 8, 'Asep', '2025-08-07 12:50:07', '2025-08-07 12:31:10', 1),
(18, 'Pelanggan 6', '1x Nutrisari Blewah, 1x Nasi Ayam Suwir', 14000, 6, 'Asep', '2025-08-07 12:50:11', '2025-08-07 10:45:23', 1),
(19, 'Pelanggan 2', '1x Nutrisari Blewah, 1x Indomie Goreng Aceh', 10000, 2, 'Asep', '2025-08-07 12:57:47', '2025-08-07 12:55:57', 1),
(20, 'Pelanggan 1', '1x Mie Goreng, 1x Es Teh Manis', 13000, 1, 'Asep', '2025-08-07 12:57:54', '2025-08-07 12:54:57', 1),
(21, 'Pelanggan 9', '1x Mie Goreng, 1x Es Teh Manis', 13000, 9, 'Asep', '2025-08-07 12:57:58', '2025-08-07 12:34:05', 1),
(22, 'Pelanggan 5', '1x Chocolatos Matcha, 1x Mie Kocok Bandung', 20000, 5, 'Asep', '2025-08-07 16:56:03', '2025-08-07 16:50:33', 1),
(23, 'Pelanggan 4', '1x Nutrisari Blewah, 1x Nasi Telor Dadar', 13000, 4, 'Asep', '2025-08-07 16:56:21', '2025-08-07 16:48:10', 1),
(24, 'Pelanggan 3', '1x Es Teh Tawar, 1x Chocolatos Matcha, 1x Nasi Telor Dadar, 1x Nasi Ayam Suwir', 26000, 3, 'Asep', '2025-08-07 16:56:24', '2025-08-07 16:46:42', 1),
(25, 'Pelanggan 2', '1x Mie Goreng, 1x Es Teh Tawar', 12000, 2, 'Asep', '2025-08-07 16:56:28', '2025-08-07 16:46:17', 1),
(26, 'Pelanggan 1', '1x Nutrisari Blewah, 1x Indomie Goreng Aceh', 10000, 1, 'Asep', '2025-08-07 16:56:32', '2025-08-07 16:45:53', 1),
(27, 'Pelanggan 1', '1x Mie Goreng, 1x Es Teh Manis, 1x Chocolatos Matcha', 18000, 1, 'Asep', '2025-08-08 08:07:33', '2025-08-08 08:04:30', 1),
(28, 'Pelanggan 5', '1x Indomie Goreng Aceh, 1x Indomie Goreng Special', 12000, 5, 'Asep', '2025-08-08 13:10:45', '2025-08-08 13:09:34', 1),
(29, 'Pelanggan 2', '1x Nasi Goreng, 1x Es Teh Tawar', 17000, 2, 'Asep', '2025-08-08 13:10:49', '2025-08-08 08:05:18', 1),
(30, 'Pelanggan 8', '1x Mie Goreng, 1x Es Teh Manis', 13000, 8, 'Asep', '2025-08-08 13:15:21', '2025-08-08 13:14:38', 1),
(31, 'Pelanggan 7', '1x Nutrisari Blewah, 1x Nasi Goreng Mawut', 17000, 7, 'Asep', '2025-08-09 11:07:08', '2025-08-08 13:14:11', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indexes for table `kasir`
--
ALTER TABLE `kasir`
  ADD PRIMARY KEY (`id_kasir`);

--
-- Indexes for table `koki`
--
ALTER TABLE `koki`
  ADD PRIMARY KEY (`id_koki`);

--
-- Indexes for table `meja`
--
ALTER TABLE `meja`
  ADD PRIMARY KEY (`id_meja`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indexes for table `menu_pesanan`
--
ALTER TABLE `menu_pesanan`
  ADD KEY `id_menu` (`id_menu`),
  ADD KEY `id_pesanan` (`id_pesanan`);

--
-- Indexes for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`id_pelanggan`);

--
-- Indexes for table `pelayan`
--
ALTER TABLE `pelayan`
  ADD PRIMARY KEY (`id_pelayan`);

--
-- Indexes for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id_pesanan`),
  ADD KEY `id_pelanggan` (`id_pelanggan`),
  ADD KEY `id_pelayan` (`id_pelayan`),
  ADD KEY `id_meja` (`id_meja`),
  ADD KEY `id_koki` (`id_koki`);

--
-- Indexes for table `riwayat_pesanan`
--
ALTER TABLE `riwayat_pesanan`
  ADD PRIMARY KEY (`id_riwayat`),
  ADD KEY `id_kasir` (`id_kasir`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kasir`
--
ALTER TABLE `kasir`
  MODIFY `id_kasir` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `koki`
--
ALTER TABLE `koki`
  MODIFY `id_koki` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `meja`
--
ALTER TABLE `meja`
  MODIFY `id_meja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `pelanggan`
--
ALTER TABLE `pelanggan`
  MODIFY `id_pelanggan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- AUTO_INCREMENT for table `pelayan`
--
ALTER TABLE `pelayan`
  MODIFY `id_pelayan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id_pesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `riwayat_pesanan`
--
ALTER TABLE `riwayat_pesanan`
  MODIFY `id_riwayat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `menu_pesanan`
--
ALTER TABLE `menu_pesanan`
  ADD CONSTRAINT `id_menu` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id_menu`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_pesanan` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `id_koki` FOREIGN KEY (`id_koki`) REFERENCES `koki` (`id_koki`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_meja` FOREIGN KEY (`id_meja`) REFERENCES `meja` (`id_meja`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `id_pelanggan` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id_pelanggan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_pelayan` FOREIGN KEY (`id_pelayan`) REFERENCES `pelayan` (`id_pelayan`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `riwayat_pesanan`
--
ALTER TABLE `riwayat_pesanan`
  ADD CONSTRAINT `id_kasir2` FOREIGN KEY (`id_kasir`) REFERENCES `kasir` (`id_kasir`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
