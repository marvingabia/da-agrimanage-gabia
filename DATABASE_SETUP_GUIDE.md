# Database Setup Guide

## Quick Start (Default Database)

Use the default database name `da_agrimanage`:

```bash
node migrate-mysql.js
```

## Custom Database Name

### Option 1: Command Line (Recommended)

Specify your database name when running migration:

```bash
node migrate-mysql.js your_database_name
```

**Example:**
```bash
node migrate-mysql.js agri_system
node migrate-mysql.js bulalacao_agri
node migrate-mysql.js my_custom_db
```

### Option 2: Environment Variables

Set environment variables before starting the app:

**Windows (PowerShell):**
```powershell
$env:DB_NAME="your_database_name"
$env:DB_HOST="localhost"
$env:DB_USER="root"
$env:DB_PASSWORD=""
node migrate-mysql.js
npm start
```

**Windows (CMD):**
```cmd
set DB_NAME=your_database_name
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
node migrate-mysql.js
npm start
```

**Linux/Mac:**
```bash
export DB_NAME=your_database_name
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=
node migrate-mysql.js
npm start
```

### Option 3: Edit Configuration File

Edit `config/database.js` and change the database name:

```javascript
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'your_database_name',  // ← Change this
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
```

Then run:
```bash
node migrate-mysql.js your_database_name
npm start
```

## Complete Setup Steps

### 1. Start Laragon/XAMPP
- Open Laragon
- Click "Start All"
- Wait for MySQL to start (green indicator)

### 2. Run Migration with Custom Database
```bash
node migrate-mysql.js my_agri_database
```

You should see:
```
═══════════════════════════════════════════
  DA-AgriManage MySQL Migration
═══════════════════════════════════════════

📝 Using custom database name: my_agri_database

🔄 Connecting to MySQL...
✅ Connected to MySQL
📄 Reading SQL file: C:\...\setup-database.sql
🔄 Replacing database name: da_agrimanage → my_agri_database
📊 Found X SQL statements to execute

🗄️  Creating database...
📋 Creating table: users
📋 Creating table: insurance
...

✅ Migration completed successfully!

📊 Database Summary:
   Database: my_agri_database
   Total tables: 9
   - announcements
   - benefits
   - claims
   - conversations
   - damage_reports
   - insurance
   - inventory
   - request_letters
   - users

🎉 Database is ready to use!

💡 Update your config/database.js to use:
   database: 'my_agri_database'
```

### 3. Update Configuration
Edit `config/database.js`:
```javascript
database: 'my_agri_database',  // Use your database name
```

### 4. Start Application
```bash
npm start
```

### 5. Verify in phpMyAdmin
1. Open http://localhost/phpmyadmin
2. Look for your database in the left sidebar
3. Click on it to see all tables

## Database Tables Created

The migration creates these tables:

1. **users** - All users (farmers, staff, admin)
2. **insurance** - Insurance applications
3. **damage_reports** - Crop/livestock damage reports
4. **request_letters** - Farmer requests
5. **claims** - Benefit claims
6. **inventory** - Agricultural supplies
7. **announcements** - System announcements
8. **benefits** - Distributed benefits
9. **conversations** - Admin-Staff communication

## Default Admin Account

After migration, you can login with:
- **Email**: admin@gmail.com
- **Password**: Admin2025

## Troubleshooting

### Error: "Cannot connect to MySQL"
**Solution:**
1. Make sure Laragon/XAMPP is running
2. Check if MySQL service is started
3. Verify credentials in `config/database.js`

### Error: "Database already exists"
**Solution:**
This is normal! The migration will use the existing database and create/update tables.

### Error: "Access denied for user"
**Solution:**
Check your MySQL username and password:
```javascript
// In config/database.js
user: 'root',        // Your MySQL username
password: '',        // Your MySQL password
```

### Want to start fresh?
Drop the database in phpMyAdmin and run migration again:
```sql
DROP DATABASE IF EXISTS your_database_name;
```
Then:
```bash
node migrate-mysql.js your_database_name
```

## Multiple Databases

You can create multiple databases for different purposes:

```bash
# Development database
node migrate-mysql.js agri_dev

# Testing database
node migrate-mysql.js agri_test

# Production database
node migrate-mysql.js agri_production
```

Then switch between them by changing `config/database.js` or using environment variables.

## Environment-Specific Configuration

Create a `.env` file (add to .gitignore):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=my_custom_database
```

Then use a package like `dotenv`:
```bash
npm install dotenv
```

In your `index.js`:
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

## Backup Your Database

### Using phpMyAdmin:
1. Open phpMyAdmin
2. Select your database
3. Click "Export" tab
4. Click "Go" to download SQL file

### Using Command Line:
```bash
mysqldump -u root -p your_database_name > backup.sql
```

### Restore from Backup:
```bash
mysql -u root -p your_database_name < backup.sql
```

## Summary

**Easiest Method:**
```bash
node migrate-mysql.js your_database_name
```

Then update `config/database.js` to match your database name.

That's it! Your custom database is ready to use.
