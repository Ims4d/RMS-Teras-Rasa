function showTab(tabId) {
    document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.getElementById('btn-' + tabId.replace('tab-', '')).classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => showTab('tab-proses-pembayaran'));

async function prosesPembayaran(id_pesanan, id_kasir, id_meja, id_pelanggan, total_harga, waktu_pesan) {
    try {
        const response = await fetch('kasir/proses-pembayaran', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_pesanan, id_kasir, id_meja, id_pelanggan, total_harga, waktu_pesan }),
        });
        if (response.ok) {
            alert('Pembayaran berhasil diproses!');
            location.reload();
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
    document.querySelectorAll('.btn-bayar').forEach((btn) => {
        btn.innerHTML = 'Pilih untuk Bayar';
        btn.disabled = false;
    });
    document.querySelectorAll('.pesanan-item').forEach((item) => item.classList.remove('selected'));

    const selectedBtn = document.getElementById(`btn-${id_pesanan}`);
    selectedBtn.innerHTML = 'Dipilih';
    selectedBtn.disabled = true;

    document.getElementById(`item-${id_pesanan}`).classList.add('selected');
    document.getElementById(`detail-pembayaran-${id_pesanan}`).style.display = 'block';
    document.getElementById('placeholder').style.display = 'none';
}
