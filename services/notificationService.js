/*
    Smart Notification Service
    Sends notifications to farmers via Email and SMS
*/

import nodemailer from 'nodemailer';

// Email configuration (using Gmail)
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// SMS configuration (Semaphore API)
const SMS_API_KEY = process.env.SEMAPHORE_API_KEY || 'your-semaphore-api-key';
const SMS_API_URL = 'https://api.semaphore.co/api/v4/messages';

/**
 * Send Email Notification
 */
export async function sendEmailNotification(to, subject, message) {
    try {
        console.log(`📧 Sending email to: ${to}`);
        
        // Check if email is configured
        const isEmailConfigured = process.env.EMAIL_USER && 
                                  process.env.EMAIL_USER !== 'your-email@gmail.com' &&
                                  process.env.EMAIL_PASSWORD && 
                                  process.env.EMAIL_PASSWORD !== 'your-app-password';
        
        if (!isEmailConfigured) {
            // Mock mode - simulate successful send for testing
            console.log('📧 [MOCK MODE] Email would be sent to:', to);
            console.log('   Subject:', subject);
            console.log('   Message:', message.substring(0, 50) + '...');
            console.log('✅ [MOCK] Email simulated successfully');
            return { 
                success: true, 
                messageId: `mock-${Date.now()}`,
                mock: true 
            };
        }
        
        // Real email sending
        const mailOptions = {
            from: process.env.EMAIL_USER || 'DA AgriManage <noreply@agrimanage.com>',
            to: to,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🌾 DA AgriManage</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 5px 0;">Municipal Agriculture Office</p>
                    </div>
                    <div style="padding: 30px; background: #f9f9f9;">
                        <h2 style="color: #2d5016;">${subject}</h2>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            ${message}
                        </div>
                        <p style="color: #666; font-size: 12px; margin-top: 20px;">
                            This is an automated message from DA AgriManage System.<br>
                            Please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        };
        
        const info = await emailTransporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('❌ Email error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send SMS Notification
 */
export async function sendSMSNotification(phoneNumber, message) {
    try {
        console.log(`📱 Sending SMS to: ${phoneNumber}`);
        
        // Check if SMS is configured
        const isSMSConfigured = process.env.SEMAPHORE_API_KEY && 
                               process.env.SEMAPHORE_API_KEY !== 'your-semaphore-api-key';
        
        if (!isSMSConfigured) {
            // Mock mode - simulate successful send for testing
            console.log('📱 [MOCK MODE] SMS would be sent to:', phoneNumber);
            console.log('   Message:', message.substring(0, 50) + '...');
            console.log('✅ [MOCK] SMS simulated successfully');
            return { 
                success: true, 
                messageId: `mock-sms-${Date.now()}`,
                mock: true 
            };
        }
        
        // Format phone number (remove spaces, dashes, etc.)
        const formattedPhone = phoneNumber.replace(/[^0-9+]/g, '');
        
        // Semaphore API call
        const response = await fetch(SMS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apikey: SMS_API_KEY,
                number: formattedPhone,
                message: message,
                sendername: 'DA-AgriMng'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ SMS sent successfully');
            return { success: true, data };
        } else {
            console.error('❌ SMS error:', data);
            return { success: false, error: data };
        }
        
    } catch (error) {
        console.error('❌ SMS error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send notification to all active farmers
 */
export async function notifyAllFarmers(subject, message, options = {}) {
    try {
        const { User } = await import('../models/UserMySQL.js');
        
        // Get all active farmers
        const farmers = await User.findByRole('farmer');
        const activeFarmers = farmers.filter(f => f.isApproved !== false);
        
        console.log(`📢 Notifying ${activeFarmers.length} active farmers...`);
        
        const results = {
            total: activeFarmers.length,
            emailSent: 0,
            smsSent: 0,
            failed: 0
        };
        
        // Send notifications
        for (const farmer of activeFarmers) {
            // Send Email
            if (options.sendEmail !== false && farmer.email) {
                const emailResult = await sendEmailNotification(
                    farmer.email,
                    subject,
                    message
                );
                if (emailResult.success) results.emailSent++;
                else results.failed++;
            }
            
            // Send SMS
            if (options.sendSMS && farmer.phone) {
                const smsResult = await sendSMSNotification(
                    farmer.phone,
                    `${subject}\n\n${message.replace(/<[^>]*>/g, '')}` // Strip HTML
                );
                if (smsResult.success) results.smsSent++;
                else results.failed++;
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('✅ Notification results:', results);
        return { success: true, results };
        
    } catch (error) {
        console.error('❌ Notification error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send notification to specific farmer
 */
export async function notifyFarmer(farmerId, subject, message, options = {}) {
    try {
        const { User } = await import('../models/UserMySQL.js');
        const farmer = await User.findById(farmerId);
        
        if (!farmer) {
            return { success: false, error: 'Farmer not found' };
        }
        
        const results = {
            email: null,
            sms: null
        };
        
        // Send Email
        if (options.sendEmail !== false && farmer.email) {
            results.email = await sendEmailNotification(
                farmer.email,
                subject,
                message
            );
        }
        
        // Send SMS
        if (options.sendSMS && farmer.phone) {
            results.sms = await sendSMSNotification(
                farmer.phone,
                `${subject}\n\n${message.replace(/<[^>]*>/g, '')}`
            );
        }
        
        return { success: true, results };
        
    } catch (error) {
        console.error('❌ Notification error:', error.message);
        return { success: false, error: error.message };
    }
}

export default {
    sendEmailNotification,
    sendSMSNotification,
    notifyAllFarmers,
    notifyFarmer
};
