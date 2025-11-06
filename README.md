# DA-AgriManage 🌾

**Professional Agricultural Management System for Bulalacao, Oriental Mindoro**

A comprehensive web-based agricultural management system designed for the Municipality of Bulalacao, Oriental Mindoro. This system helps manage farmers, staff, inventory, claims, damage reports, and agricultural announcements.

## 🚀 Live Demo

**Deployed on Vercel:** [Your Vercel URL will be here]

## ✨ Features

### 🔐 Authentication System
- **Multi-Role Login**: Admin, Staff, and Farmer roles
- **Google OAuth Integration**: Farmers can sign in with Google accounts
- **Secure Registration**: Role-based registration with validation
- **Session Management**: Secure user sessions

### 👥 User Management
- **Admin Dashboard**: Complete system overview and management
- **Staff Portal**: Inventory and announcement management
- **Farmer Portal**: Claims, damage reports, and profile management
- **Role-Based Access**: Different permissions for each user type

### 📊 Dashboard Features
- **Real-time Statistics**: Live data on farmers, staff, claims, and inventory
- **Beautiful UI**: Agricultural-themed design with transparent cards
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Charts**: Visual representation of agricultural data

### 🌾 Agricultural Management
- **Farmer Registration**: Complete farmer profiles with land information
- **Inventory Management**: Track agricultural supplies and equipment
- **Claims Processing**: Handle farmer assistance claims
- **Damage Reports**: Report and track crop/livestock damage
- **Insurance Management**: Agricultural insurance tracking
- **Announcements**: System-wide and barangay-specific announcements

### 🎨 Design Features
- **Agricultural Theme**: Green color palette with farming imagery
- **Glass Morphism**: Modern transparent card design
- **Background Images**: Beautiful agricultural landscape backgrounds
- **Professional Layout**: Clean, organized interface
- **Mobile Responsive**: Optimized for all devices

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Handlebars templating engine
- **Styling**: Custom CSS with Bootstrap 5
- **Authentication**: Session-based with Google OAuth
- **Database**: In-memory storage (easily replaceable with MongoDB/PostgreSQL)
- **Deployment**: Vercel serverless functions

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Local Development
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DA-AgriManage.git
   cd DA-AgriManage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run xian
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Default Login Credentials
- **Admin**: admin@gmail.com / Admin2025
- **Staff/Farmer**: Register through the system or use Google OAuth

## 🚀 Deployment

### Deploy to Vercel
1. **Push to GitHub**
2. **Connect to Vercel**
3. **Auto-deploy on push**

The project includes `vercel.json` configuration for seamless deployment.

## 📱 User Roles & Permissions

### 🔧 Admin
- Full system access
- User management
- System statistics
- All CRUD operations

### 👔 Staff
- Inventory management
- Announcement creation
- Claims processing
- Damage report handling

### 🌾 Farmer
- Profile management
- Submit claims
- Report damage
- View announcements
- Google OAuth login

## 🎯 Key Features

### Google OAuth Integration
- Seamless farmer registration
- No manual form filling required
- Automatic account creation
- Secure authentication

### Responsive Dashboard
- 6-card statistics layout
- Transparent design elements
- Agricultural background themes
- Mobile-optimized interface

### Professional Design
- Agricultural color scheme
- Glass morphism effects
- Smooth animations
- User-friendly navigation

## 🔧 Configuration

### Google OAuth Setup
1. Create Google Cloud Project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Update client ID in login.xian

### Background Images
- Add images to `public/images/backgrounds/`
- Replace `agriculture-bg.jpg` with your image
- Automatic fallback to CSS gradients

## 📄 Project Structure

```
DA-AgriManage/
├── controllers/          # Business logic
├── middleware/          # Authentication middleware
├── models/             # Data models
├── public/             # Static assets
├── routes/             # API routes
├── views/              # Handlebars templates
├── index.js            # Main server file
├── package.json        # Dependencies
└── vercel.json         # Deployment config
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Created By

**Gabia** - Agricultural Management System Developer

---

## 🌟 Acknowledgments

- Municipality of Bulalacao, Oriental Mindoro
- Department of Agriculture
- Local farmers and agricultural staff
- Open source community

---

**DA-AgriManage** - Empowering Agricultural Communities Through Technology 🌾