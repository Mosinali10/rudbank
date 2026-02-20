const appState = {
    isLoggedIn: false,
    user: null,
    transactions: []
};

// UI Elements
const jsonOutput = document.getElementById('json-output');
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const authStatus = document.getElementById('auth-status');
const transactionList = document.getElementById('transaction-list');

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
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
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
        document.getElementById('health-status').textContent = 'Health Check: Off';
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
            fetchTransactions();
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

async function fetchTransactions() {
    try {
        const res = await fetch('/api/bank/transactions');
        const result = await res.json();
        if (result.success) {
            appState.transactions = result.data;
            renderTransactions();
        }
    } catch (e) {
        console.error("Failed to fetch transactions", e);
    }
}

function renderTransactions() {
    if (appState.transactions.length === 0) {
        transactionList.innerHTML = '<div class="empty-state">No transactions recently.</div>';
        return;
    }

    transactionList.innerHTML = appState.transactions.map(tx => {
        const isCredit = tx.type === 'credit';
        const date = new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        return `
            <div class="transaction-item">
                <div class="tx-icon">
                    <i data-lucide="${isCredit ? 'arrow-down-left' : 'arrow-up-right'}" style="color: ${isCredit ? '#10b981' : '#ef4444'}"></i>
                </div>
                <div class="tx-info">
                    <div class="tx-title">${tx.description}</div>
                    <div class="tx-date">${date} • ${tx.category}</div>
                </div>
                <div class="tx-amount ${isCredit ? 'amount-up' : 'amount-down'}">
                    ${isCredit ? '+' : '-'}₹${parseFloat(tx.amount).toLocaleString('en-IN')}
                    <span class="tx-status">${tx.status}</span>
                </div>
            </div>
        `;
    }).join('');
    lucide.createIcons();
}

function updateDashboard() {
    if (appState.isLoggedIn) {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        authStatus.textContent = 'Active Session';
        authStatus.style.color = '#10b981';

        document.getElementById('display-welcome').textContent = `Welcome back, ${appState.user.username}`;
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
        if (result.success) {
            showToast('Securely logged in', 'success');
            fetchProfile();
        } else {
            showToast(result.message || 'Access Denied', 'error');
        }
    } catch (err) {
        showToast('Connection Refused', 'error');
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
        if (result.success) {
            showToast('Account Created!', 'success');
            showTab('login');
        } else {
            showToast(result.message || 'Could not register', 'error');
        }
    } catch (err) {
        showToast('Network Error', 'error');
    }
});

document.getElementById('btn-logout').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    appState.isLoggedIn = false;
    showToast('Securely logged out');
    updateDashboard();
});

// --- Transaction Modal ---
function showTransactionModal() {
    document.getElementById('transaction-modal').classList.remove('hidden');
    document.getElementById('transaction-amount').focus();
}

function closeTransactionModal() {
    document.getElementById('transaction-modal').classList.add('hidden');
}

async function handleTransaction(type) {
    const amountInput = document.getElementById('transaction-amount');
    const amount = amountInput.value;
    if (!amount || amount <= 0) return showToast('Invalid amount', 'error');

    try {
        const btn = document.getElementById(`btn-${type}`);
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Processing...';

        const res = await fetch(`/api/bank/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(amount) })
        });

        const result = await res.json();
        btn.disabled = false;
        btn.textContent = originalText;

        if (result.success) {
            showToast('Transaction Perfect!', 'success');
            if (type === 'credit' && typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#c084fc', '#22d3ee', '#ffffff']
                });
            }
            amountInput.value = '';
            closeTransactionModal();
            fetchProfile();
        } else {
            showToast(result.message, 'error');
        }
    } catch (e) {
        showToast('Server error', 'error');
    }
}

document.getElementById('btn-credit').addEventListener('click', () => handleTransaction('credit'));
document.getElementById('btn-debit').addEventListener('click', () => handleTransaction('debit'));

// Close modal on escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTransactionModal();
});

// Init
checkHealth();
fetchProfile();
lucide.createIcons();
