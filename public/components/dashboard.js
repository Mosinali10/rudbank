/**
 * Dashboard Component
 * Main dashboard view with stats and transactions
 */

async function renderDashboard() {
    return `
        <header class="top-bar">
            <div class="welcome-msg">
                <h1 id="display-welcome">Welcome back</h1>
                <p>Here's what's happening with your finance today.</p>
            </div>
            <div class="top-actions">
                <button id="btn-check-balance" class="btn-secondary">Check Balance</button>
                <button id="btn-open-transaction" class="btn-cta">Send Money</button>
            </div>
        </header>

        <!-- Stats Grid -->
        <section class="stats-grid">
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="dollar-sign" class="icon-orange"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> Active</span>
                </div>
                <p class="stat-label">Total Balance</p>
                <h2 id="display-balance" class="stat-value">₹0.00</h2>
            </div>
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="trending-up" class="icon-red"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> 0%</span>
                </div>
                <p class="stat-label">Monthly Income</p>
                <h2 id="display-income" class="stat-value">₹0.00</h2>
            </div>
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="activity" class="icon-blue"></i>
                    <span class="trend-down"><i data-lucide="arrow-down-right"></i> 0%</span>
                </div>
                <p class="stat-label">Monthly Expenses</p>
                <h2 id="display-expenses" class="stat-value">₹0.00</h2>
            </div>
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="briefcase" class="icon-gold"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> 0%</span>
                </div>
                <p class="stat-label">Total Savings</p>
                <h2 id="display-savings" class="stat-value">₹0.00</h2>
            </div>
        </section>

        <!-- Middle Section -->
        <div class="content-grid">
            <!-- Chart Area -->
            <div class="chart-section glass">
                <div class="section-header">
                    <h3>Spending Analytics</h3>
                    <select class="time-filter">
                        <option>Last 7 Days</option>
                        <option>Last Month</option>
                    </select>
                </div>
                <div class="mock-chart">
                    <div class="chart-gradient"></div>
                    <svg class="chart-svg" viewBox="0 0 100 40">
                        <path d="M0,35 Q10,15 20,25 T40,15 T60,25 T80,10 T100,5" fill="none"
                            stroke="url(#chartGradient)" stroke-width="2" />
                        <defs>
                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color: #c084fc; stop-opacity: 1" />
                                <stop offset="100%" style="stop-color: #c084fc; stop-opacity: 0.2" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div class="chart-labels">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>

            <!-- History Area -->
            <div class="history-section glass">
                <div class="section-header">
                    <h3>Recent Transactions</h3>
                    <a href="#" class="view-all">View All</a>
                </div>
                <div id="transaction-list" class="transaction-list">
                    <div class="empty-state">Loading transactions...</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize dashboard-specific functionality
 */
function initDashboard() {
    // Reinitialize Lucide icons
    if (window.lucide) lucide.createIcons();

    // Load balance and transactions
    loadDashboardData();

    // Attach event listeners
    document.getElementById('btn-check-balance')?.addEventListener('click', refreshBalance);
    document.getElementById('btn-open-transaction')?.addEventListener('click', openTransactionModal);
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    try {
        // Load balance
        const balanceRes = await API.bank.getBalance();
        if (balanceRes.success) {
            const balance = balanceRes.data.data.balance;
            document.getElementById('display-balance').textContent = formatCurrency(balance);
        }

        // Load transactions
        const txRes = await API.bank.getTransactions();
        if (txRes.success) {
            renderTransactions(txRes.data.data);
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

/**
 * Refresh balance
 */
async function refreshBalance() {
    showToast('Updating balance...', 'info');
    const res = await API.bank.getBalance();
    if (res.success) {
        const balance = res.data.data.balance;
        document.getElementById('display-balance').textContent = formatCurrency(balance);
        showToast('Balance updated', 'success');
    }
}

/**
 * Render transactions list
 */
function renderTransactions(transactions) {
    const container = document.getElementById('transaction-list');
    if (!container) return;

    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<div class="empty-state">No transactions recorded yet.</div>';
        return;
    }

    container.innerHTML = transactions.map(tx => {
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
