import React, { useState } from 'react';
import { X, Copy, Database, Check, ShieldCheck, Key, FileCode } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../services/dataStorage';

import { 
  testSupabaseConnection, 
  ConnectionTestResult, 
  DEFAULT_BUSINESS_SLUG,
  getSupabaseConfigErrors,
  isSupabaseConfigured 
} from '../services/supabaseClient';

interface SupabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSchemaModal: React.FC<SupabaseSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRunConnectionTest = async () => {
    setIsTesting(true);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Failed to complete connection test',
        details: err?.message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#18181B]/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl shadow-2xl overflow-hidden my-8">
        <div className="bg-[#18181B] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#C5A880]" />
            <div>
              <div className="text-[10px] font-mono tracking-wider uppercase text-[#C5A880]">
                Backend Infrastructure
              </div>
              <h2 className="font-serif text-lg font-bold text-white">
                Supabase PostgreSQL Schema & RLS Security
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-xs text-[#52525B] leading-relaxed">
            SalonFlow Kenya is architected to be 100% database-agnostic. In local demo mode, all bookings and updates persist securely inside browser storage. When deploying for a paying client in Kutus, paste this DDL script into the client's Supabase project SQL Editor to instantiate the multi-tenant tables and security policies.
          </div>

          <div className="p-4 bg-[#F3EFEA] rounded-lg border border-[#E8E2D9] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-[#18181B]">
                <Key className="w-4 h-4 text-[#9A7B50]" />
                <span>Supabase Configuration Status</span>
              </div>
              <button
                onClick={handleRunConnectionTest}
                disabled={isTesting}
                className="px-3 py-1 text-xs font-semibold bg-[#C5A880] hover:bg-[#B89758] text-[#18181B] rounded transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isTesting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-[#18181B] border-t-transparent rounded-full animate-spin"></span>
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>Test Supabase Connection</span>
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded border text-xs space-y-1 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-1.5">
                    {testResult.success ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <X className="w-4 h-4 text-rose-600" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                  {testResult.latencyMs !== undefined && (
                    <span className="text-[11px] font-mono text-zinc-500">
                      {testResult.latencyMs}ms ping
                    </span>
                  )}
                </div>
                {testResult.details && (
                  <p className="text-[11px] opacity-90 leading-relaxed font-mono">
                    {testResult.details}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[11px] text-[#71717A] font-medium">Expected Environment Variables (.env / Secrets):</span>
              <pre className="font-mono text-[11px] bg-white p-2.5 rounded border border-[#D9D2C7] overflow-x-auto text-[#18181B]">
VITE_SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"{"\n"}
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."{"\n"}
VITE_BUSINESS_SLUG="{DEFAULT_BUSINESS_SLUG}"
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#18181B] flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[#9A7B50]" />
                PostgreSQL DDL Migration (Tables & RLS)
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-semibold bg-[#18181B] hover:bg-[#27272A] text-white rounded transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#C5A880]" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#18181B] text-[#E4E4E7] rounded-lg text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>

          <div className="pt-2 border-t border-[#E8E2D9] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
