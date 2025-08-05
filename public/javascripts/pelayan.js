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

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.getElementById('btn-' + tabId.replace('tab-', '')).classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => showTab('tab-belum-dimasak'));

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
            location.reload();
        } else {
            alert('Gagal menghapus menu');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

function openChangeMenuModal(idMenu, idPesanan, menuName, quantity) {
    changeMenuData = {
        oldIdMenu: idMenu,
        idPesanan: idPesanan,
        oldMenuName: menuName,
        oldQuantity: parseInt(quantity),
        newIdMenu: null,
        newMenuName: null,
        newPrice: 0,
        newQuantity: parseInt(quantity)
    };

    document.getElementById('modal-ganti-menu').style.display = 'block';
    showFormTab('tab-pilih-menu');
}

function closeChangeMenuModal() {
    document.getElementById('modal-ganti-menu').style.display = 'none';

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

function showFormTab(tabId) {
    document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

function selectNewMenu(idMenu, menuName, price) {
    changeMenuData.newIdMenu = idMenu;
    changeMenuData.newMenuName = menuName;
    changeMenuData.newPrice = parseInt(price);

    updateChangeSummary();
    showFormTab('tab-konfirmasi');
}

function updateChangeSummary() {
    const summary = `<div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h4>Menu Lama:</h4>
        <div>${changeMenuData.oldQuantity}x ${changeMenuData.oldMenuName}</div>
      </div>
      <div style="text-align: center; margin: 20px 0; font-size: 18px;">↓ DIGANTI DENGAN ↓</div>
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; background-color: #f0f8ff;">
        <h4>Menu Baru:</h4>
        <div>${changeMenuData.newQuantity}x ${changeMenuData.newMenuName}</div>
        <div>Harga Satuan: Rp ${changeMenuData.newPrice.toLocaleString('id-ID')}</div>
      </div>`;

    document.getElementById('change-summary').innerHTML = summary;
    document.getElementById('new-quantity').textContent = changeMenuData.newQuantity;
    updateSubtotal();
}

function changeQuantity(delta) {
    const newQty = changeMenuData.newQuantity + delta;
    if (newQty > 0) {
        changeMenuData.newQuantity = newQty;
        document.getElementById('new-quantity').textContent = newQty;
        updateSubtotal();
        updateChangeSummary();
    }
}

function updateSubtotal() {
    const subtotal = changeMenuData.newQuantity * changeMenuData.newPrice;
    document.getElementById('new-subtotal').textContent = subtotal.toLocaleString('id-ID');
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

window.onclick = function(event) {
    const modal = document.getElementById('modal-ganti-menu');
    if (event.target === modal) {
        closeChangeMenuModal();
    }
}
