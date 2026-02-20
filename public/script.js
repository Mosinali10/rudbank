const appState = {
    isLoggedIn: false,
    user: null
};

// UI Elements
const jsonOutput = document.getElementById('json-output');
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const authStatus = document.getElementById('auth-status');

// --- Navigation ---
function showTab(type) {
    document.getElementById('login-form').classList.toggle('hidden', type === 'register');
    document.getElementById('register-form').classList.toggle('hidden', type === 'login');
    document.getElementById('tab-login').classList.toggle('active', type === 'login');
    document.getElementById('tab-register').classList.toggle('active', type === 'register');
}

function updateLog(data) {
    jsonOutput.textContent = JSON.stringify(data, null, 2);
}

// --- API Calls ---

async function checkHealth() {
    try {
        const res = await fetch('/api/health');
        const data = await res.json();
        document.getElementById('health-status').textContent = `Health Check: ${data.message}`;
        document.getElementById('health-status').style.color = '#10b981';
    } catch (e) {
        document.getElementById('health-status').textContent = 'Health Check: Failed to Connect';
        document.getElementById('health-status').style.color = '#ef4444';
    }
}

async function fetchProfile() {
    try {
        const res = await fetch('/api/bank/profile');
        const result = await res.json();

        if (result.success) {
            appState.isLoggedIn = true;
            appState.user = result.data;
            updateDashboard();
        } else {
            appState.isLoggedIn = false;
            updateDashboard();
        }
        updateLog(result);
    } catch (e) {
        appState.isLoggedIn = false;
        updateDashboard();
    }
}

function updateDashboard() {
    if (appState.isLoggedIn) {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        authStatus.textContent = 'Status: Active Session';
        authStatus.style.color = '#10b981';

        document.getElementById('display-name').textContent = appState.user.username;
        document.getElementById('display-email').textContent = appState.user.email;
        document.getElementById('display-balance').textContent = `₹${parseFloat(appState.user.balance).toLocaleString()}`;
    } else {
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        authStatus.textContent = 'Status: Guest';
        authStatus.style.color = '#94a3b8';
    }
}

// --- Auth Actions ---

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await res.json();
    updateLog(result);
    if (result.success) {
        fetchProfile();
    } else {
        alert(result.message);
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = {
        username: document.getElementById('reg-username').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        phone: document.getElementById('reg-phone').value
    };

    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });

    const result = await res.json();
    updateLog(result);
    if (result.success) {
        alert('Registered successfully! Now login.');
        showTab('login');
    } else {
        alert(result.message);
    }
});

async function logout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    const result = await res.json();
    updateLog(result);
    appState.isLoggedIn = false;
    updateDashboard();
}

async function performTransaction(type) {
    const amount = document.getElementById('transaction-amount').value;
    if (!amount) return alert('Enter an amount');

    const res = await fetch(`/api/bank/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) })
    });

    const result = await res.json();
    updateLog(result);
    if (result.success) {
        fetchProfile();
        document.getElementById('transaction-amount').value = '';
    } else {
        alert(result.message);
    }
}

// Init
checkHealth();
fetchProfile();
