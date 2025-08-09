// Laporan penjualan & riwayat

let chartInstance = null;
let chartMenuTerlarisInstance = null;
let riwayatData = [];

async function loadData(start = '', end = '') {
    let url = 'admin/data-penjualan';
    if (start && end) {
        url += `?start=${start}&end=${end}`;
    }

    const res = await fetch(url);
    const riwayat = await res.json();
    riwayatData = riwayat; // simpan global untuk pencarian di Riwayat Penjualan

    // Ringkasan
    const totalTransaksi = riwayat.length;
    const totalPendapatan = riwayat.reduce((sum, r) => sum + r.harga_total, 0);
    const rataTransaksi = totalPendapatan / (totalTransaksi || 1);

    document.getElementById('totalTransaksi').textContent = totalTransaksi;
    document.getElementById('totalPendapatan').textContent = 'Rp ' + totalPendapatan.toLocaleString('id-ID');
    document.getElementById('rataTransaksi').textContent = 'Rp ' + rataTransaksi.toLocaleString('id-ID');

    // Tabel Laporan & Riwayat
    renderTable('tableLaporan', riwayat);
    renderTable('tableRiwayat', riwayat);

    // Grafik Penjualan Harian
    const penjualanPerTanggal = {};
    riwayat.forEach(r => {
        const tgl = new Date(r.waktu_bayar).toLocaleDateString('id-ID');
        penjualanPerTanggal[tgl] = (penjualanPerTanggal[tgl] || 0) + r.harga_total;
    });

    const labels = Object.keys(penjualanPerTanggal);
    const data = Object.values(penjualanPerTanggal);

    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(document.getElementById('chartPenjualan'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pendapatan Harian (Rp)',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    // Grafik 10 Menu Terlaris
    const menuCount = {};
    riwayat.forEach(r => {
        const items = r.menu_pesanan.split(',');
        items.forEach(rawItem => {
            const item = rawItem.trim();
            const match = item.match(/^(\d+)x\s*(.+)$/i);
            if (match) {
                const qty = parseInt(match[1], 10);
                const menuName = match[2].trim();
                menuCount[menuName] = (menuCount[menuName] || 0) + qty;
            }
        });
    });

    const sortedMenu = Object.entries(menuCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const menuLabels = sortedMenu.map(m => m[0]);
    const menuData = sortedMenu.map(m => m[1]);

    if (chartMenuTerlarisInstance) chartMenuTerlarisInstance.destroy();
    chartMenuTerlarisInstance = new Chart(document.getElementById('chartMenuTerlaris'), {
        type: 'bar',
        data: {
            labels: menuLabels,
            datasets: [{
                label: 'Jumlah Terjual',
                data: menuData,
                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: { beginAtZero: true }
            }
        }
    });

}

function renderTable(tableId, data) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    data.forEach((item, index) => {
        tbody.innerHTML += `
        <tr>
        <td>${index + 1}</td>
        <td>${item.nama_pelanggan}</td>
        <td>${item.menu_pesanan}</td>
        <td>Rp ${item.harga_total.toLocaleString('id-ID')}</td>
        <td>${item.id_meja}</td>
        <td>${item.nama_kasir}</td>
        <td>${new Date(item.waktu_bayar).toLocaleString('id-ID')}</td>
        </tr>
        `;
    });
}

// Filter periode di laporan
document.getElementById('btnFilter').addEventListener('click', () => {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    loadData(start, end);
});

// Pencarian di Riwayat Penjualan
document.getElementById('searchInput').addEventListener('input', () => {
    filterRiwayat();
});
document.getElementById('filterColumn').addEventListener('change', () => {
    filterRiwayat();
});

function filterRiwayat() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const colIndex = document.getElementById('filterColumn').value;

    const filtered = riwayatData.filter(item => {
        const row = [
            item.nama_pelanggan,
            item.menu_pesanan,
            item.harga_total.toString(),
            item.id_meja.toString(),
            item.nama_kasir,
            new Date(item.waktu_bayar).toLocaleString('id-ID')
        ];
        if (colIndex) {
            return row[colIndex - 1].toLowerCase().includes(keyword);
        } else {
            return row.some(val => val.toLowerCase().includes(keyword));
        }
    });

    renderTable('tableRiwayat', filtered);
}

const socket = new WebSocket(`ws://${window.location.host}`);

socket.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data.type === 'kasir_proses_pembayaran') {
        loadData();
    }
};

loadData();


// Kelola Menu

let menuData = {
    gambarMenu: null,
    idMenu: null,
    namaMenu: null,
    jenisMenu: null,
    hargaMenu: 0
};

function resetMenuData() {
    menuData = {
        gambarMenu: null,
        idMenu: null,
        namaMenu: null,
        jenisMenu: null,
        hargaMenu: 0
    };
}

function updateButtonState(btn, inputs) {
    btn.disabled = inputs.some(input => input.value === '');
}

function setJenisMenuEventListeners(makananElm, minumanElm, jenisKey) {
    makananElm.onchange = () => menuData[jenisKey] = makananElm.value;
    minumanElm.onchange = () => menuData[jenisKey] = minumanElm.value;
}

function setupInputEvents(namaElm, hargaElm, btn, isEdit = false, originalNama = '', originalHarga = '') {
    namaElm.oninput = () => {
        menuData.namaMenu = namaElm.value;
        btn.disabled = namaElm.value === '' || hargaElm.value === '' || (isEdit && namaElm.value === originalNama);
    };

    hargaElm.oninput = () => {
        menuData.hargaMenu = hargaElm.value;
        btn.disabled = namaElm.value === '' || hargaElm.value === '' || (isEdit && hargaElm.value === originalHarga);
    };
}

function setupGambarInput(inputElm, imgElm, btn) {
    inputElm.onchange = () => {
        menuData.gambarMenu = inputElm.files[0];
        imgElm.src = URL.createObjectURL(menuData.gambarMenu);
        btn.disabled = false;
    };
    inputElm.oncancel = () => btn.disabled = true;
}

function openEditMenuModal(id_menu, nama_menu, jenis_menu, harga) {
    const imgElm = document.getElementById('edit-menu-img');
    const namaElm = document.getElementById('edit-nama-menu');
    const hargaElm = document.getElementById('edit-harga-menu');
    const makananElm = document.getElementById('edit-jenis-menu-makanan');
    const minumanElm = document.getElementById('edit-jenis-menu-minuman');
    const inputElm = document.getElementById('edit-gambar-menu');
    const saveBtn = document.getElementById('btn-save-edit-menu');

    Object.assign(menuData, { idMenu: id_menu, namaMenu: nama_menu, hargaMenu: harga, jenisMenu: jenis_menu });
    namaElm.value = nama_menu;
    hargaElm.value = harga;
    imgElm.src = `/img/menu/${id_menu}.jpg`;

    makananElm.checked = jenis_menu === 'MAKANAN';
    minumanElm.checked = jenis_menu !== 'MAKANAN';

    setupInputEvents(namaElm, hargaElm, saveBtn, true, nama_menu, harga);
    setJenisMenuEventListeners(makananElm, minumanElm, 'jenisMenu');
    setupGambarInput(inputElm, imgElm, saveBtn);
}

function cancelEditMenu() {
    resetMenuData();
    document.getElementById('btn-save-edit-menu').disabled = true;
}

async function confirmEditMenu() {
    try {
        const formData = new FormData();
        formData.append('id_menu', menuData.idMenu);
        formData.append('gambar_menu', menuData.gambarMenu);

        const imgResponse = await fetch('admin/update-menu/img', {
            method: 'POST',
            body: formData
        });

        if (!imgResponse.ok) return alert('Gagal mengunggah gambar menu');

        const dataResponse = await fetch('admin/update-menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_menu: menuData.idMenu,
                nama_menu: menuData.namaMenu,
                jenis_menu: menuData.jenisMenu,
                harga: menuData.hargaMenu
            })
        });

        if (dataResponse.ok) {
            alert('Menu berhasil diedit!');
            cancelEditMenu();
            location.reload();
        } else alert('Gagal mengganti menu');
    } catch {
        alert('Terjadi kesalahan');
    }
}

function cancelAddMenu() {
    resetMenuData();
    document.getElementById('btn-save-add-menu').disabled = true;
}

function setupAddMenuForm() {
    const imgElm = document.getElementById('add-menu-img');
    const namaElm = document.getElementById('add-nama-menu');
    const hargaElm = document.getElementById('add-harga-menu');
    const makananElm = document.getElementById('add-jenis-menu-makanan');
    const minumanElm = document.getElementById('add-jenis-menu-minuman');
    const inputElm = document.getElementById('add-gambar-menu');
    const saveBtn = document.getElementById('btn-save-add-menu');

    setupInputEvents(namaElm, hargaElm, saveBtn);
    setJenisMenuEventListeners(makananElm, minumanElm, 'jenisMenu');

    inputElm.onchange = () => {
        menuData.gambarMenu = inputElm.files[0];
        imgElm.src = URL.createObjectURL(menuData.gambarMenu);
        document.getElementById('add-menu-img-cont').classList.remove('d-none');
        updateButtonState(saveBtn, [namaElm, hargaElm]);
    };
}

async function confirmAddMenu() {
    try {
        const formData = new FormData();
        formData.append('id_menu', 'new');
        formData.append('gambar_menu', menuData.gambarMenu);

        const imgResponse = await fetch('admin/insert-menu/img', {
            method: 'POST',
            body: formData
        });

        if (!imgResponse.ok) return alert('Gagal mengunggah gambar menu');

        const dataResponse = await fetch('admin/insert-menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nama_menu: menuData.namaMenu,
                jenis_menu: menuData.jenisMenu || 'MAKANAN',
                harga: menuData.hargaMenu
            })
        });

        if (dataResponse.ok) {
            alert('Menu berhasil ditambahkan!');
            cancelAddMenu();
            location.reload();
        } else alert('Gagal menambah menu');
    } catch {
        alert('Terjadi kesalahan');
    }
}

async function deleteMenu(id_menu) {
    if (!confirm('Yakin ingin menghapus menu ini dari daftar menu?')) return;
    try {
        const response = await fetch('admin/delete-menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_menu })
        });

        if (response.ok) {
            alert('Menu berhasil dihapus!');
            location.reload();
        } else alert('Gagal menghapus menu');
    } catch {
        alert('Terjadi kesalahan');
    }
}


// Kelola Meja

function downloadQRCode(dataUrl, fileName) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function addMeja() {
    try {
        const response = await fetch('admin/insert-meja', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status_meja: 'KOSONG' }),
        });

        if (response.ok) {
            alert('Berhasil menambah meja');
            location.reload();
        } else {
            alert('Gagal menambah meja');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

async function deleteMeja(id_meja) {
    if (!confirm('Yakin ingin menghapus meja ini?')) {
        return;
    }
    try {
        const response = await fetch('admin/delete-meja', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_meja: id_meja }),
        });

        if (response.ok) {
            alert('Berhasil menghapus meja!');
            location.reload();
        } else {
            alert('Gagal menghapus meja');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}


// Kelola Koki

let kokiData = {
    idKoki: null,
    namaKoki: null,
    username: null,
    password: null
};

const addNamaKokiElm = document.getElementById('add-nama-koki');
const addUsernameKokiElm = document.getElementById('add-username-koki');
const addPasswordKokiElm = document.getElementById('add-password-koki');
const saveAddKokiBtn = document.getElementById('btn-save-add-koki');

addNamaKokiElm.oninput = updateKokiFormState;
addUsernameKokiElm.oninput = updateKokiFormState;
addPasswordKokiElm.oninput = updateKokiFormState;

function updateKokiFormState() {
    kokiData.namaKoki = addNamaKokiElm.value;
    kokiData.username = addUsernameKokiElm.value;
    kokiData.password = addPasswordKokiElm.value;
    saveAddKokiBtn.disabled = !kokiData.namaKoki || !kokiData.username || !kokiData.password;
}

function cancelAddKoki() {
    kokiData = { idKoki: null, namaKoki: null, username: null, password: null };
    saveAddKokiBtn.disabled = true;
}

async function confirmAddKoki() {
    try {
        const response = await fetch('admin/insert-koki', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nama_koki: kokiData.namaKoki,
                username: kokiData.username,
                password: kokiData.password
            }),
        });

        if (response.ok) {
            alert('Berhasil menambah karyawan koki');
            location.reload();
        } else {
            alert('Gagal menambah karyawan koki');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

const editNamaKokiElm = document.getElementById('edit-nama-koki');
const editUsernameKokiElm = document.getElementById('edit-username-koki');
const editPasswordKokiElm = document.getElementById('edit-password-koki');
const saveEditKokiBtn = document.getElementById('btn-save-edit-koki');

function openEditKokiModal(id_koki, nama_koki, username, password) {
    kokiData = { idKoki: id_koki, namaKoki: nama_koki, username, password };
    editNamaKokiElm.value = nama_koki;
    editUsernameKokiElm.value = username;
    editPasswordKokiElm.value = password;
    updateEditKokiFormState();

    editNamaKokiElm.oninput = updateEditKokiFormState;
    editUsernameKokiElm.oninput = updateEditKokiFormState;
    editPasswordKokiElm.oninput = updateEditKokiFormState;
}

function updateEditKokiFormState() {
    kokiData.namaKoki = editNamaKokiElm.value;
    kokiData.username = editUsernameKokiElm.value;
    kokiData.password = editPasswordKokiElm.value;
    saveEditKokiBtn.disabled = !kokiData.namaKoki || !kokiData.username || !kokiData.password;
}

async function confirmEditKoki() {
    try {
        const response = await fetch('admin/update-koki', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_koki: kokiData.idKoki,
                nama_koki: kokiData.namaKoki,
                username: kokiData.username,
                password: kokiData.password
            }),
        });

        if (response.ok) {
            alert('Berhasil mengedit karyawan koki');
            location.reload();
        } else {
            alert('Gagal mengedit karyawan koki');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

async function deleteKoki(id_koki) {
    if (!confirm('Yakin ingin menghapus karyawan koki ini?')) return;
    try {
        const response = await fetch('admin/delete-koki', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_koki }),
        });

        if (response.ok) {
            alert('Berhasil menghapus karyawan koki!');
            location.reload();
        } else {
            alert('Gagal menghapus karyawan koki');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}


// Kelola Kasir

let kasirData = {
    idKasir: null,
    namaKasir: null,
    username: null,
    password: null
};

const addNamaKasirElm = document.getElementById('add-nama-kasir');
const addUsernameKasirElm = document.getElementById('add-username-kasir');
const addPasswordKasirElm = document.getElementById('add-password-kasir');
const saveAddKasirBtn = document.getElementById('btn-save-add-kasir');

addNamaKasirElm.oninput = updateKasirFormState;
addUsernameKasirElm.oninput = updateKasirFormState;
addPasswordKasirElm.oninput = updateKasirFormState;

function updateKasirFormState() {
    kasirData.namaKasir = addNamaKasirElm.value;
    kasirData.username = addUsernameKasirElm.value;
    kasirData.password = addPasswordKasirElm.value;
    saveAddKasirBtn.disabled = !kasirData.namaKasir || !kasirData.username || !kasirData.password;
}

function cancelAddKasir() {
    kasirData = { idKasir: null, namaKasir: null, username: null, password: null };
    saveAddKasirBtn.disabled = true;
}

async function confirmAddKasir() {
    try {
        const response = await fetch('admin/insert-kasir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nama_kasir: kasirData.namaKasir,
                username: kasirData.username,
                password: kasirData.password
            }),
        });

        if (response.ok) {
            alert('Berhasil menambah karyawan kasir');
            location.reload();
        } else {
            alert('Gagal menambah karyawan kasir');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

const editNamaKasirElm = document.getElementById('edit-nama-kasir');
const editUsernameKasirElm = document.getElementById('edit-username-kasir');
const editPasswordKasirElm = document.getElementById('edit-password-kasir');
const saveEditKasirBtn = document.getElementById('btn-save-edit-kasir');

function openEditKasirModal(id_kasir, nama_kasir, username, password) {
    kasirData = { idKasir: id_kasir, namaKasir: nama_kasir, username, password };
    editNamaKasirElm.value = nama_kasir;
    editUsernameKasirElm.value = username;
    editPasswordKasirElm.value = password;
    updateEditKasirFormState();

    editNamaKasirElm.oninput = updateEditKasirFormState;
    editUsernameKasirElm.oninput = updateEditKasirFormState;
    editPasswordKasirElm.oninput = updateEditKasirFormState;
}

function updateEditKasirFormState() {
    kasirData.namaKasir = editNamaKasirElm.value;
    kasirData.username = editUsernameKasirElm.value;
    kasirData.password = editPasswordKasirElm.value;
    saveEditKasirBtn.disabled = !kasirData.namaKasir || !kasirData.username || !kasirData.password;
}

async function confirmEditKasir() {
    try {
        const response = await fetch('admin/update-kasir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_kasir: kasirData.idKasir,
                nama_kasir: kasirData.namaKasir,
                username: kasirData.username,
                password: kasirData.password
            }),
        });

        if (response.ok) {
            alert('Berhasil mengedit karyawan kasir');
            location.reload();
        } else {
            alert('Gagal mengedit karyawan kasir');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

async function deleteKasir(id_kasir) {
    if (!confirm('Yakin ingin menghapus karyawan kasir ini?')) return;
    try {
        const response = await fetch('admin/delete-kasir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_kasir }),
        });

        if (response.ok) {
            alert('Berhasil menghapus karyawan kasir!');
            location.reload();
        } else {
            alert('Gagal menghapus karyawan kasir');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}


// Kelola pelayan

let pelayanData = {
    idPelayan: null,
    namaPelayan: null,
    username: null,
    password: null
};

const addNamaPelayanElm = document.getElementById('add-nama-pelayan');
const addUsernamePelayanElm = document.getElementById('add-username-pelayan');
const addPasswordPelayanElm = document.getElementById('add-password-pelayan');
const saveAddPelayanBtn = document.getElementById('btn-save-add-pelayan');

addNamaPelayanElm.oninput = updatePelayanFormState;
addUsernamePelayanElm.oninput = updatePelayanFormState;
addPasswordPelayanElm.oninput = updatePelayanFormState;

function updatePelayanFormState() {
    pelayanData.namaPelayan = addNamaPelayanElm.value;
    pelayanData.username = addUsernamePelayanElm.value;
    pelayanData.password = addPasswordPelayanElm.value;
    saveAddPelayanBtn.disabled = !pelayanData.namaPelayan || !pelayanData.username || !pelayanData.password;
}

function cancelAddPelayan() {
    pelayanData = { idPelayan: null, namaPelayan: null, username: null, password: null };
    saveAddPelayanBtn.disabled = true;
}

async function confirmAddPelayan() {
    try {
        const response = await fetch('admin/insert-pelayan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nama_pelayan: pelayanData.namaPelayan,
                username: pelayanData.username,
                password: pelayanData.password
            }),
        });

        if (response.ok) {
            alert('Berhasil menambah karyawan pelayan');
            location.reload();
        } else {
            alert('Gagal menambah karyawan pelayan');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

const editNamaPelayanElm = document.getElementById('edit-nama-pelayan');
const editUsernamePelayanElm = document.getElementById('edit-username-pelayan');
const editPasswordPelayanElm = document.getElementById('edit-password-pelayan');
const saveEditPelayanBtn = document.getElementById('btn-save-edit-pelayan');

function openEditPelayanModal(id_pelayan, nama_pelayan, username, password) {
    pelayanData = { idPelayan: id_pelayan, namaPelayan: nama_pelayan, username, password };
    editNamaPelayanElm.value = nama_pelayan;
    editUsernamePelayanElm.value = username;
    editPasswordPelayanElm.value = password;
    updateEditPelayanFormState();

    editNamaPelayanElm.oninput = updateEditPelayanFormState;
    editUsernamePelayanElm.oninput = updateEditPelayanFormState;
    editPasswordPelayanElm.oninput = updateEditPelayanFormState;
}

function updateEditPelayanFormState() {
    pelayanData.namaPelayan = editNamaPelayanElm.value;
    pelayanData.username = editUsernamePelayanElm.value;
    pelayanData.password = editPasswordPelayanElm.value;
    saveEditPelayanBtn.disabled = !pelayanData.namaPelayan || !pelayanData.username || !pelayanData.password;
}

async function confirmEditPelayan() {
    try {
        const response = await fetch('admin/update-pelayan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_pelayan: pelayanData.idPelayan,
                nama_pelayan: pelayanData.namaPelayan,
                username: pelayanData.username,
                password: pelayanData.password
            }),
        });

        if (response.ok) {
            alert('Berhasil mengedit karyawan pelayan');
            location.reload();
        } else {
            alert('Gagal mengedit karyawan pelayan');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

async function deletePelayan(id_pelayan) {
    if (!confirm('Yakin ingin menghapus karyawan pelayan ini?')) return;
    try {
        const response = await fetch('admin/delete-pelayan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_pelayan }),
        });

        if (response.ok) {
            alert('Berhasil menghapus karyawan pelayan!');
            location.reload();
        } else {
            alert('Gagal menghapus karyawan pelayan');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}


// Kelola Admin

let adminData = {
    idAdmin: null,
    namaAdmin: null,
    username: null,
    password: null
};

const addNamaAdminElm = document.getElementById('add-nama-admin');
const addUsernameAdminElm = document.getElementById('add-username-admin');
const addPasswordAdminElm = document.getElementById('add-password-admin');
const saveAddAdminBtn = document.getElementById('btn-save-add-admin');

addNamaAdminElm.oninput = updateAdminFormState;
addUsernameAdminElm.oninput = updateAdminFormState;
addPasswordAdminElm.oninput = updateAdminFormState;

function updateAdminFormState() {
    adminData.namaAdmin = addNamaAdminElm.value;
    adminData.username = addUsernameAdminElm.value;
    adminData.password = addPasswordAdminElm.value;
    saveAddAdminBtn.disabled = !adminData.namaAdmin || !adminData.username || !adminData.password;
}

function cancelAddAdmin() {
    adminData = { idAdmin: null, namaAdmin: null, username: null, password: null };
    saveAddAdminBtn.disabled = true;
}

async function confirmAddAdmin() {
    try {
        const response = await fetch('admin/insert-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nama_admin: adminData.namaAdmin,
                username: adminData.username,
                password: adminData.password
            }),
        });

        if (response.ok) {
            alert('Berhasil menambah admin');
            location.reload();
        } else {
            alert('Gagal menambah admin');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

const editNamaAdminElm = document.getElementById('edit-nama-admin');
const editUsernameAdminElm = document.getElementById('edit-username-admin');
const editPasswordAdminElm = document.getElementById('edit-password-admin');
const saveEditAdminBtn = document.getElementById('btn-save-edit-admin');

function openEditAdminModal(id_admin, nama_admin, username, password) {
    adminData = { idAdmin: id_admin, namaAdmin: nama_admin, username, password };
    editNamaAdminElm.value = nama_admin;
    editUsernameAdminElm.value = username;
    editPasswordAdminElm.value = password;
    updateEditAdminFormState();

    editNamaAdminElm.oninput = updateEditAdminFormState;
    editUsernameAdminElm.oninput = updateEditAdminFormState;
    editPasswordAdminElm.oninput = updateEditAdminFormState;
}

function updateEditAdminFormState() {
    adminData.namaAdmin = editNamaAdminElm.value;
    adminData.username = editUsernameAdminElm.value;
    adminData.password = editPasswordAdminElm.value;
    saveEditAdminBtn.disabled = !adminData.namaAdmin || !adminData.username || !adminData.password;
}

async function confirmEditAdmin() {
    try {
        const response = await fetch('admin/update-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_admin: adminData.idAdmin,
                nama_admin: adminData.namaAdmin,
                username: adminData.username,
                password: adminData.password
            }),
        });

        if (response.ok) {
            alert('Berhasil mengedit admin');
            location.reload();
        } else {
            alert('Gagal mengedit admin');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}

async function deleteAdmin(id_admin) {
    if (!confirm('Yakin ingin menghapus admin ini?')) return;
    try {
        const response = await fetch('admin/delete-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_admin }),
        });

        if (response.ok) {
            alert('Berhasil menghapus admin!');
            location.reload();
        } else {
            alert('Gagal menghapus admin');
        }
    } catch (error) {
        alert('Terjadi kesalahan');
    }
}
