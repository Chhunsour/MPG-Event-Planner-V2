'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
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
      title: 'Your Privacy & Cookie Controls',
      description: 'Manage how your browsing telemetry is handled on MPG Event Planner.',
      statusAccepted: 'Analytics Cookies are Active',
      statusDeclined: 'Non-Essential Cookies are Disabled',
      statusUnset: 'No Preference Selected (Default Mode)',
      descAccepted: 'Lightweight performance metrics are anonymously collected to improve our website experience.',
      descDeclined: 'Telemetry is suppressed. Only strictly necessary operational cookies are active.',
      descUnset: 'You will see the consent pop card on your next visit.',
      btnEnable: 'Enable Analytics',
      btnDisable: 'Disable Analytics',
      btnReset: 'Reset Preferences',
      savedNotice: 'Preferences updated successfully!',
    },
    km: {
      title: 'ការគ្រប់គ្រងឯកជនភាព និង Cookies របស់អ្នក',
      description: 'គ្រប់គ្រងរបៀបដែលទិន្នន័យនៃការរុករករបស់អ្នកត្រូវបានដំណើរការនៅលើគេហទំព័រ MPG។',
      statusAccepted: 'Cookies វិភាគទិន្នន័យកំពុងដំណើរការ',
      statusDeclined: 'Cookies មិនចាំបាច់ត្រូវបានបិទ',
      statusUnset: 'មិនទាន់បានជ្រើសរើស (ទម្រង់លំនាំដើម)',
      descAccepted: 'ទិន្នន័យវិភាគត្រូវបានប្រមូលដោយអនាមិក ដើម្បីបង្កើនប្រសិទ្ធភាពបទពិសោធន៍ប្រើប្រាស់។',
      descDeclined: 'ទិន្នន័យវិភាគត្រូវបានផ្អាក។ មានតែ Cookies ចាំបាច់ប៉ុណ្ណោះដែលដំណើរការ។',
      descUnset: 'ផ្ទាំងជូនដំណឹង Cookie នឹងបង្ហាញនៅពេលអ្នកចូលមើលលើកក្រោយ។',
      btnEnable: 'បើកដំណើរការវិភាគ',
      btnDisable: 'បិទដំណើរការវិភាគ',
      btnReset: 'កំណត់ជម្រើសឡើងវិញ',
      savedNotice: 'ការកំណត់ត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!',
    },
    zh: {
      title: '您的隐私与 Cookie 控制',
      description: '管理您在 MPG 活动策划网站上的浏览数据偏好。',
      statusAccepted: '数据分析 Cookie 已启用',
      statusDeclined: '非必要 Cookie 已停用',
      statusUnset: '未选择偏好（默认状态）',
      descAccepted: '我们将匿名收集轻量级性能指标，以优化您的浏览体验。',
      descDeclined: '已暂停所有非必要数据收集，仅保留系统核心功能。',
      descUnset: '下次访问时将再次显示偏好选择卡片。',
      btnEnable: '启用数据分析',
      btnDisable: '停用数据分析',
      btnReset: '重置所有偏好',
      savedNotice: '隐私偏好设置已更新！',
    },
  }[locale] || {
    title: 'Your Privacy & Cookie Controls',
    description: 'Manage how your browsing telemetry is handled on MPG Event Planner.',
    statusAccepted: 'Analytics Cookies are Active',
    statusDeclined: 'Non-Essential Cookies are Disabled',
    statusUnset: 'No Preference Selected (Default Mode)',
    descAccepted: 'Lightweight performance metrics are anonymously collected to improve our website experience.',
    descDeclined: 'Telemetry is suppressed. Only strictly necessary operational cookies are active.',
    descUnset: 'You will see the consent pop card on your next visit.',
    btnEnable: 'Enable Analytics',
    btnDisable: 'Disable Analytics',
    btnReset: 'Reset Preferences',
    savedNotice: 'Preferences updated successfully!',
  };

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm my-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            {consentStatus === 'accepted' ? (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#1e9a2a] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-slate-200 border border-slate-300 text-slate-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-base font-bold text-[#061421]">{copy.title}</h3>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{copy.description}</p>
        </div>

        <div className="shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              consentStatus === 'accepted'
                ? 'bg-emerald-500/10 text-[#1e9a2a] border border-emerald-500/20'
                : 'bg-slate-200 text-slate-700 border border-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                consentStatus === 'accepted' ? 'bg-[#1e9a2a]' : 'bg-slate-500'
              }`}
            />
            {consentStatus === 'accepted'
              ? 'Active'
              : consentStatus === 'declined'
              ? 'Disabled'
              : 'Default'}
          </span>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200/80">
        <p className="text-xs sm:text-sm font-semibold text-[#061421]">
          {consentStatus === 'accepted'
            ? copy.statusAccepted
            : consentStatus === 'declined'
            ? copy.statusDeclined
            : copy.statusUnset}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {consentStatus === 'accepted'
            ? copy.descAccepted
            : consentStatus === 'declined'
            ? copy.descDeclined
            : copy.descUnset}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {consentStatus !== 'accepted' && (
          <button
            type="button"
            onClick={() => updateConsent('accepted')}
            className="px-4 py-2 bg-[#1e9a2a] hover:bg-[#147a22] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {copy.btnEnable}
          </button>
        )}
        {consentStatus !== 'declined' && (
          <button
            type="button"
            onClick={() => updateConsent('declined')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {copy.btnDisable}
          </button>
        )}
        <button
          type="button"
          onClick={() => updateConsent('unset')}
          className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 text-slate-500" />
          {copy.btnReset}
        </button>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1e9a2a] animate-in fade-in duration-200 ml-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {copy.savedNotice}
          </span>
        )}
      </div>
    </div>
  );
}
