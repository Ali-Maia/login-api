const BASE_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
const profileError = document.getElementById('profileError');

if (!token) {
  window.location.href = 'index.html';
}

async function loadProfile() {
  try {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Não autorizado');
    const data = await res.json();
    document.getElementById('userName').textContent = data.user.name;
    document.getElementById('userEmail').textContent = data.user.email;
    document.getElementById('userCreated').textContent = new Date(data.user.createdAt).toLocaleString();
    document.getElementById('editName').value = data.user.name;
    M.updateTextFields();
  } catch (err) {
    profileError.textContent = 'Erro ao carregar perfil. Faça login novamente.';
    setTimeout(() => window.location.href = 'index.html', 2000);
  }
}

loadProfile();

// Editar perfil
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileSection = document.getElementById('editProfileSection');
const profileCard = document.getElementById('profileCard');
const cancelEdit = document.getElementById('cancelEdit');

editProfileBtn.addEventListener('click', () => {
  profileCard.style.display = 'none';
  editProfileSection.style.display = 'block';
});
cancelEdit.addEventListener('click', () => {
  editProfileSection.style.display = 'none';
  profileCard.style.display = 'block';
});

document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  profileError.textContent = '';
  const name = document.getElementById('editName').value;
  try {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('Erro ao atualizar perfil');
    M.toast({html: 'Perfil atualizado!'});
    editProfileSection.style.display = 'none';
    profileCard.style.display = 'block';
    loadProfile();
  } catch (err) {
    profileError.textContent = 'Erro ao atualizar perfil.';
  }
});

// Excluir conta
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
deleteAccountBtn.addEventListener('click', async () => {
  if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) return;
  try {
    const res = await fetch(`${BASE_URL}/users/delete`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erro ao excluir conta');
    localStorage.removeItem('token');
    M.toast({html: 'Conta excluída!'});
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (err) {
    profileError.textContent = 'Erro ao excluir conta.';
  }
});
