#!/usr/bin/env node

/**
 * DA-AgriManage Deployment Helper
 * Helps prepare the project for deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🌾 DA-AgriManage Deployment Helper');
console.log('=====================================');

// Check if git is initialized
try {
    execSync('git status', { stdio: 'ignore' });
    console.log('✅ Git repository detected');
} catch (error) {
    console.log('❌ Git not initialized. Initializing...');
    execSync('git init');
    console.log('✅ Git initialized');
}

// Check if package.json exists
if (fs.existsSync('package.json')) {
    console.log('✅ package.json found');
} else {
    console.log('❌ package.json not found');
    process.exit(1);
}

// Check if vercel.json exists
if (fs.existsSync('vercel.json')) {
    console.log('✅ vercel.json configuration found');
} else {
    console.log('❌ vercel.json not found');
    process.exit(1);
}

// Check if .gitignore exists
if (fs.existsSync('.gitignore')) {
    console.log('✅ .gitignore found');
} else {
    console.log('❌ .gitignore not found');
}

// Check if README.md exists
if (fs.existsSync('README.md')) {
    console.log('✅ README.md found');
} else {
    console.log('❌ README.md not found');
}

console.log('\n🚀 Ready for deployment!');
console.log('\nNext steps:');
console.log('1. git add .');
console.log('2. git commit -m "Initial commit: DA-AgriManage"');
console.log('3. Create GitHub repository');
console.log('4. git remote add origin <your-repo-url>');
console.log('5. git push -u origin main');
console.log('6. Deploy to Vercel via dashboard or CLI');

console.log('\n📖 See DEPLOYMENT_GUIDE.md for detailed instructions');