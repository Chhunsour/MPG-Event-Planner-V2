import { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-5">
      <div className="w-full max-w-100 bg-paper p-8 shadow-[0_8px_30px_rgb(6_24_43/0.12)]">
        {/* Brand header */}
        <div className="mb-7 flex flex-col items-center gap-4 text-center">
          <img
            src="/images/mpg-logo.png"
            alt="MPG Event Planner"
            className="h-16 w-auto object-contain"
          />
          <p className="text-[13.5px] text-muted">
            Sign in to manage services, projects & quotation requests.
          </p>
        </div>

        {/* Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-5 border border-red-200 bg-red-50 p-3" role="alert">
            <ul className="list-disc pl-5 text-sm text-red-600">
              {Object.values(errors).map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            post("/admin/login");
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-wider text-muted"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              placeholder="Enter your email"
              required
              autoFocus
              autoComplete="username"
              onChange={(e) => setData("email", e.target.value)}
              className="w-full min-h-12 border-line-strong bg-paper px-3.5 py-2 text-sm text-ink-text outline-none transition-colors focus:border-brand"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-wider text-muted"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                placeholder="Enter Your Password"
                required
                autoComplete="current-password"
                onChange={(e) => setData("password", e.target.value)}
                className="w-full min-h-12 border-line-strong bg-paper px-3.5 py-2 pr-10 text-sm text-ink-text outline-none transition-colors focus:border-brand"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-faint transition-colors hover:text-muted"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={data.remember}
              onChange={(e) => setData("remember", e.target.checked)}
              className="h-4 w-4 border-line-strong text-brand focus:ring-brand"
            />
            <label
              htmlFor="remember"
              className="text-sm text-muted"
            >
              Keep me signed in
            </label>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="btn btn-primary btn-lg w-full disabled:opacity-50"
          >
            Sign in to Dashboard
          </button>
        </form>

        {/* Back to website */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-faint transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
