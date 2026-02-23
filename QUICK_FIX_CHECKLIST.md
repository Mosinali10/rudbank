# ⚡ Quick Fix Checklist - Do This Now!

## 🎯 Step 1: Vercel Environment Variables (5 minutes)

1. Go to: https://vercel.com/dashboard
2. Select your **rudbank** project
3. Click **Settings** → **Environment Variables**
4. Add these variables for **Production**:

```
DATABASE_URL = [Your Neon connection string]
JWT_SECRET = [Generate a random 32+ character string]
CORS_ORIGIN = https://rudbank.vercel.app
GOOGLE_CLIENT_ID = 602322479541-0it27p79h5i6j606a5k881v2d81577k8.apps.googleusercontent.com
```

**CRITICAL:** Make sure `CORS_ORIGIN` is EXACTLY `https://rudbank.vercel.app` (no trailing slash!)

5. Click **Save**
6. Go to **Deployments** → Click **Redeploy** on latest deployment

---

## 🎯 Step 2: Google Cloud Console (5 minutes)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Click **Edit** (pencil icon)
4. Under **Authorized JavaScript origins**, add:
   ```
   https://rudbank.vercel.app
   ```
5. Under **Authorized redirect URIs**, add:
   ```
   https://rudbank.vercel.app
   https://rudbank.vercel.app/
   ```
6. Click **Save**
7. **Wait 5-10 minutes** for Google to propagate changes

---

## 🎯 Step 3: Test Your Deployment (2 minutes)

### Test 1: Check Environment Variables
Visit: https://rudbank.vercel.app/api/debug

Should show:
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

❌ If `corsOrigin` shows "not set" → Go back to Step 1

### Test 2: Clear Browser Cache
- Press `Ctrl + Shift + Delete`
- Select "Cookies and other site data"
- Select "Cached images and files"
- Click "Clear data"

### Test 3: Test Login
1. Go to: https://rudbank.vercel.app
2. Login with username/password
3. Should redirect to dashboard
4. Open DevTools (F12) → Console
5. Should see NO red errors

### Test 4: Test Google Login (After 10 minutes)
1. Click Google icon
2. Select Google account
3. Should redirect to dashboard
4. Check console - no errors

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ `/api/debug` shows all environment variables set
2. ✅ Login redirects to dashboard
3. ✅ Refresh page - still logged in
4. ✅ No 401 errors in console
5. ✅ No CSP violations
6. ✅ Google login works (after 10 min wait)
7. ✅ Navigation between views works
8. ✅ Cookie appears in DevTools → Application → Cookies

---

## 🆘 Still Not Working?

### If 401 Errors Persist:

1. **Check CORS_ORIGIN:**
   - Must be EXACTLY `https://rudbank.vercel.app`
   - No trailing slash
   - No http:// (must be https://)

2. **Redeploy:**
   - Vercel → Deployments → Redeploy
   - Wait 2-3 minutes

3. **Clear Everything:**
   - Browser cache
   - Cookies
   - Try incognito mode

### If Google Login Fails:

1. **Wait 10 minutes** after Google Console changes
2. Check Client ID matches in both places
3. Try incognito mode
4. Check browser console for specific error

### If Session Doesn't Persist:

1. Check cookie in DevTools → Application → Cookies
2. Should have:
   - Name: `token`
   - HttpOnly: ✅
   - Secure: ✅
   - SameSite: None
3. If missing, check CORS_ORIGIN

---

## 📞 Need Help?

Run this command locally to verify your config:
```bash
npm run verify
```

This will check all your environment variables and configuration.

---

## ⏱️ Timeline

- **Step 1 (Vercel):** 5 minutes
- **Step 2 (Google):** 5 minutes
- **Wait time:** 10 minutes (for Google changes)
- **Testing:** 5 minutes
- **Total:** ~25 minutes

---

**After completing these steps, your production deployment should be fully functional!** 🚀
