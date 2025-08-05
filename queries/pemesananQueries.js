import connection from '../database.js';

const getMenu = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM menu', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

const insertPelanggan = nama_pelanggan =>
    new Promise((resolve, reject) => {
        connection.query('INSERT INTO pelanggan (nama_pelanggan) VALUES (?)', [nama_pelanggan], (error, results) => {
            if (error) return reject(error);
            resolve(results.insertId);
        });
    });

const insertPesanan = (id_pelanggan, id_meja, total_harga) =>
    new Promise((resolve, reject) => {
        const waktu_pesan = new Date();
        connection.query(
            'INSERT INTO pesanan (id_pelanggan, id_meja, waktu_pesan, waktu_bayar, total_harga) VALUES (?, ?, ?, ?, ?)',
            [id_pelanggan, id_meja, waktu_pesan, waktu_pesan, total_harga],
            (error, results) => {
                if (error) return reject(error);
                resolve(results.insertId);
            }
        );
    });

const insertMenuPesanan = (id_menu, id_pesanan, nama_menu, jumlah, sub_total) =>
    new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO menu_pesanan (id_menu, id_pesanan, nama_menu, jumlah, sub_total) VALUES (?, ?, ?, ?, ?)',
            [id_menu, id_pesanan, nama_menu, jumlah, sub_total],
            (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }
        );
    });

const updateMeja = id_meja =>
    new Promise((resolve, reject) => {
        connection.query('UPDATE meja SET status_meja = ? WHERE id_meja = ?', ['TERISI', id_meja], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

export {
    getMenu,
    insertPelanggan,
    insertPesanan,
    insertMenuPesanan,
    updateMeja
};
