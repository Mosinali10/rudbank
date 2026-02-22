const appState = {
    isLoggedIn: false,
    user: null,
    transactions: []
};

// --- Google Client ID ---
// NOTE: Replace this with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "602322479541-0it27p79h5i6j606a5k881v2d81577k8.apps.googleusercontent.com";

// UI Elements
const jsonOutput = document.getElementById('json-output');
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const authStatus = document.getElementById('auth-status');
const transactionList = document.getElementById('transaction-list');
const displayBalance = document.getElementById('display-balance');

// --- Helper: Format Currency ---
const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(val || 0);
};

// --- Helper: Update Debug Log ---
function updateLog(data) {
    if (jsonOutput) {
        jsonOutput.textContent = JSON.stringify(data, null, 2);
    }
}

// --- Helper: Show Toast ---
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

// --- Navigation ---
function showTab(type) {
    document.getElementById('login-form').classList.toggle('hidden', type === 'register');
    document.getElementById('register-form').classList.toggle('hidden', type === 'login');
    document.getElementById('tab-login').classList.toggle('active', type === 'login');
    document.getElementById('tab-register').classList.toggle('active', type === 'register');
}

// --- TASK 1 & 6: Validate Session & Protect Dashboard ---
async function validateSession() {
    try {
        const res = await fetch('/api/bank/profile', {
            credentials: 'include'   // 🔥 THIS WAS MISSING
        });

        // If backend says unauthorized → logout UI
        if (res.status === 401) {
            return handleLogoutEffect();
        }

        const result = await res.json();
        updateLog(result);

        if (result.success) {
            appState.isLoggedIn = true;
            appState.user = result.data;

            updateDashboardUI();
            fetchTransactions();
            fetchBalance();
        } else {
            handleLogoutEffect();
        }

    } catch (e) {
        console.error("Session validation error:", e);
        handleLogoutEffect();
    }
}

// --- TASK 2: Fetch Balance ---
async function fetchBalance() {
    try {
        const res = await fetch('/api/bank/balance');
        if (res.status === 401) return handleLogoutEffect();

        const result = await res.json();
        updateLog(result);

        if (result.success) {
            const balance = result.data.balance;
            displayBalance.textContent = formatCurrency(balance);
            if (appState.user) appState.user.balance = balance;
        }
    } catch (e) {
        console.error("Balance Fetch Error:", e);
    }
}

async function fetchTransactions() {
    try {
        const res = await fetch('/api/bank/transactions');
        const result = await res.json();
        if (result.success) {
            appState.transactions = result.data;
            renderTransactionsList();
        }
    } catch (e) {
        console.error("TX Fetch Error:", e);
    }
}

function renderTransactionsList() {
    if (!transactionList) return;
    if (appState.transactions.length === 0) {
        transactionList.innerHTML = '<div class="empty-state">No transactions recorded yet.</div>';
        return;
    }

    transactionList.innerHTML = appState.transactions.map(tx => {
        const isCredit = tx.type === 'credit';
        const date = new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        return `
            <div class="transaction-item">
                <div class="tx-icon">
                    <i data-lucide="${isCredit ? 'arrow-down-left' : 'arrow-up-right'}" style="color: ${isCredit ? '#00f59b' : '#ff4d88'}"></i>
                </div>
                <div class="tx-info">
                    <div class="tx-title">${tx.description || (isCredit ? 'Account Credit' : 'Account Debit')}</div>
                    <div class="tx-date">${date} • ${tx.category || 'Banking'}</div>
                </div>
                <div class="tx-amount ${isCredit ? 'amount-up' : 'amount-down'}">
                    ${isCredit ? '+' : '-'}₹${parseFloat(tx.amount).toLocaleString('en-IN')}
                    <span class="tx-status">${tx.status || 'completed'}</span>
                </div>
            </div>
        `;
    }).join('');
    if (window.lucide) lucide.createIcons();
}

// --- TASK 4 & 5: Dashboard Header Upgrade ---
function updateDashboardUI() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    authStatus.textContent = 'Active Session';
    authStatus.style.color = '#00f59b';

    document.getElementById('display-welcome').textContent = `Welcome back, ${appState.user.username}`;

    // Header Profile Image & Name
    const headerImg = document.getElementById('header-user-img');
    const headerName = document.getElementById('header-user-name');

    if (headerName) headerName.textContent = appState.user.username;

    if (headerImg) {
        if (appState.user.profile_image) {
            headerImg.innerHTML = `<img src="${appState.user.profile_image}" alt="Profile">`;
        } else {
            headerImg.textContent = appState.user.username.charAt(0).toUpperCase();
        }
    }
}

function handleLogoutEffect() {
    appState.isLoggedIn = false;
    appState.user = null;
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    authStatus.textContent = 'Status: Guest';
    authStatus.style.color = '#8b8ba7';
}

// --- Google Auth: Callback ---
async function handleGoogleCallback(response) {
    const idToken = response.credential;

    try {
        const res = await fetch('/api/auth/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });

        const result = await res.json();
        updateLog(result);

        if (result.success) {
            showToast(`Welcome back, ${result.data.user.username}`, 'success');
            validateSession();
        } else {
            showToast(result.message || 'Google Auth Failed', 'error');
        }
    } catch (err) {
        showToast('Google Login Service Error', 'error');
    }
}

// --- TASK 3 & 4: Transactions (Credit / Debit) ---
async function handleTransaction(type) {
    const amountInput = document.getElementById('transaction-amount');
    const amount = amountInput.value;

    if (!amount || parseFloat(amount) <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }

    const btn = document.getElementById(`btn-${type}`);
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '...';

    try {
        const res = await fetch(`/api/bank/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(amount) })
        });

        const result = await res.json();
        updateLog(result);
        btn.disabled = false;
        btn.textContent = originalText;

        if (result.success) {
            showToast(`${type === 'credit' ? 'Money Added' : 'Money Sent'} Successfully!`, 'success');

            if (type === 'credit' && typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#c084fc', '#22d3ee', '#ffffff']
                });
            }

            amountInput.value = '';
            document.getElementById('transaction-modal').classList.add('hidden');

            fetchBalance();
            fetchTransactions();
        } else {
            showToast(result.message || 'Transaction Failed', 'error');
        }
    } catch (e) {
        showToast('Network Error. Try again.', 'error');
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// --- TASK 5: Logout ---
async function performLogout() {
    try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        const result = await res.json();
        updateLog(result);
        showToast('Securely logged out', 'info');
        handleLogoutEffect();
    } catch (e) {
        handleLogoutEffect();
    }
}

// --- Event Listeners ---
function init() {
    // Tabs
    document.getElementById('tab-login')?.addEventListener('click', () => showTab('login'));
    document.getElementById('tab-register')?.addEventListener('click', () => showTab('register'));

    // Google Login Init
    window.onload = function () {
        if (window.google) {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCallback
            });
            google.accounts.id.renderButton(
                document.getElementById("google-login-btn"),
                { theme: "outline", size: "large", width: "100%", text: "continue_with" }
            );
        }
    };

    // Profile Dropdown Toggle
    const profileArea = document.querySelector('.brand-profile');
    const profileDropdown = document.getElementById('profile-dropdown');

    profileArea?.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown?.classList.toggle('hidden');
    });

    window.addEventListener('click', () => {
        profileDropdown?.classList.add('hidden');
    });

    // Logout from Dropdown
    document.getElementById('btn-logout-dropdown')?.addEventListener('click', performLogout);

    // Auth Forms
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
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
                showToast('Welcome to Kodbank', 'success');
                validateSession();
            } else {
                showToast(result.message || 'Wrong Credentials', 'error');
            }
        } catch (err) {
            showToast('Service Unavailable', 'error');
        }
    });

    // ... (rest of registration and stats buttons left as is) ...
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            username: document.getElementById('reg-username').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            phone: document.getElementById('reg-phone').value
        };

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            updateLog(result);

            if (result.success) {
                showToast('Identity Verified! Please Login.', 'success');
                showTab('login');
            } else {
                showToast(result.message || 'Verification Failed', 'error');
            }
        } catch (err) {
            showToast('Network Connectivity Issue', 'error');
        }
    });

    document.getElementById('btn-check-balance')?.addEventListener('click', () => {
        showToast('Updating balance...', 'info');
        fetchBalance();
    });

    document.getElementById('btn-open-transaction')?.addEventListener('click', () => {
        document.getElementById('transaction-modal').classList.remove('hidden');
        document.getElementById('transaction-amount').focus();
    });

    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
        document.getElementById('transaction-modal').classList.add('hidden');
    });

    document.getElementById('btn-credit')?.addEventListener('click', () => handleTransaction('credit'));
    document.getElementById('btn-debit')?.addEventListener('click', () => handleTransaction('debit'));

    document.getElementById('btn-logout')?.addEventListener('click', performLogout);

    validateSession();
    if (window.lucide) lucide.createIcons();
}

init();
