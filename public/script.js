/**
 * Main Application Script
 * Handles auth, routing, and global functionality
 */

const appState = {
    isLoggedIn: false,
    user: null,
    transactions: []
};

// Google Client ID
const GOOGLE_CLIENT_ID = "602322479541-0it27p79h5i6j606a5k881v2d81577k8.apps.googleusercontent.com";

// UI Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');

// --- Helper: Format Currency ---
const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(val || 0);
};

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

// --- Validate Session & Initialize App ---
async function validateSession() {
    try {
        const res = await API.auth.getProfile();

        if (res.success && res.data.data) {
            appState.isLoggedIn = true;
            appState.user = res.data.data;
            
            // Show dashboard and initialize router
            updateDashboardUI();
            initializeRouter();
        } else {
            // Silently handle - user not logged in
            handleLogoutEffect();
        }
    } catch (e) {
        // Silently handle - user not logged in
        handleLogoutEffect();
    }
}

// --- Initialize Router ---
function initializeRouter() {
    // Register all routes
    router.register('dashboard', renderDashboard);
    router.register('analytics', renderAnalytics);
    router.register('cards', renderCards);
    router.register('assets', renderAssets);
    router.register('profile', renderProfile);
    
    // Set content container
    router.setContainer('#app-content');
    
    // Trigger initial route
    router.handleRouteChange();
}

// --- Update Dashboard UI ---
function updateDashboardUI() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');

    // Update header profile
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

// --- Handle Logout ---
function handleLogoutEffect() {
    appState.isLoggedIn = false;
    appState.user = null;
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
}

// --- Transaction Modal ---
function openTransactionModal() {
    document.getElementById('transaction-modal').classList.remove('hidden');
    document.getElementById('transaction-amount').focus();
}

function closeTransactionModal() {
    document.getElementById('transaction-modal').classList.add('hidden');
}

// --- Handle Transaction (Credit/Debit) ---
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
        const res = await API.bank[type](parseFloat(amount));
        
        btn.disabled = false;
        btn.textContent = originalText;

        if (res.success) {
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
            closeTransactionModal();

            // Refresh current view if on dashboard
            if (router.getCurrentRoute() === 'dashboard') {
                router.handleRouteChange();
            }
        } else {
            showToast(res.data.message || 'Transaction Failed', 'error');
        }
    } catch (e) {
        showToast('Network Error. Try again.', 'error');
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// --- Logout ---
async function performLogout() {
    try {
        await API.auth.logout();
        showToast('Securely logged out', 'info');
        handleLogoutEffect();
    } catch (e) {
        handleLogoutEffect();
    }
}

// --- Google Auth Callback ---
async function handleGoogleCallback(response) {
    const idToken = response.credential;

    try {
        const res = await fetch('/api/auth/google-login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });

        const result = await res.json();

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

// --- Event Listeners ---
function init() {
    // Tabs
    document.getElementById('tab-login')?.addEventListener('click', () => showTab('login'));
    document.getElementById('tab-register')?.addEventListener('click', () => showTab('register'));

    // Password Toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const wrapper = this.closest('.input-wrapper');
            const input = wrapper.querySelector('input');
            const isPassword = input.type === 'password';
            
            input.type = isPassword ? 'text' : 'password';
            
            const iconName = isPassword ? 'eye' : 'eye-off';
            this.setAttribute('data-lucide', iconName);
            if (window.lucide) lucide.createIcons();
        });
    });

    // Google Login Init
    window.onload = function () {
        if (window.google) {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCallback
            });
        }
    };

    // Google button click handler
    document.getElementById('google-login-trigger')?.addEventListener('click', () => {
        if (window.google) {
            google.accounts.id.prompt();
        } else {
            showToast('Google Sign-In not loaded', 'error');
        }
    });

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

    // Logout buttons
    document.getElementById('btn-logout-dropdown')?.addEventListener('click', performLogout);
    document.getElementById('btn-logout')?.addEventListener('click', performLogout);

    // Auth Forms
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await API.auth.login({ username, password });

            if (res.success) {
                showToast('Welcome to Kodbank', 'success');
                validateSession();
            } else {
                showToast(res.data.message || 'Wrong Credentials', 'error');
            }
        } catch (err) {
            console.error('Login error:', err);
            showToast('Service Unavailable', 'error');
        }
    });

    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            username: document.getElementById('reg-username').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            phone: document.getElementById('reg-phone').value
        };

        try {
            const res = await API.auth.register(data);

            if (res.success) {
                showToast('Identity Verified! Please Login.', 'success');
                showTab('login');
            } else {
                showToast(res.data.message || 'Verification Failed', 'error');
            }
        } catch (err) {
            console.error('Registration error:', err);
            showToast('Network Connectivity Issue', 'error');
        }
    });

    // Transaction Modal
    document.getElementById('btn-close-modal')?.addEventListener('click', closeTransactionModal);
    document.getElementById('btn-credit')?.addEventListener('click', () => handleTransaction('credit'));
    document.getElementById('btn-debit')?.addEventListener('click', () => handleTransaction('debit'));

    // Listen for auth logout event
    window.addEventListener('auth:logout', handleLogoutEffect);

    // Initialize app
    validateSession();
    
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
        setTimeout(() => lucide.createIcons(), 100);
    }
}

// Start the app
init();
