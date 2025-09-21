import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as nodemailer from 'nodemailer';

// Simple email configuration - you'll need to update these with real credentials
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'mdpu.notifications@gmail.com', // Replace with your email
    pass: 'your-app-password' // Replace with your Gmail app password
  }
};

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Email templates for applicants
const createApprovalEmail = (applicantName: string, email: string) => ({
  subject: '🎉 Your MDPU Membership Application Has Been APPROVED!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; font-size: 28px; margin-bottom: 10px;">🎉 CONGRATULATIONS!</h1>
          <div style="width: 80px; height: 4px; background: linear-gradient(90deg, #16a34a, #059669); margin: 0 auto; border-radius: 2px;"></div>
        </div>
        
        <p style="color: #1f2937; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
          Dear <strong>${applicantName}</strong>,
        </p>
        
        <div style="background-color: #dcfce7; border-left: 5px solid #16a34a; padding: 20px; margin: 25px 0; border-radius: 5px;">
          <p style="color: #166534; font-size: 18px; font-weight: bold; margin: 0;">
            ✅ Your membership application to the Mathamba Descendants Progressive Union (MDPU) has been APPROVED!
          </p>
        </div>
        
        <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          Welcome to the MDPU family! You are now an official member of our union.
        </p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px;">🚀 Next Steps:</h3>
          <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Sign in to your account:</strong> Use your email <strong>${email}</strong> and the password you provided in your application</li>
            <li><strong>Access your member dashboard:</strong> View union activities, events, and updates</li>
            <li><strong>Connect with other members:</strong> Join your chapter's activities and community</li>
            <li><strong>Stay updated:</strong> Check the website regularly for news and announcements</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mdpu-website.web.app/auth/signin" 
             style="background: linear-gradient(135deg, #16a34a, #059669); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(22, 163, 74, 0.3);">
            🔐 Sign In to Your Member Account
          </a>
        </div>
        
        <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
            If you have any questions or need assistance, please contact us:
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            📧 Email: <a href="mailto:support@mdpu.org" style="color: #16a34a;">support@mdpu.org</a><br>
            🌐 Website: <a href="https://mdpu-website.web.app" style="color: #16a34a;">mdpu-website.web.app</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            <strong>Mathamba Descendants Progressive Union</strong><br>
            Building bridges, strengthening communities
          </p>
        </div>
        
      </div>
    </div>
  `,
  text: `
Congratulations ${applicantName}!

Your MDPU membership application has been APPROVED!

You can now sign in to your member account using:
Email: ${email}
Password: The password you provided in your application

Sign in at: https://mdpu-website.web.app/auth/signin

Welcome to the MDPU family!

If you need help, contact us at support@mdpu.org

Mathamba Descendants Progressive Union
Building bridges, strengthening communities
  `
});

const createRejectionEmail = (applicantName: string, email: string) => ({
  subject: 'MDPU Membership Application Status Update',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fef2f2;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 10px;">Application Status Update</h1>
          <div style="width: 80px; height: 4px; background: #dc2626; margin: 0 auto; border-radius: 2px;"></div>
        </div>
        
        <p style="color: #1f2937; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
          Dear <strong>${applicantName}</strong>,
        </p>
        
        <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          Thank you for your interest in joining the Mathamba Descendants Progressive Union (MDPU).
        </p>
        
        <div style="background-color: #fee2e2; border-left: 5px solid #dc2626; padding: 20px; margin: 25px 0; border-radius: 5px;">
          <p style="color: #991b1b; font-size: 16px; margin: 0;">
            After careful review, we are unable to approve your membership application at this time.
          </p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">What you can do:</h3>
          <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>You may reapply in the future when circumstances change</li>
            <li>Contact us if you have questions about the decision</li>
            <li>Continue to support MDPU's mission in your community</li>
          </ul>
        </div>
        
        <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
            If you have questions about this decision, please contact us:
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            📧 Email: <a href="mailto:support@mdpu.org" style="color: #dc2626;">support@mdpu.org</a><br>
            🌐 Website: <a href="https://mdpu-website.web.app" style="color: #dc2626;">mdpu-website.web.app</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            <strong>Mathamba Descendants Progressive Union</strong><br>
            Building bridges, strengthening communities
          </p>
        </div>
        
      </div>
    </div>
  `,
  text: `
Dear ${applicantName},

Thank you for your interest in joining the Mathamba Descendants Progressive Union (MDPU).

After careful review, we are unable to approve your membership application at this time.

You may reapply in the future when circumstances change. If you have questions about this decision, please contact us at support@mdpu.org.

Thank you for your interest in MDPU.

Mathamba Descendants Progressive Union
Building bridges, strengthening communities
  `
});

// Helper function to send emails
async function sendEmail(to: string, template: { subject: string; html: string; text: string }) {
  try {
    const mailOptions = {
      from: `"MDPU Notifications" <${EMAIL_CONFIG.auth.user}>`,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

// Callable function to send approval notification to applicant
export const sendApprovalEmail = onCall(async (request) => {
  try {
    const { email, fullName } = request.data;
    const { auth } = request;

    // Check if user is admin
    if (!auth || !auth.token.role || (auth.token.role !== 'admin' && auth.token.role !== 'superadmin')) {
      throw new HttpsError('permission-denied', 'Only admins can send approval emails');
    }

    if (!email || !fullName) {
      throw new HttpsError('invalid-argument', 'Email and fullName are required');
    }

    console.log(`📧 Sending approval email to: ${email} (${fullName})`);

    const template = createApprovalEmail(fullName, email);
    const result = await sendEmail(email, template);

    console.log(`✅ Approval email sent successfully to: ${email}`);

    return {
      success: true,
      message: `Approval email sent to ${email}`,
      messageId: result.messageId
    };
  } catch (error: any) {
    console.error('❌ Error sending approval email:', error);
    throw new HttpsError('internal', `Failed to send approval email: ${error.message}`);
  }
});

// Callable function to send rejection notification to applicant
export const sendRejectionEmail = onCall(async (request) => {
  try {
    const { email, fullName } = request.data;
    const { auth } = request;

    // Check if user is admin
    if (!auth || !auth.token.role || (auth.token.role !== 'admin' && auth.token.role !== 'superadmin')) {
      throw new HttpsError('permission-denied', 'Only admins can send rejection emails');
    }

    if (!email || !fullName) {
      throw new HttpsError('invalid-argument', 'Email and fullName are required');
    }

    console.log(`📧 Sending rejection email to: ${email} (${fullName})`);

    const template = createRejectionEmail(fullName, email);
    const result = await sendEmail(email, template);

    console.log(`✅ Rejection email sent successfully to: ${email}`);

    return {
      success: true,
      message: `Rejection email sent to ${email}`,
      messageId: result.messageId
    };
  } catch (error: any) {
    console.error('❌ Error sending rejection email:', error);
    throw new HttpsError('internal', `Failed to send rejection email: ${error.message}`);
  }
});

