"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLeadershipNotification = exports.sendApprovalNotification = void 0;
const https_1 = require("firebase-functions/v2/https");
const nodemailer = __importStar(require("nodemailer"));
// Simple email configuration (you'll need to set this up with your email provider)
const EMAIL_CONFIG = {
    service: 'gmail',
    auth: {
        user: 'mdpu.notifications@gmail.com', // Replace with your email
        pass: 'your-app-password' // Replace with your app password
    }
};
// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);
// Simple email templates
const createApprovalEmail = (memberName, email) => ({
    subject: '🎉 Your MDPU Membership Application Has Been Approved!',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to MDPU!</h1>
          <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #16a34a, #059669); margin: 0 auto;"></div>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${memberName},</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Congratulations! Your membership application to the <strong>Mathamba Descendants Progressive Union (MDPU)</strong> has been approved by our administrators.
        </p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #16a34a; padding: 20px; margin: 25px 0;">
          <h3 style="color: #16a34a; margin: 0 0 15px 0;">What's Next?</h3>
          <ul style="color: #333; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>You can now sign in to your member account using your email: <strong>${email}</strong></li>
            <li>Access your member dashboard to view union activities and updates</li>
            <li>Connect with fellow members from your chapter and beyond</li>
            <li>Participate in union events and initiatives</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mdpu-website.web.app/auth/signin" 
             style="background: linear-gradient(135deg, #16a34a, #059669); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
            Sign In to Your Account
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          If you have any questions or need assistance, please don't hesitate to contact us at 
          <a href="mailto:support@mdpu.org" style="color: #16a34a;">support@mdpu.org</a>
        </p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Mathamba Descendants Progressive Union<br>
            Building bridges, strengthening communities
          </p>
        </div>
      </div>
    </div>
  `
});
const createLeadershipEmail = (memberName, position, assignedBy) => ({
    subject: `👑 You've Been Assigned to Leadership: ${position} - MDPU`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin-bottom: 10px;">Leadership Appointment</h1>
          <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #dc2626, #ef4444); margin: 0 auto;"></div>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${memberName},</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Congratulations! You have been appointed to the leadership position of <strong>${position}</strong> in the MDPU by ${assignedBy}.
        </p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 25px 0;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">Leadership Responsibilities:</h3>
          <ul style="color: #333; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Represent MDPU with integrity and dedication</li>
            <li>Guide and support fellow union members</li>
            <li>Contribute to strategic decision-making</li>
            <li>Uphold the values and mission of MDPU</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mdpu-website.web.app/leadership" 
             style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
            View Leadership Page
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Your leadership profile is now visible on our public leadership page. Thank you for your commitment to serving the MDPU community.
        </p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Mathamba Descendants Progressive Union<br>
            Leadership Team
          </p>
        </div>
      </div>
    </div>
  `
});
// Helper function to send emails
async function sendEmail(to, template) {
    try {
        const mailOptions = {
            from: `"MDPU Notifications" <${EMAIL_CONFIG.auth.user}>`,
            to,
            subject: template.subject,
            html: template.html
        };
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return result;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
// Callable function to send approval notification
exports.sendApprovalNotification = (0, https_1.onCall)(async (request) => {
    try {
        const { email, fullName } = request.data;
        const { auth } = request;
        // Check if user is admin
        if (!auth || !auth.token.role || (auth.token.role !== 'admin' && auth.token.role !== 'superadmin')) {
            throw new https_1.HttpsError('permission-denied', 'Only admins can send notifications');
        }
        if (!email || !fullName) {
            throw new https_1.HttpsError('invalid-argument', 'Email and fullName are required');
        }
        const template = createApprovalEmail(fullName, email);
        await sendEmail(email, template);
        console.log(`Approval notification sent to: ${email}`);
        return {
            success: true,
            message: `Approval notification sent to ${email}`,
        };
    }
    catch (error) {
        console.error('Error sending approval notification:', error);
        throw new https_1.HttpsError('internal', `Failed to send notification: ${error.message}`);
    }
});
// Callable function to send leadership assignment notification
exports.sendLeadershipNotification = (0, https_1.onCall)(async (request) => {
    try {
        const { email, memberName, position, assignedBy } = request.data;
        const { auth } = request;
        // Check if user is admin
        if (!auth || !auth.token.role || (auth.token.role !== 'admin' && auth.token.role !== 'superadmin')) {
            throw new https_1.HttpsError('permission-denied', 'Only admins can send notifications');
        }
        if (!email || !memberName || !position) {
            throw new https_1.HttpsError('invalid-argument', 'Email, memberName, and position are required');
        }
        const template = createLeadershipEmail(memberName, position, assignedBy || 'Administrator');
        await sendEmail(email, template);
        console.log(`Leadership notification sent to: ${email}`);
        return {
            success: true,
            message: `Leadership notification sent to ${email}`,
        };
    }
    catch (error) {
        console.error('Error sending leadership notification:', error);
        throw new https_1.HttpsError('internal', `Failed to send notification: ${error.message}`);
    }
});
//# sourceMappingURL=email-simple.js.map