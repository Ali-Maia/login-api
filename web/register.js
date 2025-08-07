const BASE_URL = 'http://localhost:3000/api';
const registerForm = document.getElementById('registerForm');
const registerError = document.getElementById('registerError');
const registerSuccess = document.getElementById('registerSuccess');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  registerError.textContent = '';
  registerSuccess.textContent = '';
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      registerSuccess.textContent = 'Usuário criado com sucesso! Redirecionando...';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      registerError.textContent = data.error || 'Erro ao criar usuário';
    }
  } catch (err) {
    registerError.textContent = 'Erro de conexão com o servidor';
  }
});
