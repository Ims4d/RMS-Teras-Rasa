import { Router } from 'express';
import {
    getMeja,
    getMenu,
    getMenuPesanan,
    getPesanan,
    getTotalHargaMenuPesanan,
    updateMenuPesanan,
    updateStatusPesanan,
    updateTotalHargaPesanan,
    deleteMenuPesanan
} from '../../queries/pelayanQueries.js';

const router = Router();

const checkAuth = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'pelayan' && req.session.user.id) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/', checkAuth, async (req, res) => {
    const menu = await getMenu();
    const meja = await getMeja();
    const pesanan = await getPesanan();
    const menuPesanan = await getMenuPesanan();

    res.render('dashboard/pelayan', {
        title: 'Dashboard Pelayan',
        id_pelayan: req.session.user.id,
        menu,
        meja,
        pesanan,
        menuPesanan
    });
});

router.post('/update-status', async (req, res) => {
    const { id_pesanan, id_pelayan, status } = req.body;
    await updateStatusPesanan(id_pesanan, id_pelayan, status);

    req.app.get('wss').clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'pelayan_update_status' }));
        }
    });

    res.sendStatus(200);
});

router.post('/delete-menupesanan', async (req, res) => {
    const { id_menu, id_pesanan } = req.body;

    await deleteMenuPesanan(id_menu, id_pesanan);

    const newTotal = await getTotalHargaMenuPesanan(id_pesanan);
    await updateTotalHargaPesanan(id_pesanan, newTotal);

    req.app.get('wss').clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'pelayan_delete_menu_pesanan' }));
        }
    });

    res.sendStatus(200);
});

router.post('/update-menupesanan', async (req, res) => {
    const { id_pesanan, old_id_menu, new_id_menu, nama_menu, jumlah, harga } = req.body;

    const sub_total = jumlah * harga;

    await updateMenuPesanan(old_id_menu, id_pesanan, new_id_menu, nama_menu, jumlah, sub_total);

    const newTotal = await getTotalHargaMenuPesanan(id_pesanan);
    await updateTotalHargaPesanan(id_pesanan, newTotal);

    req.app.get('wss').clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'pelayan_update_menu_pesanan' }));
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
