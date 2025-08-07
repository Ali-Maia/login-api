const BASE_URL = 'http://localhost:3000/api';

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'profile.html';
    } else {
      loginError.textContent = data.error || 'Erro ao fazer login';
    }
  } catch (err) {
    loginError.textContent = 'Erro de conexão com o servidor';
  }
});

// Esqueci minha senha
const forgotPassword = document.getElementById('forgotPassword');
forgotPassword.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'reset-password.html';
});
