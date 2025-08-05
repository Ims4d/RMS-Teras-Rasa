import connection from '../database.js';

const findUser = (username, role, callback) => {
    let tableName;
    switch (role) {
        case 'pelayan':
            tableName = 'pelayan';
            break;
        case 'koki':
            tableName = 'koki';
            break;
        case 'kasir':
            tableName = 'kasir';
            break;
        default:
            return callback(new Error('Invalid role'));
    }

    connection.query(`SELECT * FROM ${tableName} WHERE username = ?`, [username], (err, results) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results[0]);
    });
}

export default findUser;
