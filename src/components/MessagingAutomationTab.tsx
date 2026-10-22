import React, { useState } from 'react';
import { 
  MessageSquare, Smartphone, Check, Copy, Save, 
  ExternalLink, Send, ShieldAlert, Sparkles, AlertCircle 
} from 'lucide-react';
import { NotificationTemplate, SalonTenant } from '../types';
import { getNotificationTemplates, updateNotificationTemplate } from '../services/dataStorage';

interface MessagingAutomationTabProps {
  tenant: SalonTenant;
}

export const MessagingAutomationTab: React.FC<MessagingAutomationTabProps> = ({ tenant }) => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(getNotificationTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 'tpl-01');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const [editedText, setEditedText] = useState(activeTemplate?.templateText || '');
  const [isActive, setIsActive] = useState(activeTemplate?.isActive ?? true);

  const handleSelectTemplate = (tpl: NotificationTemplate) => {
    setSelectedTemplateId(tpl.id);
    setEditedText(tpl.templateText);
    setIsActive(tpl.isActive);
  };

  const handleSave = () => {
    const updated = updateNotificationTemplate(selectedTemplateId, editedText, isActive);
    setTemplates(updated);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  // Generate live preview by substituting sample values
  const previewText = editedText
    .replace(/{{customer_name}}/g, 'Dr. Esther Wairimu')
    .replace(/{{service_name}}/g, 'Bohemian Knotless Braids')
    .replace(/{{staff_name}}/g, 'Wanjiku "Shiku" Kariuki')
    .replace(/{{salon_name}}/g, tenant.name)
    .replace(/{{date}}/g, 'Today, Oct 22')
    .replace(/{{time_slot}}/g, '10:00 AM')
    .replace(/{{booking_ref}}/g, 'SFK-8912')
    .replace(/{{salon_phone}}/g, tenant.phone)
    .replace(/{{mpesa_till}}/g, tenant.mpesaTill)
    .replace(/{{loyalty_points}}/g, '150')
    .replace(/{{booking_link}}/g, 'salonflow.co.ke/aurum-kutus');

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewText);
    setCopiedId(selectedTemplateId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7B50] font-semibold">
            Client Communications & Retention Hub
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#18181B] mt-0.5">
            Automations & Messaging Templates
          </h2>
          <p className="text-xs text-[#71717A] mt-1 max-w-2xl leading-relaxed">
            Configure automated SMS and WhatsApp client engagement messages tailored for Kenyan clients. Variables like client name, booking reference, and M-Pesa Till number are dynamically merged.
          </p>
        </div>

        {/* Honest Provider Status */}
        <div className="p-3 bg-[#F4EFEA] border border-[#E8E2D9] rounded-xl text-xs space-y-1 sm:max-w-xs shrink-0">
          <div className="font-semibold text-[#18181B] flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[#0F281E]" />
            <span>Gateway Integration Status</span>
          </div>
          <div className="text-[11px] text-[#52525B]">
            Templates active. Connect <span className="font-semibold text-[#18181B]">Africa's Talking</span> or <span className="font-semibold text-[#18181B]">Infobip</span> in Supabase Database Webhooks for zero-code auto dispatch.
          </div>
        </div>
      </div>

      {/* Main Grid: Template Selector + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Template Selector */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
            Workflow Triggers:
          </div>
          <div className="space-y-2">
            {templates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTemplateId === tpl.id
                    ? 'border-[#0F281E] bg-[#FAF8F5] shadow-xs'
                    : 'border-[#E8E2D9] bg-white hover:border-[#C5A880]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#18181B]">{tpl.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    tpl.channel === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {tpl.channel}
                  </span>
                </div>
                <div className="text-[11px] text-[#71717A] mt-1 truncate">
                  {tpl.templateText}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Editor & Dynamic Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">
                Template Text & Dynamic Variables
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-[#71717A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded border-[#C5A880] text-[#0F281E]"
                  />
                  <span>Active in salon</span>
                </label>
              </div>
            </div>

            <textarea
              rows={4}
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              className="w-full p-3 bg-white border border-[#E8E2D9] rounded-xl text-xs text-[#18181B] font-mono leading-relaxed focus:outline-none focus:border-[#0F281E]"
            />

            {/* Merge Tags Reference */}
            <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
              <span className="text-[#71717A]">Merge tags:</span>
              {[
                '{{customer_name}}',
                '{{service_name}}',
                '{{staff_name}}',
                '{{time_slot}}',
                '{{booking_ref}}',
                '{{mpesa_till}}',
                '{{salon_phone}}',
              ].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setEditedText(prev => prev + ` ${tag}`)}
                  className="px-2 py-0.5 rounded bg-[#F4EFEA] border border-[#E8E2D9] font-mono text-[#0F281E] hover:bg-[#E8E2D9] cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 text-xs font-semibold bg-[#0F281E] hover:bg-[#15382B] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {saveFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saveFeedback ? 'Template Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Live Mobile Client Preview Phone Card */}
          <div className="p-5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#C5A880]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">
                  Client Phone Preview ({activeTemplate.channel})
                </span>
              </div>
              <button
                onClick={handleCopyPreview}
                className="px-3 py-1 text-xs font-semibold bg-white border border-[#E8E2D9] hover:border-[#18181B] text-[#18181B] rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedId === selectedTemplateId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#9A7B50]" />}
                <span>{copiedId === selectedTemplateId ? 'Copied' : 'Copy Sample SMS'}</span>
              </button>
            </div>

            <div className="p-4 bg-white border border-[#E8E2D9] rounded-xl shadow-xs">
              <div className="text-[11px] font-mono text-[#71717A] mb-1 flex items-center justify-between">
                <span>From: {tenant.name.split('&')[0].trim()}</span>
                <span>Just now</span>
              </div>
              <p className="text-xs text-[#18181B] leading-relaxed whitespace-pre-wrap font-sans">
                {previewText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
