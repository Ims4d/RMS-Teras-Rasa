import connection from '../database.js';

const getMeja = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM meja', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

const getMenu = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM menu', (error, results) => {
            if (error) return reject(error);
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

const getPesanan = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM pesanan', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
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

const deleteMenuPesanan = (id_menu, id_pesanan) =>
    new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM menu_pesanan WHERE id_menu = ? AND id_pesanan = ?',
            [id_menu, id_pesanan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const updateMenuPesanan = (old_id_menu, id_pesanan, new_id_menu, nama_menu, jumlah, sub_total) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE menu_pesanan SET id_menu = ?, nama_menu = ?, jumlah = ?, sub_total = ?, ketersediaan = ? WHERE id_menu = ? AND id_pesanan = ?',
            [new_id_menu, nama_menu, jumlah, sub_total, 'TERSEDIA', old_id_menu, id_pesanan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const updateStatusPesanan = (id_pesanan, id_pelayan, status) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE pesanan SET id_pelayan = ?, status_pesanan = ? WHERE id_pesanan = ?',
            [id_pelayan, status, id_pesanan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const updateTotalHargaPesanan = (id_pesanan, total_harga) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE pesanan SET total_harga = ? WHERE id_pesanan = ?',
            [total_harga, id_pesanan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const getTotalHargaMenuPesanan = (id_pesanan) =>
    new Promise((resolve, reject) => {
        connection.query(
            'SELECT SUM(sub_total) as total FROM menu_pesanan WHERE id_pesanan = ?',
            [id_pesanan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results[0]?.total || 0);
            }
        );
    });

export {
    getMeja,
    getMenu,
    getMenuPesanan,
    getPesanan,
    getTotalHargaMenuPesanan,
    insertMenuPesanan,
    updateMenuPesanan,
    updateStatusPesanan,
    updateTotalHargaPesanan,
    deleteMenuPesanan
};
