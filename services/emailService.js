import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://nqivjdxtpjymbnhdjkhj.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseClient = null;

// Initialize Supabase client
const initializeSupabase = () => {
  if (!supabaseServiceKey) {
    throw new Error('Supabase service role key is required');
  }

  try {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    return supabaseClient;
  } catch (error) {
    throw new Error(`Supabase initialization failed: ${error.message}`);
  }
};

// Initialize on module load
initializeSupabase();

// Send verification email
export const sendVerificationEmail = async (email, verificationUrl) => {
  try {
    const { data, error } = await supabaseClient.auth.admin.inviteUserByEmail(email, {
      data: { 
        email_verification: true,
        verification_url: verificationUrl,
        app_name: 'The Aellè'
      },
      redirectTo: verificationUrl
    });

    if (error) {
      throw new Error(`Failed to send verification email: ${error.message}`);
    }


    return { success: true, method: 'supabase' };
  } catch (error) {
    console.error('Verification email error:', error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const { data, error } = await supabaseClient.auth.admin.inviteUserByEmail(email, {
      data: { 
        name: userName,
        welcome_email: true,
        type: 'welcome',
        app_name: 'The Aellè'
      },
      redirectTo: `${process.env.CLIENT_URL}/login`
    });

    if (error) {
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }


    return { success: true, method: 'supabase' };
  } catch (error) {
    console.error('Welcome email error:', error);
    // Don't throw for welcome emails - not critical
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl
    });

    if (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }


    return { success: true, method: 'supabase' };
  } catch (error) {
    console.error('Password reset email error:', error);
    throw error;
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, orderDetails) => {
  try {
    const { data, error } = await supabaseClient.auth.admin.inviteUserByEmail(email, {
      data: { 
        order_confirmation: true,
        order_number: orderDetails.orderNumber,
        total_amount: orderDetails.totalAmount,
        app_name: 'The Aellè'
      },
      redirectTo: `${process.env.CLIENT_URL}/orders`
    });

    if (error) {
      throw new Error(`Failed to send order confirmation: ${error.message}`);
    }


    return { success: true, method: 'supabase' };
  } catch (error) {
    console.error('Order confirmation email error:', error);
    // Don't throw for order emails - not critical
    return { success: false, error: error.message };
  }
};

