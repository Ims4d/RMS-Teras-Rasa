import { Router } from 'express';
import {
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
    res.sendStatus(200);
});

router.post('/delete-menupesanan', async (req, res) => {
    const { id_menu, id_pesanan } = req.body;

    await deleteMenuPesanan(id_menu, id_pesanan);

    const newTotal = await getTotalHargaMenuPesanan(id_pesanan);
    await updateTotalHargaPesanan(id_pesanan, newTotal);
    res.sendStatus(200);
});

router.post('/update-menupesanan', async (req, res) => {
    const { id_pesanan, old_id_menu, new_id_menu, nama_menu, jumlah, harga } = req.body;

    const sub_total = jumlah * harga;

    await updateMenuPesanan(old_id_menu, id_pesanan, new_id_menu, nama_menu, jumlah, sub_total);

    const newTotal = await getTotalHargaMenuPesanan(id_pesanan);
    await updateTotalHargaPesanan(id_pesanan, newTotal);
    res.sendStatus(200);
});

router.post('/add-menupesanan', async (req, res) => {
    const { id_pesanan, menu_pesanan, total_harga } = req.body;
    const menu_pesanan_obj = JSON.parse(menu_pesanan);

    const menuItems = Object.entries(menu_pesanan_obj);

    await Promise.all(
        menuItems.map(([id_menu, item]) =>
            insertMenuPesanan(id_menu, id_pesanan, item.nama_menu, item.jumlah, item.sub_total)
        )
    );

    await updateTotalHargaPesanan(id_pesanan, total_harga);
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
