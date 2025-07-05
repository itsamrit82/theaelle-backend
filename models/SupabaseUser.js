import { supabase } from '../utils/supabaseConfig.js';
import bcrypt from 'bcrypt';

export class SupabaseUser {
  static async create(userData) {
    const { name, email, mobile, password, profilePic } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        mobile: mobile || '',
        password: hashedPassword,
        profile_pic: profilePic || '',
        role: 'user',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
  
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}