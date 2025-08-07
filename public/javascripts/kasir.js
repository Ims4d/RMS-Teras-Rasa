
const socket = new WebSocket(`ws://${window.location.host}`);

socket.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data.type === 'pesanan_baru' || data.type === 'update_status' || data.type === 'update_ketersediaan' || data.type === 'update_menu_pesanan' || data.type === 'delete_menu_pesanan' || data.type === 'pembayaran_diproses') {
        setTimeout(() => location.reload(), 1000);
    }
};

async function prosesPembayaran(id_pesanan, id_kasir, id_meja, id_pelanggan, total_harga, waktu_pesan) {
    try {
        const response = await fetch('kasir/proses-pembayaran', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_pesanan, id_kasir, id_meja, id_pelanggan, total_harga, waktu_pesan }),
        });
        if (response.ok) {
            alert('Pembayaran berhasil diproses!');
        } else {
            alert('Gagal memproses pembayaran!');
        }
    } catch (error) {
        alert('Terjadi kesalahan!');
    }
}

function cetakNota(id_pesanan) {
    window.open(`kasir/cetak-nota?id=${id_pesanan}`, '_blank', 'width=800,height=600');
}

function pilihBayar(id_pesanan) {
    document.querySelectorAll('.detail-pembayaran').forEach(e => e.style.display = 'none');
    document.querySelectorAll('.btn-bayar').forEach(e => {
        e.innerHTML = 'Pilih untuk Bayar';
        e.disabled = false;
    });

    const selectedBtn = document.getElementById(`btn-${id_pesanan}`);
    selectedBtn.innerHTML = 'Dipilih';
    selectedBtn.disabled = true;

    document.getElementById(`detail-pembayaran-${id_pesanan}`).style.display = 'block';
    document.getElementById('placeholder').style.display = 'none';
}
