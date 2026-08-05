import AdminLayout from "@/Layouts/AdminLayout";

export default function Settings() {
  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        <div className="border border-line bg-paper">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-base font-bold text-ink-text">Admin accounts</h2>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-muted">
              Admin accounts are created from the command line so no password is ever
              written into a file or an environment variable:
            </p>
            <pre className="mt-3 overflow-auto border border-line bg-paper-tint p-3 text-xs text-muted">
php artisan mpg:create-admin
            </pre>
            <p className="mt-3 text-xs text-faint">
              You will be prompted for a name, an email and a password
              (minimum 12 characters, with letters, numbers and symbols).
            </p>
          </div>
        </div>

        <div className="border border-line bg-paper">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-base font-bold text-ink-text">Site content</h2>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-muted">
              Company details shown on the public site — address, phone, email,
              Telegram and Facebook — currently live in the site config. Contact details
              are still placeholders and need to be filled in before launch.
            </p>
          </div>
        </div>

        <div className="border border-line bg-paper">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-base font-bold text-ink-text">Publishing</h2>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-muted">
              The public site revalidates content from this dashboard every 60 seconds.
              A change you save here appears on the website within about a minute; there
              is no separate deploy step.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
