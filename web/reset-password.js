const BASE_URL = 'http://localhost:3000/api';
const form = document.getElementById('resetPasswordForm');
const resetError = document.getElementById('resetError');
const resetSuccess = document.getElementById('resetSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resetError.textContent = '';
  resetSuccess.textContent = '';
  const email = document.getElementById('email').value;
  try {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      resetSuccess.textContent = data.message + (data.tempPassword ? ` | Senha temporária: ${data.tempPassword}` : '');
    } else {
      resetError.textContent = data.error || 'Erro ao solicitar redefinição.';
    }
  } catch (err) {
    resetError.textContent = 'Erro de conexão com o servidor.';
  }
});
