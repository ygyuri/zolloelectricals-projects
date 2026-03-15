'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      router.replace('/admin/projects');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary-1 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-card-bg p-6 shadow-xl">
        <h1 className="text-xl font-bold text-card-text mb-4">Admin login</h1>
        <p className="text-sm text-card-text/70 mb-4">
          Use your WordPress admin username and Application Password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-card-text mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-card-text"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-card-text mb-1">
              Application password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-card-text"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent-blue text-white py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <Link href="/" className="mt-4 block text-center text-sm text-accent-blue hover:underline">
          Back to Projects
        </Link>
      </div>
    </div>
  );
}
