/**
 * Analytics Component
 * Financial analytics and insights view
 */

async function renderAnalytics() {
    return `
        <header class="top-bar">
            <div class="welcome-msg">
                <h1>Analytics</h1>
                <p>Track your spending patterns and financial insights.</p>
            </div>
            <div class="top-actions">
                <select class="time-filter">
                    <option>Last 7 Days</option>
                    <option>Last Month</option>
                    <option>Last 3 Months</option>
                    <option>Last Year</option>
                </select>
            </div>
        </header>

        <!-- Analytics Stats -->
        <section class="stats-grid">
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="trending-up" class="icon-orange"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> 12%</span>
                </div>
                <p class="stat-label">Total Income</p>
                <h2 class="stat-value">₹45,230.00</h2>
            </div>
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="trending-down" class="icon-red"></i>
                    <span class="trend-down"><i data-lucide="arrow-down-right"></i> 8%</span>
                </div>
                <p class="stat-label">Total Expenses</p>
                <h2 class="stat-value">₹32,450.00</h2>
            </div>
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="pie-chart" class="icon-blue"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> 28%</span>
                </div>
                <p class="stat-label">Savings Rate</p>
                <h2 class="stat-value">28.2%</h2>
            </div>
            <div class="stat-card glass hover-lift">
                <div class="stat-header">
                    <i data-lucide="target" class="icon-gold"></i>
                    <span class="trend-up"><i data-lucide="arrow-up-right"></i> On Track</span>
                </div>
                <p class="stat-label">Budget Status</p>
                <h2 class="stat-value">75%</h2>
            </div>
        </section>

        <!-- Charts Section -->
        <div class="content-grid">
            <div class="chart-section glass" style="grid-column: 1 / -1;">
                <div class="section-header">
                    <h3>Spending by Category</h3>
                    <button class="btn-secondary">Export Report</button>
                </div>
                <div class="analytics-chart">
                    <div class="category-breakdown">
                        <div class="category-item">
                            <div class="category-info">
                                <i data-lucide="shopping-bag"></i>
                                <span>Shopping</span>
                            </div>
                            <div class="category-bar">
                                <div class="bar-fill" style="width: 65%; background: #c084fc;"></div>
                            </div>
                            <span class="category-amount">₹12,450</span>
                        </div>
                        <div class="category-item">
                            <div class="category-info">
                                <i data-lucide="utensils"></i>
                                <span>Food & Dining</span>
                            </div>
                            <div class="category-bar">
                                <div class="bar-fill" style="width: 45%; background: #22d3ee;"></div>
                            </div>
                            <span class="category-amount">₹8,230</span>
                        </div>
                        <div class="category-item">
                            <div class="category-info">
                                <i data-lucide="car"></i>
                                <span>Transportation</span>
                            </div>
                            <div class="category-bar">
                                <div class="bar-fill" style="width: 30%; background: #f472b6;"></div>
                            </div>
                            <span class="category-amount">₹5,670</span>
                        </div>
                        <div class="category-item">
                            <div class="category-info">
                                <i data-lucide="home"></i>
                                <span>Bills & Utilities</span>
                            </div>
                            <div class="category-bar">
                                <div class="bar-fill" style="width: 25%; background: #818cf8;"></div>
                            </div>
                            <span class="category-amount">₹4,100</span>
                        </div>
                        <div class="category-item">
                            <div class="category-info">
                                <i data-lucide="heart"></i>
                                <span>Healthcare</span>
                            </div>
                            <div class="category-bar">
                                <div class="bar-fill" style="width: 15%; background: #00f59b;"></div>
                            </div>
                            <span class="category-amount">₹2,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Insights Section -->
        <div class="insights-section glass">
            <div class="section-header">
                <h3>Financial Insights</h3>
            </div>
            <div class="insights-list">
                <div class="insight-item">
                    <i data-lucide="lightbulb" style="color: #00d4ff;"></i>
                    <div class="insight-content">
                        <h4>Great Progress!</h4>
                        <p>You've saved 28% more this month compared to last month.</p>
                    </div>
                </div>
                <div class="insight-item">
                    <i data-lucide="alert-circle" style="color: #ff4d88;"></i>
                    <div class="insight-content">
                        <h4>Watch Your Spending</h4>
                        <p>Shopping expenses are 15% higher than your average.</p>
                    </div>
                </div>
                <div class="insight-item">
                    <i data-lucide="check-circle" style="color: #00f59b;"></i>
                    <div class="insight-content">
                        <h4>Budget On Track</h4>
                        <p>You're within budget for 4 out of 5 categories this month.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize analytics-specific functionality
 */
function initAnalytics() {
    if (window.lucide) lucide.createIcons();
    
    // Add any analytics-specific event listeners here
    console.log('Analytics view initialized');
}
