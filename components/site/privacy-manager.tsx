'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import type { Locale } from '@/lib/types';

interface PrivacyManagerProps {
  locale: Locale;
}

export function PrivacyManager({ locale }: PrivacyManagerProps) {
  const [consentStatus, setConsentStatus] = useState<'accepted' | 'declined' | 'unset'>('unset');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mpg_cookie_consent');
      if (stored === 'accepted' || stored === 'declined') {
        setConsentStatus(stored);
      } else {
        setConsentStatus('unset');
      }
    } catch {
      setConsentStatus('unset');
    }
  }, []);

  const updateConsent = (choice: 'accepted' | 'declined' | 'unset') => {
    try {
      if (choice === 'unset') {
        localStorage.removeItem('mpg_cookie_consent');
        document.cookie = 'mpg_cookie_consent=; max-age=0; path=/; SameSite=Lax';
        document.cookie = 'mpg_sid=; max-age=0; path=/; SameSite=Lax';
        sessionStorage.removeItem('mpg_sid');
      } else {
        localStorage.setItem('mpg_cookie_consent', choice);
        const maxAge = choice === 'accepted' ? 31536000 : 86400 * 30;
        document.cookie = `mpg_cookie_consent=${choice}; max-age=${maxAge}; path=/; SameSite=Lax`;
        if (choice === 'accepted') {
          window.dispatchEvent(new CustomEvent('mpg_consent_changed', { detail: { consent: 'accepted' } }));
        }
      }
      setConsentStatus(choice);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch {
      // Fallback
    }
  };

  const copy = {
    en: {
      label: 'Telemetry Preference:',
      active: 'Active (Consented)',
      disabled: 'Disabled (Essential Only)',
      default: 'Default (Banner Active)',
      btnEnable: 'Opt In',
      btnDisable: 'Opt Out',
      btnReset: 'Reset',
      savedNotice: 'Updated',
    },
    km: {
      label: 'ជម្រើសវិភាគទិន្នន័យ៖',
      active: 'កំពុងដំណើរការ (បានយល់ព្រម)',
      disabled: 'បានបិទ (ចាំបាច់ប៉ុណ្ណោះ)',
      default: 'លំនាំដើម',
      btnEnable: 'យល់ព្រម',
      btnDisable: 'បិទដំណើរការ',
      btnReset: 'កំណត់ឡើងវិញ',
      savedNotice: 'បានធ្វើបច្ចុប្បន្នភាព',
    },
    zh: {
      label: '当前分析数据偏好：',
      active: '已启用（已同意）',
      disabled: '已停用（仅必要）',
      default: '默认状态',
      btnEnable: '启用',
      btnDisable: '停用',
      btnReset: '重置',
      savedNotice: '已更新',
    },
  }[locale] || {
    label: 'Telemetry Preference:',
    active: 'Active (Consented)',
    disabled: 'Disabled (Essential Only)',
    default: 'Default (Banner Active)',
    btnEnable: 'Opt In',
    btnDisable: 'Opt Out',
    btnReset: 'Reset',
    savedNotice: 'Updated',
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
      <div className="flex items-center gap-2 text-slate-700">
        <span className="font-semibold text-slate-900">{copy.label}</span>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium ${
            consentStatus === 'accepted'
              ? 'bg-[#1e9a2a]/10 text-[#1e9a2a]'
              : consentStatus === 'declined'
              ? 'bg-slate-200 text-slate-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              consentStatus === 'accepted' ? 'bg-[#1e9a2a]' : 'bg-slate-400'
            }`}
          />
          {consentStatus === 'accepted'
            ? copy.active
            : consentStatus === 'declined'
            ? copy.disabled
            : copy.default}
        </span>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {consentStatus !== 'accepted' && (
          <button
            type="button"
            onClick={() => updateConsent('accepted')}
            className="px-3 py-1 bg-[#1e9a2a] hover:bg-[#147a22] text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {copy.btnEnable}
          </button>
        )}
        {consentStatus !== 'declined' && (
          <button
            type="button"
            onClick={() => updateConsent('declined')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            {copy.btnDisable}
          </button>
        )}
        <button
          type="button"
          onClick={() => updateConsent('unset')}
          title="Reset cookie preference"
          className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {isSaved && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1e9a2a] animate-in fade-in duration-200">
            <CheckCircle2 className="w-3 h-3" />
            {copy.savedNotice}
          </span>
        )}
      </div>
    </div>
  );
}
