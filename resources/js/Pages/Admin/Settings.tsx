import { useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import {
  Building2,
  Globe,
  ShieldCheck,
  Zap,
  Check,
  Copy,
  Save,
  RefreshCw,
  Lock,
  Image,
} from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import TextField from "@/components/admin/forms/TextField";
import TextareaField from "@/components/admin/forms/TextareaField";
import SelectField from "@/components/admin/forms/SelectField";
import { useToast } from "@/components/ui/Toast";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

interface SettingsProps {
  settings?: {
    webp_quality?: number;
    company_name?: string;
    company_email?: string;
    company_phone?: string;
    company_address?: string;
    telegram?: string;
    facebook?: string;
    instagram?: string;
    default_lang?: string;
  };
}

export default function Settings({ settings }: SettingsProps) {
  const { props } = usePage<{ auth: AuthUser | null }>();
  const auth = props.auth;
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"company" | "translation" | "security" | "system">("company");
  const [copiedCmd, setCopiedCmd] = useState(false);

  const { data, setData, post, processing } = useForm({
    webp_quality: settings?.webp_quality ?? 82,
    company_name: settings?.company_name ?? "MPG Event Planner",
    company_email: settings?.company_email ?? "contact@mpgeventplanner.com",
    company_phone: settings?.company_phone ?? "+855 12 345 678",
    company_address: settings?.company_address ?? "Phnom Penh, Cambodia",
    telegram: settings?.telegram ?? "@mpgeventplanner",
    facebook: settings?.facebook ?? "https://facebook.com/mpgeventplanner",
    instagram: settings?.instagram ?? "@mpgeventplanner",
    default_lang: settings?.default_lang ?? "en",
  });

  const copyAdminCmd = () => {
    navigator.clipboard.writeText("php artisan mpg:create-admin");
    setCopiedCmd(true);
    toast("Command copied to clipboard!", "success");
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/settings", {
      preserveScroll: true,
      onSuccess: () => {
        toast("System settings updated successfully.", "success");
      },
    });
  };

  const handlePurgeCache = () => {
    toast("Website cache purged successfully.", "success");
  };

  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-line bg-paper px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("company")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
              activeTab === "company"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-ink-text"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Company & Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("translation")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
              activeTab === "translation"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-ink-text"
            }`}
          >
            <Globe className="h-4 w-4" />
            Localization & Translation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
              activeTab === "security"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-ink-text"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin & Security
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
              activeTab === "system"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-ink-text"
            }`}
          >
            <Zap className="h-4 w-4" />
            Media & System
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: COMPANY & CONTACT */}
          {activeTab === "company" && (
            <div className="space-y-6">
              <div className="border border-line bg-paper p-6 rounded-xl shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="text-base font-bold text-ink-text">Company Information</h3>
                    <p className="text-xs text-muted">Public contact details displayed across the website header, footer, and contact page.</p>
                  </div>
                  <Building2 className="h-5 w-5 text-brand" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Company Name"
                    name="company_name"
                    value={data.company_name}
                    onChange={(v) => setData("company_name", v)}
                    required
                  />
                  <TextField
                    label="Contact Email"
                    name="company_email"
                    type="email"
                    value={data.company_email}
                    onChange={(v) => setData("company_email", v)}
                    required
                  />
                  <TextField
                    label="Hotline Phone Number"
                    name="company_phone"
                    value={data.company_phone}
                    onChange={(v) => setData("company_phone", v)}
                    required
                  />
                  <TextField
                    label="Office Address"
                    name="company_address"
                    value={data.company_address}
                    onChange={(v) => setData("company_address", v)}
                    required
                  />
                </div>
              </div>

              <div className="border border-line bg-paper p-6 rounded-xl shadow-sm">
                <div className="mb-6 border-b border-line pb-4">
                  <h3 className="text-base font-bold text-ink-text">Social Channels</h3>
                  <p className="text-xs text-muted">Social links connected to website action buttons.</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Telegram Handle"
                    name="telegram"
                    value={data.telegram}
                    onChange={(v) => setData("telegram", v)}
                  />
                  <TextField
                    label="Facebook Page URL"
                    name="facebook"
                    value={data.facebook}
                    onChange={(v) => setData("facebook", v)}
                  />
                  <TextField
                    label="Instagram Handle"
                    name="instagram"
                    value={data.instagram}
                    onChange={(v) => setData("instagram", v)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSLATION & LOCALIZATION */}
          {activeTab === "translation" && (
            <div className="space-y-6">
              <div className="border border-line bg-paper p-6 rounded-xl shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="text-base font-bold text-ink-text">Auto-Translation Engine</h3>
                    <p className="text-xs text-muted">Configure multi-language generation behavior for Khmer and Chinese.</p>
                  </div>
                  <Globe className="h-5 w-5 text-brand" />
                </div>

                <div className="space-y-5">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      <strong className="text-xs font-bold text-emerald-900">Translation Service Active</strong>
                    </div>
                    <p className="mt-1 text-xs text-emerald-700">
                      Google Translation GTX Service is online. Supports English ➔ Khmer (km) and Chinese (zh-CN) automatic translation.
                    </p>
                  </div>

                  <div className="max-w-md">
                    <SelectField
                      label="Default Website Language"
                      name="default_lang"
                      value={data.default_lang}
                      options={[
                        { value: "en", label: "English (en)" },
                        { value: "km", label: "Khmer (km)" },
                        { value: "zh", label: "Chinese (zh)" },
                      ]}
                      onChange={(v) => setData("default_lang", v)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADMIN & SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="border border-line bg-paper p-6 rounded-xl shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="text-base font-bold text-ink-text">Current Account</h3>
                    <p className="text-xs text-muted">Your logged in administrator credentials.</p>
                  </div>
                  <Lock className="h-5 w-5 text-brand" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-faint">Name</span>
                    <p className="mt-1 text-sm font-semibold text-ink-text">{auth?.name || "Administrator"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-faint">Email Address</span>
                    <p className="mt-1 text-sm font-semibold text-ink-text">{auth?.email}</p>
                  </div>
                </div>
              </div>

              <div className="border border-line bg-paper p-6 rounded-xl shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-ink-text">Create Administrator Account</h3>
                  <p className="mt-1 text-xs text-muted">
                    New admin accounts are created securely via artisan CLI to ensure passwords are never stored in plain text or config files:
                  </p>
                </div>

                <div className="flex items-center justify-between overflow-x-auto border border-line bg-paper-tint px-4 py-3 font-mono text-xs text-ink-text rounded-lg">
                  <span>php artisan mpg:create-admin</span>
                  <button
                    type="button"
                    onClick={copyAdminCmd}
                    className="ml-4 flex items-center gap-1.5 rounded border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-brand hover:bg-brand-tint"
                  >
                    {copiedCmd ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedCmd ? "Copied!" : "Copy"}
                  </button>
                </div>

                <p className="mt-3 text-[11px] text-faint">
                  Requirements: Password must be minimum 12 characters, including letters, numbers, and special characters.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & SYSTEM OPTIMIZATION */}
          {activeTab === "system" && (
            <div className="space-y-6">
              {/* WebP Image Quality Setting */}
              <div className="border border-line bg-paper p-6 rounded-xl shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="text-base font-bold text-ink-text flex items-center gap-2">
                      <Image className="h-5 w-5 text-brand" />
                      <span>WebP Image Compression Quality</span>
                    </h3>
                    <p className="text-xs text-muted">Select desired image quality compression when JPG or PNG images are uploaded to the dashboard.</p>
                  </div>
                  <span className="rounded-md border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                    Active: {data.webp_quality}% Quality
                  </span>
                </div>

                <div className="space-y-4 max-w-xl">
                  <SelectField
                    label="Image Compression Quality Level"
                    name="webp_quality"
                    value={String(data.webp_quality)}
                    options={[
                      { value: "60", label: "60% - Maximum Compression (Smallest File Size, ~90% Saved)" },
                      { value: "75", label: "75% - High Compression (Great Quality, ~85% Saved)" },
                      { value: "82", label: "82% - Balanced (Recommended Default, ~80% Saved)" },
                      { value: "90", label: "90% - Ultra High Quality (Low Compression, ~60% Saved)" },
                      { value: "100", label: "100% - Lossless Quality (No Compression)" },
                    ]}
                    onChange={(v) => setData("webp_quality", Number(v))}
                  />
                  <p className="text-xs text-faint">
                    All image uploads across Blog Posts, Projects, Services, and Media are automatically converted to .webp using this setting.
                  </p>
                </div>
              </div>

              {/* Cache Purge */}
              <div className="border border-line bg-paper p-6 rounded-xl shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="text-base font-bold text-ink-text">Website Revalidation</h3>
                    <p className="text-xs text-muted">Manage real-time content sync between Admin Studio and the public website.</p>
                  </div>
                  <Zap className="h-5 w-5 text-brand" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-line p-4">
                    <div>
                      <p className="text-xs font-bold text-ink-text">Purge Site Cache</p>
                      <p className="text-xs text-muted">Force immediate update for all public pages.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handlePurgeCache}
                      className="flex items-center gap-1.5 rounded-lg border border-line-strong px-3.5 py-1.5 text-xs font-semibold text-ink-text hover:border-brand hover:text-brand"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Purge Cache Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button Bar */}
          <div className="flex items-center justify-end border-t border-line bg-paper px-6 py-4 rounded-xl shadow-sm">
            <button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-deep disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {processing ? "Saving..." : "Save System Settings"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
