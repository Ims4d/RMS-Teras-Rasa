const nextBtnElm = document.getElementById("next-btn");
const prevBtnElm = document.getElementById("prev-btn");
const inputNameElm = document.getElementById("input-name");
const orderSummaryElm = document.getElementById("order-summary");
const finalMenuListElm = document.getElementById("final-menu-list");
const totalPriceElm = document.getElementById("total-price");
const formSteps = document.querySelectorAll('.form-step');

let currentStep = 0;
const order = {};

function showStep(index) {
    formSteps.forEach((step, i) => step.classList.toggle('d-none', i !== index));
    prevBtnElm.classList.toggle('invisible', index === 0);
    nextBtnElm.innerHTML = index === formSteps.length - 1 ? 'Pesan Sekarang' : 'Lanjutkan <i class="bi bi-arrow-right"></i>';
}

nextBtnElm.addEventListener('click', () => {
    if (currentStep === 0 && inputNameElm.value.trim() === "") {
        alert("Silakan masukkan nama terlebih dahulu.");
        inputNameElm.focus();
        return;
    }

    if (currentStep === 1 && Object.keys(order).length === 0) {
        alert("Silakan pilih minimal satu menu terlebih dahulu.");
        return;
    }

    if (currentStep < formSteps.length - 1) {
        currentStep++;
        renderFinalMenuList();
        showStep(currentStep);
    } else {
        document.getElementById("menu-pesanan").value = JSON.stringify(order);
        document.querySelector('form').submit();
    }
});

prevBtnElm.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
});

function updateOrderSummary() {
    if (Object.keys(order).length === 0) {
        orderSummaryElm.innerHTML = "Belum ada pesanan.";
        return;
    }

    orderSummaryElm.innerHTML = Object.values(order).map(item => `
    <div class="order-item d-flex justify-content-between">
        <div><strong>${item.nama_menu}</strong><br><small>Rp ${item.harga} x ${item.jumlah}</small></div>
        <strong>Rp ${item.sub_total}</strong>
    </div>`).join('');
}

function renderFinalMenuList() {
    if (Object.keys(order).length === 0) {
        finalMenuListElm.innerHTML = "<p class='text-muted'>Tidak ada pesanan.</p>";
        totalPriceElm.textContent = "0";
        return;
    }

    finalMenuListElm.innerHTML = Object.entries(order).map(([id, item]) => `
    <div class="d-flex align-items-center border rounded p-2 mb-3 bg-white">
        <div class="flex-grow-1">
            <div class="fw-bold">${item.nama_menu}</div>
            <div class="small text-muted">Harga Satuan: Rp ${item.harga.toLocaleString('id-ID')}</div>
        </div>
        <div class="d-flex justify-content-center align-items-center">
            <button type="button" class="btn btn-outline-dark btn-sm" onclick="changeOrderQuantity('${id}', -1)">
                <i class="bi bi-dash"></i>
            </button>
            <div class="px-3 d-inline">${item.jumlah}</div>
            <button type="button" class="btn btn-outline-dark btn-sm" onclick="changeOrderQuantity('${id}', 1)">
                <i class="bi bi-plus"></i>
            </button>
        </div>
    </div>
    `).join('');

    updateTotalPrice();
}


function updateTotalPrice() {
    const total = Object.values(order).reduce((sum, item) => sum + item.sub_total, 0);
    totalPriceElm.textContent = total.toLocaleString('id-ID');
    document.getElementById("total-harga").value = total;
}

function changeOrderQuantity(id, delta) {
    if (order[id]) {
        const newQty = order[id].jumlah + delta;
        if (newQty > 0) {
            order[id].jumlah = newQty;
            order[id].sub_total = order[id].harga * newQty;
        } else {
            delete order[id];

            const btn = document.querySelector(`[data-id="${id}"]`);
            if (btn) {
                btn.disabled = false;
                btn.textContent = "Tambah";
            }
        }

        updateOrderSummary();
        renderFinalMenuList();
    }
}

function removeFromOrder(id) {
    if (confirm(`Hapus ${order[id].nama_menu}?`)) {
        delete order[id];
        updateOrderSummary();
        renderFinalMenuList();

        const btn = document.querySelector(`[data-id="${id}"]`);
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Tambah";
        }
    }
}

document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
        const harga = parseInt(btn.dataset.harga);

        order[btn.dataset.id] = {
            nama_menu: btn.dataset.nama,
            harga: harga,
            jumlah: 1,
            sub_total: harga
        };

        btn.disabled = true;
        btn.textContent = 'Ditambahkan';
        updateOrderSummary();
    });
});

showStep(currentStep);
