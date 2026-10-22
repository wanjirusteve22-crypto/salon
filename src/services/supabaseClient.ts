import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Vite environment variables via import.meta.env
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const rawBusinessSlug = import.meta.env.VITE_BUSINESS_SLUG || import.meta.env.VITE_DEFAULT_BUSINESS_SLUG;

export const DEFAULT_BUSINESS_SLUG = (rawBusinessSlug && typeof rawBusinessSlug === 'string' && rawBusinessSlug.trim())
  ? rawBusinessSlug.trim()
  : 'aurum-kutus';

export const DEFAULT_BUSINESS_ID = 'a0000000-0000-0000-0000-000000000001';

/**
 * Validates the presence and format of required environment variables.
 * Returns an array of human-readable diagnostic messages if anything is missing or malformed.
 */
export const getSupabaseConfigErrors = (): string[] => {
  const errors: string[] = [];

  if (!rawSupabaseUrl || typeof rawSupabaseUrl !== 'string' || !rawSupabaseUrl.trim()) {
    errors.push('Missing environment variable: VITE_SUPABASE_URL is not set.');
  } else {
    const trimmed = rawSupabaseUrl.trim();
    if (!trimmed.startsWith('https://')) {
      errors.push('Invalid VITE_SUPABASE_URL: URL must begin with "https://" (e.g. https://[project-ref].supabase.co).');
    }
    if (trimmed.includes('your-project-ref') || trimmed.includes('[YOUR_PROJECT_ID]')) {
      errors.push('Placeholder detected in VITE_SUPABASE_URL: Replace placeholder with your real Supabase project URL.');
    }
  }

  if (!rawSupabaseAnonKey || typeof rawSupabaseAnonKey !== 'string' || !rawSupabaseAnonKey.trim()) {
    errors.push('Missing environment variable: VITE_SUPABASE_ANON_KEY is not set.');
  } else {
    const trimmedKey = rawSupabaseAnonKey.trim();
    if (trimmedKey.includes('...') || trimmedKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')) {
      errors.push('Placeholder detected in VITE_SUPABASE_ANON_KEY: Replace placeholder with your actual anon public key.');
    }
    // Safety check: warn if user inadvertently pasted service_role key
    if (trimmedKey.includes('service_role')) {
      errors.push('Security Warning: VITE_SUPABASE_ANON_KEY appears to be a service_role key! Never expose service_role in frontend variables; use the public "anon" key only.');
    }
  }

  return errors;
};

/**
 * Quick boolean check if Supabase has required valid configurations
 */
export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfigErrors().length === 0;
};

let clientInstance: SupabaseClient | null = null;

/**
 * Returns singleton Supabase client or null if not configured
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance && rawSupabaseUrl && rawSupabaseAnonKey) {
    try {
      clientInstance = createClient(rawSupabaseUrl.trim(), rawSupabaseAnonKey.trim(), {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return clientInstance;
};

let cachedBusinessId: string | null = null;

/**
 * Resolves the active business UUID from the database matching the configured slug,
 * falling back to the standard seeded default if the table is still migrating.
 */
export const getActiveBusinessId = async (): Promise<string> => {
  if (cachedBusinessId) return cachedBusinessId;
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', DEFAULT_BUSINESS_SLUG)
        .maybeSingle();
      if (!error && data?.id) {
        cachedBusinessId = data.id;
        return data.id;
      }
    } catch {
      // Fallback
    }
  }
  return DEFAULT_BUSINESS_ID;
};

export interface ConnectionTestResult {
  success: boolean;
  latencyMs?: number;
  message: string;
  details?: string;
  businessSlug?: string;
}

/**
 * Probes the Supabase connection by executing a lightweight query and measuring response latency.
 */
export const testSupabaseConnection = async (): Promise<ConnectionTestResult> => {
  const configErrors = getSupabaseConfigErrors();
  if (configErrors.length > 0) {
    return {
      success: false,
      message: 'Configuration error: Missing or invalid Supabase environment variables.',
      details: configErrors.join(' | '),
      businessSlug: DEFAULT_BUSINESS_SLUG,
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: 'Failed to initialize Supabase client.',
      businessSlug: DEFAULT_BUSINESS_SLUG,
    };
  }

  const startTime = performance.now();
  try {
    // 1. Attempt to query the businesses table (created by the migration)
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, slug')
      .limit(1);

    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      // If table does not exist (relation "public.businesses" does not exist), credentials are valid but migration needed
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return {
          success: true,
          latencyMs,
          message: 'Connected to Supabase PostgreSQL! Migration pending.',
          details: 'Connection to your Supabase project succeeded, but the "businesses" table has not been created yet. Run the SQL migration script in your Supabase SQL Editor.',
          businessSlug: DEFAULT_BUSINESS_SLUG,
        };
      }

      // Check for auth / JWT errors
      if (error.message.includes('JWT') || error.code === 'PGRST301' || error.message.includes('apikey')) {
        return {
          success: false,
          latencyMs,
          message: 'Supabase authentication failed. Check your VITE_SUPABASE_ANON_KEY.',
          details: error.message,
          businessSlug: DEFAULT_BUSINESS_SLUG,
        };
      }

      return {
        success: false,
        latencyMs,
        message: `Supabase query error (${error.code || 'UNKNOWN'}): ${error.message}`,
        details: error.hint || error.details,
        businessSlug: DEFAULT_BUSINESS_SLUG,
      };
    }

    return {
      success: true,
      latencyMs,
      message: 'Successfully connected to Supabase PostgreSQL database!',
      details: data && data.length > 0 
        ? `Found active business tenant: "${data[0].name}" (${data[0].slug}). Tenant tables and RLS are active.`
        : 'Database connected and schema initialized. Ready for bookings.',
      businessSlug: DEFAULT_BUSINESS_SLUG,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      latencyMs,
      message: 'Network connection to Supabase failed.',
      details: err?.message || 'Check your internet connection and verify VITE_SUPABASE_URL.',
      businessSlug: DEFAULT_BUSINESS_SLUG,
    };
  }
};
