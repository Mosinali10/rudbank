# RudBank Quick Reference Card

## 🚀 Quick Commands

### Navigate Programmatically
```javascript
router.navigate('dashboard');
router.navigate('analytics');
router.navigate('cards');
```

### Get Current Route
```javascript
const currentRoute = router.getCurrentRoute();
console.log(currentRoute); // 'dashboard', 'analytics', etc.
```

### API Calls
```javascript
// Auth
await API.auth.login({ username, password });
await API.auth.register(userData);
await API.auth.getProfile();
await API.auth.logout();

// Bank
await API.bank.getBalance();
await API.bank.getTransactions();
await API.bank.credit(amount);
await API.bank.debit(amount);
```

### Show Notifications
```javascript
showToast('Success message', 'success');
showToast('Error message', 'error');
showToast('Info message', 'info');
```

### Format Currency
```javascript
const formatted = formatCurrency(1000);
// Returns: "₹1,000.00"
```

---

## 📁 File Structure Quick Map

```
public/
├── index.html              # Main HTML shell
├── script.js               # App initialization
├── style.css               # Global styles
│
├── js/
│   ├── router.js           # Routing system
│   └── api.js              # API service
│
├── components/
│   ├── dashboard.js        # Dashboard view
│   ├── analytics.js        # Analytics view
│   ├── cards.js            # Cards view
│   ├── assets.js           # Assets view
│   └── profile.js          # Profile view
│
└── styles/
    └── components.css      # Component styles
```

---

## 🎯 Component Template

```javascript
// components/newview.js

/**
 * NewView Component
 * Description of what this view does
 */

async function renderNewview() {
    return `
        <header class="top-bar">
            <div class="welcome-msg">
                <h1>New View</h1>
                <p>Description</p>
            </div>
            <div class="top-actions">
                <button class="btn-cta">Action</button>
            </div>
        </header>

        <section class="stats-grid">
            <!-- Your stats cards -->
        </section>

        <div class="content-grid">
            <!-- Your main content -->
        </div>
    `;
}

/**
 * Initialize newview-specific functionality
 */
function initNewview() {
    // Reinitialize icons
    if (window.lucide) lucide.createIcons();
    
    // Load data
    loadNewviewData();
    
    // Event listeners
    document.getElementById('btn-action')?.addEventListener('click', handleAction);
}

/**
 * Load data for this view
 */
async function loadNewviewData() {
    try {
        const res = await API.bank.someEndpoint();
        if (res.success) {
            updateUI(res.data);
        }
    } catch (error) {
        showToast('Failed to load data', 'error');
    }
}
```

---

## 🔗 Adding New Route (3 Steps)

### Step 1: Create Component
```javascript
// public/components/newview.js
async function renderNewview() { /* ... */ }
function initNewview() { /* ... */ }
```

### Step 2: Register Route
```javascript
// public/script.js - in initializeRouter()
router.register('newview', renderNewview);
```

### Step 3: Add Sidebar Link
```html
<!-- public/index.html -->
<nav class="sidebar-nav">
    <a href="#newview"><i data-lucide="icon-name"></i> New View</a>
</nav>
```

### Step 4: Include Script
```html
<!-- public/index.html - before closing body -->
<script src="components/newview.js"></script>
```

---

## 🎨 Common CSS Classes

### Layout
```css
.top-bar              /* Page header */
.stats-grid           /* 4-column stats grid */
.content-grid         /* 2-column content grid */
.glass                /* Glass morphism effect */
.hover-lift           /* Lift on hover */
```

### Cards
```css
.stat-card            /* Stat card container */
.stat-header          /* Card header with icon */
.stat-label           /* Card label text */
.stat-value           /* Card value (large) */
```

### Buttons
```css
.btn-primary          /* Primary action button */
.btn-secondary        /* Secondary button */
.btn-cta              /* Call-to-action button */
.btn-success          /* Success button (green) */
.btn-danger           /* Danger button (red) */
```

### Icons
```css
.icon-orange          /* Purple icon */
.icon-red             /* Pink icon */
.icon-blue            /* Cyan icon */
.icon-gold            /* Indigo icon */
```

### Trends
```css
.trend-up             /* Upward trend (green) */
.trend-down           /* Downward trend (red) */
.amount-up            /* Positive amount */
.amount-down          /* Negative amount */
```

---

## 🔧 Utility Functions

### Check Login Status
```javascript
if (appState.isLoggedIn) {
    // User is logged in
}
```

### Get Current User
```javascript
const user = appState.user;
console.log(user.username);
console.log(user.email);
console.log(user.balance);
```

### Reinitialize Icons
```javascript
// After DOM updates
if (window.lucide) lucide.createIcons();
```

### Open/Close Modal
```javascript
// Open
document.getElementById('modal-id').classList.remove('hidden');

// Close
document.getElementById('modal-id').classList.add('hidden');
```

---

## 🐛 Debugging Tips

### Check Router State
```javascript
console.log('Current route:', router.getCurrentRoute());
console.log('Registered routes:', Object.keys(router.routes));
```

### Check API Response
```javascript
const res = await API.bank.getBalance();
console.log('Success:', res.success);
console.log('Data:', res.data);
console.log('Status:', res.status);
```

### Check App State
```javascript
console.log('App State:', appState);
console.log('User:', appState.user);
console.log('Logged in:', appState.isLoggedIn);
```

### Monitor Navigation
```javascript
window.addEventListener('hashchange', () => {
    console.log('Route changed to:', window.location.hash);
});
```

---

## 📊 Common Patterns

### Loading State
```javascript
async function loadData() {
    const container = document.getElementById('content');
    container.innerHTML = '<div class="loading-spinner">Loading...</div>';
    
    const data = await fetchData();
    container.innerHTML = renderData(data);
}
```

### Error Handling
```javascript
try {
    const res = await API.bank.getBalance();
    if (!res.success) {
        showToast(res.data.message, 'error');
        return;
    }
    // Handle success
} catch (error) {
    console.error('Error:', error);
    showToast('Network error', 'error');
}
```

### Conditional Rendering
```javascript
function renderList(items) {
    if (!items || items.length === 0) {
        return '<div class="empty-state">No items found</div>';
    }
    
    return items.map(item => `
        <div class="item">${item.name}</div>
    `).join('');
}
```

### Event Delegation
```javascript
document.getElementById('list')?.addEventListener('click', (e) => {
    if (e.target.matches('.delete-btn')) {
        handleDelete(e.target.dataset.id);
    }
});
```

---

## 🎯 CSS Variables

```css
--bg-black: #020205
--bg-dark: #08081a
--sidebar-bg: #050512
--card-bg: rgba(15, 15, 35, 0.7)
--primary: #00d4ff
--secondary: #22d3ee
--text-white: #ffffff
--text-muted: #8b8ba7
--success: #00f59b
--danger: #ff4d88
--glass-border: rgba(0, 212, 255, 0.15)
```

---

## 🔐 Security Checklist

- ✅ JWT in HttpOnly cookies
- ✅ CORS configured
- ✅ Input validation
- ✅ XSS prevention
- ✅ Session timeout
- ✅ Auto-logout on 401

---

## 📱 Responsive Breakpoints

```css
@media (max-width: 1200px) {
    /* Tablet landscape */
}

@media (max-width: 768px) {
    /* Tablet portrait / Mobile landscape */
}

@media (max-width: 480px) {
    /* Mobile portrait */
}
```

---

## 🚀 Performance Tips

1. **Minimize DOM Updates**
   ```javascript
   // Bad: Multiple updates
   element.innerHTML += item1;
   element.innerHTML += item2;
   
   // Good: Single update
   element.innerHTML = item1 + item2;
   ```

2. **Use Event Delegation**
   ```javascript
   // Bad: Multiple listeners
   items.forEach(item => {
       item.addEventListener('click', handler);
   });
   
   // Good: Single listener
   container.addEventListener('click', (e) => {
       if (e.target.matches('.item')) handler(e);
   });
   ```

3. **Debounce Input**
   ```javascript
   let timeout;
   input.addEventListener('input', (e) => {
       clearTimeout(timeout);
       timeout = setTimeout(() => search(e.target.value), 300);
   });
   ```

---

## 📞 Quick Links

- **Architecture Guide:** `ARCHITECTURE.md`
- **Testing Guide:** `TESTING_GUIDE.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`
- **Lucide Icons:** https://lucide.dev/
- **MDN Web Docs:** https://developer.mozilla.org/

---

## 🎓 Learning Resources

### JavaScript
- Async/Await: https://javascript.info/async-await
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- ES6 Modules: https://javascript.info/modules

### Routing
- Hash Change Event: https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event
- History API: https://developer.mozilla.org/en-US/docs/Web/API/History_API

### CSS
- Flexbox: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- Grid: https://css-tricks.com/snippets/css/complete-guide-grid/
- Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/--*

---

**Keep this handy for quick reference! 📌**
