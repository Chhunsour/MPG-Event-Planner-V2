'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, { error: '' });
  return <main className="admin-login"><form action={action}><div><p>MPG Event Planner</p><h1>Admin sign in</h1><span>Manage website content and quotation requests.</span></div><label>Email address<input type="email" name="email" required autoComplete="email" autoFocus /></label><label>Password<input type="password" name="password" required autoComplete="current-password" /></label>{state.error && <p className="admin-login__error" role="alert">{state.error}</p>}<button className="btn btn-primary" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button></form></main>;
}
