import nodemailer from 'nodemailer';

// Create transporter using Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'itsamrit82@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (email, verificationUrl) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"The Aellè" <itsamrit82@gmail.com>',
      to: email,
      subject: 'Verify Your Email - The Aellè',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f1005d; margin: 0;">The Aellè</h1>
            <p style="color: #666; margin: 5px 0;">Fashion & Style</p>
          </div>
          
          <h2 style="color: #333;">Verify Your Email Address</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for signing up! Please click the button below to verify your email address and complete your registration.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: #f1005d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #f1005d;">${verificationUrl}</a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour for security reasons.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 The Aellè. All rights reserved.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', email);
    return { success: true, method: 'gmail' };
  } catch (error) {
    console.error('Verification email error:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"The Aellè" <itsamrit82@gmail.com>',
      to: email,
      subject: 'Welcome to The Aellè!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f1005d; margin: 0;">The Aellè</h1>
            <p style="color: #666; margin: 5px 0;">Fashion & Style</p>
          </div>
          
          <h2 style="color: #333;">Welcome, ${userName}! 🎉</h2>
          <p style="color: #666; line-height: 1.6;">
            Your account has been created successfully! We're excited to have you join The Aellè family.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>🛍️ Browse our latest collection</li>
              <li>💝 Get exclusive member discounts</li>
              <li>📦 Enjoy free shipping on orders over ₹500</li>
              <li>🔄 Easy 30-day returns</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://theaelle.store/shop" style="background: #f1005d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Start Shopping
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 The Aellè. All rights reserved.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
    return { success: true, method: 'gmail' };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"The Aellè" <itsamrit82@gmail.com>',
      to: email,
      subject: 'Reset Your Password - The Aellè',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f1005d; margin: 0;">The Aellè</h1>
            <p style="color: #666; margin: 5px 0;">Fashion & Style</p>
          </div>
          
          <h2 style="color: #333;">Reset Your Password</h2>
          <p style="color: #666; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #f1005d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you didn't request this, you can safely ignore this email. Your password won't be changed.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour for security reasons.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 The Aellè. All rights reserved.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
    return { success: true, method: 'gmail' };
  } catch (error) {
    console.error('Password reset email error:', error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, orderDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"The Aellè" <itsamrit82@gmail.com>',
      to: email,
      subject: `Order Confirmation #${orderDetails.orderNumber} - The Aellè`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f1005d; margin: 0;">The Aellè</h1>
            <p style="color: #666; margin: 5px 0;">Fashion & Style</p>
          </div>
          
          <h2 style="color: #333;">Order Confirmed! 🎉</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for your order! We've received your order and will process it shortly.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> #${orderDetails.orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod || 'Online Payment'}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            We'll send you another email with tracking information once your order ships.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://theaelle.store/user/dashboard" style="background: #f1005d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Track Your Order
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 The Aellè. All rights reserved.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to:', email);
    return { success: true, method: 'gmail' };
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return { success: false, error: error.message };
  }
};