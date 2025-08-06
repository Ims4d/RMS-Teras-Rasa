function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.getElementById('toggle-icon');
    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');
    icon.classList.toggle('bi-eye');
    icon.classList.toggle('bi-eye-slash');
}
