# RudBank Testing Guide

## Quick Start Testing

### 1. Access Your Application

Open your browser and navigate to:
```
https://rudbank.vercel.app
```

### 2. Login

Use your existing credentials to login. After successful login, you should see the dashboard.

---

## Testing Navigation

### Test 1: Dashboard View (Default)
**URL:** `https://rudbank.vercel.app/#dashboard`

**Expected:**
- ✅ Balance card showing your current balance
- ✅ Stats cards (Income, Expenses, Savings)
- ✅ Spending analytics chart
- ✅ Recent transactions list
- ✅ "Check Balance" and "Send Money" buttons

**Actions to Test:**
1. Click "Check Balance" → Should refresh balance
2. Click "Send Money" → Should open transaction modal
3. Verify transactions are loading

---

### Test 2: Analytics View
**URL:** `https://rudbank.vercel.app/#analytics`

**How to Access:**
- Click "Analytics" in the sidebar

**Expected:**
- ✅ URL changes to `#analytics`
- ✅ Page doesn't reload
- ✅ Analytics header appears
- ✅ Stats cards show income/expenses/savings rate
- ✅ Category breakdown chart visible
- ✅ Financial insights section

**Verify:**
- Sidebar "Analytics" link is highlighted
- Content changes instantly (no page reload)
- Icons render properly

---

### Test 3: Cards View
**URL:** `https://rudbank.vercel.app/#cards`

**How to Access:**
- Click "Cards" in the sidebar

**Expected:**
- ✅ URL changes to `#cards`
- ✅ Virtual and physical card displays
- ✅ Card holder name shows your username
- ✅ Card action buttons (Freeze, View, Settings, Statements)
- ✅ Recent card transactions

**Verify:**
- Card designs render with gradients
- Your username appears on cards
- Action buttons are clickable

---

### Test 4: Assets View
**URL:** `https://rudbank.vercel.app/#assets`

**How to Access:**
- Click "Assets" in the sidebar

**Expected:**
- ✅ URL changes to `#assets`
- ✅ Portfolio overview stats
- ✅ Asset allocation breakdown
- ✅ Top holdings list
- ✅ Investment opportunities section

**Verify:**
- All icons render
- Stats display properly
- Layout is responsive

---

### Test 5: Profile View
**URL:** `https://rudbank.vercel.app/#profile`

**How to Access:**
- Click "Profile" in the sidebar

**Expected:**
- ✅ URL changes to `#profile`
- ✅ Profile avatar with your initial
- ✅ Username and email displayed
- ✅ Account information fields populated
- ✅ Security settings section
- ✅ Quick actions (Download, Tax Docs, Help, Logout)

**Verify:**
- Your actual data is displayed
- All fields are populated
- Logout button works

---

## Testing Core Functionality

### Transaction Flow

1. **Open Transaction Modal**
   - Click "Send Money" button on dashboard
   - Modal should appear

2. **Credit Transaction**
   - Enter amount (e.g., 1000)
   - Click "Add Money"
   - Should see success toast
   - Confetti animation plays
   - Balance updates
   - Modal closes

3. **Debit Transaction**
   - Click "Send Money" again
   - Enter amount (e.g., 500)
   - Click "Send Money"
   - Should see success toast
   - Balance updates
   - Modal closes

4. **Verify Updates**
   - Balance should reflect changes
   - New transactions appear in list
   - Navigate to Analytics → Should see updated data

---

### Session Management

1. **Refresh Page**
   - On any view (e.g., Analytics)
   - Press F5 or Ctrl+R
   - Should stay on same view
   - Data should reload

2. **Direct URL Access**
   - Copy URL: `https://rudbank.vercel.app/#cards`
   - Open in new tab
   - Should go directly to Cards view (if logged in)

3. **Logout**
   - Click logout button
   - Should return to login page
   - Session cleared
   - Try accessing `#dashboard` → Should redirect to login

---

## Browser Console Testing

### Check for Errors

1. Open Developer Tools (F12)
2. Go to Console tab
3. Navigate between views
4. **Should NOT see:**
   - ❌ JavaScript errors
   - ❌ 404 errors for components
   - ❌ Failed API calls (except expected 401 on logout)

5. **Should see:**
   - ✅ "Dashboard view initialized" (or similar)
   - ✅ Successful API responses
   - ✅ Clean console output

---

## Network Tab Testing

### Verify API Calls

1. Open Developer Tools (F12)
2. Go to Network tab
3. Navigate to Dashboard

**Expected API Calls:**
- ✅ `/api/bank/profile` → 200 OK
- ✅ `/api/bank/balance` → 200 OK
- ✅ `/api/bank/transactions` → 200 OK

**Check Headers:**
- ✅ Cookies are being sent
- ✅ Content-Type: application/json
- ✅ Credentials: include

---

## Mobile Responsiveness

### Test on Mobile Devices

1. **Chrome DevTools**
   - Press F12
   - Click device toolbar icon (Ctrl+Shift+M)
   - Select iPhone or Android device

2. **Expected Behavior:**
   - ✅ Sidebar adapts or hides
   - ✅ Cards stack vertically
   - ✅ Stats grid becomes single column
   - ✅ Touch-friendly buttons
   - ✅ Readable text sizes

---

## Performance Testing

### Page Load Speed

1. **Initial Load**
   - Clear cache (Ctrl+Shift+Delete)
   - Reload page
   - Should load in < 2 seconds

2. **Navigation Speed**
   - Click between views
   - Should be instant (< 100ms)
   - No visible lag

3. **API Response Time**
   - Check Network tab
   - API calls should complete in < 500ms

---

## Common Issues & Solutions

### Issue 1: Components Not Loading
**Symptoms:** Blank page or "Loading..." stuck

**Solutions:**
1. Check browser console for errors
2. Verify all component files exist
3. Check network tab for 404 errors
4. Clear cache and reload

### Issue 2: Icons Not Showing
**Symptoms:** Empty squares instead of icons

**Solutions:**
1. Check if Lucide script is loaded
2. Open console, type: `lucide.createIcons()`
3. Verify internet connection (CDN access)

### Issue 3: Navigation Not Working
**Symptoms:** Clicking sidebar does nothing

**Solutions:**
1. Check if router.js is loaded
2. Verify href format: `#dashboard` not `/dashboard`
3. Check console for JavaScript errors

### Issue 4: API Calls Failing
**Symptoms:** "Failed to load data" messages

**Solutions:**
1. Check if backend is running
2. Verify cookies are being sent
3. Check CORS configuration
4. Test API endpoints directly

### Issue 5: Session Expired
**Symptoms:** Redirected to login unexpectedly

**Solutions:**
1. This is expected behavior after timeout
2. Login again
3. Check JWT expiry settings in backend

---

## Testing Checklist

### Basic Functionality
- [ ] Login works
- [ ] Dashboard loads
- [ ] All 5 views accessible
- [ ] Navigation is instant
- [ ] URL changes with navigation
- [ ] Active nav item highlights
- [ ] Icons render properly
- [ ] Logout works

### Data Display
- [ ] Balance shows correctly
- [ ] Transactions load
- [ ] Profile data displays
- [ ] Card holder name appears
- [ ] Stats are visible

### Interactions
- [ ] Transaction modal opens
- [ ] Credit transaction works
- [ ] Debit transaction works
- [ ] Balance updates after transaction
- [ ] Toast notifications appear
- [ ] Buttons are clickable

### Session Management
- [ ] Page refresh maintains view
- [ ] Direct URL access works
- [ ] Session validates on load
- [ ] Auto-logout on 401
- [ ] Login persists across tabs

### Responsive Design
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
- [ ] Sidebar adapts
- [ ] Cards stack properly

### Performance
- [ ] Fast initial load
- [ ] Instant navigation
- [ ] Quick API responses
- [ ] No memory leaks
- [ ] Smooth animations

---

## Advanced Testing

### Test Router Directly

Open browser console and try:

```javascript
// Navigate programmatically
router.navigate('analytics');

// Get current route
console.log(router.getCurrentRoute());

// Check registered routes
console.log(router.routes);
```

### Test API Service

```javascript
// Test balance fetch
API.bank.getBalance().then(res => console.log(res));

// Test profile fetch
API.auth.getProfile().then(res => console.log(res));

// Test transactions
API.bank.getTransactions().then(res => console.log(res));
```

### Test App State

```javascript
// Check current user
console.log(appState.user);

// Check login status
console.log(appState.isLoggedIn);

// Check transactions
console.log(appState.transactions);
```

---

## Automated Testing (Future)

### Unit Tests (Jest)
```javascript
// Example test
test('formatCurrency formats correctly', () => {
  expect(formatCurrency(1000)).toBe('₹1,000.00');
});
```

### E2E Tests (Cypress)
```javascript
// Example test
describe('Navigation', () => {
  it('should navigate to analytics', () => {
    cy.visit('/#dashboard');
    cy.contains('Analytics').click();
    cy.url().should('include', '#analytics');
  });
});
```

---

## Reporting Issues

If you find bugs, note:

1. **What you did:** Steps to reproduce
2. **What happened:** Actual behavior
3. **What you expected:** Expected behavior
4. **Browser:** Chrome, Firefox, Safari, etc.
5. **Console errors:** Any error messages
6. **Network errors:** Failed API calls

---

## Success Criteria

Your implementation is successful if:

✅ All 5 views load without errors
✅ Navigation works smoothly
✅ No page reloads during navigation
✅ Data displays correctly
✅ Transactions work
✅ Session management works
✅ Responsive on all devices
✅ No console errors
✅ Fast and smooth performance

---

## Next Steps After Testing

1. **If everything works:** Start using your dashboard!
2. **If issues found:** Check troubleshooting section
3. **Want to customize:** Review ARCHITECTURE.md
4. **Want to add features:** Follow component creation guide
5. **Need help:** Check documentation or console logs

---

**Happy Testing! 🚀**
