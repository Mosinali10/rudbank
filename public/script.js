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

document.getElementById('tab-login').addEventListener('click', () => showTab('login'));
document.getElementById('tab-register').addEventListener('click', () => showTab('register'));

function updateLog(data) {
    jsonOutput.textContent = JSON.stringify(data, null, 2);
}

function showToast(message, type = 'info') {
    // Simple modern toast logic
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- API Calls ---
async function checkHealth() {
    try {
        const res = await fetch('/api/health');
        const data = await res.json();
        const el = document.getElementById('health-status');
        el.textContent = `Health Check: ${data.message}`;
        el.style.color = '#10b981';
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
        document.getElementById('display-balance').textContent = `₹${parseFloat(appState.user.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
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

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await res.json();
        updateLog(result);
        if (result.success) {
            showToast('Welcome back!', 'success');
            fetchProfile();
        } else {
            showToast(result.message || 'Login failed', 'error');
        }
    } catch (err) {
        showToast('System Error: Could not connect to server', 'error');
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

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const result = await res.json();
        updateLog(result);
        if (result.success) {
            showToast('Account created! Please login.', 'success');
            showTab('login');
        } else {
            showToast(result.message || 'Registration failed', 'error');
        }
    } catch (err) {
        showToast('System Error: Could not connect to server', 'error');
    }
});

document.getElementById('btn-logout').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        const result = await res.json();
        updateLog(result);
        appState.isLoggedIn = false;
        showToast('Logged out successfully');
        updateDashboard();
    } catch (err) {
        updateDashboard();
    }
});

async function handleTransaction(type) {
    const amountInput = document.getElementById('transaction-amount');
    const amount = amountInput.value;

    if (!amount || isNaN(amount) || amount <= 0) {
        return showToast('Please enter a valid amount greater than 0', 'error');
    }

    try {
        const btn = document.getElementById(`btn-${type}`);
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Processing...';

        const res = await fetch(`/api/bank/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(amount) })
        });

        const result = await res.json();
        updateLog(result);

        btn.disabled = false;
        btn.innerHTML = originalText;

        if (result.success) {
            showToast(`Amount ${type === 'credit' ? 'added to' : 'deducted from'} balance!`, 'success');
            amountInput.value = '';
            fetchProfile();
        } else {
            showToast(result.message || 'Transaction failed', 'error');
        }
    } catch (e) {
        showToast('Server error during transaction', 'error');
    }
}

document.getElementById('btn-credit').addEventListener('click', () => handleTransaction('credit'));
document.getElementById('btn-debit').addEventListener('click', () => handleTransaction('debit'));

// Init
checkHealth();
fetchProfile();
