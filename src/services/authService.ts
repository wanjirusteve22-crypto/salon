import { getSupabaseClient, isSupabaseConfigured, DEFAULT_BUSINESS_ID } from './supabaseClient';

export type UserRole = 'superadmin' | 'owner' | 'employee' | 'customer';

export interface AuthUserProfile {
  id: string;
  email?: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  businessId: string;
  avatarUrl?: string;
}

export const DEMO_USERS: Record<UserRole, AuthUserProfile> = {
  owner: {
    id: 'u-owner-001',
    email: 'director@aurumsalonflow.co.ke',
    fullName: 'Grace Wambui (Salon Owner)',
    phone: '+254 722 894 120',
    role: 'owner',
    businessId: DEFAULT_BUSINESS_ID,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  employee: {
    id: 'u-emp-001',
    email: 'mwangi.barber@aurumsalonflow.co.ke',
    fullName: 'Mwangi "DJ" Kimani (Master Barber)',
    phone: '+254 723 456 702',
    role: 'employee',
    businessId: DEFAULT_BUSINESS_ID,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  customer: {
    id: 'u-cust-001',
    email: 'esther.wairimu@kyu.ac.ke',
    fullName: 'Dr. Esther Wairimu (Client)',
    phone: '+254 722 411 902',
    role: 'customer',
    businessId: DEFAULT_BUSINESS_ID,
  },
  superadmin: {
    id: 'u-admin-001',
    email: 'platform@salonflow.co.ke',
    fullName: 'SalonFlow Platform Engineer',
    phone: '+254 700 000 000',
    role: 'superadmin',
    businessId: DEFAULT_BUSINESS_ID,
  },
};

class AuthService {
  private activeSimulatedRole: UserRole = 'owner';

  getSimulatedProfile(role?: UserRole): AuthUserProfile {
    const target = role || this.activeSimulatedRole;
    return DEMO_USERS[target] || DEMO_USERS.owner;
  }

  setSimulatedRole(role: UserRole) {
    this.activeSimulatedRole = role;
  }

  async getCurrentUser(): Promise<AuthUserProfile> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            return {
              id: user.id,
              email: user.email,
              fullName: profile.full_name,
              phone: profile.phone,
              role: profile.role,
              businessId: profile.business_id || DEFAULT_BUSINESS_ID,
              avatarUrl: profile.avatar_url,
            };
          }
        }
      } catch (err) {
        console.warn('Could not query Supabase auth user, using fallback', err);
      }
    }
    return this.getSimulatedProfile();
  }

  async signInWithEmail(email: string, password: string):Promise<{ success: boolean; error?: string; profile?: AuthUserProfile }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // In demo mode
      const matched = Object.values(DEMO_USERS).find(u => u.email === email);
      if (matched) {
        this.activeSimulatedRole = matched.role;
        return { success: true, profile: matched };
      }
      return { 
        success: true, 
        profile: {
          id: `u-${Date.now()}`,
          email,
          fullName: email.split('@')[0],
          role: 'owner',
          businessId: DEFAULT_BUSINESS_ID,
        }
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    if (data.user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        success: true,
        profile: profile ? {
          id: data.user.id,
          email: data.user.email,
          fullName: profile.full_name,
          phone: profile.phone,
          role: profile.role,
          businessId: profile.business_id,
          avatarUrl: profile.avatar_url,
        } : undefined,
      };
    }

    return { success: false, error: 'Sign in failed' };
  }

  async signUp(
    email: string, 
    password: string, 
    fullName: string, 
    role: UserRole = 'owner', 
    businessId?: string
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { 
        success: true, 
        message: 'Account registered in preview mode. You can now access your dashboard.' 
      };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        }
      }
    });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      try {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          full_name: fullName,
          role,
          business_id: businessId || DEFAULT_BUSINESS_ID,
        });
      } catch (e) {
        console.warn('Profile auto-insert note:', e);
      }
    }
    return {
      success: true,
      message: 'Registration successful! Check your email to confirm your account or sign in.',
    };
  }

  async resetPasswordForEmail(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        success: true,
        message: 'Password reset instructions simulated. Check your email.',
      };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false, error: error.message };
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email address.',
    };
  }

  async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }
}

export const authService = new AuthService();
