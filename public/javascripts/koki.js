
const socket = new WebSocket(`ws://${window.location.host}`);

socket.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data.type === 'pesanan_baru' || data.type === 'update_status' || data.type === 'update_ketersediaan') {
        setTimeout(() => location.reload(), 500);
    }
};

async function updateStatus(id_pesanan, id_koki, status) {
    try {
        const response = await fetch('koki/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_pesanan, id_koki, status }),
        });
        if (!response.ok) {
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
        if (!response.ok) {
            alert('Gagal mengupdate ketersediaan');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}
