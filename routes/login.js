import { Router } from 'express';
import findUser from '../queries/loginQueries.js';

const router = Router();

router.get('/', (_req, res) => {
    res.render('login', { title: 'Login Karyawan' });
});

router.post('/', (req, res, next) => {
    const { username, password, role } = req.body;

    if (!username) {
        return res.render('login', {
            title: 'Login Karyawan',
            error: 'Masukkan username!'
        });
    }

    if (!password) {
        return res.render('login', {
            title: 'Login Karyawan',
            error: 'Masukkan password!'
        });
    }

    if (!role) {
        return res.render('login', {
            title: 'Login Karyawan',
            error: 'Silakan pilih role!'
        });
    }

    findUser(username, role, (err, user) => {
        if (err) return next(err);
        if (!user || user.password !== password) {
            return res.render('login', { title: 'Login Karyawan', error: 'Username atau password salah.' });
        }

        req.session.user = {
            id: user.id_pelayan || user.id_koki || user.id_kasir,
            role: role
        };

        switch (role) {
            case 'pelayan':
                return res.redirect('/dashboard/pelayan');
            case 'koki':
                return res.redirect('/dashboard/koki');
            case 'kasir':
                return res.redirect('/dashboard/kasir');
            case 'admin':
                return res.redirect('/dashboard/admin');
            default:
                return res.render('login', { title: 'Login Karyawan', error: 'Silakan pilih role!' });
        }
    });
});

export default router;
