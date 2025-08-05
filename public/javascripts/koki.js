function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.getElementById('btn-' + tabId.replace('tab-', '')).classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => showTab('tab-antrian'));

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
