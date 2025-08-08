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

const getKoki = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM koki', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

const updateKoki = (id_koki, nama_koki) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE koki SET nama_koki = ? WHERE id_koki = ?',
            [nama_koki, id_koki],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const insertKoki = (nama_koki) =>
    new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO koki (nama_koki) VALUES (?)',
            [nama_koki],
            (error, results) => {
                if (error) return reject(error);
                resolve(results.insertId);
            }
        );
    });

const deleteKoki = (id_koki) =>
    new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM koki WHERE id_koki = ?',
            [id_koki],
            (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }
        );
    });

const getPelayan = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM pelayan', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

const updatePelayan = (id_pelayan, nama_pelayan) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE pelayan SET nama_pelayan = ? WHERE id_pelayan = ?',
            [nama_pelayan, id_pelayan],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const insertPelayan = (nama_pelayan) =>
    new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO pelayan (nama_pelayan) VALUES (?)',
            [nama_pelayan],
            (error, results) => {
                if (error) return reject(error);
                resolve(results.insertId);
            }
        );
    });

const deletePelayan = (id_pelayan) =>
    new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM pelayan WHERE id_pelayan = ?',
            [id_pelayan],
            (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }
        );
    });

const getKasir = () =>
    new Promise((resolve, reject) => {
        connection.query('SELECT * FROM kasir', (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });

const updateKasir = (id_kasir, nama_kasir) =>
    new Promise((resolve, reject) => {
        connection.query(
            'UPDATE kasir SET nama_kasir = ? WHERE id_kasir = ?',
            [nama_kasir, id_kasir],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });

const insertKasir = (nama_kasir) =>
    new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO kasir (nama_kasir) VALUES (?)',
            [nama_kasir],
            (error, results) => {
                if (error) return reject(error);
                resolve(results.insertId);
            }
        );
    });

const deleteKasir = (id_kasir) =>
    new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM kasir WHERE id_kasir = ?',
            [id_kasir],
            (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }
        );
    });
