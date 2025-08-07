import { Router } from 'express';
import {
    getMenuPesanan,
    getPesanan,
    updateMenuPesanan,
    updatePesanan
} from '../../queries/kokiQueries.js';

const router = Router();

const checkAuth = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'koki' && req.session.user.id) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/', checkAuth, async (req, res) => {
    const pesanan = await getPesanan();
    const menuPesanan = await getMenuPesanan();

    res.render('dashboard/koki', {
        title: 'Dashboard Koki',
        id_koki: req.session.user.id,
        pesanan,
        menuPesanan
    });
});

router.post('/update-status', async (req, res) => {
    const { id_pesanan, id_koki, status } = req.body;
    await updatePesanan(id_pesanan, id_koki, status);

    req.app.get('wss').clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'update_status' }));
        }
    });

    res.sendStatus(200);
});

router.post('/update-ketersediaan', async (req, res) => {
    const { id_menu, id_pesanan, ketersediaan } = req.body;
    await updateMenuPesanan(id_menu, id_pesanan, ketersediaan);

    req.app.get('wss').clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'update_ketersediaan' }));
        }
    });

    res.sendStatus(200);
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

export default router;
