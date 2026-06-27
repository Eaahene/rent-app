import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: `"RentApp" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const generateVerificationEmail = (token: string, baseUrl: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Verify Your Email</h2>
    <p>Thank you for registering with RentApp. Please click the button below to verify your email address:</p>
    <a href="${baseUrl}/verify-email?token=${token}" 
       style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
      Verify Email
    </a>
    <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
    <p style="color: #666; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
  </div>
`;

export const generateResetPasswordEmail = (token: string, baseUrl: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Reset Your Password</h2>
    <p>You requested a password reset. Click the button below to set a new password:</p>
    <a href="${baseUrl}/reset-password?token=${token}" 
       style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
      Reset Password
    </a>
    <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
    <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
  </div>
`;
