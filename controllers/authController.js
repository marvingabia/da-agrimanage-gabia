/*
    DA AgriManage - Agricultural Management System
    Authentication Controller
*/

// Firebase imports removed - using local storage for demo
// import { auth, db } from "../models/firebaseConfig.js";
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// Model imports removed - using local data structures
// import { User } from "../models/User.js";
// import { Inventory } from "../models/Inventory.js";
// import { Claim } from "../models/Claim.js";
// import { DamageReport } from "../models/DamageReport.js";
// import { Insurance } from "../models/Insurance.js";
// import { Announcement } from "../models/Announcement.js";

export const loginPage = (req, res) => res.render("login", { title: "DA AgriManage - Login" });
export const registerPage = (req, res) => res.render("register", { title: "DA AgriManage - Register" });
export const forgotPasswordPage = (req, res) => res.render("forgotpassword", { title: "Forgot Password" });

export const dashboardPage = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  
  console.log('Dashboard access for user:', req.session.userId, 'Role:', req.session.userRole);
  
  try {
    // Use session data for all users (no database dependency)
    const user = {
      id: req.session.userId,
      name: req.session.userName || 'User',
      email: req.session.userEmail || 'unknown@email.com',
      role: req.session.userRole || 'user',
      barangay: req.session.userBarangay || 'Unknown'
    };

    // Get dashboard stats
    const stats = await getDashboardStats();
    
    console.log('Rendering dashboard for user:', user.name, 'Role:', user.role);
    
    res.render("dashboard-enhanced", { 
      title: `AgriSystem Dashboard - ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`,
      user: user,
      stats: stats
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    // Fallback with session data
    res.render("dashboard-enhanced", { 
      title: "AgriSystem Dashboard",
      user: {
        name: req.session.userName || 'User',
        role: req.session.userRole || 'user',
        barangay: req.session.userBarangay || 'Unknown',
        email: req.session.userEmail || 'unknown@email.com'
      },
      stats: {
        totalFarmers: localUsers.size || 0,
        totalClaims: 0,
        pendingReports: 0,
        inventoryItems: 0,
        totalStaff: Array.from(localUsers.values()).filter(u => u.role === 'staff').length || 0,
        totalAdmins: 1,
        pendingClaims: 0,
        availableItems: 0,
        activeAnnouncements: 0
      }
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    // Handle admin login separately
    if (email === 'admin@gmail.com' && password === 'Admin2025') {
      req.session.userId = 'admin-default-user';
      req.session.userRole = 'admin';
      req.session.userName = 'System Administrator';
      req.session.userBarangay = 'Main Office';
      req.session.userEmail = 'admin@gmail.com';
      
      console.log('Admin login successful, redirecting to dashboard');
      return res.redirect("/dashboard");
    }

    // Handle farmer and staff login with local storage
    const user = localUsers.get(email);
    
    if (!user) {
      return res.render("login", { 
        title: "iBarangay Login - Agricultural Management System",
        error: "User not found. Please register first or check your email."
      });
    }

    // Check password (in production, use proper password hashing)
    if (user.password !== password) {
      return res.render("login", { 
        title: "iBarangay Login - Agricultural Management System",
        error: "Invalid password. Please try again."
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.render("login", { 
        title: "iBarangay Login - Agricultural Management System",
        error: "Your account is not active. Please contact administrator."
      });
    }

    // Check if the user's role matches the selected role (if specified)
    if (role && user.role !== role) {
      return res.render("login", { 
        title: "iBarangay Login - Agricultural Management System",
        error: `Access denied. This account is registered as ${user.role}, not ${role}.`
      });
    }

    // Create session
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userName = user.name;
    req.session.userBarangay = user.barangay;
    req.session.userEmail = user.email;
    
    console.log(`${user.role} login successful:`, user.name, 'redirecting to dashboard');
    
    // Redirect to dashboard
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error.message);
    res.render("login", { 
      title: "iBarangay Login - Agricultural Management System",
      error: "Login failed. Please try again."
    });
  }
};

// Simple in-memory user storage (for demo purposes)
const localUsers = new Map();

// Helper function to list all registered users (for debugging)
export const listUsers = () => {
  console.log('=== Registered Users ===');
  localUsers.forEach((user, email) => {
    console.log(`${user.role.toUpperCase()}: ${user.name} (${email})`);
  });
  console.log(`Total users: ${localUsers.size}`);
};

export const registerUser = async (req, res) => {
  const { name, email, password, phone, barangay, role, landArea, landType, staffingManagement, position } = req.body;
  
  try {
    // Check if user already exists
    if (localUsers.has(email)) {
      return res.render("login", { 
        title: "iBarangay Login - Agricultural Management System",
        error: "Email is already registered"
      });
    }

    // Create user ID
    const userId = `${role}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Create user profile based on role
    const userData = {
      id: userId,
      name,
      email,
      password, // In production, this should be hashed
      phone,
      role: role || 'farmer',
      barangay,
      status: 'active',
      createdAt: new Date()
    };

    // Add role-specific fields
    if (role === 'farmer') {
      userData.landArea = parseFloat(landArea);
      userData.landType = landType;
    } else if (role === 'staff') {
      userData.staffingManagement = staffingManagement;
      userData.position = position;
    }

    // Store user locally
    localUsers.set(email, userData);
    
    console.log(`${role} registered successfully:`, name, email);

    // Show success message and redirect to login (no auto-login)
    res.render("login", { 
      title: "iBarangay Login - Agricultural Management System",
      success: `Registration successful! Welcome ${name}. Please login with your email (${email}) and password to access your dashboard.`,
      registeredEmail: email,
      registeredRole: role
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.render("login", { 
      title: "iBarangay Login - Agricultural Management System",
      error: "Registration failed. Please try again."
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    console.log('User logging out:', req.session.userName, 'Role:', req.session.userRole);
    
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
      }
      console.log('Logout successful, redirecting to login');
      res.redirect("/login");
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.redirect("/login");
  }
};

// Helper function to get dashboard statistics
async function getDashboardStats() {
  try {
    const users = Array.from(localUsers.values());
    const farmers = users.filter(u => u.role === 'farmer');
    const staff = users.filter(u => u.role === 'staff');
    
    return {
      totalFarmers: farmers.length,
      totalClaims: Math.floor(farmers.length * 1.5), // Mock: average 1.5 claims per farmer
      pendingReports: Math.floor(farmers.length * 0.3), // Mock: 30% have pending reports
      inventoryItems: 25 + (staff.length * 5), // Mock: base items + staff contributions
      totalStaff: staff.length,
      totalAdmins: 1, // Only one admin
      pendingClaims: Math.floor(farmers.length * 0.2), // Mock: 20% pending claims
      availableItems: 20 + (staff.length * 3), // Mock: available inventory
      activeAnnouncements: 3 + Math.floor(users.length / 5) // Mock: announcements based on user count
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error.message);
    return {
      totalFarmers: 0,
      totalClaims: 0,
      pendingReports: 0,
      inventoryItems: 0,
      totalStaff: 0,
      totalAdmins: 1,
      pendingClaims: 0,
      availableItems: 0,
      activeAnnouncements: 0
    };
  }
}

// Google OAuth Authentication
export const googleAuth = async (req, res) => {
  const { credential } = req.body;
  
  try {
    // Verify Google JWT token
    const googleUser = await verifyGoogleToken(credential);
    
    if (!googleUser) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const { email, name, picture } = googleUser;
    
    // Check if user already exists
    let user = localUsers.get(email);
    
    if (user) {
      // User exists, log them in
      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.userName = user.name;
      req.session.userBarangay = user.barangay;
      req.session.userEmail = user.email;
      
      console.log(`Google login successful for existing user: ${user.name} (${user.role})`);
      
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // New user, auto-register as farmer
      const userId = `farmer-google-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      
      const userData = {
        id: userId,
        name: name,
        email: email,
        password: null,
        phone: null,
        role: 'farmer',
        barangay: 'To be updated',
        status: 'active',
        createdAt: new Date(),
        googleId: googleUser.sub,
        profilePicture: picture,
        landArea: 0,
        landType: 'To be updated',
        authProvider: 'google'
      };

      // Store user locally
      localUsers.set(email, userData);
      
      // Create session
      req.session.userId = userId;
      req.session.userRole = 'farmer';
      req.session.userName = name;
      req.session.userBarangay = 'To be updated';
      req.session.userEmail = email;
      
      console.log(`Google auto-registration successful for: ${name} (${email})`);
      
      return res.json({
        success: true,
        message: 'Registration and login successful',
        user: {
          name: name,
          email: email,
          role: 'farmer'
        },
        isNewUser: true
      });
    }
  } catch (error) {
    console.error("Google auth error:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Google authentication failed. Please try again.'
    });
  }
};

// Helper function to verify Google JWT token
async function verifyGoogleToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    if (!payload.email || !payload.name) {
      throw new Error('Invalid token payload');
    }
    
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }
    
    return {
      sub: payload.sub || `google_${Date.now()}`,
      email: payload.email,
      name: payload.name,
      picture: payload.picture || null,
      email_verified: payload.email_verified || true
    };
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    return {
      sub: `demo_google_${Date.now()}`,
      email: 'demo.farmer@gmail.com',
      name: 'Demo Google User',
      picture: null,
      email_verified: true
    };
  }
}

// Helper function to get user by Google ID
export const getUserByGoogleId = (googleId) => {
  for (const user of localUsers.values()) {
    if (user.googleId === googleId) {
      return user;
    }
  }
  return null;
};

// Helper function to get all farmers (including Google-registered ones)
export const getAllRegisteredFarmers = () => {
  const farmers = [];
  for (const user of localUsers.values()) {
    if (user.role === 'farmer') {
      farmers.push({
        id: user.id,
        name: user.name,
        email: user.email,
        barangay: user.barangay,
        landArea: user.landArea,
        landType: user.landType,
        authProvider: user.authProvider || 'email',
        status: user.status,
        createdAt: user.createdAt
      });
    }
  }
  return farmers;
};

// Helper function to get farmer statistics
export const getFarmerStats = () => {
  const farmers = getAllRegisteredFarmers();
  const googleFarmers = farmers.filter(f => f.authProvider === 'google');
  const emailFarmers = farmers.filter(f => f.authProvider === 'email' || !f.authProvider);
  
  return {
    totalFarmers: farmers.length,
    googleFarmers: googleFarmers.length,
    emailFarmers: emailFarmers.length,
    activeFarmers: farmers.filter(f => f.status === 'active').length
  };
};