const BASE_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
const statsError = document.getElementById('statsError');

if (!token) {
  window.location.href = 'index.html';
}

async function loadStats() {
  try {
    const res = await fetch(`${BASE_URL}/users/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Não autorizado');
    const data = await res.json();
    document.getElementById('totalUsers').textContent = data.stats.totalUsers;
    document.getElementById('blockedAccounts').textContent = data.stats.blockedAccounts;
    const blockedEmailsList = document.getElementById('blockedEmails');
    blockedEmailsList.innerHTML = '';
    if (data.stats.blockedEmails.length === 0) {
      blockedEmailsList.innerHTML = '<li class="collection-item">Nenhum email bloqueado</li>';
    } else {
      data.stats.blockedEmails.forEach(email => {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.textContent = email;
        blockedEmailsList.appendChild(li);
      });
    }
  } catch (err) {
    statsError.textContent = 'Erro ao carregar estatísticas.';
    setTimeout(() => window.location.href = 'profile.html', 2000);
  }
}

loadStats();
