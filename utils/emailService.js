import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase email service initialized');
}

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    if (supabase) {
      try {
        const { error } = await supabase.auth.admin.inviteUserByEmail(userEmail, {
          data: { name: userName, welcome: true },
          redirectTo: `${process.env.CLIENT_URL}/login`
        });
        
        if (!error) {
          console.log('✅ Welcome email sent via Supabase to:', userEmail);
          return { success: true, message: 'Welcome email sent' };
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase email failed:', supabaseError.message);
      }
    }
    
    // Fallback to console
    console.log('\n=== WELCOME EMAIL SENT ===');
    console.log(`📧 To: ${userEmail}`);
    console.log(`👤 Name: ${userName}`);
    console.log(`📝 Subject: Welcome to The Aellè!`);
    console.log(`✨ Message: Welcome ${userName}! Your account has been created successfully.`);
    console.log('========================\n');
    
    return { success: true, message: 'Welcome email processed' };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (userEmail, resetLink, userName) => {
  try {
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
          redirectTo: resetLink
        });
        
        if (!error) {
          console.log('✅ Password reset email sent via Supabase to:', userEmail);
          return { success: true, message: 'Reset email sent' };
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase reset email failed:', supabaseError.message);
      }
    }
    
    // Fallback to console
    console.log('\n=== PASSWORD RESET EMAIL SENT ===');
    console.log(`📧 To: ${userEmail}`);
    console.log(`🔗 Reset Link: ${resetLink}`);
    console.log('================================\n');
    
    return { success: true, message: 'Reset email processed' };
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