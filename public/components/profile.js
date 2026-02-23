/**
 * Profile Component
 * User profile and settings view
 */

async function renderProfile() {
    return `
        <header class="top-bar">
            <div class="welcome-msg">
                <h1>Profile Settings</h1>
                <p>Manage your account information and preferences.</p>
            </div>
        </header>

        <!-- Profile Overview -->
        <div class="profile-container">
            <div class="profile-card glass">
                <div class="profile-header">
                    <div class="profile-avatar-large" id="profile-avatar">?</div>
                    <div class="profile-info">
                        <h2 id="profile-username">Loading...</h2>
                        <p id="profile-email">Loading...</p>
                        <span class="profile-badge">Premium Member</span>
                    </div>
                    <button class="btn-secondary">Edit Profile</button>
                </div>
            </div>

            <!-- Account Details -->
            <div class="profile-details glass">
                <div class="section-header">
                    <h3>Account Information</h3>
                </div>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Full Name</label>
                        <input type="text" id="detail-username" readonly>
                    </div>
                    <div class="detail-item">
                        <label>Email Address</label>
                        <input type="email" id="detail-email" readonly>
                    </div>
                    <div class="detail-item">
                        <label>Phone Number</label>
                        <input type="tel" id="detail-phone" readonly>
                    </div>
                    <div class="detail-item">
                        <label>Account Type</label>
                        <input type="text" id="detail-role" readonly>
                    </div>
                    <div class="detail-item">
                        <label>Member Since</label>
                        <input type="text" value="January 2024" readonly>
                    </div>
                    <div class="detail-item">
                        <label>Account Status</label>
                        <input type="text" value="Active" readonly style="color: #00f59b;">
                    </div>
                </div>
            </div>

            <!-- Security Settings -->
            <div class="security-section glass">
                <div class="section-header">
                    <h3>Security & Privacy</h3>
                </div>
                <div class="security-options">
                    <div class="security-item">
                        <div class="security-info">
                            <i data-lucide="lock"></i>
                            <div>
                                <h4>Change Password</h4>
                                <p>Update your password regularly</p>
                            </div>
                        </div>
                        <button class="btn-secondary">Change</button>
                    </div>
                    <div class="security-item">
                        <div class="security-info">
                            <i data-lucide="smartphone"></i>
                            <div>
                                <h4>Two-Factor Authentication</h4>
                                <p>Add an extra layer of security</p>
                            </div>
                        </div>
                        <button class="btn-secondary">Enable</button>
                    </div>
                    <div class="security-item">
                        <div class="security-info">
                            <i data-lucide="shield"></i>
                            <div>
                                <h4>Login History</h4>
                                <p>View recent login activity</p>
                            </div>
                        </div>
                        <button class="btn-secondary">View</button>
                    </div>
                    <div class="security-item">
                        <div class="security-info">
                            <i data-lucide="bell"></i>
                            <div>
                                <h4>Notification Preferences</h4>
                                <p>Manage email and SMS alerts</p>
                            </div>
                        </div>
                        <button class="btn-secondary">Manage</button>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions glass">
                <div class="section-header">
                    <h3>Quick Actions</h3>
                </div>
                <div class="actions-grid">
                    <button class="action-btn">
                        <i data-lucide="download"></i>
                        <span>Download Statements</span>
                    </button>
                    <button class="action-btn">
                        <i data-lucide="file-text"></i>
                        <span>Tax Documents</span>
                    </button>
                    <button class="action-btn">
                        <i data-lucide="help-circle"></i>
                        <span>Help & Support</span>
                    </button>
                    <button class="action-btn danger">
                        <i data-lucide="log-out"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize profile-specific functionality
 */
async function initProfile() {
    if (window.lucide) lucide.createIcons();
    
    // Load user profile data
    try {
        const res = await API.auth.getProfile();
        if (res.success && res.data.data) {
            const user = res.data.data;
            
            // Update profile display
            document.getElementById('profile-username').textContent = user.username;
            document.getElementById('profile-email').textContent = user.email;
            
            // Update form fields
            document.getElementById('detail-username').value = user.username;
            document.getElementById('detail-email').value = user.email;
            document.getElementById('detail-phone').value = user.phone || 'Not provided';
            document.getElementById('detail-role').value = user.role || 'Standard';
            
            // Update avatar
            const avatar = document.getElementById('profile-avatar');
            if (user.profile_image) {
                avatar.innerHTML = `<img src="${user.profile_image}" alt="Profile">`;
            } else {
                avatar.textContent = user.username.charAt(0).toUpperCase();
            }
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
    }

    // Logout button
    document.querySelector('.action-btn.danger')?.addEventListener('click', async () => {
        if (confirm('Are you sure you want to logout?')) {
            await API.auth.logout();
            window.location.reload();
        }
    });
}
