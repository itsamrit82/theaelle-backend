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
            <p style="color: #666; margin: 5px 0;">Own Your Edge</p>
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
            <p style="color: #666; margin: 5px 0;">Own Your Edge</p>
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
            <p style="color: #666; margin: 5px 0;">Own Your Edge</p>
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
    
    const itemsHtml = orderDetails.items.map(item => `
      <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
        <div style="flex: 1;">
          <h4 style="margin: 0; color: #333;">${item.title}</h4>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">
            Qty: ${item.quantity} ${item.size ? `| Size: ${item.size}` : ''} ${item.color ? `| Color: ${item.color}` : ''}
          </p>
        </div>
        <div style="font-weight: bold; color: #333;">₹${item.price * item.quantity}</div>
      </div>
    `).join('');
    
    const mailOptions = {
      from: '"The Aellè" <itsamrit82@gmail.com>',
      to: email,
      subject: `Order Confirmation #${orderDetails.orderNumber} - The Aellè`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f1005d; margin: 0;">The Aellè</h1>
            <p style="color: #666; margin: 5px 0;">Own Your Edge</p>
          </div>
          
          <h2 style="color: #333;">Order Confirmed! 🎉</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for your order! We've received your payment and will process your order shortly.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> #${orderDetails.orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${orderDetails.finalAmount}</p>
            <p><strong>Payment Status:</strong> ${orderDetails.paymentDetails?.paymentStatus === 'completed' ? 'Paid' : 'Pending'}</p>
            ${orderDetails.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(orderDetails.estimatedDelivery).toLocaleDateString('en-IN')}</p>` : ''}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Items Ordered</h3>
            ${itemsHtml}
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            We'll send you another email with tracking information once your order ships.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://theaelle.store/user/dashboard/orders" style="background: #f1005d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
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

// Send invoice email
export const sendInvoiceEmail = async (email, order) => {
  try {
    const transporter = createTransporter();
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.size || '-'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.color || '-'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');
    
    const mailOptions = {
      from: '"The Aellè" <itsamrit82@gmail.com>',
      to: email,
      subject: `Invoice #${order.orderNumber} - The Aellè`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #f1005d; padding-bottom: 20px;">
            <div>
              <h1 style="color: #f1005d; margin: 0;">The Aellè</h1>
              <p style="color: #666; margin: 5px 0;">Own Your Edge</p>
            </div>
            <div style="text-align: right;">
              <h2 style="color: #333; margin: 0;">INVOICE</h2>
              <p style="color: #666; margin: 5px 0;">#${order.orderNumber}</p>
              <p style="color: #666; margin: 5px 0;">Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div>
              <h3 style="color: #333; margin-bottom: 10px;">Bill To:</h3>
              <p style="margin: 2px 0; color: #666;"><strong>${order.shippingAddress.fullName}</strong></p>
              <p style="margin: 2px 0; color: #666;">${order.shippingAddress.email}</p>
              <p style="margin: 2px 0; color: #666;">${order.shippingAddress.phone}</p>
              <p style="margin: 2px 0; color: #666;">${order.shippingAddress.address}</p>
              <p style="margin: 2px 0; color: #666;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
              <p style="margin: 2px 0; color: #666;">${order.shippingAddress.country}</p>
            </div>
            <div style="text-align: right;">
              <h3 style="color: #333; margin-bottom: 10px;">Order Details:</h3>
              <p style="margin: 2px 0; color: #666;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              <p style="margin: 2px 0; color: #666;"><strong>Payment Method:</strong> ${order.paymentDetails.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
              <p style="margin: 2px 0; color: #666;"><strong>Payment Status:</strong> ${order.paymentDetails.paymentStatus}</p>
              ${order.paymentDetails.transactionId ? `<p style="margin: 2px 0; color: #666;"><strong>Transaction ID:</strong> ${order.paymentDetails.transactionId}</p>` : ''}
            </div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 15px 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
                <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Size</th>
                <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Color</th>
                <th style="padding: 15px 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                <th style="padding: 15px 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 300px;">
              <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
                <span>Subtotal:</span>
                <span>₹${order.totalAmount}</span>
              </div>
              ${order.shippingCost > 0 ? `
                <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
                  <span>Shipping:</span>
                  <span>₹${order.shippingCost}</span>
                </div>
              ` : ''}
              ${order.tax > 0 ? `
                <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
                  <span>Tax (GST):</span>
                  <span>₹${order.tax}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; padding: 10px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #f1005d; color: #333;">
                <span>Total Amount:</span>
                <span>₹${order.finalAmount}</span>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Thank You!</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 0;">
              Thank you for shopping with The Aellè. If you have any questions about this invoice, please contact us at itsamrit82@gmail.com
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 The Aellè. All rights reserved.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Invoice email sent to:', email);
    return { success: true, method: 'gmail' };
  } catch (error) {
    console.error('Invoice email error:', error);
    return { success: false, error: error.message };
  }
};