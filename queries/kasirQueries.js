import connection from '../database.js';

const getPesanan = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM pesanan ORDER BY waktu_pesan DESC', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

const getMenuPesanan = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM menu_pesanan', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

const getPelanggan = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM pelanggan', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

const getKasir = (id_kasir) =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM kasir WHERE id_kasir = ?', [id_kasir], (error, results) => {
            if (error) return reject(error);
            resolve(results[0]);
        });
    });

const getRiwayatPembayaran = () =>
    new Promise((resolve, reject) => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        connection.query(
            'SELECT * FROM riwayat_pesanan WHERE waktu_bayar >= ? AND waktu_bayar < ? ORDER BY waktu_bayar DESC',
            [startOfDay, endOfDay],
            (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }
        );
    });

const insertRiwayatPembayaran = (data) =>
    new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO riwayat_pesanan (nama_pelanggan, menu_pesanan, harga_total, id_meja, nama_kasir, waktu_bayar, waktu_pesan, id_kasir) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.nama_pelanggan,
                data.menu_pesanan,
                data.harga_total,
                data.id_meja,
                data.nama_kasir,
                data.waktu_bayar,
                data.waktu_pesan,
                data.id_kasir
            ],
            (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }
        );
    });

const updateMeja = (id_meja) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE meja SET status_meja = ? WHERE id_meja = ?',
            ['KOSONG', id_meja],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const updateWaktuBayar = (id_pesanan) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE pesanan SET waktu_bayar = NOW() WHERE id_pesanan = ?',
            [id_pesanan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const deletePesanan = (id_pesanan) =>
    new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM pesanan WHERE id_pesanan = ?',
            [id_pesanan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

export {
    getPesanan,
    getMenuPesanan,
    getPelanggan,
    getKasir,
    getRiwayatPembayaran,
    insertRiwayatPembayaran,
    updateMeja,
    updateWaktuBayar,
    deletePesanan
}
