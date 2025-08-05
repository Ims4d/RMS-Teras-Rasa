const roleButtons = document.querySelectorAll('.role-btn');
const roleInput = document.getElementById('role');

roleButtons.forEach(button => {
    button.addEventListener('click', () => {
        roleButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        roleInput.value = button.dataset.role;
    });
});
