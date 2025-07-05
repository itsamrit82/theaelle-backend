// Simple email service without external dependencies

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    console.log('\n=== WELCOME EMAIL SENT ===');
    console.log(`📧 To: ${userEmail}`);
    console.log(`👤 Name: ${userName}`);
    console.log(`📝 Subject: Welcome to The Aellè!`);
    console.log(`✨ Message: Welcome ${userName}! Your account has been created successfully.`);
    console.log(`🛍️ Start exploring our unique fashion collection.`);
    console.log(`💝 Thank you for joining The Aellè family!`);
    console.log('========================\n');
    
    return { success: true, message: 'Welcome email logged to console' };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (userEmail, resetLink, userName) => {
  try {
    console.log('\n=== PASSWORD RESET EMAIL SENT ===');
    console.log(`📧 To: ${userEmail}`);
    console.log(`👤 Name: ${userName || 'Customer'}`);
    console.log(`📝 Subject: Reset Your Password - The Aellè`);
    console.log(`🔐 Message: You requested a password reset for your account.`);
    console.log(`🔗 Reset Link: ${resetLink}`);
    console.log(`⏰ This link expires in 1 hour.`);
    console.log(`ℹ️ If you didn't request this, please ignore this email.`);
    console.log('================================\n');
    
    return { success: true, message: 'Password reset email logged to console' };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error };
  }
};

export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    console.log('\n=== ORDER CONFIRMATION EMAIL SENT ===');
    console.log(`📧 To: ${userEmail}`);
    console.log(`📝 Subject: Order Confirmation #${orderDetails.orderNumber}`);
    console.log(`🎉 Thank you for your order!`);
    console.log(`📦 Order #: ${orderDetails.orderNumber}`);
    console.log(`💰 Total Amount: ₹${orderDetails.finalAmount}`);
    console.log(`💳 Payment: ${orderDetails.paymentDetails.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`);
    console.log(`📅 Estimated Delivery: ${new Date(orderDetails.estimatedDelivery).toLocaleDateString()}`);
    console.log(`📋 Items Ordered:`);
    
    orderDetails.items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title} - Qty: ${item.quantity} - ₹${item.price}`);
    });
    
    console.log(`📬 We'll send tracking info once your order ships.`);
    console.log(`🙏 Thank you for shopping with The Aellè!`);
    console.log('===================================\n');
    
    return { success: true, message: 'Order confirmation email logged to console' };
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return { success: false, error };
  }
};