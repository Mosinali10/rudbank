# RudBank Deployment & Debugging Guide

## 🔧 Critical Fixes Applied

### 1. **ID Field Mismatch (CRITICAL FIX)**
**Problem**: Code was using `user.uid` but PostgreSQL table uses `id` as primary key.

**Fixed in**:
- `src/controllers/auth.controller.js` - Login function
- `src/controllers/auth.controller.js` - Google login function
- All references now use `user.id` instead of `user.uid`

### 2. **Missing credentials: 'include' in Frontend**
**Problem**: Cookies weren't being sent with fetch requests.

**Fixed in** `public/script.js`:
- All fetch calls now include `credentials: 'include'`
- Added proper headers to all API calls

### 3. **CORS Configuration**
**Fixed in** `src/server.js`:
- Added `exposedHeaders: ["Set-Cookie"]`
- Added fallback for `CORS_ORIGIN`

### 4. **Enhanced Error Logging**
Added console.log statements in:
- Login controller
- JWT middleware
- Profile controller

---

## 🚀 Vercel Deployment Checklist

### Step 1: Environment Variables in Vercel
Go to your Vercel project → Settings → Environment Variables

Add these variables:

```env
DATABASE_URL=postgresql://[username]:[password]@[host]/[database]?sslmode=require
JWT_SECRET=RudBank@2026SecureAuthKey#Mosin
JWT_EXPIRES_IN=1d
PORT=5000
CORS_ORIGIN=https://your-vercel-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
```

**Important**: 
- Set `CORS_ORIGIN` to your exact Vercel domain
- Use `*` only for testing (not recommended for production)

### Step 2: Verify Database Schema
Run this in your Neon SQL Editor:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify koduser structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'koduser';

-- Check if 'id' is the primary key (not 'uid')
SELECT column_name 
FROM information_schema.key_column_usage 
WHERE table_name = 'koduser' 
AND constraint_name LIKE '%pkey%';
```

Expected result: Primary key should be `id`, not `uid`.

### Step 3: Test Database Connection
Create a test endpoint to verify connection:

```javascript
// Add to src/server.js
app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ success: true, time: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

### Step 4: Push to GitHub
```bash
git add .
git commit -m "Fix: ID mismatch and credentials configuration"
git push origin main
```

Vercel will auto-deploy from GitHub.

---

## 🐛 Debugging Steps

### Check 1: Verify Login Returns 200
Open browser DevTools → Network tab → Try login

**Expected**:
- Status: `200 OK`
- Response: `{ "success": true, "message": "Login successful", "data": { "token": "..." } }`
- Cookies: Should see `token` cookie set

**If 400 Error**:
- Check Vercel logs: `vercel logs [deployment-url]`
- Look for: "User not found" or "Password mismatch"
- Verify username exists in database

**If 500 Error**:
- Database connection issue
- Check `DATABASE_URL` in Vercel env vars
- Verify SSL is enabled in Neon

### Check 2: Verify Profile Endpoint
After successful login, check:

```
GET /api/bank/profile
```

**Expected**:
- Status: `200 OK`
- Response: `{ "success": true, "data": { "username": "...", "balance": 100000 } }`

**If 401 Error**:
- Cookie not being sent
- Check browser console for CORS errors
- Verify `credentials: 'include'` in fetch call

**If 500 Error**:
- Check Vercel logs for "User not found for uid: X"
- This means ID mismatch still exists

### Check 3: Cookie Configuration
In browser DevTools → Application → Cookies

**Expected cookie attributes**:
- Name: `token`
- Value: JWT string
- HttpOnly: ✓
- Secure: ✓
- SameSite: None
- Domain: Your Vercel domain

**If cookie not set**:
- CORS issue
- Check `CORS_ORIGIN` matches exactly
- Verify `sameSite: "none"` requires `secure: true`

---

## 🔍 Common Issues & Solutions

### Issue 1: "Invalid or expired token"
**Cause**: Token not found in database or expired

**Solution**:
```sql
-- Check tokens in database
SELECT * FROM usertoken WHERE expiry > NOW();

-- Clear expired tokens
DELETE FROM usertoken WHERE expiry < NOW();
```

### Issue 2: "User not found" after login
**Cause**: ID mismatch between JWT payload and database query

**Solution**: Verify all code uses `user.id` not `user.uid`

### Issue 3: CORS errors in browser
**Cause**: Origin mismatch

**Solution**:
1. Set exact domain in `CORS_ORIGIN`
2. Ensure `credentials: true` in CORS config
3. Add `credentials: 'include'` in all fetch calls

### Issue 4: Cookies not sent in production
**Cause**: SameSite=None requires Secure=true

**Solution**: Already fixed in code:
```javascript
.cookie("token", token, {
    httpOnly: true,
    secure: true,        // Required for SameSite=None
    sameSite: "none",    // Required for cross-origin
    maxAge: 3600000
})
```

---

## 📊 Monitoring & Logs

### View Vercel Logs
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs [your-deployment-url] --follow
```

### Check Database Logs
Go to Neon Dashboard → Your Project → Monitoring

Look for:
- Connection errors
- Query failures
- SSL issues

---

## ✅ Testing Checklist

After deployment, test in order:

1. ✅ Health check: `GET /api/health`
2. ✅ Database test: `GET /api/test-db` (if added)
3. ✅ Registration: `POST /api/auth/register`
4. ✅ Login: `POST /api/auth/login`
5. ✅ Profile: `GET /api/bank/profile` (requires login)
6. ✅ Balance: `GET /api/bank/balance` (requires login)
7. ✅ Credit: `POST /api/bank/credit` (requires login)
8. ✅ Transactions: `GET /api/bank/transactions` (requires login)
9. ✅ Logout: `POST /api/auth/logout`

---

## 🔐 Security Recommendations

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use strong JWT_SECRET** - Already configured
3. **Enable rate limiting** - Consider adding `express-rate-limit`
4. **Add input validation** - Consider adding `express-validator`
5. **Sanitize SQL inputs** - Already using parameterized queries ✓
6. **Add HTTPS only** - Vercel provides this automatically ✓

---

## 📞 Quick Debug Commands

```bash
# Check if user exists
SELECT * FROM koduser WHERE username = 'your-username';

# Check active tokens
SELECT * FROM usertoken WHERE expiry > NOW();

# Check recent transactions
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;

# Verify table structure
\d koduser
\d usertoken
\d transactions
```

---

## 🎯 Next Steps After Deployment

1. Test all endpoints using Postman or browser
2. Monitor Vercel logs for any errors
3. Check Neon dashboard for database performance
4. Set up proper error monitoring (e.g., Sentry)
5. Add rate limiting for production
6. Consider adding refresh tokens for better security

---

## 📝 Notes

- All fixes have been applied to the codebase
- Push to GitHub to trigger Vercel deployment
- Monitor logs during first deployment
- Test thoroughly before sharing with users
