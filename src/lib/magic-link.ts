import { supabase } from './supabase';
import { sendEmail } from './email-notifications';

// Generate a secure magic link token
export async function generateMagicLink(
  email: string, 
  userType: 'congress' | 'wahs' | 'admin'
): Promise<{ token: string; expiresAt: Date; error?: string }> {
  try {
    // Generate a secure random token
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Token expires in 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    // Store token in database
    const { error } = await supabase
      .from('magic_link_tokens')
      .insert({
        email: email.toLowerCase(),
        token,
        user_type: userType,
        expires_at: expiresAt.toISOString(),
        used: false
      });
    
    if (error) {
      return { token: '', expiresAt, error: error.message };
    }
    
    return { token, expiresAt };
  } catch (error) {
    return { 
      token: '', 
      expiresAt: new Date(), 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Send magic link for password reset
export async function sendPasswordResetLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, check if user exists and determine user type
    const { data: congressUser } = await supabase
      .from('congress_submitters')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();
    
    const { data: wahsUser } = await supabase
      .from('wahs_members')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();
    
    let userType: 'congress' | 'wahs' | 'admin' | null = null;
    
    if (congressUser) {
      userType = 'congress';
    } else if (wahsUser) {
      userType = 'wahs';
    } else {
      // Check if admin user
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
        .single();
      
      if (adminUser) {
        userType = 'admin';
      } else {
        // User doesn't exist in any table
        // Still send a generic magic link that will fail gracefully
        userType = 'congress'; // Default
      }
    }
    
    // Generate magic link token
    const { token, expiresAt, error: tokenError } = await generateMagicLink(email, userType);
    
    if (tokenError || !token) {
      return { success: false, error: tokenError || 'Failed to generate token' };
    }
    
    // Create magic link URL for password reset
    const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://congress.iwahs.org'}/auth/magic-link?token=${token}&email=${encodeURIComponent(email)}&reset=true`;
    
    // Send password reset email
    const result = await sendEmail(email, 'PASSWORD_RESET', {
      magicLink,
      expiresIn: '1 hour'
    });
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Send magic link email using Resend
export async function sendMagicLinkEmail(
  email: string,
  userType: 'congress' | 'wahs' | 'admin'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate magic link token
    const { token, expiresAt, error: tokenError } = await generateMagicLink(email, userType);
    
    if (tokenError || !token) {
      return { success: false, error: tokenError || 'Failed to generate token' };
    }
    
    // Create magic link URL
    const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://congress.iwahs.org'}/auth/magic-link?token=${token}&email=${encodeURIComponent(email)}`;
    
    // Determine email template based on user type
    const templateKey = userType === 'congress' ? 'MAGIC_LINK_CONGRESS' : 
                       userType === 'wahs' ? 'MAGIC_LINK_WAHS' : 
                       'MAGIC_LINK_ADMIN';
    
    // Send email using our email system (which uses Resend)
    const result = await sendEmail(email, templateKey as any, {
      magicLink,
      expiresIn: '1 hour'
    });
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Verify magic link token
export async function verifyMagicLinkToken(
  token: string,
  email: string
): Promise<{ 
  valid: boolean; 
  userType?: 'congress' | 'wahs' | 'admin'; 
  error?: string 
}> {
  try {
    // Find token in database
    const { data, error } = await supabase
      .from('magic_link_tokens')
      .select('*')
      .eq('token', token)
      .eq('email', email.toLowerCase())
      .eq('used', false)
      .single();
    
    if (error || !data) {
      return { valid: false, error: 'Invalid or expired token' };
    }
    
    // Check if token is expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      return { valid: false, error: 'Token has expired' };
    }
    
    // Mark token as used
    await supabase
      .from('magic_link_tokens')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', data.id);
    
    return { 
      valid: true, 
      userType: data.user_type as 'congress' | 'wahs' | 'admin'
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Send admin magic link
export async function sendAdminMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user is in admin_users table
    const { data: userData } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (!userData) {
      return { success: false, error: 'Admin user not found' };
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    if (!adminData) {
      return { success: false, error: 'Not authorized as admin' };
    }

    // Send magic link for admin
    return sendMagicLinkEmail(email, 'admin');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Unified function to send magic link (for registration or password reset)
export async function sendMagicLink(
  email: string,
  purpose: 'registration' | 'password_reset' = 'registration',
  userType?: 'congress' | 'wahs' | 'admin'
): Promise<{ success: boolean; error?: string }> {
  if (purpose === 'password_reset') {
    return sendPasswordResetLink(email);
  } else {
    if (!userType) {
      return { success: false, error: 'User type required for registration' };
    }
    return sendMagicLinkEmail(email, userType);
  }
}

// Clean up expired tokens (run as cron job)
export async function cleanupExpiredTokens(): Promise<{ deleted: number; error?: string }> {
  try {
    const { count, error } = await supabase
      .from('magic_link_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (error) {
      return { deleted: 0, error: error.message };
    }
    
    return { deleted: count || 0 };
  } catch (error) {
    return {
      deleted: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}