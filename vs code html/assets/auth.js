// Simple client-side auth (localStorage)
// Crea account admin se non esiste
function ensureAdmin() {
    let users = getUsers();
    const adminIdx = users.findIndex(u => u.username === 'admin' || u.email === 'admin');
    if (adminIdx === -1) {
        users.push({ username: 'admin', email: 'admin', password: '2018010ic' });
        saveUsers(users);
    } else {
        users[adminIdx].password = '2018010ic';
        saveUsers(users);
    }
}
ensureAdmin();
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
// Login
if (document.getElementById('loginForm')) {
    // Captcha setup
    let captchaA = Math.floor(Math.random() * 10) + 1;
    let captchaB = Math.floor(Math.random() * 10) + 1;
    document.getElementById('captchaLabel').innerText = `Quanto fa ${captchaA} + ${captchaB}?`;
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        const usernameOrEmail = document.getElementById('usernameOrEmail').value;
        const password = document.getElementById('password').value;
        const captchaInput = document.getElementById('captchaInput').value;
        if (parseInt(captchaInput) !== (captchaA + captchaB)) {
            document.getElementById('loginMessage').innerText = 'Captcha errato. Riprova.';
            captchaA = Math.floor(Math.random() * 10) + 1;
            captchaB = Math.floor(Math.random() * 10) + 1;
            document.getElementById('captchaLabel').innerText = `Quanto fa ${captchaA} + ${captchaB}?`;
            return;
        }
        const users = getUsers();
        const user = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password);
        if (user) {
            localStorage.setItem('loggedIn', 'true');
            if (user.username === 'admin' || user.email === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = '95.html';
            }
        } else {
            document.getElementById('loginMessage').innerText = 'Credenziali non valide.';
        }
    }
    document.getElementById('deleteAccountBtn').onclick = function() {
        const usernameOrEmail = document.getElementById('usernameOrEmail').value;
        const password = document.getElementById('password').value;
        let users = getUsers();
        // Solo admin può eliminare account
        const adminUser = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password && (u.username === 'admin' || u.email === 'admin'));
        if (!adminUser) {
            document.getElementById('loginMessage').innerText = 'Solo l’admin può eliminare account.';
            return;
        }
        const idx = users.findIndex(u => (u.username !== 'admin' && u.email !== 'admin') && (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password);
        if (window.confirm('Sei sicuro di voler eliminare un account? L’operazione è irreversibile.')) {
            // Mostra elenco utenti (escluso admin) e chiedi quale eliminare
            let userList = users.filter(u => u.username !== 'admin' && u.email !== 'admin');
            let toDelete = prompt('Inserisci username o email dell’account da eliminare:', userList.length > 0 ? userList[0].username : '');
            let delIdx = users.findIndex(u => (u.username === toDelete || u.email === toDelete) && u.username !== 'admin' && u.email !== 'admin');
            if (delIdx !== -1) {
                users.splice(delIdx, 1);
                saveUsers(users);
                document.getElementById('loginMessage').innerText = 'Account eliminato.';
            } else {
                document.getElementById('loginMessage').innerText = 'Account non trovato o non eliminabile.';
            }
        }
    }
}
// Register
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        let users = getUsers();
        if (users.find(u => u.username === username)) {
            document.getElementById('registerMessage').innerText = 'Username già esistente.';
            return;
        }
        if (users.find(u => u.email === email)) {
            document.getElementById('registerMessage').innerText = 'Email già registrata.';
            return;
        }
        users.push({ username, email, password });
        saveUsers(users);
        document.getElementById('registerMessage').innerText = 'Registrazione avvenuta! Puoi fare login.';
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    }
}
// Forgot Password
if (document.getElementById('forgotForm')) {
    let generatedCode = '';
    document.getElementById('sendCode').onclick = function() {
        const email = document.getElementById('forgotEmail').value;
        const users = getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
            generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            document.getElementById('forgotMessage').innerText = 'Codice di verifica inviato alla tua email (simulato): ' + generatedCode;
            document.getElementById('verifyCode').style.display = '';
            document.getElementById('newForgotPassword').style.display = '';
            document.getElementById('resetBtn').style.display = '';
        } else {
            document.getElementById('forgotMessage').innerText = 'Email non trovata.';
        }
    };
    document.getElementById('forgotForm').onsubmit = function(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        const code = document.getElementById('verifyCode').value;
        const newPassword = document.getElementById('newForgotPassword').value;
        if (code !== generatedCode) {
            document.getElementById('forgotMessage').innerText = 'Codice di verifica errato.';
            return;
        }
        let users = getUsers();
        let user = users.find(u => u.email === email);
        if (user) {
            user.password = newPassword;
            saveUsers(users);
            document.getElementById('forgotMessage').innerText = 'Password aggiornata! Puoi fare login.';
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        }
    };
}
