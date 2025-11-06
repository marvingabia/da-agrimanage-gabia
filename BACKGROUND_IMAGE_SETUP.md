# Dashboard Background Image Setup

## How to Add Your Agricultural Background Image

### Step 1: Prepare Your Image
1. Choose a high-quality agricultural image (rice fields, farmers working, etc.)
2. Recommended size: 1920x1080 or higher
3. Format: JPG or PNG
4. File size: Keep under 2MB for faster loading

### Step 2: Add the Image
1. Save your image as `agriculture-bg.jpg`
2. Replace the placeholder file at: `public/images/backgrounds/agriculture-bg.jpg`
3. Make sure the filename matches exactly

### Step 3: Alternative Images
You can also use these filenames (update CSS accordingly):
- `rice-field-bg.jpg` - For rice field backgrounds
- `farm-landscape-bg.jpg` - For general farm landscapes
- `organic-farming-bg.jpg` - For organic farming scenes

### Step 4: Test the Background
1. Start your server: `npm run xian`
2. Go to the dashboard
3. The background should appear behind the transparent cards

### Current Setup:
- Background image path: `/images/backgrounds/agriculture-bg.jpg`
- Fallback: Beautiful green gradient if image doesn't load
- Overlay: Semi-transparent green overlay for better text readability
- Effect: Fixed background that doesn't scroll

### Troubleshooting:
- If image doesn't show: Check file path and name
- If image is too bright: The CSS overlay will help with readability
- If image is too dark: Reduce the overlay opacity in the CSS

The dashboard is already configured to show your background image with proper transparency effects!