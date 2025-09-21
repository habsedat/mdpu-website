import emailjs from '@emailjs/browser';

// EmailJS configuration - you'll need to set these up at https://emailjs.com
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_mdpu', // Replace with your EmailJS service ID
  TEMPLATE_ID_APPROVAL: 'template_approval', // Replace with your approval template ID
  TEMPLATE_ID_REJECTION: 'template_rejection', // Replace with your rejection template ID
  PUBLIC_KEY: 'your_public_key' // Replace with your EmailJS public key
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export interface EmailData {
  to_email: string;
  to_name: string;
  from_name?: string;
  message?: string;
}

// Send approval email to applicant
export const sendApprovalEmail = async (applicantData: EmailData): Promise<boolean> => {
  try {
    console.log('📧 Sending approval email to:', applicantData.to_email);

    const templateParams = {
      to_email: applicantData.to_email,
      to_name: applicantData.to_name,
      from_name: 'MDPU Administration',
      subject: '🎉 Your MDPU Membership Application Has Been APPROVED!',
      message: `
Dear ${applicantData.to_name},

🎉 CONGRATULATIONS! Your membership application to the Mathamba Descendants Progressive Union (MDPU) has been APPROVED!

Welcome to the MDPU family! You are now an official member of our union.

NEXT STEPS:
✅ Sign in to your account using your email: ${applicantData.to_email}
✅ Use the password you provided in your application
✅ Access your member dashboard at: https://mdpu-website.web.app/auth/signin
✅ Connect with fellow members and participate in union activities

If you have any questions or need assistance, please contact us at support@mdpu.org

Welcome aboard!

Best regards,
MDPU Administration Team
Mathamba Descendants Progressive Union
Building bridges, strengthening communities
      `.trim()
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_APPROVAL,
      templateParams
    );

    console.log('✅ Approval email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Error sending approval email:', error);
    return false;
  }
};

// Send rejection email to applicant
export const sendRejectionEmail = async (applicantData: EmailData): Promise<boolean> => {
  try {
    console.log('📧 Sending rejection email to:', applicantData.to_email);

    const templateParams = {
      to_email: applicantData.to_email,
      to_name: applicantData.to_name,
      from_name: 'MDPU Administration',
      subject: 'MDPU Membership Application Status Update',
      message: `
Dear ${applicantData.to_name},

Thank you for your interest in joining the Mathamba Descendants Progressive Union (MDPU).

After careful review, we are unable to approve your membership application at this time.

WHAT YOU CAN DO:
• You may reapply in the future when circumstances change
• Contact us if you have questions about this decision
• Continue to support MDPU's mission in your community

If you have questions about this decision, please contact us at support@mdpu.org

Thank you for your interest in MDPU.

Best regards,
MDPU Administration Team
Mathamba Descendants Progressive Union
Building bridges, strengthening communities
      `.trim()
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_REJECTION,
      templateParams
    );

    console.log('✅ Rejection email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Error sending rejection email:', error);
    return false;
  }
};

// Fallback function - shows instructions for manual email setup
export const showEmailInstructions = (applicantEmail: string, applicantName: string, isApproval: boolean) => {
  const status = isApproval ? 'APPROVED' : 'REJECTED';
  const subject = isApproval 
    ? '🎉 Your MDPU Membership Application Has Been APPROVED!'
    : 'MDPU Membership Application Status Update';

  const message = isApproval
    ? `Dear ${applicantName},

🎉 CONGRATULATIONS! Your MDPU membership application has been APPROVED!

You can now sign in at: https://mdpu-website.web.app/auth/signin
Email: ${applicantEmail}
Password: Use the password from your application

Welcome to MDPU!`
    : `Dear ${applicantName},

Thank you for your interest in MDPU. After careful review, we are unable to approve your membership application at this time.

You may reapply in the future. If you have questions, contact support@mdpu.org`;

  return {
    to: applicantEmail,
    subject,
    message,
    instructions: `
📧 EMAIL DETAILS TO SEND TO APPLICANT:

TO: ${applicantEmail}
SUBJECT: ${subject}

MESSAGE:
${message}

⚠️ Please copy and send this email manually to the applicant.
    `.trim()
  };
};


