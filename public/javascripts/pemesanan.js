const order = {};
let currentTab = 'nama';
const tabs = ['nama', 'menu', 'konfirmasi'];

const nextBtnElm = document.getElementById("next-btn");
const prevBtnElm = document.getElementById("prev-btn");
const inputNameElm = document.getElementById("input-name");
const orderSummaryElm = document.getElementById("order-summary");
const finalMenuListElm = document.getElementById("final-menu-list");
const totalPriceElm = document.getElementById("total-price");
const totalHargaInput = document.getElementById("total-harga");
const menuPesananInput = document.getElementById("menu-pesanan");

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`content-${tabName}`).classList.add('active');

    currentTab = tabName;
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const currentIndex = tabs.indexOf(currentTab);

    if (currentIndex === 0) {
        prevBtnElm.style.display = 'none';
    } else {
        prevBtnElm.style.display = 'inline-block';
    }

    if (currentIndex === tabs.length - 1) {
        nextBtnElm.textContent = 'Pesan Sekarang';
    } else {
        nextBtnElm.textContent = 'Lanjutkan';
    }
}

function nextTab() {
    const currentIndex = tabs.indexOf(currentTab);

    if (currentIndex >= tabs.length - 1) {
        document.getElementById("order-form").submit();
        return;
    }

    if (currentTab === 'nama' && !inputNameElm.value.trim()) {
        alert('Silakan masukkan nama Anda terlebih dahulu');
        return;
    }
    if (currentTab === 'menu' && Object.keys(order).length === 0) {
        alert('Silakan pilih minimal satu menu');
        return;
    }

    const nextTabName = tabs[currentIndex + 1];
    showTab(nextTabName);

    if (nextTabName === 'konfirmasi') {
        renderFinalMenuList();
    }
}

function previousTab() {
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
        const prevTabName = tabs[currentIndex - 1];
        showTab(prevTabName);
    }
}

function updateOrderSummary() {
    if (Object.keys(order).length === 0) {
        orderSummaryElm.innerHTML = "Belum ada pesanan.";
        return;
    }
    orderSummaryElm.innerHTML = "";
    for (const id in order) {
        const item = order[id];
        const orderItem = document.createElement("div");
        orderItem.className = "order-item";
        orderItem.innerHTML = `
          <div>
            <strong>${item.nama_menu}</strong><br>
            <span style="color: #666;">Rp ${item.harga} x ${item.jumlah}</span>
          </div>
          <div>
            <span style="font-weight: bold;">Rp ${item.sub_total}</span>
          </div>
        `;
        orderSummaryElm.appendChild(orderItem);
    }
}

function updateTotalPrice() {
    const total = Object.values(order).reduce((sum, item) => sum + item.sub_total, 0);
    totalPriceElm.textContent = total.toLocaleString('id-ID');
    totalHargaInput.value = total;
}

function changeOrderQuantity(id, delta) {
    if (order[id]) {
        const newQuantity = order[id].jumlah + delta;
        if (newQuantity > 0) {
            order[id].jumlah = newQuantity;
            order[id].sub_total = order[id].harga * newQuantity;
            updateOrderSummary();
            updateTotalPrice();
            renderFinalMenuList();
        }
    }
}

function removeFromOrder(id) {
    if (order[id] && confirm(`Hapus ${order[id].nama_menu} dari pesanan?`)) {
        delete order[id];
        updateOrderSummary();
        updateTotalPrice();
        renderFinalMenuList();

        // Re-enable add button
        const addBtn = document.querySelector(`[data-id="${id}"]`);
        if (addBtn) {
            addBtn.disabled = false;
            addBtn.textContent = 'Tambah';
        }
    }
}

function renderFinalMenuList() {
    finalMenuListElm.innerHTML = "";

    if (Object.keys(order).length === 0) {
        finalMenuListElm.innerHTML = "<p>Tidak ada pesanan.</p>";
        totalPriceElm.textContent = "0";
        return;
    }

    for (const id in order) {
        const item = order[id];
        const itemDiv = document.createElement("div");
        itemDiv.className = "order-item";
        itemDiv.style.marginBottom = "15px";
        itemDiv.innerHTML = `
          <div>
            <div style="font-weight: bold; font-size: 18px;">${item.nama_menu}</div>
            <div style="color: #666; margin: 5px 0;">Harga Satuan: Rp ${item.harga}</div>
          </div>
          <div class="quantity-controls">
            <button type="button" onclick="changeOrderQuantity('${id}', -1)">-</button>
            <span class="quantity-display">${item.jumlah}</span>
            <button type="button" onclick="changeOrderQuantity('${id}', 1)">+</button>
            <button type="button" onclick="removeFromOrder('${id}')" style="margin-left: 10px; background: #dc3545; border-radius: 50%; width: 30px; height: 30px;">×</button>
          </div>
        `;

        finalMenuListElm.appendChild(itemDiv);
    }

    updateTotalPrice();
    totalHargaInput.value = Object.values(order).reduce((sum, item) => sum + item.sub_total, 0);;
    menuPesananInput.value = JSON.stringify(order);
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const harga = parseFloat(btn.dataset.harga);

        order[id] = { nama_menu: btn.dataset.nama, harga: harga, jumlah: 1, sub_total: harga };

        btn.disabled = true;
        btn.textContent = 'Ditambahkan';

        updateOrderSummary();
        updateTotalPrice();
    });
});

inputNameElm.addEventListener("input", () => {
    nextBtnElm.disabled = !inputNameElm.value.trim();
});

// Initialize
updateNavigationButtons();
nextBtnElm.disabled = true;
