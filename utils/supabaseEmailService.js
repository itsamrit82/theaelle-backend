import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Only create Supabase client if environment variables are available
let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase email client initialized');
  } catch (error) {
    console.log('⚠️ Supabase client initialization failed:', error.message);
  }
} else {
  console.log('⚠️ Supabase credentials missing, email service will use fallback');
}

export const sendSupabaseWelcomeEmail = async (userEmail, userName) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }
    
    // Method 1: Try to send via Supabase Auth
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(userEmail, {
      data: {
        name: userName,
        welcome_email: true
      },
      redirectTo: `${process.env.CLIENT_URL}/login`
    });

    if (error) {
      console.log('⚠️ Supabase invite failed:', error.message);
      throw error;
    }

    console.log('✅ Welcome email sent via Supabase to:', userEmail);
    return { success: true, data };
  } catch (error) {
    console.log('⚠️ Supabase email failed, using fallback');
    
    // Fallback to console logging
    console.log('\n=== WELCOME EMAIL (SUPABASE FALLBACK) ===');
    console.log(`📧 To: ${userEmail}`);
    console.log(`👤 Name: ${userName}`);
    console.log(`📝 Subject: Welcome to The Aellè!`);
    console.log(`✨ Welcome ${userName}! Your account is ready.`);
    console.log('=======================================\n');
    
    return { success: true, fallback: true };
  }
};

export const sendSupabasePasswordReset = async (userEmail, resetLink) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: resetLink
    });

    if (error) {
      console.log('⚠️ Supabase reset failed:', error.message);
      throw error;
    }

    console.log('✅ Password reset email sent via Supabase to:', userEmail);
    return { success: true, data };
  } catch (error) {
    console.log('⚠️ Supabase reset failed, using fallback');
    
    // Fallback to console logging
    console.log('\n=== PASSWORD RESET (SUPABASE FALLBACK) ===');
    console.log(`📧 To: ${userEmail}`);
    console.log(`🔗 Reset Link: ${resetLink}`);
    console.log('=========================================\n');
    
    return { success: true, fallback: true };
  }
};

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    if (!supabase) {
      return { connected: false, error: 'Supabase client not initialized' };
    }
    
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('❌ Supabase connection test failed:', error.message);
      return { connected: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful');
    console.log(`📊 Found ${data.users.length} users in Supabase`);
    return { connected: true, userCount: data.users.length };
  } catch (error) {
    console.log('❌ Supabase connection error:', error.message);
    return { connected: false, error: error.message };
  }
};