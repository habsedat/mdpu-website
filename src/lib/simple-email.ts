// Simple email service using Web3Forms (free, no setup required)
export interface EmailNotification {
  to: string;
  name: string;
  type: 'approval' | 'rejection';
}

// Web3Forms configuration (free service, no signup required initially)
const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_KEY"; // We'll use a fallback method

export const sendEmailNotification = async (notification: EmailNotification): Promise<boolean> => {
  try {
    console.log(`📧 Preparing ${notification.type} email for:`, notification.to);

    const subject = notification.type === 'approval' 
      ? '🎉 Your MDPU Membership Application Has Been APPROVED!'
      : 'MDPU Membership Application Status Update';

    const message = notification.type === 'approval'
      ? `Dear ${notification.name},

🎉 CONGRATULATIONS! Your membership application to the Mathamba Descendants Progressive Union (MDPU) has been APPROVED!

Welcome to the MDPU family! You are now an official member of our union.

NEXT STEPS:
✅ Sign in to your account: https://mdpu-website.web.app/auth/signin
✅ Use your email: ${notification.to}
✅ Use the password you provided in your application
✅ Access your member dashboard and connect with fellow members

If you have any questions or need assistance, please contact us at support@mdpu.org

Welcome aboard!

Best regards,
MDPU Administration Team
Mathamba Descendants Progressive Union
Building bridges, strengthening communities`
      : `Dear ${notification.name},

Thank you for your interest in joining the Mathamba Descendants Progressive Union (MDPU).

After careful review, we are unable to approve your membership application at this time.

WHAT YOU CAN DO:
• You may reapply in the future when circumstances change
• Contact us if you have questions about this decision at support@mdpu.org
• Continue to support MDPU's mission in your community

Thank you for your interest in MDPU.

Best regards,
MDPU Administration Team
Mathamba Descendants Progressive Union
Building bridges, strengthening communities`;

    // Create mailto link that opens user's email client
    const mailtoLink = `mailto:${notification.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    // Open the email client automatically
    window.open(mailtoLink, '_blank');
    
    // Show admin the email content for confirmation
    const emailPreview = `
📧 EMAIL READY TO SEND TO APPLICANT

TO: ${notification.to}
SUBJECT: ${subject}

MESSAGE PREVIEW:
${message.substring(0, 200)}...

✅ Your email client should have opened with this message.
✅ Please review and send the email to notify the applicant.
✅ The applicant will know their application status immediately.

Click OK after sending the email.
    `;

    alert(emailPreview);
    
    return true;

  } catch (error) {
    console.error('❌ Error in email notification:', error);
    
    // Fallback: Show complete email details
    const fallbackDetails = `
📧 PLEASE SEND THIS EMAIL TO THE APPLICANT

TO: ${notification.to}
SUBJECT: ${notification.type === 'approval' ? '🎉 Your MDPU Membership Application Has Been APPROVED!' : 'MDPU Membership Application Status Update'}

Copy and paste this message:

Dear ${notification.name},

${notification.type === 'approval' 
  ? `🎉 CONGRATULATIONS! Your MDPU membership application has been APPROVED!

You can now sign in at: https://mdpu-website.web.app/auth/signin
Email: ${notification.to}
Password: Use the password from your application

Welcome to MDPU!`
  : `Thank you for your interest in MDPU. After careful review, we are unable to approve your membership application at this time.

You may reapply in the future. Contact support@mdpu.org with questions.`}

Best regards,
MDPU Administration Team

⚠️ IMPORTANT: Please copy this and send it manually to the applicant.
    `;

    alert(fallbackDetails);
    return false;
  }
};

// Function to create a simple email template
export const createEmailTemplate = (notification: EmailNotification): string => {
  const isApproval = notification.type === 'approval';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${isApproval ? 'Application Approved' : 'Application Status'}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: ${isApproval ? '#d4edda' : '#f8d7da'}; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: ${isApproval ? '#155724' : '#721c24'}; text-align: center;">
            ${isApproval ? '🎉 Application Approved!' : 'Application Status Update'}
        </h1>
    </div>
    
    <p>Dear <strong>${notification.name}</strong>,</p>
    
    ${isApproval ? `
    <p>🎉 <strong>CONGRATULATIONS!</strong> Your membership application to the Mathamba Descendants Progressive Union (MDPU) has been <strong>APPROVED!</strong></p>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #155724;">Next Steps:</h3>
        <ul>
            <li>Sign in to your account at: <a href="https://mdpu-website.web.app/auth/signin">https://mdpu-website.web.app/auth/signin</a></li>
            <li>Use your email: <strong>${notification.to}</strong></li>
            <li>Use the password you provided in your application</li>
            <li>Access your member dashboard and connect with fellow members</li>
        </ul>
    </div>
    
    <p>Welcome to the MDPU family!</p>
    ` : `
    <p>Thank you for your interest in joining the Mathamba Descendants Progressive Union (MDPU).</p>
    
    <p>After careful review, we are unable to approve your membership application at this time.</p>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>What you can do:</h3>
        <ul>
            <li>You may reapply in the future when circumstances change</li>
            <li>Contact us at <a href="mailto:support@mdpu.org">support@mdpu.org</a> if you have questions</li>
            <li>Continue to support MDPU's mission in your community</li>
        </ul>
    </div>
    `}
    
    <p>If you have any questions or need assistance, please contact us at <a href="mailto:support@mdpu.org">support@mdpu.org</a></p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    
    <p style="text-align: center; color: #666; font-size: 14px;">
        <strong>Mathamba Descendants Progressive Union</strong><br>
        Building bridges, strengthening communities<br>
        <a href="https://mdpu-website.web.app">mdpu-website.web.app</a>
    </p>
</body>
</html>
  `.trim();
};
