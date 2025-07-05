import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials missing');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const sendVerificationEmail = async (email, redirectUrl) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { 
        email_verification: true,
        redirect_url: redirectUrl
      },
      redirectTo: redirectUrl
    });

    if (error) {
      console.log('⚠️ Supabase email failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Verification email sent via Supabase to:', email);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (email, userName) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { 
        name: userName,
        welcome_email: true
      },
      redirectTo: `${process.env.CLIENT_URL}/login`
    });

    if (error) {
      console.log('⚠️ Welcome email failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Welcome email sent via Supabase to:', email);
    return { success: true, data };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const { data, error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl
    });

    if (error) {
      console.log('⚠️ Password reset email failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Password reset email sent via Supabase to:', email);
    return { success: true, data };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error: error.message };
  }
};