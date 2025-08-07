import { Router } from 'express';
import {
    getPesanan,
    getMenuPesanan,
    getPelanggan,
    getKasir,
    getRiwayatPembayaran,
    insertRiwayatPembayaran,
    updateMeja,
    updateWaktuBayar,
    deletePelanggan
} from '../../queries/kasirQueries.js';

const router = Router();

const checkAuth = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'kasir' && req.session.user.id) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/', checkAuth, async (req, res) => {
    const pesanan = await getPesanan();
    const menuPesanan = await getMenuPesanan();
    const riwayatPembayaran = await getRiwayatPembayaran();
    const pelanggan = await getPelanggan();

    res.render('dashboard/kasir', {
        title: 'Dashboard Kasir',
        id_kasir: req.session.user.id,
        pesanan,
        menuPesanan,
        riwayatPembayaran,
        pelanggan
    });
});

router.post('/proses-pembayaran', async (req, res) => {
    const { id_pesanan, id_kasir, id_meja, id_pelanggan, total_harga, waktu_pesan } = req.body;

    const menuPesanan = await getMenuPesanan();
    const menuItems = menuPesanan.filter(m => m.id_pesanan == id_pesanan);
    const pelanggan = await getPelanggan();
    const targetPelanggan = pelanggan.find(p => p.id_pelanggan == id_pelanggan);
    const kasir = await getKasir(id_kasir);
    const menuPesananStr = menuItems.map(m => `${m.jumlah}x ${m.nama_menu}`).join(', ');

    const riwayatData = {
        nama_pelanggan: targetPelanggan.nama_pelanggan,
        menu_pesanan: menuPesananStr,
        harga_total: total_harga,
        id_meja: id_meja,
        nama_kasir: kasir.nama_kasir,
        waktu_bayar: new Date(),
        waktu_pesan: new Date(waktu_pesan),
        id_kasir: id_kasir
    };

    await updateWaktuBayar(id_pesanan);
    await updateMeja(id_meja);
    await insertRiwayatPembayaran(riwayatData);
    await deletePelanggan(id_pelanggan);

    req.app.get('wss').clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'pembayaran_diproses' }));
        }
    });

    res.sendStatus(200);
});

router.get('/cetak-nota', async (req, res) => {
    const id_pesanan = req.query.id;

    const pesanan = await getPesanan();
    const menuPesanan = await getMenuPesanan();
    const pelanggan = await getPelanggan();
    const targetPesanan = pesanan.find(p => p.id_pesanan == id_pesanan);

    const menuItems = menuPesanan.filter(m => m.id_pesanan == id_pesanan);
    const targetPelanggan = pelanggan.find(p => p.id_pelanggan == targetPesanan.id_pelanggan);

    res.render('nota', {
        title: 'Nota Pembayaran',
        pesanan: targetPesanan,
        menuItems,
        pelanggan: targetPelanggan,
        tanggal: new Date().toLocaleString('id-ID')
    });
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
