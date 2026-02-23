# 🚀 RudBank Production Deployment - Complete Fix Guide

## Issues Being Fixed

1. ✅ 401 Unauthorized errors (JWT cookies not working in production)
2. ✅ Google OAuth 403 errors
3. ✅ CSP violations
4. ✅ Session not persisting
5. ✅ Third-party cookie warnings

---

## 🔧 Part 1: Vercel Environment Variables

### Step 1: Configure Vercel Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables for **Production, Preview, and Development**:

```env
# Database (from Neon Dashboard)
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# CORS Origin (MUST match your Vercel domain EXACTLY)
CORS_ORIGIN=https://rudbank.vercel.app

# Google OAuth Client ID
GOOGLE_CLIENT_ID=602322479541-0it27p79h5i6j606a5k881v2d81577k8.apps.googleusercontent.com
```

**CRITICAL:** 
- `CORS_ORIGIN` must be EXACTLY `https://rudbank.vercel.app` (no trailing slash)
- If you have a custom domain, use that instead
- JWT_SECRET should be at least 32 characters

---

## 🔧 Part 2: Google Cloud Console Setup

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project (or create one)
3. Go to: **APIs & Services → Credentials**

### Step 2: Configure OAuth 2.0 Client ID

Find your OAuth 2.0 Client ID and click **Edit**

#### Authorized JavaScript origins:
```
https://rudbank.vercel.app
```

#### Authorized redirect URIs:
```
https://rudbank.vercel.app
https://rudbank.vercel.app/
```

**Important:**
- Add both with and without trailing slash
- Must be HTTPS (not HTTP)
- Must match your Vercel domain exactly
- No wildcards allowed

### Step 3: Save and Wait

- Click **Save**
- Wait 5-10 minutes for changes to propagate
- Google's servers need time to update

---

## 🔧 Part 3: Backend Cookie Configuration (FIXED)

Your current cookie configuration is already correct:

```javascript
.cookie("token", token, {
    httpOnly: true,      // ✅ Prevents JavaScript access
    secure: true,        // ✅ HTTPS only
    sameSite: "none",    // ✅ Required for cross-site cookies
    maxAge: 3600000      // ✅ 1 hour
})
```

**Why this works:**
- `httpOnly: true` - Cookie not accessible via JavaScript (security)
- `secure: true` - Only sent over HTTPS (required in production)
- `sameSite: "none"` - Allows cross-site requests (required for Vercel)
- `maxAge: 3600000` - Cookie expires in 1 hour

---

## 🔧 Part 4: CORS Configuration (FIXED)

Your current CORS is already correct:

```javascript
cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,                    // ✅ CRITICAL: Allows cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"]        // ✅ Exposes Set-Cookie header
})
```

**CRITICAL:** `credentials: true` is essential for cookies to work!

---

## 🔧 Part 5: Frontend API Configuration (ALREADY CORRECT)

Your `public/js/api.js` already has:

```javascript
const config = {
    credentials: 'include',  // ✅ CRITICAL: Sends cookies with requests
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    },
    ...options
};
```

**CRITICAL:** `credentials: 'include'` is essential!

---

## 🔧 Part 6: Content Security Policy (NEEDS UPDATE)

### Current CSP (in server.js):

```javascript
res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://accounts.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src https://accounts.google.com; connect-src 'self' https://accounts.google.com;"
);
```

### ✅ UPDATED CSP (Add Google GSI styles):

```javascript
res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://accounts.google.com https://www.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "frame-src https://accounts.google.com; " +
    "connect-src 'self' https://accounts.google.com;"
);
```

**Key change:** Added `https://accounts.google.com` to `style-src`

---

## 🔧 Part 7: Frontend CSP (NEEDS UPDATE)

### Current CSP (in index.html):

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://accounts.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://accounts.google.com;
    frame-src https://accounts.google.com;
">
```

This is already correct! ✅

---

## 🔧 Part 8: Debugging Steps

### Test 1: Check Environment Variables

Visit: `https://rudbank.vercel.app/api/debug`

Should return:
```json
{
  "success": true,
  "database": "Connected",
  "env": {
    "hasJwtSecret": true,
    "hasDatabaseUrl": true,
    "corsOrigin": "https://rudbank.vercel.app"
  }
}
```

If `corsOrigin` shows "not set", your environment variable is missing!

### Test 2: Check Cookie in Browser

1. Login successfully
2. Open DevTools → Application → Cookies
3. Look for cookie named `token`
4. Should have:
   - `HttpOnly`: ✅
   - `Secure`: ✅
   - `SameSite`: None
   - `Domain`: .vercel.app or your domain

### Test 3: Check Network Tab

1. Login
2. Open DevTools → Network
3. Find the login request
4. Check Response Headers:
   - Should have `Set-Cookie: token=...`
5. Find the profile request
6. Check Request Headers:
   - Should have `Cookie: token=...`

If cookie is NOT sent with profile request, CORS is misconfigured!

---

## 🔧 Part 9: Common Issues & Solutions

### Issue 1: Cookie Not Set

**Symptoms:** No cookie appears after login

**Solutions:**
1. Check `CORS_ORIGIN` matches your domain exactly
2. Ensure `credentials: true` in CORS config
3. Ensure `secure: true` in cookie config
4. Verify you're using HTTPS (not HTTP)

### Issue 2: Cookie Not Sent

**Symptoms:** Cookie exists but not sent with requests

**Solutions:**
1. Check `credentials: 'include'` in fetch config
2. Verify `sameSite: "none"` in cookie config
3. Check CORS `credentials: true`
4. Ensure domain matches

### Issue 3: Google OAuth 403

**Symptoms:** "Client ID not found" error

**Solutions:**
1. Wait 5-10 minutes after Google Console changes
2. Verify Authorized JavaScript origins
3. Check Client ID matches in code and .env
4. Clear browser cache
5. Try incognito mode

### Issue 4: CSP Violations

**Symptoms:** "Refused to load stylesheet" errors

**Solutions:**
1. Add `https://accounts.google.com` to `style-src`
2. Add `https://accounts.google.com` to `script-src`
3. Add `https://accounts.google.com` to `frame-src`
4. Redeploy after changes

---

## 🔧 Part 10: Deployment Checklist

### Before Deploying:

- [ ] Set all environment variables in Vercel
- [ ] Configure Google Cloud Console
- [ ] Update CSP headers
- [ ] Test locally first
- [ ] Commit and push changes

### After Deploying:

- [ ] Wait 2-3 minutes for deployment
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Test in incognito mode
- [ ] Check `/api/debug` endpoint
- [ ] Test regular login
- [ ] Test Google login
- [ ] Test protected routes
- [ ] Check browser console for errors

---

## 🔧 Part 11: Testing Procedure

### Test Regular Login:

1. Go to https://rudbank.vercel.app
2. Enter username and password
3. Click "Get Started"
4. Should redirect to dashboard
5. Refresh page - should stay logged in
6. Check console - no errors

### Test Google Login:

1. Click Google icon
2. Select Google account
3. Should redirect to dashboard
4. Refresh page - should stay logged in
5. Check console - no errors

### Test Session Persistence:

1. Login successfully
2. Close browser completely
3. Reopen browser
4. Go to https://rudbank.vercel.app
5. Should still be logged in (if within 1 hour)

### Test Protected Routes:

1. Login successfully
2. Navigate to different views (Analytics, Cards, etc.)
3. All should load without 401 errors
4. Check Network tab - all API calls should be 200 OK

---

## 🔧 Part 12: Production-Ready Configuration Summary

### Backend (server.js):

```javascript
// CORS
cors({
    origin: process.env.CORS_ORIGIN,  // https://rudbank.vercel.app
    credentials: true,                 // CRITICAL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"]
})

// Cookie
.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3600000
})
```

### Frontend (api.js):

```javascript
const config = {
    credentials: 'include',  // CRITICAL
    headers: {
        'Content-Type': 'application/json'
    }
};
```

### Environment Variables (Vercel):

```env
DATABASE_URL=postgresql://...
JWT_SECRET=long_random_string_32_chars_minimum
CORS_ORIGIN=https://rudbank.vercel.app
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Google Cloud Console:

```
Authorized JavaScript origins:
https://rudbank.vercel.app

Authorized redirect URIs:
https://rudbank.vercel.app
https://rudbank.vercel.app/
```

---

## 🎯 Expected Results After Fix

### ✅ What Should Work:

1. Regular login with username/password
2. Google OAuth login
3. Session persists across page refreshes
4. Protected routes work without 401 errors
5. No CSP violations in console
6. Cookies set and sent correctly
7. Navigation between views works
8. Logout clears session

### ✅ Console Should Show:

- No red errors
- Only informational warnings (tracking prevention - safe)
- "Analytics view initialized" when navigating
- Clean network requests (all 200 OK)

---

## 🆘 Still Having Issues?

### Check These:

1. **Environment Variables:**
   - Go to Vercel → Settings → Environment Variables
   - Verify all are set correctly
   - Redeploy after changes

2. **Google Console:**
   - Wait 10 minutes after changes
   - Try incognito mode
   - Check Client ID matches

3. **Browser:**
   - Clear all cookies and cache
   - Try different browser
   - Check if third-party cookies are enabled

4. **Vercel Logs:**
   - Go to Vercel → Deployments → Latest → Functions
   - Check for errors in logs

5. **Database:**
   - Verify Neon database is accessible
   - Check connection string is correct
   - Test with `/api/debug` endpoint

---

## 📞 Support

If issues persist after following this guide:

1. Check Vercel deployment logs
2. Check browser console (F12)
3. Check Network tab for failed requests
4. Verify all environment variables
5. Wait 10 minutes after Google Console changes
6. Try incognito mode

---

**This guide provides a complete, production-ready authentication setup for Vercel deployment with Google OAuth support.** 🚀
