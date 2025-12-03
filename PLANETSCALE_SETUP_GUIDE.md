# 🚀 PlanetScale MySQL Setup for Vercel Deployment

## Step-by-Step Guide to Fix Database Issues

### 📋 What You'll Get:
- ✅ Free MySQL database (5GB storage, 1 billion row reads/month)
- ✅ Automatic backups
- ✅ Global edge network
- ✅ Works perfectly with Vercel
- ✅ No credit card required for free tier

---

## 🎯 Step 1: Create PlanetScale Account

1. **Go to PlanetScale:**
   - Visit: https://planetscale.com
   - Click "Sign up" or "Get started"

2. **Sign up with GitHub:**
   - Click "Continue with GitHub"
   - Authorize PlanetScale
   - This makes deployment easier!

3. **Complete profile:**
   - Enter your name
   - Choose "Hobby" plan (FREE)
   - Click "Continue"

---

## 🗄️ Step 2: Create Database

1. **Create new database:**
   - Click "Create a database"
   - Database name: `da-agrimanage`
   - Region: Choose closest to you (e.g., `AWS us-east-1`)
   - Click "Create database"

2. **Wait for initialization:**
   - Takes about 30-60 seconds
   - Status will change to "Ready"

---

## 🔑 Step 3: Get Connection String

1. **Go to database dashboard:**
   - Click on your `da-agrimanage` database
   - Click "Connect" button

2. **Create password:**
   - Click "New password"
   - Name it: `vercel-production`
   - Click "Create password"

3. **Copy connection details:**
   - Select "Node.js" from dropdown
   - You'll see something like:
   ```
   host: aws.connect.psdb.cloud
   username: xxxxxxxxxx
   password: pscale_pw_xxxxxxxxxx
   ```
   - **IMPORTANT:** Copy these NOW! Password shown only once!

4. **Get the connection string:**
   - Look for the connection string format:
   ```
   mysql://username:password@host/database?ssl={"rejectUnauthorized":true}
   ```

---

## 🛠️ Step 4: Update Database Configuration

Update your `config/database.js` to support PlanetScale:

```javascript
// Add this at the top
const isPlanetScale = process.env.DB_HOST?.includes('psdb.cloud');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'da_agrimanage',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // PlanetScale specific settings
    ...(isPlanetScale && {
        ssl: {
            rejectUnauthorized: true
        }
    })
};
```

---

## ⚙️ Step 5: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project: `da-agrimanage-gabia`

2. **Go to Settings:**
   - Click "Settings" tab
   - Click "Environment Variables" in sidebar

3. **Add these variables:**

   **Variable 1:**
   ```
   Name: DB_HOST
   Value: aws.connect.psdb.cloud (your actual host)
   Environment: Production, Preview, Development
   ```

   **Variable 2:**
   ```
   Name: DB_USER
   Value: (your username from PlanetScale)
   Environment: Production, Preview, Development
   ```

   **Variable 3:**
   ```
   Name: DB_PASSWORD
   Value: pscale_pw_xxxxxxxxxx (your password)
   Environment: Production, Preview, Development
   ```

   **Variable 4:**
   ```
   Name: DB_NAME
   Value: da_agrimanage
   Environment: Production, Preview, Development
   ```

   **Variable 5:**
   ```
   Name: SESSION_SECRET
   Value: (generate random string - see below)
   Environment: Production, Preview, Development
   ```

   **Variable 6:**
   ```
   Name: NODE_ENV
   Value: production
   Environment: Production
   ```

4. **Generate SESSION_SECRET:**
   ```powershell
   # Run in PowerShell:
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

5. **Click "Save" for each variable**

---

## 📊 Step 6: Initialize Database Tables

1. **Go to PlanetScale Console:**
   - Click on your database
   - Click "Console" tab

2. **Run the setup script:**
   - Copy the contents of `setup-database.sql`
   - Paste into PlanetScale console
   - Click "Execute"
   - Wait for completion

3. **Verify tables created:**
   ```sql
   SHOW TABLES;
   ```
   You should see:
   - users
   - insurance
   - damage_reports
   - claims
   - request_letters
   - inventory
   - announcements
   - benefits
   - conversations
   - notifications

---

## 🚀 Step 7: Deploy to Vercel

1. **Trigger redeployment:**
   - Go to Vercel Dashboard
   - Click "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Check "Use existing Build Cache" (optional)
   - Click "Redeploy"

2. **Wait for deployment:**
   - Takes 1-2 minutes
   - Watch the logs for any errors

3. **Check deployment logs:**
   - Look for: `✅ MySQL Connected successfully!`
   - Look for: `✅ All database tables created successfully!`

---

## ✅ Step 8: Test Your Application

1. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Clear cookies and cached files
   - Close and reopen browser

2. **Test Farmer Registration:**
   - Go to your Vercel URL
   - Click "Register as Farmer"
   - Fill in the form
   - Submit
   - Should see success message

3. **Test Farmer Login:**
   - Go to login page
   - Enter farmer credentials
   - Should login successfully!

4. **Test Staff Registration:**
   - Register as staff
   - Should see "pending approval" message
   - Login as admin
   - Approve the staff
   - Staff can now login!

---

## 🔍 Troubleshooting

### Issue: "Connection refused"
**Solution:**
- Check if DB_HOST includes `psdb.cloud`
- Verify username and password are correct
- Make sure SSL is enabled in config

### Issue: "Database does not exist"
**Solution:**
- Run the SQL setup script in PlanetScale Console
- Verify DB_NAME matches your database name

### Issue: "Access denied"
**Solution:**
- Regenerate password in PlanetScale
- Update DB_PASSWORD in Vercel
- Redeploy

### Issue: Still getting 401 errors
**Solution:**
- Clear all cookies
- Check SESSION_SECRET is set
- Verify NODE_ENV=production
- Redeploy

---

## 📝 Important Notes

### PlanetScale Differences:
1. **No FOREIGN KEY constraints** - PlanetScale doesn't support them
2. **Use indexes instead** - Already configured in setup script
3. **Automatic backups** - Daily backups included
4. **Branching** - Can create dev/staging branches

### Free Tier Limits:
- 5 GB storage
- 1 billion row reads/month
- 10 million row writes/month
- 1 production branch
- 1 development branch

### Security:
- ✅ SSL/TLS encryption enabled
- ✅ Passwords are one-time use
- ✅ Can rotate passwords anytime
- ✅ IP whitelisting available

---

## 🎉 Success Checklist

- [ ] PlanetScale account created
- [ ] Database `da-agrimanage` created
- [ ] Connection password generated and saved
- [ ] Environment variables added to Vercel
- [ ] Database tables created via Console
- [ ] Application redeployed
- [ ] Farmer registration works
- [ ] Farmer login works
- [ ] Staff registration works
- [ ] Admin can approve staff
- [ ] All API endpoints return JSON (no 401 errors)

---

## 🆘 Need Help?

**PlanetScale Support:**
- Documentation: https://planetscale.com/docs
- Discord: https://discord.gg/planetscale
- Twitter: @planetscale

**Vercel Support:**
- Documentation: https://vercel.com/docs
- Discord: https://vercel.com/discord

---

## 🔄 Alternative: Railway (If PlanetScale doesn't work)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision MySQL"
4. Copy connection details
5. Add to Vercel environment variables
6. Deploy!

---

## 📊 Monitoring

**Check database usage:**
- Go to PlanetScale Dashboard
- Click "Insights" tab
- Monitor queries, storage, and performance

**Check Vercel logs:**
```bash
vercel logs --follow
```

---

## ✨ You're All Set!

Once completed, your application will:
- ✅ Store all data in PlanetScale MySQL
- ✅ Support farmer and staff registration
- ✅ Persist sessions properly
- ✅ Work on Vercel serverless
- ✅ Scale automatically

Good luck! 🚀
