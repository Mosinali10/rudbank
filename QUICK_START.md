# 🚀 Quick Start Guide - RudBank Deployment

## For Immediate Deployment to Vercel

### Step 1: Push to GitHub (2 minutes)
```bash
git add .
git commit -m "Fix: Authentication and database issues"
git push origin main
```

### Step 2: Configure Vercel (3 minutes)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
DATABASE_URL = postgresql://[user]:[pass]@[host]/[db]?sslmode=require
JWT_SECRET = RudBank@2026SecureAuthKey#Mosin
JWT_EXPIRES_IN = 1d
CORS_ORIGIN = https://your-app.vercel.app
```

**Important**: Replace `CORS_ORIGIN` with your actual Vercel URL!

### Step 3: Verify Database (2 minutes)
1. Open [Neon Dashboard](https://console.neon.tech)
2. Go to SQL Editor
3. Run this query:

```sql
-- Verify primary key is 'id' not 'uid'
SELECT column_name 
FROM information_schema.key_column_usage 
WHERE table_name = 'koduser' 
AND constraint_name LIKE '%pkey%';
```

Expected result: `id`

If you see `uid`, run:
```sql
-- This is just to check, don't modify if 'id' exists
SELECT * FROM koduser LIMIT 1;
```

### Step 4: Deploy & Test (3 minutes)
1. Vercel will auto-deploy from GitHub
2. Wait for deployment to complete
3. Open your Vercel URL
4. Test the flow:
   - Register new user
   - Login
   - Dashboard should load
   - Check balance
   - Try credit operation

---

## ✅ Quick Verification

### Check 1: Login Works
Open browser DevTools → Network tab → Try login

**Expected**:
- Status: `200 OK`
- Response: `{ "success": true, "message": "Login successful" }`
- Cookie: `token` should be set

### Check 2: Dashboard Loads
After login:
- Dashboard should appear
- Balance should display
- No errors in console

### Check 3: Cookies Are Set
DevTools → Application → Cookies

**Expected**:
- Name: `token`
- HttpOnly: ✓
- Secure: ✓
- SameSite: None

---

## 🐛 If Something Goes Wrong

### Login Returns 400
**Quick Fix**:
1. Check Vercel logs: `vercel logs [your-url]`
2. Look for: "User not found" or "Password mismatch"
3. Verify user exists in database

### Dashboard Not Loading
**Quick Fix**:
1. Open browser console
2. Look for CORS errors
3. Verify `CORS_ORIGIN` matches your domain exactly
4. Check cookies are enabled

### Profile Returns 500
**Quick Fix**:
1. Check Vercel logs
2. Look for: "User not found for uid: X"
3. This means database still uses `uid` instead of `id`
4. Verify database schema

---

## 📊 Monitoring

### View Logs in Real-Time
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs [your-deployment-url] --follow
```

### Check Database Activity
1. Go to Neon Dashboard
2. Click on your project
3. Go to **Monitoring** tab
4. Check for connection errors

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Registration creates user in database
- ✅ Login returns 200 and sets cookie
- ✅ Dashboard loads with user data
- ✅ Balance displays correctly
- ✅ Credit/debit operations work
- ✅ Transactions are logged
- ✅ No errors in browser console
- ✅ No 500 errors in Vercel logs

---

## 📞 Need Help?

### Check These First:
1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed debugging
2. [FIXES_APPLIED.md](./FIXES_APPLIED.md) - What was fixed
3. Vercel logs - Real-time error messages
4. Browser console - Frontend errors

### Common Issues:
- **CORS errors**: Check `CORS_ORIGIN` matches domain
- **Cookie not set**: Verify HTTPS is enabled
- **500 errors**: Check database connection
- **401 errors**: Token not being sent

---

## 🔄 Rollback Plan

If deployment fails:

1. **Revert in Vercel**:
   - Go to Deployments tab
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Check Environment Variables**:
   - Verify all variables are set
   - Check for typos in `DATABASE_URL`
   - Ensure `CORS_ORIGIN` is correct

3. **Test Locally First**:
   ```bash
   npm run dev
   node test-api.js
   ```

---

## 📝 Post-Deployment Checklist

After successful deployment:

- [ ] Test all authentication flows
- [ ] Verify transactions are logged
- [ ] Check error handling works
- [ ] Test logout functionality
- [ ] Monitor logs for 24 hours
- [ ] Set up error monitoring (Sentry)
- [ ] Add rate limiting
- [ ] Review security settings

---

## 🎉 You're Done!

Your RudBank application should now be:
- ✅ Deployed on Vercel
- ✅ Connected to Neon database
- ✅ Authentication working
- ✅ Dashboard loading correctly
- ✅ All features functional

**Next Steps**:
1. Share the URL with users
2. Monitor logs for issues
3. Set up proper monitoring
4. Plan for scaling

---

**Estimated Total Time**: 10-15 minutes

**Difficulty**: Easy (all fixes already applied)

**Support**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed help
