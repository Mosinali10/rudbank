/**
 * Assets Component
 * Investment and asset portfolio view
 */

async function renderAssets() {
    return `
        <header class="top-bar">
            <div class="welcome-msg">
                <h1>Assets & Investments</h1>
                <p>Track your investment portfolio and assets.</p>
            </div>
            <div class="top-actions">
                <button class="btn-cta">
                    <i data-lucide="trending-up"></i> Invest Now
                </button>
            </div>
        </header>

        <!-- Portfolio Overview -->
        <section class="stats-grid">
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="briefcase" class="icon-orange"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> 15.2%</span>
                </div>
                <p class="stat-label">Total Portfolio</p>
                <h2 class="stat-value">₹2,45,000</h2>
            </div>
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="trending-up" class="icon-red"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> 8.5%</span>
                </div>
                <p class="stat-label">Total Returns</p>
                <h2 class="stat-value">₹18,450</h2>
            </div>
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="pie-chart" class="icon-blue"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> 12%</span>
                </div>
                <p class="stat-label">Today's Gain</p>
                <h2 class="stat-value">₹3,240</h2>
            </div>
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="target" class="icon-gold"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> Active</span>
                </div>
                <p class="stat-label">Active Investments</p>
                <h2 class="stat-value">8</h2>
            </div>
        </section>

        <!-- Asset Allocation -->
        <div class="content-grid">
            <div class="chart-section glass">
                <div class="section-header">
                    <h3>Asset Allocation</h3>
                    <select class="time-filter">
                        <option>All Time</option>
                        <option>This Year</option>
                    </select>
                </div>
                <div class="asset-allocation">
                    <div class="allocation-item">
                        <div class="allocation-info">
                            <div class="allocation-color" style="background: #c084fc;"></div>
                            <span>Stocks</span>
                        </div>
                        <span class="allocation-percent">45%</span>
                        <span class="allocation-amount">₹1,10,250</span>
                    </div>
                    <div class="allocation-item">
                        <div class="allocation-info">
                            <div class="allocation-color" style="background: #22d3ee;"></div>
                            <span>Mutual Funds</span>
                        </div>
                        <span class="allocation-percent">30%</span>
                        <span class="allocation-amount">₹73,500</span>
                    </div>
                    <div class="allocation-item">
                        <div class="allocation-info">
                            <div class="allocation-color" style="background: #f472b6;"></div>
                            <span>Fixed Deposits</span>
                        </div>
                        <span class="allocation-percent">15%</span>
                        <span class="allocation-amount">₹36,750</span>
                    </div>
                    <div class="allocation-item">
                        <div class="allocation-info">
                            <div class="allocation-color" style="background: #818cf8;"></div>
                            <span>Gold</span>
                        </div>
                        <span class="allocation-percent">10%</span>
                        <span class="allocation-amount">₹24,500</span>
                    </div>
                </div>
            </div>

            <!-- Top Holdings -->
            <div class="history-section glass">
                <div class="section-header">
                    <h3>Top Holdings</h3>
                    <a href="#" class="view-all">View All</a>
                </div>
                <div class="holdings-list">
                    <div class="holding-item">
                        <div class="holding-icon">TCS</div>
                        <div class="holding-info">
                            <div class="holding-name">Tata Consultancy</div>
                            <div class="holding-shares">25 shares</div>
                        </div>
                        <div class="holding-value">
                            <div class="holding-price">₹3,850</div>
                            <div class="holding-change positive">+2.5%</div>
                        </div>
                    </div>
                    <div class="holding-item">
                        <div class="holding-icon">INFY</div>
                        <div class="holding-info">
                            <div class="holding-name">Infosys</div>
                            <div class="holding-shares">30 shares</div>
                        </div>
                        <div class="holding-value">
                            <div class="holding-price">₹1,650</div>
                            <div class="holding-change positive">+1.8%</div>
                        </div>
                    </div>
                    <div class="holding-item">
                        <div class="holding-icon">HDFC</div>
                        <div class="holding-info">
                            <div class="holding-name">HDFC Bank</div>
                            <div class="holding-shares">20 shares</div>
                        </div>
                        <div class="holding-value">
                            <div class="holding-price">₹1,580</div>
                            <div class="holding-change negative">-0.5%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Investment Opportunities -->
        <div class="opportunities-section glass">
            <div class="section-header">
                <h3>Investment Opportunities</h3>
            </div>
            <div class="opportunities-grid">
                <div class="opportunity-card">
                    <i data-lucide="trending-up" style="color: #00d4ff;"></i>
                    <h4>High Growth Stocks</h4>
                    <p>Potential return: 15-20%</p>
                    <button class="btn-secondary">Explore</button>
                </div>
                <div class="opportunity-card">
                    <i data-lucide="shield" style="color: #00f59b;"></i>
                    <h4>Safe Fixed Deposits</h4>
                    <p>Guaranteed return: 7.5%</p>
                    <button class="btn-secondary">Explore</button>
                </div>
                <div class="opportunity-card">
                    <i data-lucide="zap" style="color: #ff4d88;"></i>
                    <h4>Mutual Fund SIP</h4>
                    <p>Start from ₹500/month</p>
                    <button class="btn-secondary">Explore</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize assets-specific functionality
 */
function initAssets() {
    if (window.lucide) lucide.createIcons();
    console.log('Assets view initialized');
}
