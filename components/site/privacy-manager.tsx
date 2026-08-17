'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Shield, CheckCircle2, RotateCcw } from 'lucide-react';
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
      title: 'Your Active Privacy Controls',
      description: 'Manage telemetry permissions for your current device and browser session.',
      statusAccepted: 'Telemetry Active (Consented)',
      statusDeclined: 'Telemetry Disabled (Essential Only)',
      statusUnset: 'No Preference Stored (Default Mode)',
      descAccepted: 'Lightweight anonymous pageview metrics are collected to help us optimize proposal workflows.',
      descDeclined: 'All non-essential analytics tracking is blocked. Only core website functions run.',
      descUnset: 'The floating cookie banner will appear on your next page visit.',
      btnEnable: 'Enable Analytics',
      btnDisable: 'Disable Analytics',
      btnReset: 'Reset to Default',
      savedNotice: 'Preferences updated',
    },
    km: {
      title: 'ការគ្រប់គ្រងឯកជនភាពសកម្មរបស់អ្នក',
      description: 'គ្រប់គ្រងការអនុញ្ញាតទិន្នន័យសម្រាប់ឧបករណ៍ និងកម្មវិធីរុករកបច្ចុប្បន្នរបស់អ្នក។',
      statusAccepted: 'ទិន្នន័យវិភាគកំពុងដំណើរការ',
      statusDeclined: 'បានបិទទិន្នន័យវិភាគ (ចាំបាច់ប៉ុណ្ណោះ)',
      statusUnset: 'មិនទាន់បានកំណត់ (ទម្រង់លំនាំដើម)',
      descAccepted: 'ទិន្នន័យទស្សនកិច្ចអនាមិកត្រូវបានប្រមូល ដើម្បីជួយកែលម្អប្រព័ន្ធរៀបចំកម្មវិធី។',
      descDeclined: 'រាល់ការតាមដានមិនចាំបាច់ត្រូវបានផ្អាក។ ដំណើរការតែមុខងារស្នូលប៉ុណ្ណោះ។',
      descUnset: 'ផ្ទាំង Cookie នឹងបង្ហាញនៅពេលអ្នកចូលមើលលើកក្រោយ។',
      btnEnable: 'បើកដំណើរការ',
      btnDisable: 'បិទដំណើរការ',
      btnReset: 'កំណត់ឡើងវិញ',
      savedNotice: 'បានធ្វើបច្ចុប្បន្នភាព',
    },
    zh: {
      title: '您的当前隐私控制面板',
      description: '管理您当前设备与浏览器会话的数据偏好设置。',
      statusAccepted: '数据分析已启用（已同意）',
      statusDeclined: '数据分析已停用（仅必要）',
      statusUnset: '未存储偏好（默认模式）',
      descAccepted: '匿名收集轻量级页面访问指标，以帮助我们优化活动方案提交流程。',
      descDeclined: '已拦截所有非必要分析追踪，仅运行网站核心系统。',
      descUnset: '下次访问时将再次显示浮动 Cookie 选项卡。',
      btnEnable: '启用数据分析',
      btnDisable: '停用数据分析',
      btnReset: '重置为默认',
      savedNotice: '设置已成功更新',
    },
  }[locale] || {
    title: 'Your Active Privacy Controls',
    description: 'Manage telemetry permissions for your current device and browser session.',
    statusAccepted: 'Telemetry Active (Consented)',
    statusDeclined: 'Telemetry Disabled (Essential Only)',
    statusUnset: 'No Preference Stored (Default Mode)',
    descAccepted: 'Lightweight anonymous pageview metrics are collected to help us optimize proposal workflows.',
    descDeclined: 'All non-essential analytics tracking is blocked. Only core website functions run.',
    descUnset: 'The floating cookie banner will appear on your next page visit.',
    btnEnable: 'Enable Analytics',
    btnDisable: 'Disable Analytics',
    btnReset: 'Reset to Default',
    savedNotice: 'Preferences updated',
  };

  return (
    <div className="bg-slate-900/[0.02] border border-slate-900/10 rounded-2xl p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {consentStatus === 'accepted' ? (
            <ShieldCheck className="w-5 h-5 text-[#1e9a2a] shrink-0" />
          ) : (
            <Shield className="w-5 h-5 text-slate-500 shrink-0" />
          )}
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">{copy.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{copy.description}</p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              consentStatus === 'accepted'
                ? 'bg-[#1e9a2a]/10 text-[#1e9a2a]'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                consentStatus === 'accepted' ? 'bg-[#1e9a2a]' : 'bg-slate-400'
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

      <div className="mt-4 p-4 rounded-xl bg-white border border-slate-900/10 shadow-[0_2px_8px_rgba(6,20,33,0.03)]">
        <div className="text-xs font-bold text-slate-900">
          {consentStatus === 'accepted'
            ? copy.statusAccepted
            : consentStatus === 'declined'
            ? copy.statusDeclined
            : copy.statusUnset}
        </div>
        <div className="mt-1 text-xs text-slate-500 leading-relaxed">
          {consentStatus === 'accepted'
            ? copy.descAccepted
            : consentStatus === 'declined'
            ? copy.descDeclined
            : copy.descUnset}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {consentStatus !== 'accepted' && (
          <button
            type="button"
            onClick={() => updateConsent('accepted')}
            className="px-4 py-2 bg-[#1e9a2a] hover:bg-[#147a22] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {copy.btnEnable}
          </button>
        )}
        {consentStatus !== 'declined' && (
          <button
            type="button"
            onClick={() => updateConsent('declined')}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {copy.btnDisable}
          </button>
        )}
        <button
          type="button"
          onClick={() => updateConsent('unset')}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-300/80 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
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
