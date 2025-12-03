# 🚀 Vercel Deployment - Session Fix

## ❌ Current Issue

Getting 401 (Unauthorized) errors on all API endpoints because sessions are not persisting in Vercel's serverless environment.

## ✅ Solution

### 1. Update Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

```
NODE_ENV=production
SESSION_SECRET=your-super-secret-random-string-here
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=da_agrimanage
```

**Generate a secure SESSION_SECRET:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use online generator:
# https://randomkeygen.com/
```

### 2. Session Configuration Updated

The `index.js` now includes:
- Secure cookies for production
- Proxy trust for Vercel
- 24-hour session expiration
- HttpOnly and SameSite protection

### 3. Vercel Limitations

**Important:** Vercel's serverless functions are stateless. Each request might hit a different server instance, which can cause session issues.

**Solutions:**

**Option A: Use Vercel KV (Recommended)**
```bash
# Install Vercel KV
npm install @vercel/kv

# Add to Vercel project
vercel link
vercel env pull
```

Then update session config:
```javascript
import { kv } from '@vercel/kv';
import connectRedis from 'connect-redis';

const RedisStore = connectRedis(session);

app.use(session({
  store: new RedisStore({ client: kv }),
  secret: process.env.SESSION_SECRET,
  // ... other options
}));
```

**Option B: Use JWT Tokens (Alternative)**
Instead of sessions, use JWT tokens stored in cookies.

**Option C: Use a Database Session Store**
Store sessions in MySQL database.

### 4. Quick Fix for Testing

For immediate testing, you can use cookie-based sessions (less secure but works):

```javascript
// In index.js
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'none' // Allow cross-site cookies
  }
}));
```

### 5. Verify Deployment

After updating:

1. **Redeploy to Vercel:**
   ```bash
   git push origin main
   ```

2. **Check Environment Variables:**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Verify all variables are set

3. **Test Login:**
   - Clear browser cache
   - Try logging in
   - Check browser console for errors

4. **Check Vercel Logs:**
   ```bash
   vercel logs
   ```

### 6. Database Connection

Ensure your MySQL database is accessible from Vercel:

- Use a cloud MySQL service (PlanetScale, Railway, etc.)
- Or use Vercel Postgres
- Whitelist Vercel's IP addresses in your database firewall

### 7. Common Issues

**Issue:** Still getting 401 errors
**Fix:** Clear all cookies and try again

**Issue:** Session not persisting
**Fix:** Check if SESSION_SECRET is set in Vercel

**Issue:** Database connection timeout
**Fix:** Use connection pooling and increase timeout

## 📝 Recommended: Use Vercel KV

For production, use Vercel KV (Redis) for session storage:

```bash
# 1. Enable Vercel KV in your project
vercel link

# 2. Install dependencies
npm install @vercel/kv connect-redis

# 3. Update session config (see Option A above)

# 4. Deploy
git push origin main
```

## 🎯 Current Status

- ✅ Session configuration updated for Vercel
- ✅ Proxy trust enabled
- ✅ Secure cookies configured
- ⏳ Need to add SESSION_SECRET to Vercel
- ⏳ Consider using Vercel KV for production

## 🔗 Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Express Session Best Practices](https://github.com/expressjs/session#readme)
