import { Router } from 'express';
import multer from 'multer';
import * as adminQuery from '../../queries/adminQueries.js';
import { rename, rm } from 'fs/promises';
import QRCode from 'qrcode';

const router = Router();

const imgMenuStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, './public/img/menu'),
    filename: (req, _file, cb) => cb(null, req.body.id_menu + '.jpg')
});

const uploadImageMenu = multer({ storage: imgMenuStorage });

const checkAuth = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin' && req.session.user.id) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/', checkAuth, async (req, res) => {
    const menu = await adminQuery.getMenu();
    const meja = await adminQuery.getMeja();
    const koki = await adminQuery.getKoki();
    const kasir = await adminQuery.getKasir();
    const pelayan = await adminQuery.getPelayan();
    const admin = await adminQuery.getAdmin();

    await Promise.all(
        meja.map(async (m) => {
            const pemesananUrl = `${req.protocol}://${req.get('host')}/pemesanan?idm=${m.id_meja}`;
            m.qr_code = await QRCode.toDataURL(pemesananUrl);
        })
    );

    res.render('dashboard/admin', {
        title: 'Dashboard Admin',
        menu,
        meja,
        koki,
        kasir,
        pelayan,
        admin
    });
});

router.get('/data-penjualan', checkAuth, async (req, res) => {
    const { start, end } = req.query;
    let riwayat = await adminQuery.getRiwayatPembayaran();

    if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        riwayat = riwayat.filter(item => {
            const bayar = new Date(item.waktu_bayar);
            return bayar >= startDate && bayar <= endDate;
        });
    }

    res.json(riwayat);
});

router.post('/insert-menu', async (req, res) => {
    const { nama_menu, jenis_menu, harga } = req.body;

    const idMenu = await adminQuery.insertMenu(nama_menu, jenis_menu, parseInt(harga));
    await rename('./public/img/menu/new.jpg', `./public/img/menu/${idMenu}.jpg`);
    res.sendStatus(200);
});

router.post('/insert-menu/img', uploadImageMenu.single('gambar_menu'), (_req, res) => res.sendStatus(200));

router.post('/update-menu', async (req, res) => {
    const { id_menu, nama_menu, jenis_menu, harga } = req.body;
    await adminQuery.updateMenu(id_menu, nama_menu, jenis_menu, parseInt(harga));
    res.sendStatus(200);
});

router.post('/update-menu/img', uploadImageMenu.single('gambar_menu'), (_req, res) => res.sendStatus(200));

router.post('/delete-menu', async (req, res) => {
    const { id_menu } = req.body;

    await rm(`./public/img/menu/${id_menu}.jpg`);
    await adminQuery.deleteMenu(id_menu);
    res.sendStatus(200);
});

router.post('/insert-meja', async (req, res) => {
    const { status_meja } = req.body;
    await adminQuery.insertMeja(status_meja);
    res.sendStatus(200);
});

router.post('/delete-meja', async (req, res) => {
    const { id_meja } = req.body;
    await adminQuery.deleteMeja(id_meja);
    res.sendStatus(200);
});

router.post('/isert-koki', async (req, res) => {
    const { nama_koki, username, password } = req.body;

    await adminQuery.insertKoki(nama_koki, username, password);

    res.sendStatus(200);
});

router.post('/update-koki', async (req, res) => {
    const { id_koki, nama_koki, username, password } = req.body;
    await adminQuery.updateKoki(id_koki, nama_koki, username, password);
    res.sendStatus(200);
});

router.post('/delete-koki', async (req, res) => {
    const { id_koki } = req.body;
    await adminQuery.deleteKoki(id_koki);
    res.sendStatus(200);
});

router.post('/insert-kasir', async (req, res) => {
    const { nama_kasir, username, password } = req.body;
    await adminQuery.insertKasir(nama_kasir, username, password);
    res.sendStatus(200);
});

router.post('/update-kasir', async (req, res) => {
    const { id_kasir, nama_kasir, username, password } = req.body;
    await adminQuery.updateKasir(id_kasir, nama_kasir, username, password);
    res.sendStatus(200);
});

router.post('/delete-kasir', async (req, res) => {
    const { id_kasir } = req.body;
    await adminQuery.deleteKasir(id_kasir);
    res.sendStatus(200);
});

router.post('/insert-pelayan', async (req, res) => {
    const { nama_pelayan, username, password } = req.body;
    await adminQuery.insertPelayan(nama_pelayan, username, password);
    res.sendStatus(200);
});

router.post('/update-pelayan', async (req, res) => {
    const { id_pelayan, nama_pelayan, username, password } = req.body;
    await adminQuery.updatePelayan(id_pelayan, nama_pelayan, username, password);
    res.sendStatus(200);
});

router.post('/delete-pelayan', async (req, res) => {
    const { id_pelayan } = req.body;
    await adminQuery.deletePelayan(id_pelayan);
    res.sendStatus(200);
});

router.post('/insert-admin', async (req, res) => {
    const { nama_admin, username, password } = req.body;
    await adminQuery.insertAdmin(nama_admin, username, password);
    res.sendStatus(200);
});

router.post('/update-admin', async (req, res) => {
    const { id_admin, nama_admin, username, password } = req.body;
    await adminQuery.updateAdmin(id_admin, nama_admin, username, password);
    res.sendStatus(200);
});

router.post('/delete-admin', async (req, res) => {
    const { id_admin } = req.body;
    await adminQuery.deleteAdmin(id_admin);
    res.sendStatus(200);
});

export default router;
