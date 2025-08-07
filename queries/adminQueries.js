import connection from '../database.js';

const getMenu = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM menu', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

const updateMenu = (id_menu, nama_menu, jenis_menu, harga) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE menu SET nama_menu = ?, jenis_menu = ?, harga = ? WHERE id_menu = ?',
            [nama_menu, jenis_menu, harga, id_menu],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const insertMenu = (nama_menu, jenis_menu, harga) =>
    new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO menu (nama_menu, jenis_menu, harga) VALUES (?, ?, ?)',
            [nama_menu, jenis_menu, harga],
            (error, results) => {
                if (error) return reject(error);
                resolve(results.insertId);
            }
        );
    });

const deleteMenu = (id_menu) =>
    new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM menu WHERE id_menu = ?',
            [id_menu],
            (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }
        );
    });

const getMeja = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM meja', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

const updateMeja = (id_meja, new_id_meja) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE menu SET id_meja = ? WHERE id_meja = ?',
            [new_id_meja, id_meja],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const insertMeja = () =>
    new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO meja (status_meja) VALUES (?)',
            ['KOSONG'],
            (error, results) => {
                if (error) return reject(error);
                resolve(results.insertId);
            }
        );
    });

const deleteMeja = (id_meja) =>
    new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM meja WHERE id_meja = ?',
            [id_meja],
            (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }
        );
    });

export { getMenuPesanan, getPesanan, updateMenuPesanan, updatePesanan };
