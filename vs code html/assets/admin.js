// Mostra lista utenti (escluso admin)
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function renderUserList() {
    const users = getUsers().filter(u => u.username !== 'admin' && u.email !== 'admin');
    const ul = document.getElementById('userList');
    ul.innerHTML = '';
    users.forEach(u => {
        const li = document.createElement('li');
        li.textContent = `${u.username} (${u.email})`;
        ul.appendChild(li);
    });
}
document.addEventListener('DOMContentLoaded', renderUserList);
document.getElementById('deleteUserBtn').onclick = function() {
    const toDelete = document.getElementById('deleteUserInput').value;
    let users = getUsers();
    const idx = users.findIndex(u => (u.username === toDelete || u.email === toDelete) && u.username !== 'admin' && u.email !== 'admin');
    if (idx !== -1) {
        users.splice(idx, 1);
        saveUsers(users);
        document.getElementById('adminMessage').innerText = 'Utente eliminato.';
        renderUserList();
    } else {
        document.getElementById('adminMessage').innerText = 'Utente non trovato.';
    }
};