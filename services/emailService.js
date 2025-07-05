// Simple email service - console logging for now
// This avoids Supabase user creation issues

// Send verification email
export const sendVerificationEmail = async (email, verificationUrl) => {
  try {
    console.log('\n=== EMAIL VERIFICATION ===');
    console.log(`📧 To: ${email}`);
    console.log(`🔗 Verification Link: ${verificationUrl}`);
    console.log('==========================\n');
    
    return { success: true, method: 'console' };
  } catch (error) {
    console.error('Verification email error:', error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, userName) => {
  try {
    console.log('\n=== WELCOME EMAIL ===');
    console.log(`📧 To: ${email}`);
    console.log(`👋 Welcome ${userName}!`);
    console.log(`🎉 Your account has been created successfully`);
    console.log(`🛍️ Start shopping at The Aellè`);
    console.log('=====================\n');
    
    return { success: true, method: 'console' };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    console.log('\n=== PASSWORD RESET ===');
    console.log(`📧 To: ${email}`);
    console.log(`🔐 Reset your password`);
    console.log(`🔗 Reset Link: ${resetUrl}`);
    console.log(`⏰ Link expires in 1 hour`);
    console.log('======================\n');
    
    return { success: true, method: 'console' };
  } catch (error) {
    console.error('Password reset email error:', error);
    throw error;
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, orderDetails) => {
  try {
    console.log('\n=== ORDER CONFIRMATION ===');
    console.log(`📧 To: ${email}`);
    console.log(`📦 Order #${orderDetails.orderNumber}`);
    console.log(`💰 Total: ₹${orderDetails.totalAmount}`);
    console.log(`✅ Order confirmed successfully`);
    console.log('==========================\n');
    
    return { success: true, method: 'console' };
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return { success: false, error: error.message };
  }
};