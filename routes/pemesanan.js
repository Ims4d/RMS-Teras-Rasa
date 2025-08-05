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
    const menu = await getMenu();
    res.render('pemesanan', { id_meja: req.query.idm, menu });
});

router.post('/', async (req, res) => {
    const { nama_pelanggan, id_meja, menu_pesanan, total_harga } = req.body;
    const menu_pesanan_obj = JSON.parse(menu_pesanan);

    await updateMeja(id_meja);

    const id_pelanggan = await insertPelanggan(nama_pelanggan);
    const id_pesanan = await insertPesanan(id_pelanggan, id_meja, total_harga);

    await Promise.all(
        menuItems.map(([id_menu, item]) =>
            insertMenuPesanan(id_menu, id_pesanan, item.nama_menu, item.jumlah, item.sub_total)
        )
    );

    res.render('pemesanan', {
        done: true,
        nama_pelanggan,
        pesanan: Object.values(menu_pesanan_obj),
        total_harga,
    });
});

export default router;
