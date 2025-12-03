# 🔐 Admin Account Setup Guide

## Security First Approach

For security reasons, the admin account is **NOT** automatically created. You must manually create it after deployment.

## 📋 Prerequisites

- MySQL database access
- Database already set up using `setup-database.sql`
- Sample data loaded (optional)

## 🚀 Step-by-Step Admin Creation

### Method 1: Using SQL Script (Recommended)

1. **Copy the template script:**
   ```bash
   cp create-admin.sql create-admin-production.sql
   ```

2. **Edit the file and replace placeholders:**
   ```sql
   -- Open create-admin-production.sql and change:
   'YOUR_ADMIN_EMAIL'        → 'your.email@example.com'
   'YOUR_SECURE_PASSWORD'    → 'YourStr0ngP@ssw0rd!'
   'YOUR_PHONE_NUMBER'       → '09123456789'
   ```

3. **Run the script:**
   ```bash
   mysql -u your_user -p da_agrimanage < create-admin-production.sql
   ```

4. **Delete the file immediately:**
   ```bash
   rm create-admin-production.sql
   ```

### Method 2: Direct MySQL Command

```sql
USE da_agrimanage;

INSERT INTO users (
    id, 
    name, 
    email, 
    password, 
    role, 
    barangay, 
    phone, 
    authProvider, 
    isApproved, 
    status, 
    createdAt
)
VALUES (
    CONCAT('admin-', UNIX_TIMESTAMP(), '-', SUBSTRING(MD5(RAND()), 1, 8)),
    'System Administrator',
    'your.email@example.com',     -- Your email
    'YourStr0ngP@ssw0rd!',        -- Your password
    'admin',
    'Main Office',
    '09123456789',                -- Your phone
    'email',
    TRUE,
    'active',
    NOW()
);
```

### Method 3: Using Node.js Script

Create a file `create-admin.js`:

```javascript
import { getPool } from './config/database.js';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createAdmin() {
    const pool = getPool();
    
    rl.question('Admin Email: ', (email) => {
        rl.question('Admin Password: ', (password) => {
            rl.question('Admin Phone: ', async (phone) => {
                try {
                    const id = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
                    
                    await pool.execute(
                        `INSERT INTO users (id, name, email, password, role, barangay, phone, authProvider, isApproved, status, createdAt)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                        [id, 'System Administrator', email, password, 'admin', 'Main Office', phone, 'email', true, 'active']
                    );
                    
                    console.log('✅ Admin account created successfully!');
                    console.log('📧 Email:', email);
                    console.log('🔑 Please login and change your password immediately!');
                } catch (error) {
                    console.error('❌ Error creating admin:', error.message);
                } finally {
                    rl.close();
                    process.exit();
                }
            });
        });
    });
}

createAdmin();
```

Run it:
```bash
node create-admin.js
```

## 🔒 Security Best Practices

### Password Requirements
- Minimum 8 characters
- Mix of uppercase and lowercase
- Include numbers
- Include special characters
- Example: `MyStr0ng!P@ss2024`

### After Creation
1. ✅ Login immediately
2. ✅ Change password in Settings
3. ✅ Delete creation script
4. ✅ Verify admin access works
5. ✅ Test all admin functions

### Regular Maintenance
- 🔄 Change password every 90 days
- 📝 Keep admin credentials secure
- 🚫 Never share admin account
- 📊 Monitor admin activity logs
- 🔐 Use strong, unique passwords

## 🎯 Verification

After creating admin account, verify it works:

1. **Check database:**
   ```sql
   SELECT id, name, email, role, isApproved, status 
   FROM users 
   WHERE role = 'admin';
   ```

2. **Login test:**
   - Go to: `https://your-domain.com/login`
   - Enter admin email and password
   - Should redirect to admin dashboard

3. **Test admin functions:**
   - Staff management
   - View all farmers
   - Send notifications
   - Data analytics

## ⚠️ Troubleshooting

### Can't login?
- Check email is correct
- Verify password (case-sensitive)
- Ensure `isApproved = TRUE`
- Check `status = 'active'`

### Forgot password?
Run this SQL to reset:
```sql
UPDATE users 
SET password = 'NewPassword123!' 
WHERE email = 'your.email@example.com' AND role = 'admin';
```

### Multiple admins?
You can create multiple admin accounts for backup:
```sql
-- Just run the INSERT statement again with different email
```

## 📞 Support

If you encounter issues:
1. Check database connection
2. Verify table structure
3. Check application logs
4. Review error messages

## 🎉 Success!

Once admin account is created and verified:
- ✅ Admin can login
- ✅ Admin dashboard accessible
- ✅ All admin functions working
- ✅ Creation script deleted
- ✅ Password changed from default

Your system is now secure and ready for production! 🚀
