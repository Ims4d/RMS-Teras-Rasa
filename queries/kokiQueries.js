import connection from '../database.js';

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

const updateMenuPesanan = (id_menu, id_pesanan, ketersediaan) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE menu_pesanan SET ketersediaan = ? WHERE id_menu = ? AND id_pesanan = ?',
            [ketersediaan, id_menu, id_pesanan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const updatePesanan = (id_pesanan, id_koki, status) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE pesanan SET id_koki = ?, status_pesanan = ? WHERE id_pesanan = ?',
            [id_koki, status, id_pesanan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

export { getMenuPesanan, getPesanan, updateMenuPesanan, updatePesanan };
