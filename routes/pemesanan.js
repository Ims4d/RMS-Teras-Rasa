import { Router } from 'express';
import {
    getMenu,
    insertPelanggan,
    insertPesanan,
    insertMenuPesanan,
    updateMeja
} from '../queries/pemesananQueries.js';

const router = Router();

router.get('/', async (req, res) => {
    if (!req.query.idm) {
        res.render('peringatan', {
            title: "Peringatan",
            message: "URL tidak valid!"
        });
        return;
    }

    const menu = await getMenu();
    res.render('pemesanan', { title: "Pemesanan", id_meja: req.query.idm, menu });
});

router.post('/', async (req, res) => {
    const { nama_pelanggan, id_meja, menu_pesanan, total_harga } = req.body;
    const menuPesananObj = JSON.parse(menu_pesanan);
    const menuItems = Object.entries(menuPesananObj);
    const totalHargaInt = parseInt(total_harga);

    await updateMeja(id_meja);

    const id_pelanggan = await insertPelanggan(nama_pelanggan);
    const id_pesanan = await insertPesanan(id_pelanggan, id_meja, totalHargaInt);

    await Promise.all(
        menuItems.map(([id_menu, item]) =>
            insertMenuPesanan(id_menu, id_pesanan, item.nama_menu, item.jumlah, item.sub_total)
        )
    );

    res.render('pemesanan', {
        title: "Pemesanan",
        done: true,
        nama_pelanggan,
        pesanan: Object.values(menuPesananObj),
        total_harga: totalHargaInt.toLocaleString('id-ID'),
    });
});

export default router;
