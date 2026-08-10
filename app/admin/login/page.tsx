'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, { error: '' });
  return <main className="grid min-h-screen place-items-center bg-paper-tint px-5"><form action={action} className="w-full max-w-md space-y-6 border border-line bg-white p-8 shadow-sm"><div><p className="t-label text-brand">MPG Event Planner</p><h1 className="t-heading mt-2 text-3xl">Admin sign in</h1></div><label className="block text-sm font-bold">Email<input type="email" name="email" required autoComplete="email" className="mt-1 w-full border border-line px-3 py-3 font-normal" /></label><label className="block text-sm font-bold">Password<input type="password" name="password" required autoComplete="current-password" className="mt-1 w-full border border-line px-3 py-3 font-normal" /></label>{state.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}<button className="btn btn-primary w-full" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button></form></main>;
}
