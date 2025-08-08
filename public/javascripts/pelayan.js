const socket = new WebSocket(`ws://${window.location.host}`);

socket.onmessage = event => {
    const data = JSON.parse(event.data);
    if (
        data.type === 'pesanan_baru' ||
        data.type === 'koki_update_status' ||
        data.type === 'koki_update_ketersediaan' ||
        data.type === 'kasir_proses_pembayaran'
    ) {
        location.reload();
    }
};

let changeMenuData = {
    oldIdMenu: null,
    idPesanan: null,
    oldMenuName: null,
    oldQuantity: 1,
    newIdMenu: null,
    newMenuName: null,
    newPrice: 0,
    newQuantity: 1
};

function showStep(index) {
    document.querySelectorAll('.form-step').forEach((e, i) => e.classList.toggle('d-none', i !== index));
    document.getElementById('modal-footer').classList.toggle('d-none', index === 0);
    if (index === 1) {
        document.getElementById('modal-title').textContent = 'Konfirmasi Penggantian';
    } else {
        document.getElementById('modal-title').textContent = 'Pilih Menu Pengganti';
    }
}

function openChangeMenuModal(idMenu, idPesanan, menuName, quantity) {
    showStep(0);
    changeMenuData = {
        oldIdMenu: idMenu,
        idPesanan: idPesanan,
        oldMenuName: menuName,
        oldQuantity: parseInt(quantity),
        newIdMenu: null,
        newMenuName: null,
        newPrice: 0,
        newQuantity: 1
    };
}

function closeChangeMenuModal() {
    changeMenuData = {
        oldIdMenu: null,
        idPesanan: null,
        oldMenuName: null,
        oldQuantity: 1,
        newIdMenu: null,
        newMenuName: null,
        newPrice: 0,
        newQuantity: 1
    };
}

function updateSubtotal() {
    const subtotal = changeMenuData.newQuantity * changeMenuData.newPrice;
    document.getElementById('new-subtotal').textContent = subtotal.toLocaleString('id-ID');
}

function updateChangeSummary() {
    document.getElementById('change-summary').innerHTML = `
    <div class="border rounded p-3">
        <h4 class="m-0 text-center">${changeMenuData.oldQuantity}x ${changeMenuData.oldMenuName}</h4>
    </div>
    <h3 class="text-center my-5">↓ DIGANTI DENGAN ↓</h3>
    <div class="border rounded p-3 text-center">
        <h4 class="m-0">${changeMenuData.newQuantity}x ${changeMenuData.newMenuName}</h4>
        <small>Harga Satuan: Rp ${changeMenuData.newPrice.toLocaleString('id-ID')}</small>
    </div>`;
    document.getElementById('new-quantity').textContent = changeMenuData.newQuantity;
    updateSubtotal();
}

function selectNewMenu(idMenu, menuName, price) {
    changeMenuData.newIdMenu = idMenu;
    changeMenuData.newMenuName = menuName;
    changeMenuData.newPrice = parseInt(price);
    updateChangeSummary();
    showStep(1);
}

function changeQuantity(delta) {
    const newQty = changeMenuData.newQuantity + delta;
    if (newQty > 0) {
        changeMenuData.newQuantity = newQty;
        document.getElementById('new-quantity').textContent = newQty;
        updateSubtotal();
        updateChangeSummary();
    } else {
        showStep(0);
    }
}

async function confirmChangeMenu() {
    if (!changeMenuData.newIdMenu) {
        alert('Pilih menu pengganti terlebih dahulu');
        return;
    }
    try {
        const response = await fetch('pelayan/update-menupesanan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_pesanan: changeMenuData.idPesanan,
                old_id_menu: changeMenuData.oldIdMenu,
                new_id_menu: changeMenuData.newIdMenu,
                nama_menu: changeMenuData.newMenuName,
                jumlah: changeMenuData.newQuantity,
                harga: changeMenuData.newPrice
            }),
        });
        if (response.ok) {
            alert('Menu berhasil diganti!');
            closeChangeMenuModal();
            location.reload();
        } else {
            alert('Gagal mengganti menu');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

async function updateStatusPesanan(id_pesanan, id_pelayan, status) {
    try {
        const response = await fetch('pelayan/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_pesanan, id_pelayan, status }),
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

async function deleteMenuPesanan(id_menu, id_pesanan) {
    if (!confirm('Yakin ingin menghapus menu ini dari pesanan?')) {
        return;
    }
    try {
        const response = await fetch('pelayan/delete-menupesanan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_menu, id_pesanan }),
        });
        if (response.ok) {
            alert('Menu berhasil dihapus!');
            location.reload();
        } else {
            alert('Gagal menghapus menu');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}
