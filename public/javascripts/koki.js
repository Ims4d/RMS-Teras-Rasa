const socket = new WebSocket(`ws://${window.location.host}`);

socket.onmessage = event => {
    const data = JSON.parse(event.data);
    if (
        data.type === 'pesanan_baru' ||
        data.type === 'pelayan_update_status' ||
        data.type === 'pelayan_update_menu_pesanan' ||
        data.type === 'pelayan_delete_menu_pesanan'
    ) {
        location.reload();
    }
};

async function updateStatus(id_pesanan, id_koki, status) {
    try {
        const response = await fetch('koki/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_pesanan, id_koki, status }),
        });
        if (response.ok) {
            location.reload();
        } else {
            alert('Gagal mengupdate status');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

async function updateKetersediaan(id_menu, id_pesanan, el) {
    try {
        const ketersediaan = el.value;
        const response = await fetch('koki/update-ketersediaan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_menu, id_pesanan, ketersediaan }),
        });
        if (response.ok) {
            location.reload();
        } else {
            alert('Gagal mengupdate ketersediaan');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}
