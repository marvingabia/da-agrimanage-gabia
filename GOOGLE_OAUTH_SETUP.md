# Google OAuth Setup Guide

## Setting up Google OAuth for DA-AgriManagement

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### Step 2: Create OAuth 2.0 Credentials
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized origins:
   - `http://localhost:3000`
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback`

### Step 3: Configure the Application
1. Copy your Client ID from Google Cloud Console
2. Replace `YOUR_GOOGLE_CLIENT_ID` in `views/login.xian` with your actual Client ID
3. Update the client_id in both places:
   - Line with `data-client_id="YOUR_GOOGLE_CLIENT_ID"`
   - JavaScript initialization: `client_id: "YOUR_GOOGLE_CLIENT_ID"`

### Step 4: Test the Integration
1. Start your server: `npm run xian`
2. Go to `http://localhost:3000`
3. Click "Continue with Google"
4. Select your Google account
5. You should be automatically registered as a farmer and redirected to dashboard

### Features Implemented:
- ✅ Google Sign-In popup
- ✅ Automatic farmer registration for new Google users
- ✅ Automatic login for existing Google users
- ✅ Session management
- ✅ Dashboard redirect after successful authentication
- ✅ No manual form filling required

### Security Notes:
- The current implementation uses JWT decoding for demo purposes
- For production, install `google-auth-library` package for proper token verification
- Never expose your Client Secret in frontend code
- Use HTTPS in production

### Demo Mode:
If you don't want to set up Google OAuth immediately, the system includes a demo mode that will create a test user when the Google button is clicked.