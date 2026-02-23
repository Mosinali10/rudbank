/**
 * Cards Component
 * Virtual and physical cards management
 */

async function renderCards() {
    return `
        <header class="top-bar">
            <div class="welcome-msg">
                <h1>My Cards</h1>
                <p>Manage your virtual and physical cards.</p>
            </div>
            <div class="top-actions">
                <button class="btn-cta" id="btn-add-card">
                    <i data-lucide="plus"></i> Add New Card
                </button>
            </div>
        </header>

        <!-- Cards Grid -->
        <section class="cards-grid">
            <!-- Primary Card -->
            <div class="bank-card glass primary-card">
                <div class="card-header">
                    <span class="card-type">Virtual Card</span>
                    <i data-lucide="credit-card"></i>
                </div>
                <div class="card-chip"></div>
                <div class="card-number">•••• •••• •••• 4829</div>
                <div class="card-footer">
                    <div class="card-holder">
                        <span class="label">Card Holder</span>
                        <span class="value" id="card-holder-name">Loading...</span>
                    </div>
                    <div class="card-expiry">
                        <span class="label">Expires</span>
                        <span class="value">12/26</span>
                    </div>
                </div>
                <div class="card-brand">Kodbank</div>
            </div>

            <!-- Secondary Card -->
            <div class="bank-card glass secondary-card">
                <div class="card-header">
                    <span class="card-type">Physical Card</span>
                    <i data-lucide="credit-card"></i>
                </div>
                <div class="card-chip"></div>
                <div class="card-number">•••• •••• •••• 7392</div>
                <div class="card-footer">
                    <div class="card-holder">
                        <span class="label">Card Holder</span>
                        <span class="value" id="card-holder-name-2">Loading...</span>
                    </div>
                    <div class="card-expiry">
                        <span class="label">Expires</span>
                        <span class="value">08/27</span>
                    </div>
                </div>
                <div class="card-brand">Kodbank</div>
            </div>
        </section>

        <!-- Card Actions -->
        <section class="card-actions-grid">
            <div class="action-card glass hover-lift">
                <i data-lucide="lock" class="action-icon"></i>
                <h3>Freeze Card</h3>
                <p>Temporarily disable your card</p>
                <button class="btn-secondary">Freeze</button>
            </div>
            <div class="action-card glass hover-lift">
                <i data-lucide="eye" class="action-icon"></i>
                <h3>View Details</h3>
                <p>See full card information</p>
                <button class="btn-secondary">View</button>
            </div>
            <div class="action-card glass hover-lift">
                <i data-lucide="settings" class="action-icon"></i>
                <h3>Card Settings</h3>
                <p>Manage limits and preferences</p>
                <button class="btn-secondary">Settings</button>
            </div>
            <div class="action-card glass hover-lift">
                <i data-lucide="file-text" class="action-icon"></i>
                <h3>Statements</h3>
                <p>Download card statements</p>
                <button class="btn-secondary">Download</button>
            </div>
        </section>

        <!-- Recent Card Transactions -->
        <div class="history-section glass">
            <div class="section-header">
                <h3>Recent Card Transactions</h3>
                <a href="#" class="view-all">View All</a>
            </div>
            <div class="transaction-list">
                <div class="transaction-item">
                    <div class="tx-icon">
                        <i data-lucide="shopping-bag" style="color: #c084fc;"></i>
                    </div>
                    <div class="tx-info">
                        <div class="tx-title">Amazon Purchase</div>
                        <div class="tx-date">Today • Card ending 4829</div>
                    </div>
                    <div class="tx-amount amount-down">
                        -₹2,499
                        <span class="tx-status">completed</span>
                    </div>
                </div>
                <div class="transaction-item">
                    <div class="tx-icon">
                        <i data-lucide="coffee" style="color: #22d3ee;"></i>
                    </div>
                    <div class="tx-info">
                        <div class="tx-title">Starbucks</div>
                        <div class="tx-date">Yesterday • Card ending 7392</div>
                    </div>
                    <div class="tx-amount amount-down">
                        -₹450
                        <span class="tx-status">completed</span>
                    </div>
                </div>
                <div class="transaction-item">
                    <div class="tx-icon">
                        <i data-lucide="smartphone" style="color: #f472b6;"></i>
                    </div>
                    <div class="tx-info">
                        <div class="tx-title">Netflix Subscription</div>
                        <div class="tx-date">2 days ago • Card ending 4829</div>
                    </div>
                    <div class="tx-amount amount-down">
                        -₹649
                        <span class="tx-status">completed</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize cards-specific functionality
 */
async function initCards() {
    if (window.lucide) lucide.createIcons();
    
    // Load user data for card holder name
    try {
        const res = await API.auth.getProfile();
        if (res.success && res.data.data) {
            const username = res.data.data.username;
            document.getElementById('card-holder-name').textContent = username.toUpperCase();
            document.getElementById('card-holder-name-2').textContent = username.toUpperCase();
        }
    } catch (error) {
        console.error('Failed to load card holder name:', error);
    }

    // Add card button
    document.getElementById('btn-add-card')?.addEventListener('click', () => {
        showToast('Add card feature coming soon!', 'info');
    });
}
