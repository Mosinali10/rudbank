# RudBank Dashboard Architecture

## Overview

RudBank uses a **Single Page Application (SPA)** architecture with hash-based routing for seamless navigation without page reloads.

## Architecture Pattern

**Component-Based SPA with Hash Routing**

### Why This Approach?

1. ✅ No page reloads - smooth user experience
2. ✅ Works perfectly with Vercel static hosting
3. ✅ Easy to maintain and scale
4. ✅ No build tools required (vanilla JS)
5. ✅ Clean separation of concerns
6. ✅ SEO not critical for authenticated dashboards

---

## Folder Structure

```
rudbank/
├── public/
│   ├── index.html                 # Main shell (auth + dashboard layout)
│   ├── style.css                  # Global styles
│   ├── script.js                  # Main app logic & initialization
│   │
│   ├── js/
│   │   ├── router.js              # Hash routing system
│   │   └── api.js                 # Centralized API service layer
│   │
│   ├── components/
│   │   ├── dashboard.js           # Dashboard view component
│   │   ├── analytics.js           # Analytics view component
│   │   ├── cards.js               # Cards management view
│   │   ├── assets.js              # Assets/investments view
│   │   └── profile.js             # Profile settings view
│   │
│   └── styles/
│       └── components.css         # Component-specific styles
│
├── src/                           # Backend (Node.js + Express)
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── server.js
│
└── package.json
```

---

## Core Components

### 1. Router (`js/router.js`)

**Purpose:** Manages hash-based navigation and component rendering

**Key Features:**
- Hash change detection (`#dashboard`, `#analytics`, etc.)
- Dynamic component loading
- Active nav state management
- Component initialization hooks

**Usage:**
```javascript
// Register routes
router.register('dashboard', renderDashboard);
router.register('analytics', renderAnalytics);

// Set content container
router.setContainer('#app-content');

// Navigate programmatically
router.navigate('dashboard');
```

### 2. API Service (`js/api.js`)

**Purpose:** Centralized API communication layer

**Key Features:**
- Consistent error handling
- Automatic session management
- HttpOnly cookie support
- 401 redirect handling

**Usage:**
```javascript
// Auth endpoints
await API.auth.login({ username, password });
await API.auth.getProfile();
await API.auth.logout();

// Bank endpoints
await API.bank.getBalance();
await API.bank.getTransactions();
await API.bank.credit(amount);
await API.bank.debit(amount);
```

### 3. Components (`components/*.js`)

**Purpose:** Modular view components for each section

**Structure:**
Each component exports:
1. `render{ComponentName}()` - Returns HTML string
2. `init{ComponentName}()` - Initializes component-specific logic

**Example:**
```javascript
// components/dashboard.js
async function renderDashboard() {
    return `<div>Dashboard HTML</div>`;
}

function initDashboard() {
    // Component-specific event listeners
    // Data fetching
    // Icon initialization
}
```

---

## Navigation Flow

```
User clicks sidebar link (#analytics)
    ↓
Hash changes in URL
    ↓
Router detects hashchange event
    ↓
Router calls renderAnalytics()
    ↓
HTML injected into #app-content
    ↓
Router calls initAnalytics()
    ↓
Component initialized (events, data, icons)
```

---

## Adding New Sections

### Step 1: Create Component File

```javascript
// public/components/newfeature.js

async function renderNewfeature() {
    return `
        <header class="top-bar">
            <h1>New Feature</h1>
        </header>
        <div class="content">
            <!-- Your content here -->
        </div>
    `;
}

function initNewfeature() {
    // Initialize component
    if (window.lucide) lucide.createIcons();
    
    // Add event listeners
    document.getElementById('some-button')?.addEventListener('click', () => {
        console.log('Button clicked');
    });
}
```

### Step 2: Add to Sidebar

```html
<!-- public/index.html -->
<nav class="sidebar-nav">
    <a href="#newfeature"><i data-lucide="star"></i> New Feature</a>
</nav>
```

### Step 3: Register Route

```javascript
// public/script.js - in initializeRouter()
router.register('newfeature', renderNewfeature);
```

### Step 4: Include Script

```html
<!-- public/index.html -->
<script src="components/newfeature.js"></script>
```

---

## State Management

### Global App State

```javascript
const appState = {
    isLoggedIn: false,
    user: null,
    transactions: []
};
```

### Session Management

- JWT stored in HttpOnly cookies (secure)
- Session validated on app load
- Auto-redirect on 401 responses
- Logout clears session and resets UI

---

## API Integration

### Authentication Flow

```
1. User submits login form
2. API.auth.login() called
3. Backend sets HttpOnly cookie
4. validateSession() fetches user profile
5. Dashboard shown, router initialized
6. User navigates between sections
```

### Data Fetching Pattern

```javascript
// In component init function
async function initDashboard() {
    try {
        const res = await API.bank.getBalance();
        if (res.success) {
            updateUI(res.data);
        }
    } catch (error) {
        showToast('Failed to load data', 'error');
    }
}
```

---

## Styling Architecture

### Global Styles (`style.css`)
- CSS variables
- Layout (sidebar, main content)
- Auth page styles
- Common components (buttons, cards, modals)

### Component Styles (`styles/components.css`)
- View-specific styles
- Analytics charts
- Card designs
- Profile layouts
- Asset displays

---

## Best Practices

### 1. Component Isolation
- Each component is self-contained
- No global variable pollution
- Clean initialization/cleanup

### 2. Error Handling
```javascript
try {
    const res = await API.bank.getBalance();
    if (!res.success) {
        showToast(res.data.message, 'error');
        return;
    }
    // Handle success
} catch (error) {
    showToast('Network error', 'error');
}
```

### 3. Icon Management
```javascript
// Always reinitialize Lucide icons after DOM updates
if (window.lucide) lucide.createIcons();
```

### 4. Event Listeners
```javascript
// Use optional chaining to prevent errors
document.getElementById('btn')?.addEventListener('click', handler);
```

### 5. Loading States
```javascript
async function renderComponent() {
    return `<div class="loading-spinner">Loading...</div>`;
}

async function initComponent() {
    // Fetch data and update DOM
    const data = await fetchData();
    updateContent(data);
}
```

---

## Performance Considerations

1. **Lazy Loading**: Components loaded only when needed
2. **Minimal Re-renders**: Only active component re-renders
3. **Efficient DOM Updates**: Direct element updates vs full re-render
4. **API Caching**: Consider caching frequently accessed data
5. **Debouncing**: For search/filter inputs

---

## Security

1. **HttpOnly Cookies**: JWT not accessible via JavaScript
2. **CORS**: Configured for specific origins
3. **Input Validation**: Both client and server side
4. **XSS Prevention**: Sanitize user inputs
5. **CSRF Protection**: Consider adding CSRF tokens

---

## Deployment

### Vercel Configuration

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Build Process

No build step required! Pure vanilla JS.

1. Push to GitHub
2. Vercel auto-deploys
3. Backend runs on serverless functions

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Login/Register flows
- [ ] Navigation between all sections
- [ ] Transaction operations
- [ ] Profile updates
- [ ] Logout functionality
- [ ] Session expiry handling
- [ ] Mobile responsiveness

### Future: Automated Testing

Consider adding:
- Jest for unit tests
- Cypress for E2E tests
- API integration tests

---

## Troubleshooting

### Issue: Component not rendering
**Solution:** Check browser console for errors, ensure component is registered in router

### Issue: Icons not showing
**Solution:** Call `lucide.createIcons()` after DOM updates

### Issue: API calls failing
**Solution:** Check network tab, verify cookies are being sent

### Issue: Navigation not working
**Solution:** Ensure href uses hash format (`#dashboard` not `/dashboard`)

---

## Future Enhancements

1. **State Management Library**: Consider Zustand or Redux for complex state
2. **TypeScript**: Add type safety
3. **Build Tool**: Vite for bundling and optimization
4. **Testing**: Jest + Cypress
5. **PWA**: Add service worker for offline support
6. **Real-time**: WebSocket for live updates
7. **Charts**: Integrate Chart.js or D3.js for real analytics

---

## Resources

- [Hash Routing Guide](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Lucide Icons](https://lucide.dev/)
- [Vercel Deployment](https://vercel.com/docs)

---

## Support

For questions or issues:
1. Check this documentation
2. Review component code
3. Check browser console
4. Review network requests
5. Test API endpoints directly

---

**Built with ❤️ for scalable, maintainable dashboard architecture**
