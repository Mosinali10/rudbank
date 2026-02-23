# RudBank Navigation Flow Diagram

## Visual Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER OPENS APP                          │
│                    https://rudbank.vercel.app                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Auth Section  │
                    │   (Login UI)   │
                    └────────┬───────┘
                             │
                    User enters credentials
                             │
                             ▼
                    ┌────────────────┐
                    │  API.auth.     │
                    │  login()       │
                    └────────┬───────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              Success              Failure
                    │                 │
                    ▼                 ▼
         ┌──────────────────┐   ┌──────────┐
         │ validateSession()│   │Show Error│
         │ Fetch Profile    │   │Toast     │
         └────────┬─────────┘   └──────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ updateDashboard  │
         │ UI()             │
         │ - Show sidebar   │
         │ - Hide auth      │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ initializeRouter()│
         │ - Register routes│
         │ - Set container  │
         │ - Load #dashboard│
         └────────┬─────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DASHBOARD LOADED                           │
│                   User sees main interface                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │   User Clicks Sidebar    │
              │   (e.g., "Analytics")    │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  URL Changes to          │
              │  #analytics              │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Router Detects          │
              │  hashchange Event        │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  router.handleRoute      │
              │  Change()                │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Update Active Nav       │
              │  Highlight "Analytics"   │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Call renderAnalytics()  │
              │  Generate HTML           │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Inject HTML into        │
              │  #app-content            │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Call initAnalytics()    │
              │  - Load data             │
              │  - Attach events         │
              │  - Init icons            │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Analytics View Ready    │
              │  User can interact       │
              └──────────────────────────┘
```

---

## Component Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT LIFECYCLE                          │
└─────────────────────────────────────────────────────────────────┘

1. ROUTE CHANGE
   ↓
   User clicks sidebar link or URL changes
   
2. ROUTER DETECTION
   ↓
   window.hashchange event fires
   
3. RENDER PHASE
   ↓
   async function renderComponent()
   - Returns HTML string
   - Can fetch data if needed
   - Pure function (no side effects)
   
4. INJECTION PHASE
   ↓
   router.contentContainer.innerHTML = html
   - Old content removed
   - New content injected
   
5. INITIALIZATION PHASE
   ↓
   function initComponent()
   - Attach event listeners
   - Fetch component data
   - Initialize icons
   - Setup component state
   
6. ACTIVE STATE
   ↓
   Component is interactive
   User can interact with UI
   
7. CLEANUP (on route change)
   ↓
   Old component removed
   Event listeners auto-removed
   New component lifecycle begins
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                               │
└─────────────────────────────────────────────────────────────────┘

USER ACTION
    │
    ▼
COMPONENT EVENT HANDLER
    │
    ▼
API SERVICE CALL
    │
    ├─→ API.auth.*
    ├─→ API.bank.*
    │
    ▼
FETCH REQUEST
    │
    ├─→ credentials: 'include'
    ├─→ HttpOnly cookie sent
    │
    ▼
BACKEND API
    │
    ├─→ Validate JWT
    ├─→ Process request
    ├─→ Query database
    │
    ▼
RESPONSE
    │
    ├─→ Success: { success: true, data: {...} }
    ├─→ Error: { success: false, message: "..." }
    ├─→ 401: Session expired
    │
    ▼
API SERVICE HANDLER
    │
    ├─→ Check status
    ├─→ Handle 401 → logout
    ├─→ Return formatted response
    │
    ▼
COMPONENT HANDLER
    │
    ├─→ Update UI
    ├─→ Show toast
    ├─→ Refresh data
    │
    ▼
USER SEES RESULT
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

LOGIN
  │
  ├─→ User enters credentials
  │
  ├─→ API.auth.login({ username, password })
  │
  ├─→ POST /api/auth/login
  │
  ├─→ Backend validates credentials
  │
  ├─→ Backend generates JWT
  │
  ├─→ Backend sets HttpOnly cookie
  │
  ├─→ Response: { success: true, data: { user } }
  │
  ├─→ Frontend calls validateSession()
  │
  ├─→ Fetch user profile
  │
  ├─→ Update appState.user
  │
  ├─→ Show dashboard
  │
  └─→ Initialize router

SESSION VALIDATION (on page load)
  │
  ├─→ API.auth.getProfile()
  │
  ├─→ GET /api/bank/profile (cookie sent automatically)
  │
  ├─→ Backend validates JWT from cookie
  │
  ├─→ If valid: Return user data
  │   └─→ Show dashboard
  │
  └─→ If invalid (401): Return unauthorized
      └─→ Show login page

LOGOUT
  │
  ├─→ User clicks logout
  │
  ├─→ API.auth.logout()
  │
  ├─→ POST /api/auth/logout
  │
  ├─→ Backend clears cookie
  │
  ├─→ Frontend clears appState
  │
  └─→ Show login page
```

---

## Transaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     TRANSACTION FLOW                            │
└─────────────────────────────────────────────────────────────────┘

USER INITIATES TRANSACTION
    │
    ├─→ Clicks "Send Money" button
    │
    ├─→ openTransactionModal()
    │
    ├─→ Modal appears
    │
    ▼
USER ENTERS AMOUNT
    │
    ├─→ Types amount (e.g., 1000)
    │
    ├─→ Clicks "Add Money" or "Send Money"
    │
    ▼
VALIDATION
    │
    ├─→ Check if amount > 0
    │
    ├─→ If invalid: Show error toast
    │
    ├─→ If valid: Continue
    │
    ▼
API CALL
    │
    ├─→ API.bank.credit(amount) or API.bank.debit(amount)
    │
    ├─→ POST /api/bank/credit or /api/bank/debit
    │
    ├─→ Backend validates session
    │
    ├─→ Backend updates balance in database
    │
    ├─→ Backend creates transaction record
    │
    ▼
RESPONSE HANDLING
    │
    ├─→ If success:
    │   ├─→ Show success toast
    │   ├─→ Play confetti (for credit)
    │   ├─→ Close modal
    │   ├─→ Refresh balance
    │   └─→ Refresh transaction list
    │
    └─→ If error:
        └─→ Show error toast

DASHBOARD UPDATE
    │
    ├─→ Balance card updates
    │
    ├─→ New transaction appears in list
    │
    └─→ User sees updated data
```

---

## Router State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROUTER STATE MACHINE                         │
└─────────────────────────────────────────────────────────────────┘

IDLE STATE
    │
    ├─→ Waiting for hash change
    │
    ▼
HASH CHANGE DETECTED
    │
    ├─→ Extract route from URL
    │   (e.g., #analytics → 'analytics')
    │
    ▼
ROUTE LOOKUP
    │
    ├─→ Check if route exists in router.routes
    │
    ├─→ If not found: Use default route (dashboard)
    │
    ▼
UPDATE NAVIGATION
    │
    ├─→ Remove 'active' class from all nav links
    │
    ├─→ Add 'active' class to current route link
    │
    ▼
RENDER COMPONENT
    │
    ├─→ Show loading spinner
    │
    ├─→ Call component render function
    │
    ├─→ Await HTML generation
    │
    ▼
INJECT HTML
    │
    ├─→ Clear content container
    │
    ├─→ Insert new HTML
    │
    ▼
INITIALIZE COMPONENT
    │
    ├─→ Call init function (if exists)
    │
    ├─→ Setup event listeners
    │
    ├─→ Load component data
    │
    ├─→ Initialize icons
    │
    ▼
READY STATE
    │
    ├─→ Component is interactive
    │
    ├─→ Return to IDLE state
    │
    └─→ Wait for next hash change
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                          │
└─────────────────────────────────────────────────────────────────┘

API CALL MADE
    │
    ▼
TRY BLOCK
    │
    ├─→ Fetch request sent
    │
    ├─→ Response received
    │
    ▼
RESPONSE CHECK
    │
    ├─→ Status 200-299: Success
    │   └─→ Parse JSON
    │       └─→ Return data
    │
    ├─→ Status 401: Unauthorized
    │   └─→ Trigger auth:logout event
    │       └─→ Redirect to login
    │
    ├─→ Status 400-499: Client error
    │   └─→ Show error message
    │       └─→ Return error response
    │
    └─→ Status 500-599: Server error
        └─→ Show generic error
            └─→ Log to console

CATCH BLOCK
    │
    ├─→ Network error
    │   └─→ Show "Network error" toast
    │
    ├─→ Parse error
    │   └─→ Show "Invalid response" toast
    │
    └─→ Unknown error
        └─→ Show generic error toast
            └─→ Log to console

FINALLY
    │
    └─→ Reset loading states
        └─→ Re-enable buttons
```

---

## Component Communication

```
┌─────────────────────────────────────────────────────────────────┐
│                  COMPONENT COMMUNICATION                        │
└─────────────────────────────────────────────────────────────────┘

SHARED STATE (appState)
    │
    ├─→ appState.user
    ├─→ appState.isLoggedIn
    └─→ appState.transactions
    
    All components can read/write

CUSTOM EVENTS
    │
    ├─→ window.dispatchEvent(new CustomEvent('auth:logout'))
    │
    └─→ window.addEventListener('auth:logout', handler)

ROUTER NAVIGATION
    │
    ├─→ router.navigate('analytics')
    │
    └─→ Triggers route change
        └─→ All components notified via hashchange

API SERVICE
    │
    ├─→ Centralized data fetching
    │
    └─→ All components use same API methods
        └─→ Consistent error handling

TOAST NOTIFICATIONS
    │
    ├─→ showToast(message, type)
    │
    └─→ Global notification system
        └─→ Any component can trigger
```

---

**Use these diagrams to understand the flow! 📊**
